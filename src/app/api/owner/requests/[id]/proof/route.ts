import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendProofUploadedToAdvertiser } from "@/lib/email";
import { createNotification } from "@/lib/notify";

export const dynamic = "force-dynamic";

async function getOwnerIdFromSession() {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) return null;
    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session.userId },
        select: { id: true },
    });
    return owner?.id ?? null;
}

async function ensureOwnedRental(rentalId: string, ownerId: string) {
    const rental = await prisma.staticRental.findUnique({
        where: { id: rentalId },
        include: {
            panel: {
                include: {
                    owner: {
                        include: { user: { select: { name: true, email: true } } },
                    },
                },
            },
            advertiser: {
                include: { user: { select: { id: true, name: true, email: true } } },
            },
        },
    });
    if (!rental) return { error: "Talep bulunamadı", status: 404 as const, rental: null };
    if (rental.panel.ownerId !== ownerId)
        return { error: "Yetkisiz erişim", status: 403 as const, rental: null };
    return { rental, error: null, status: 200 as const };
}

// GET — kanıtları listele
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rental, error, status } = await ensureOwnedRental(params.id, ownerId);
    if (error) return NextResponse.json({ error }, { status });

    const proofs = await prisma.proofOfPosting.findMany({
        where: { rentalId: params.id },
        orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json({
        proofStatus: rental!.proofStatus,
        items: proofs.map((p) => ({
            id: p.id,
            photoUrls: p.photoUrls,
            notes: p.notes,
            uploadedAt: p.uploadedAt.toISOString(),
            confirmedAt: p.confirmedAt?.toISOString() ?? null,
        })),
    });
}

// POST — yeni kanıt yükle
// body: { photoUrls: string[] (1..3), notes?: string }
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rental, error, status } = await ensureOwnedRental(params.id, ownerId);
    if (error) return NextResponse.json({ error }, { status });

    if (rental!.ownerReviewStatus !== "APPROVED") {
        return NextResponse.json(
            { error: "Sadece onaylanmış rezervasyonlar için kanıt yükleyebilirsiniz." },
            { status: 400 }
        );
    }

    const body = await req.json().catch(() => ({}));
    const photoUrls: unknown = body?.photoUrls;
    const notesRaw: unknown = body?.notes;

    if (!Array.isArray(photoUrls) || photoUrls.length === 0) {
        return NextResponse.json({ error: "En az 1 fotoğraf gerekli." }, { status: 400 });
    }
    if (photoUrls.length > 3) {
        return NextResponse.json({ error: "En fazla 3 fotoğraf yükleyebilirsiniz." }, { status: 400 });
    }

    const cleanUrls = photoUrls
        .filter((u): u is string => typeof u === "string" && u.trim().length > 0)
        .map((u) => u.trim())
        .slice(0, 3);

    if (cleanUrls.length === 0) {
        return NextResponse.json({ error: "Geçerli fotoğraf URL'leri gerekli." }, { status: 400 });
    }

    const notes =
        typeof notesRaw === "string" && notesRaw.trim().length > 0
            ? notesRaw.trim().slice(0, 500)
            : null;

    const [created] = await prisma.$transaction([
        prisma.proofOfPosting.create({
            data: {
                rentalId: params.id,
                photoUrls: cleanUrls,
                notes,
            },
        }),
        prisma.staticRental.update({
            where: { id: params.id },
            data: { proofStatus: "UPLOADED" },
        }),
    ]);

    // Reklam verene bildirim (best-effort)
    try {
        await sendProofUploadedToAdvertiser({
            rentalId: rental!.id,
            photoUrls: cleanUrls,
            notes,
            panel: {
                name: rental!.panel.name,
                city: rental!.panel.city,
                district: rental!.panel.district,
            },
            owner: {
                name: rental!.panel.owner?.user?.name || "Medya Sahibi",
                companyName: rental!.panel.owner?.companyName ?? null,
            },
            advertiser: {
                name: rental!.advertiser?.user?.name || "Reklam Veren",
                companyName: rental!.advertiser?.companyName ?? null,
                email: rental!.advertiser?.user?.email ?? null,
            },
            startDate: rental!.startDate,
            endDate: rental!.endDate,
        });
    } catch (mailErr) {
        console.error("[Email] proof notification failed:", mailErr);
    }

    if (rental!.advertiser?.user?.id) {
        await createNotification({
            userId: rental!.advertiser.user.id,
            type: "PROOF_UPLOADED",
            title: `Yayın kanıtı yüklendi — ${rental!.panel.name}`,
            body: "Medya sahibi kampanyanızın yayın kanıtı fotoğrafını paylaştı.",
            link: `/app/advertiser/rentals/${rental!.id}`,
            meta: { rentalId: rental!.id, proofId: created.id },
        });
    }

    return NextResponse.json({
        id: created.id,
        photoUrls: created.photoUrls,
        notes: created.notes,
        uploadedAt: created.uploadedAt.toISOString(),
    });
}

// DELETE — tek kanıt sil
// query: ?proofId=xxx
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rental, error, status } = await ensureOwnedRental(params.id, ownerId);
    if (error) return NextResponse.json({ error }, { status });

    const proofId = new URL(req.url).searchParams.get("proofId");
    if (!proofId) return NextResponse.json({ error: "proofId gerekli" }, { status: 400 });

    const proof = await prisma.proofOfPosting.findUnique({ where: { id: proofId } });
    if (!proof || proof.rentalId !== rental!.id) {
        return NextResponse.json({ error: "Kanıt bulunamadı" }, { status: 404 });
    }

    await prisma.proofOfPosting.delete({ where: { id: proofId } });

    // Geriye kanıt kalmadıysa statüyü PENDING'e çek
    const remaining = await prisma.proofOfPosting.count({
        where: { rentalId: rental!.id },
    });
    if (remaining === 0) {
        await prisma.staticRental.update({
            where: { id: rental!.id },
            data: { proofStatus: "PENDING" },
        });
    }

    return NextResponse.json({ ok: true, remaining });
}
