import prisma from "@/lib/prisma";

export type OwnerDashboardStats = {
    totalUnits: number;
    activeUnits: number;
    requestsLast30Days: number;
    occupancyPercent: number;
    pendingRequests: number;
};

export type RecentRequest = {
    id: string;
    createdAt: Date;
    advertiserName: string;
    unitName: string;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
    amount: number | null;
};

export type MonthlyRequestPoint = {
    key: string; // e.g. "2026-03"
    label: string; // e.g. "Mar 26"
    total: number;
};

const MONTH_LABELS_TR = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

/**
 * Computes summary cards for the owner dashboard.
 * Data sources (Faz 2):
 *  - Units    = owner's Screen count (StaticPanel owner linkage arrives in Faz 3)
 *  - Requests = Campaigns booked against the owner's screens (CampaignScreen join)
 *  - Occupancy = share of owner screen-weeks that are booked in the current week-of-year window
 */
export async function getOwnerStats(ownerId: string): Promise<OwnerDashboardStats> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [screens, panels, activeScreens, activePanels, campaignsLast30, rentalsLast30, pendingRentals, occupancyPercent] = await Promise.all([
        prisma.screen.count({ where: { ownerId } }),
        prisma.staticPanel.count({ where: { ownerId } }),
        prisma.screen.count({ where: { ownerId, active: true } }),
        prisma.staticPanel.count({ where: { ownerId, active: true, reviewStatus: "APPROVED", ownerStatus: "ACTIVE" } }),
        prisma.campaign.count({
            where: {
                createdAt: { gte: thirtyDaysAgo },
                campaignScreens: { some: { screen: { ownerId } } },
            },
        }),
        prisma.staticRental.count({
            where: { createdAt: { gte: thirtyDaysAgo }, panel: { ownerId } },
        }),
        prisma.staticRental.count({
            where: { ownerReviewStatus: "PENDING", panel: { ownerId } },
        }),
        computeCurrentOccupancy(ownerId),
    ]);

    return {
        totalUnits: screens + panels,
        activeUnits: activeScreens + activePanels,
        requestsLast30Days: campaignsLast30 + rentalsLast30,
        occupancyPercent,
        pendingRequests: pendingRentals,
    };
}

export async function getPendingRequestsCount(ownerId: string): Promise<number> {
    return prisma.staticRental.count({
        where: { ownerReviewStatus: "PENDING", panel: { ownerId } },
    });
}

async function computeCurrentOccupancy(ownerId: string): Promise<number> {
    // Consider the next 4 weeks as the window. For each screen, count weeks that
    // overlap at least one campaign booking -> divide by (screens * 4).
    const totalScreens = await prisma.screen.count({ where: { ownerId } });
    if (totalScreens === 0) return 0;

    const now = new Date();
    const windowEnd = new Date();
    windowEnd.setDate(now.getDate() + 28);

    const bookings = await prisma.campaign.findMany({
        where: {
            campaignScreens: { some: { screen: { ownerId } } },
            startDate: { lte: windowEnd },
            endDate: { gte: now },
            status: { in: ["ACTIVE", "APPROVED", "RUNNING", "SCHEDULED"] },
        },
        select: {
            startDate: true,
            endDate: true,
            campaignScreens: {
                where: { screen: { ownerId } },
                select: { screenId: true },
            },
        },
    });

    // Map screenId -> set of occupied week indices (0..3)
    const occupied = new Map<string, Set<number>>();
    const weekMs = 7 * 24 * 3600 * 1000;
    for (const b of bookings) {
        for (const cs of b.campaignScreens) {
            const s = Math.max(b.startDate.getTime(), now.getTime());
            const e = Math.min(b.endDate.getTime(), windowEnd.getTime());
            if (e < s) continue;
            const startWeek = Math.floor((s - now.getTime()) / weekMs);
            const endWeek = Math.floor((e - now.getTime()) / weekMs);
            const set = occupied.get(cs.screenId) ?? new Set<number>();
            for (let w = startWeek; w <= endWeek && w < 4; w++) {
                if (w >= 0) set.add(w);
            }
            occupied.set(cs.screenId, set);
        }
    }

    let occupiedCells = 0;
    occupied.forEach((set) => {
        occupiedCells += set.size;
    });
    const capacity = totalScreens * 4;
    return Math.round((occupiedCells / capacity) * 100);
}

export async function getRecentRequests(ownerId: string, limit = 5): Promise<RecentRequest[]> {
    const rows = await prisma.staticRental.findMany({
        where: { panel: { ownerId } },
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
            id: true,
            createdAt: true,
            ownerReviewStatus: true,
            startDate: true,
            endDate: true,
            totalPrice: true,
            advertiser: {
                select: {
                    companyName: true,
                    user: { select: { name: true } },
                },
            },
            panel: { select: { name: true } },
        },
    });

    return rows.map((r) => ({
        id: r.id,
        createdAt: r.createdAt,
        advertiserName: r.advertiser?.companyName || r.advertiser?.user?.name || "Reklam Veren",
        unitName: r.panel?.name ?? "Ünite",
        status: r.ownerReviewStatus,
        startDate: r.startDate,
        endDate: r.endDate,
        amount: r.totalPrice ? Number(r.totalPrice) : null,
    }));
}

export async function getMonthlyRequestTrend(ownerId: string): Promise<MonthlyRequestPoint[]> {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const rows = await prisma.staticRental.findMany({
        where: {
            createdAt: { gte: start },
            panel: { ownerId },
        },
        select: { createdAt: true },
    });

    const buckets = new Map<string, number>();
    for (let i = 0; i < 6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        buckets.set(key, 0);
    }
    for (const row of rows) {
        const d = row.createdAt;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (buckets.has(key)) buckets.set(key, (buckets.get(key) || 0) + 1);
    }

    const points: MonthlyRequestPoint[] = [];
    buckets.forEach((total, key) => {
        const [y, m] = key.split("-").map(Number);
        const label = `${MONTH_LABELS_TR[m - 1]} ${String(y).slice(-2)}`;
        points.push({ key, label, total });
    });
    return points;
}

export function translateCampaignStatus(status: string): { label: string; tone: "amber" | "emerald" | "rose" | "sky" | "slate" } {
    const upper = status.toUpperCase();
    switch (upper) {
        case "PENDING":
        case "PENDING_APPROVAL":
        case "DRAFT":
            return { label: "Beklemede", tone: "amber" };
        case "APPROVED":
        case "ACTIVE":
        case "RUNNING":
        case "SCHEDULED":
            return { label: "Onaylandı", tone: "emerald" };
        case "REJECTED":
        case "CANCELLED":
            return { label: "Reddedildi", tone: "rose" };
        case "COMPLETED":
            return { label: "Tamamlandı", tone: "sky" };
        default:
            return { label: status, tone: "slate" };
    }
}
