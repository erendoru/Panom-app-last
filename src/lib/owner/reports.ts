import prisma from "@/lib/prisma";

// Panobu komisyon oranı (varsayılan %10). ENV ile ayarlanabilir.
export const COMMISSION_RATE = (() => {
    const raw = Number(process.env.PANOBU_COMMISSION_RATE);
    if (!Number.isFinite(raw) || raw < 0 || raw > 1) return 0.1;
    return raw;
})();

export type ReportPeriodKey =
    | "this_month"
    | "last_3m"
    | "last_6m"
    | "this_year"
    | "custom";

export type ReportPeriod = {
    key: ReportPeriodKey;
    label: string;
    start: Date;
    end: Date;
};

const MONTH_LABELS_TR = [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
];

export type ReportKpis = {
    totalRevenue: number;
    netRevenue: number;
    commission: number;
    rentalCount: number;
    avgOccupancyPercent: number;
    topUnit: { name: string; revenue: number; rentals: number } | null;
};

export type MonthlyRevenuePoint = {
    key: string;
    label: string;
    gross: number;
    commission: number;
    net: number;
    rentals: number;
};

export type UnitReportRow = {
    id: string;
    name: string;
    city: string;
    district: string;
    type: string;
    rentalCount: number;
    revenue: number;
    occupancyPercent: number;
    topCustomer: string | null;
};

export type StatusDistribution = {
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
};

export type PanelTypeRevenueSlice = {
    type: string;
    revenue: number;
    rentalCount: number;
};

export type TopCustomerRow = {
    name: string;
    revenue: number;
    rentalCount: number;
};

export type OwnerReport = {
    period: ReportPeriod;
    kpis: ReportKpis;
    monthly: MonthlyRevenuePoint[];
    units: UnitReportRow[];
    statusDistribution: StatusDistribution;
    panelTypeRevenue: PanelTypeRevenueSlice[];
    topCustomers: TopCustomerRow[];
};

/**
 * Belirli bir periyot anahtarına göre başlangıç/bitiş tarihleri döner.
 * `custom` ise sağlanan `customStart`/`customEnd` kullanılır.
 */
export function resolvePeriod(
    key: ReportPeriodKey,
    customStart?: string | null,
    customEnd?: string | null
): ReportPeriod {
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    let label = "Bu ay";
    switch (key) {
        case "this_month":
            start.setDate(1);
            label = "Bu ay";
            break;
        case "last_3m":
            start.setMonth(start.getMonth() - 2, 1);
            label = "Son 3 ay";
            break;
        case "last_6m":
            start.setMonth(start.getMonth() - 5, 1);
            label = "Son 6 ay";
            break;
        case "this_year":
            start.setMonth(0, 1);
            label = "Bu yıl";
            break;
        case "custom": {
            const s = customStart ? new Date(customStart) : start;
            const e = customEnd ? new Date(customEnd) : now;
            if (!Number.isNaN(s.getTime())) {
                s.setHours(0, 0, 0, 0);
                return {
                    key,
                    label: "Özel aralık",
                    start: s,
                    end: Number.isNaN(e.getTime()) ? now : (e.setHours(23, 59, 59, 999), e),
                };
            }
            break;
        }
    }

    return { key, label, start, end: now };
}

function safeNumber(v: unknown): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function diffDaysInclusive(a: Date, b: Date): number {
    const MS = 24 * 60 * 60 * 1000;
    const d = Math.floor((b.getTime() - a.getTime()) / MS) + 1;
    return d > 0 ? d : 0;
}

/**
 * Belirtilen dönem için tam bir rapor üretir.
 * Veri kaynağı: `StaticRental` (ownerReviewStatus=APPROVED, status != CANCELLED)
 * Dönem kriteri: rezervasyonun [startDate..endDate] aralığı dönem aralığıyla kesişiyor olmalı.
 */
export async function buildOwnerReport(
    ownerId: string,
    period: ReportPeriod
): Promise<OwnerReport> {
    // Owner'ın sahip olduğu tüm static panellerin listesi (doluluk ve unit raporu için)
    let panels: {
        id: string;
        name: string;
        city: string;
        district: string;
        type: string;
    }[] = [];
    try {
        panels = await prisma.staticPanel.findMany({
            where: { ownerId },
            select: { id: true, name: true, city: true, district: true, type: true },
        });
    } catch (err) {
        console.error("[reports] panels load failed:", (err as Error)?.message);
    }

    // Döneme denk gelen tüm rezervasyonlar (status dağılımı dahil hepsi — onaylı/ret/beklemede)
    let allRentalsInPeriod: Array<{
        id: string;
        panelId: string;
        startDate: Date;
        endDate: Date;
        totalPrice: any;
        status: string;
        ownerReviewStatus: "PENDING" | "APPROVED" | "REJECTED";
        advertiser: { companyName: string | null; user: { name: string | null } | null } | null;
        panel: { id: string; name: string; city: string; district: string; type: string };
    }> = [];
    try {
        const rows = await prisma.staticRental.findMany({
            where: {
                panel: { ownerId },
                startDate: { lte: period.end },
                endDate: { gte: period.start },
            },
            include: {
                advertiser: {
                    include: { user: { select: { name: true } } },
                },
                panel: {
                    select: { id: true, name: true, city: true, district: true, type: true },
                },
            },
        });
        allRentalsInPeriod = rows as typeof allRentalsInPeriod;
    } catch (err) {
        console.error("[reports] rentals load failed:", (err as Error)?.message);
    }

    // Revenue hesabında sadece APPROVED & iptal olmamış olanlar
    const revenueRentals = allRentalsInPeriod.filter(
        (r) => r.ownerReviewStatus === "APPROVED" && r.status !== "CANCELLED"
    );

    // KPI: toplam gelir
    const totalRevenue = revenueRentals.reduce((sum, r) => sum + safeNumber(r.totalPrice), 0);
    const commission = totalRevenue * COMMISSION_RATE;
    const netRevenue = totalRevenue - commission;

    // Status distribution (period kapsayan tüm rentallar üzerinden)
    const statusDistribution: StatusDistribution = {
        PENDING: 0,
        APPROVED: 0,
        REJECTED: 0,
    };
    for (const r of allRentalsInPeriod) {
        statusDistribution[r.ownerReviewStatus] =
            (statusDistribution[r.ownerReviewStatus] || 0) + 1;
    }

    // Aylık gelir trendi
    const monthlyMap = new Map<string, MonthlyRevenuePoint>();
    // Dönem aralığındaki her ay için boş bucket oluştur
    const cur = new Date(period.start.getFullYear(), period.start.getMonth(), 1);
    const endMarker = new Date(period.end.getFullYear(), period.end.getMonth(), 1);
    while (cur <= endMarker) {
        const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`;
        monthlyMap.set(key, {
            key,
            label: `${MONTH_LABELS_TR[cur.getMonth()]} ${String(cur.getFullYear()).slice(-2)}`,
            gross: 0,
            commission: 0,
            net: 0,
            rentals: 0,
        });
        cur.setMonth(cur.getMonth() + 1);
    }
    for (const r of revenueRentals) {
        const d = r.startDate;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const bucket = monthlyMap.get(key);
        if (!bucket) continue;
        const gross = safeNumber(r.totalPrice);
        bucket.gross += gross;
        bucket.commission += gross * COMMISSION_RATE;
        bucket.net += gross * (1 - COMMISSION_RATE);
        bucket.rentals += 1;
    }
    const monthly: MonthlyRevenuePoint[] = [];
    monthlyMap.forEach((v) => monthly.push(v));

    // Ünite bazlı doluluk ve gelir
    const periodDays = diffDaysInclusive(period.start, period.end);
    type UnitAgg = {
        rentalCount: number;
        revenue: number;
        busyDays: number;
        customers: Map<string, { revenue: number; count: number }>;
    };
    const unitAgg = new Map<string, UnitAgg>();
    for (const p of panels) {
        unitAgg.set(p.id, {
            rentalCount: 0,
            revenue: 0,
            busyDays: 0,
            customers: new Map(),
        });
    }

    for (const r of revenueRentals) {
        const agg = unitAgg.get(r.panelId);
        if (!agg) continue;
        agg.rentalCount += 1;
        agg.revenue += safeNumber(r.totalPrice);

        // Dönemle kesişen gün sayısı
        const overlapStart = r.startDate > period.start ? r.startDate : period.start;
        const overlapEnd = r.endDate < period.end ? r.endDate : period.end;
        agg.busyDays += diffDaysInclusive(overlapStart, overlapEnd);

        // Müşteri bazlı toplam
        const customerName =
            r.advertiser?.companyName ||
            r.advertiser?.user?.name ||
            "Bilinmeyen Müşteri";
        const curr = agg.customers.get(customerName) || { revenue: 0, count: 0 };
        curr.revenue += safeNumber(r.totalPrice);
        curr.count += 1;
        agg.customers.set(customerName, curr);
    }

    const units: UnitReportRow[] = panels.map((p) => {
        const a = unitAgg.get(p.id)!;
        let topCustomer: string | null = null;
        let topSum = -1;
        a.customers.forEach((v, k) => {
            if (v.revenue > topSum) {
                topSum = v.revenue;
                topCustomer = k;
            }
        });
        const occupancy = periodDays > 0 ? Math.min(100, Math.round((a.busyDays / periodDays) * 100)) : 0;
        return {
            id: p.id,
            name: p.name,
            city: p.city,
            district: p.district,
            type: p.type,
            rentalCount: a.rentalCount,
            revenue: a.revenue,
            occupancyPercent: occupancy,
            topCustomer,
        };
    });
    units.sort((a, b) => b.revenue - a.revenue);

    // Ortalama doluluk
    const avgOccupancyPercent = panels.length
        ? Math.round(units.reduce((s, u) => s + u.occupancyPercent, 0) / panels.length)
        : 0;

    // En çok talep alan ünite (gelir bazlı)
    const topUnit =
        units.find((u) => u.rentalCount > 0)
            ? {
                  name: units[0].name,
                  revenue: units[0].revenue,
                  rentals: units[0].rentalCount,
              }
            : null;

    // Panel tipi bazlı gelir
    const typeMap = new Map<string, { revenue: number; rentalCount: number }>();
    for (const r of revenueRentals) {
        const type = r.panel?.type || "DİĞER";
        const curr = typeMap.get(type) || { revenue: 0, rentalCount: 0 };
        curr.revenue += safeNumber(r.totalPrice);
        curr.rentalCount += 1;
        typeMap.set(type, curr);
    }
    const panelTypeRevenue: PanelTypeRevenueSlice[] = [];
    typeMap.forEach((v, type) =>
        panelTypeRevenue.push({ type, revenue: v.revenue, rentalCount: v.rentalCount })
    );
    panelTypeRevenue.sort((a, b) => b.revenue - a.revenue);

    // En çok kiralayan müşteriler (top 5)
    const customerMap = new Map<string, { revenue: number; rentalCount: number }>();
    for (const r of revenueRentals) {
        const name =
            r.advertiser?.companyName ||
            r.advertiser?.user?.name ||
            "Bilinmeyen Müşteri";
        const curr = customerMap.get(name) || { revenue: 0, rentalCount: 0 };
        curr.revenue += safeNumber(r.totalPrice);
        curr.rentalCount += 1;
        customerMap.set(name, curr);
    }
    const topCustomers: TopCustomerRow[] = [];
    customerMap.forEach((v, name) =>
        topCustomers.push({ name, revenue: v.revenue, rentalCount: v.rentalCount })
    );
    topCustomers.sort((a, b) => b.revenue - a.revenue);

    return {
        period,
        kpis: {
            totalRevenue,
            netRevenue,
            commission,
            rentalCount: revenueRentals.length,
            avgOccupancyPercent,
            topUnit,
        },
        monthly,
        units,
        statusDistribution,
        panelTypeRevenue,
        topCustomers: topCustomers.slice(0, 5),
    };
}
