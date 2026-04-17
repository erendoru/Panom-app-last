import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rental = await prisma.staticRental.findUnique({
        where: { id: params.id },
        include: {
            advertiser: {
                include: {
                    user: { select: { name: true, email: true, phone: true } },
                },
            },
            panel: true,
        },
    });

    if (!rental) return NextResponse.json({ error: "Talep bulunamadı" }, { status: 404 });
    if (rental.panel.ownerId !== ownerId)
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });

    return NextResponse.json({
        id: rental.id,
        panel: rental.panel,
        advertiser: {
            id: rental.advertiser?.id,
            companyName: rental.advertiser?.companyName ?? null,
            name: rental.advertiser?.user?.name ?? null,
            email: rental.advertiser?.user?.email ?? null,
            phone: rental.advertiser?.user?.phone ?? null,
        },
        startDate: rental.startDate.toISOString(),
        endDate: rental.endDate.toISOString(),
        totalPrice: rental.totalPrice,
        currency: rental.currency,
        status: rental.status,
        ownerReviewStatus: rental.ownerReviewStatus,
        ownerReviewNote: rental.ownerReviewNote,
        ownerReviewedAt: rental.ownerReviewedAt?.toISOString() ?? null,
        creativeUrl: rental.creativeUrl,
        creativeStatus: rental.creativeStatus,
        creativeNote: rental.creativeNote,
        creativeReviewedAt: rental.creativeReviewedAt?.toISOString() ?? null,
        designRequested: rental.designRequested,
        createdAt: rental.createdAt.toISOString(),
    });
}
