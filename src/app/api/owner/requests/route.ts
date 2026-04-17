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

// GET /api/owner/requests?status=PENDING|APPROVED|REJECTED|ALL&panelId=...&sort=newest|oldest|price
export async function GET(req: NextRequest) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") || "ALL").toUpperCase();
    const panelId = searchParams.get("panelId");
    const sort = searchParams.get("sort") || "newest";

    const where: any = {
        panel: { ownerId },
    };
    if (status === "PENDING" || status === "APPROVED" || status === "REJECTED") {
        where.ownerReviewStatus = status;
    }
    if (panelId) where.panelId = panelId;

    let orderBy: any = { createdAt: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    if (sort === "price") orderBy = { totalPrice: "desc" };

    const rentals = await prisma.staticRental.findMany({
        where,
        orderBy,
        include: {
            advertiser: {
                include: { user: { select: { name: true, email: true, phone: true } } },
            },
            panel: {
                select: {
                    id: true,
                    name: true,
                    city: true,
                    district: true,
                    type: true,
                    imageUrl: true,
                    imageUrls: true,
                },
            },
        },
    });

    // Özet rakamlar
    const counts = await prisma.staticRental.groupBy({
        by: ["ownerReviewStatus"],
        where: { panel: { ownerId } },
        _count: { _all: true },
    });

    const summary = {
        PENDING: 0,
        APPROVED: 0,
        REJECTED: 0,
        total: 0,
    };
    for (const c of counts) {
        summary[c.ownerReviewStatus as "PENDING" | "APPROVED" | "REJECTED"] =
            c._count._all;
        summary.total += c._count._all;
    }

    return NextResponse.json({
        items: rentals.map((r) => ({
            id: r.id,
            panel: r.panel,
            advertiser: {
                companyName: r.advertiser?.companyName ?? null,
                name: r.advertiser?.user?.name ?? null,
                email: r.advertiser?.user?.email ?? null,
                phone: r.advertiser?.user?.phone ?? null,
            },
            startDate: r.startDate.toISOString(),
            endDate: r.endDate.toISOString(),
            totalPrice: r.totalPrice,
            currency: r.currency,
            status: r.status,
            ownerReviewStatus: r.ownerReviewStatus,
            ownerReviewNote: r.ownerReviewNote,
            ownerReviewedAt: r.ownerReviewedAt?.toISOString() ?? null,
            creativeUrl: r.creativeUrl,
            creativeStatus: r.creativeStatus,
            creativeNote: r.creativeNote,
            designRequested: r.designRequested,
            proofStatus: r.proofStatus,
            createdAt: r.createdAt.toISOString(),
        })),
        summary,
    });
}
