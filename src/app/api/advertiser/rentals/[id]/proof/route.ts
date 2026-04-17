import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createNotification } from "@/lib/notify";

export const dynamic = "force-dynamic";

async function getAdvertiserFromSession() {
    const session = await getSession();
    if (!session || !session.userId) return null;
    const advertiser = await prisma.advertiser.findUnique({
        where: { userId: session.userId },
        select: { id: true },
    });
    return advertiser ? { advertiserId: advertiser.id, userId: session.userId } : null;
}

async function ensureOwnRental(rentalId: string, advertiserId: string) {
    const rental = await prisma.staticRental.findUnique({
        where: { id: rentalId },
        include: {
            panel: {
                select: {
                    id: true,
                    name: true,
                    city: true,
                    district: true,
                    imageUrl: true,
                    imageUrls: true,
                    owner: { select: { userId: true, companyName: true } },
                },
            },
        },
    });
    if (!rental) return { error: "Kiralama bulunamadı", status: 404 as const, rental: null };
    if (rental.advertiserId !== advertiserId)
        return { error: "Yetkisiz erişim", status: 403 as const, rental: null };
    return { rental, error: null, status: 200 as const };
}

// GET — kanıtları listele
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const ctx = await getAdvertiserFromSession();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rental, error, status } = await ensureOwnRental(params.id, ctx.advertiserId);
    if (error) return NextResponse.json({ error }, { status });

    const proofs = await prisma.proofOfPosting.findMany({
        where: { rentalId: params.id },
        orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json({
        rental: {
            id: rental!.id,
            panel: rental!.panel,
            startDate: rental!.startDate.toISOString(),
            endDate: rental!.endDate.toISOString(),
            proofStatus: rental!.proofStatus,
        },
        items: proofs.map((p) => ({
            id: p.id,
            photoUrls: p.photoUrls,
            notes: p.notes,
            uploadedAt: p.uploadedAt.toISOString(),
            confirmedAt: p.confirmedAt?.toISOString() ?? null,
        })),
    });
}

// PATCH — reklam veren tüm kanıtları "onaylandı" işaretler
// body: {} (no-op); toggles rental.proofStatus -> CONFIRMED
export async function PATCH(_req: NextRequest, { params }: { params: { id: string } }) {
    const ctx = await getAdvertiserFromSession();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { rental, error, status } = await ensureOwnRental(params.id, ctx.advertiserId);
    if (error) return NextResponse.json({ error }, { status });

    if (rental!.proofStatus !== "UPLOADED") {
        return NextResponse.json(
            { error: "Onaylanacak yüklenmiş kanıt yok." },
            { status: 400 }
        );
    }

    const now = new Date();
    await prisma.$transaction([
        prisma.proofOfPosting.updateMany({
            where: { rentalId: params.id, confirmedAt: null },
            data: { confirmedAt: now, confirmedBy: ctx.userId },
        }),
        prisma.staticRental.update({
            where: { id: params.id },
            data: { proofStatus: "CONFIRMED" },
        }),
    ]);

    if (rental!.panel.owner?.userId) {
        await createNotification({
            userId: rental!.panel.owner.userId,
            type: "PROOF_CONFIRMED",
            title: `Yayın kanıtı onaylandı — ${rental!.panel.name}`,
            body: "Reklam veren yayın kanıtınızı onayladı.",
            link: `/app/owner/requests/${rental!.id}`,
            meta: { rentalId: rental!.id },
        });
    }

    return NextResponse.json({ ok: true, proofStatus: "CONFIRMED", confirmedAt: now.toISOString() });
}
