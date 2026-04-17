import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendRequestDecisionToAdvertiser } from "@/lib/email";

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

// PATCH — talep onay/red
// body: { action: "approve" | "reject", note?: string }
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
                include: { user: { select: { name: true, email: true } } },
            },
        },
    });

    if (!rental) return NextResponse.json({ error: "Talep bulunamadı" }, { status: 404 });
    if (rental.panel.ownerId !== ownerId)
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { action, note } = body || {};

    if (action !== "approve" && action !== "reject") {
        return NextResponse.json(
            { error: "action: 'approve' | 'reject' olmalı" },
            { status: 400 }
        );
    }

    const cleanNote = note ? String(note).slice(0, 500) : null;

    const updated = await prisma.staticRental.update({
        where: { id: rental.id },
        data: {
            ownerReviewStatus: action === "approve" ? "APPROVED" : "REJECTED",
            ownerReviewNote: cleanNote,
            ownerReviewedAt: new Date(),
            // Reddedildiğinde kiralama iptal akışına sokulur
            ...(action === "reject" ? { status: "CANCELLED" } : {}),
        },
    });

    // Reklam verene karar bildirimi (best-effort)
    try {
        await sendRequestDecisionToAdvertiser({
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
        console.error("[Email] decision notification failed:", mailErr);
    }

    return NextResponse.json({
        id: updated.id,
        ownerReviewStatus: updated.ownerReviewStatus,
        ownerReviewNote: updated.ownerReviewNote,
        ownerReviewedAt: updated.ownerReviewedAt?.toISOString() ?? null,
        status: updated.status,
    });
}
