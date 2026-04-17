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

// GET /api/owner/calendar?panelId=...&from=YYYY-MM-DD&to=YYYY-MM-DD
// Tek ünite için: takvim kaynakları (rentals, blocks)
// panelId verilmezse: bu sahibin tüm ünitelerinin doluluk özeti
export async function GET(req: NextRequest) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const panelId = searchParams.get("panelId");
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");

    const defaultFrom = new Date();
    defaultFrom.setDate(1);
    const defaultTo = new Date(defaultFrom);
    defaultTo.setMonth(defaultTo.getMonth() + 3);

    const from = fromStr ? new Date(fromStr) : defaultFrom;
    const to = toStr ? new Date(toStr) : defaultTo;

    if (panelId) {
        const panel = await prisma.staticPanel.findFirst({
            where: { id: panelId, ownerId },
            select: {
                id: true,
                name: true,
                city: true,
                district: true,
                type: true,
                imageUrl: true,
                blockedDates: true,
                ownerStatus: true,
                reviewStatus: true,
                active: true,
                priceWeekly: true,
                priceDaily: true,
                isStartingPrice: true,
            },
        });

        if (!panel) return NextResponse.json({ error: "Pano bulunamadı" }, { status: 404 });

        const rentals = await prisma.staticRental.findMany({
            where: {
                panelId: panel.id,
                OR: [
                    { startDate: { gte: from, lte: to } },
                    { endDate: { gte: from, lte: to } },
                    { AND: [{ startDate: { lte: from } }, { endDate: { gte: to } }] },
                ],
            },
            include: {
                advertiser: {
                    include: { user: { select: { name: true, email: true } } },
                },
            },
            orderBy: { startDate: "asc" },
        });

        const pricings = await prisma.panelPricing.findMany({
            where: {
                panelId: panel.id,
                active: true,
                OR: [
                    { startDate: { gte: from, lte: to } },
                    { endDate: { gte: from, lte: to } },
                    { AND: [{ startDate: { lte: from } }, { endDate: { gte: to } }] },
                ],
            },
            orderBy: [{ priority: "desc" }, { startDate: "asc" }],
        });

        return NextResponse.json({
            panel,
            rentals: rentals.map((r) => ({
                id: r.id,
                startDate: r.startDate.toISOString(),
                endDate: r.endDate.toISOString(),
                status: r.status,
                ownerReviewStatus: r.ownerReviewStatus,
                customerName:
                    r.advertiser?.companyName || r.advertiser?.user?.name || "Müşteri",
                customerEmail: r.advertiser?.user?.email ?? null,
                totalPrice: r.totalPrice,
            })),
            blocks: Array.isArray(panel.blockedDates) ? panel.blockedDates : [],
            pricings,
            range: { from: from.toISOString(), to: to.toISOString() },
        });
    }

    // Toplu özet
    const panels = await prisma.staticPanel.findMany({
        where: { ownerId },
        select: {
            id: true,
            name: true,
            city: true,
            type: true,
            blockedDates: true,
            ownerStatus: true,
            active: true,
        },
        orderBy: { name: "asc" },
    });

    const panelIds = panels.map((p) => p.id);
    const rentals = await prisma.staticRental.findMany({
        where: {
            panelId: { in: panelIds },
            OR: [
                { startDate: { gte: from, lte: to } },
                { endDate: { gte: from, lte: to } },
                { AND: [{ startDate: { lte: from } }, { endDate: { gte: to } }] },
            ],
        },
        select: {
            id: true,
            panelId: true,
            startDate: true,
            endDate: true,
            status: true,
            ownerReviewStatus: true,
        },
        orderBy: { startDate: "asc" },
    });

    return NextResponse.json({
        panels,
        rentals: rentals.map((r) => ({
            ...r,
            startDate: r.startDate.toISOString(),
            endDate: r.endDate.toISOString(),
        })),
        range: { from: from.toISOString(), to: to.toISOString() },
    });
}
