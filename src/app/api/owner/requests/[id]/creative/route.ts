import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendCreativeDecisionToAdvertiser } from "@/lib/email";
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

// PATCH — kampanya görseli onay/revizyon
// body: { action: "approve" | "revision", note?: string }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rental = await prisma.staticRental.findUnique({
        where: { id: params.id },
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

    if (!rental) return NextResponse.json({ error: "Talep bulunamadı" }, { status: 404 });
    if (rental.panel.ownerId !== ownerId)
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });

    if (!rental.creativeUrl) {
        return NextResponse.json({ error: "Bu talepte yüklenmiş görsel yok" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { action, note } = body || {};

    if (action !== "approve" && action !== "revision") {
        return NextResponse.json(
            { error: "action: 'approve' | 'revision' olmalı" },
            { status: 400 }
        );
    }

    if (action === "revision" && !note) {
        return NextResponse.json(
            { error: "Revizyon isteğinde not zorunlu" },
            { status: 400 }
        );
    }

    const cleanNote = note ? String(note).slice(0, 500) : null;

    const updated = await prisma.staticRental.update({
        where: { id: rental.id },
        data: {
            creativeStatus: action === "approve" ? "APPROVED" : "REVISION_REQUESTED",
            creativeNote: cleanNote,
            creativeReviewedAt: new Date(),
        },
    });

    // Reklam verene creative kararını bildir (best-effort)
    try {
        await sendCreativeDecisionToAdvertiser({
            rentalId: rental.id,
            decision: action,
            note: cleanNote,
            panel: {
                name: rental.panel.name,
                city: rental.panel.city,
                district: rental.panel.district,
            },
            owner: {
                name: rental.panel.owner?.user?.name || "Medya Sahibi",
                companyName: rental.panel.owner?.companyName,
                email: rental.panel.owner?.contactEmail || rental.panel.owner?.user?.email,
            },
            advertiser: {
                name: rental.advertiser?.user?.name || "Reklam Veren",
                companyName: rental.advertiser?.companyName ?? null,
                email: rental.advertiser?.user?.email ?? null,
            },
            startDate: rental.startDate,
            endDate: rental.endDate,
            totalPrice: rental.totalPrice.toString(),
            currency: rental.currency,
        });
    } catch (mailErr) {
        console.error("[Email] creative notification failed:", mailErr);
    }

    if (rental.advertiser?.user?.id) {
        await createNotification({
            userId: rental.advertiser.user.id,
            type: action === "approve" ? "CREATIVE_APPROVED" : "CREATIVE_REJECTED",
            title:
                action === "approve"
                    ? `Görseliniz onaylandı — ${rental.panel.name}`
                    : `Görsel revizyon istendi — ${rental.panel.name}`,
            body: cleanNote ?? undefined,
            link: `/app/advertiser/rentals/${rental.id}`,
            meta: { rentalId: rental.id },
        });
    }

    return NextResponse.json({
        id: updated.id,
        creativeStatus: updated.creativeStatus,
        creativeNote: updated.creativeNote,
        creativeReviewedAt: updated.creativeReviewedAt?.toISOString() ?? null,
    });
}
