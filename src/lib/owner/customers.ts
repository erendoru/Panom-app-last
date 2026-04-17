import prisma from "@/lib/prisma";

export type OwnerCustomer = {
    advertiserId: string;
    name: string;
    companyName: string | null;
    email: string;
    phone: string | null;
    rentalCount: number;
    totalSpend: number;
    firstRentalAt: Date | null;
    lastRentalAt: Date | null;
    sector: string | null;
    notes: string | null;
};

export type CustomerRentalSummary = {
    id: string;
    panelId: string;
    panelName: string;
    panelCity: string;
    panelDistrict: string;
    panelType: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    status: string;
    ownerReviewStatus: string;
    createdAt: Date;
};

export type OwnerCustomerDetail = OwnerCustomer & {
    rentals: CustomerRentalSummary[];
};

type RentalRow = {
    id: string;
    startDate: Date;
    endDate: Date;
    totalPrice: { toNumber: () => number } | null;
    status: string;
    ownerReviewStatus: string;
    createdAt: Date;
    panel: {
        id: string;
        name: string;
        city: string;
        district: string;
        type: string;
    };
    advertiser: {
        id: string;
        companyName: string | null;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
        };
    };
};

async function fetchRentals(ownerId: string): Promise<RentalRow[]> {
    try {
        const rows = (await prisma.staticRental.findMany({
            where: { panel: { ownerId } },
            include: {
                panel: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        district: true,
                        type: true,
                    },
                },
                advertiser: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, phone: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 2000,
        })) as unknown as RentalRow[];
        return rows;
    } catch (err) {
        console.error("[owner/customers] fetchRentals failed:", err);
        return [];
    }
}

async function fetchNotes(ownerId: string) {
    try {
        const client = prisma as unknown as {
            ownerCustomerNote?: {
                findMany: (args: {
                    where: { ownerId: string };
                }) => Promise<
                    Array<{
                        advertiserId: string;
                        notes: string | null;
                        sector: string | null;
                    }>
                >;
            };
        };
        if (!client.ownerCustomerNote) return new Map<string, { notes: string | null; sector: string | null }>();
        const rows = await client.ownerCustomerNote.findMany({ where: { ownerId } });
        const m = new Map<string, { notes: string | null; sector: string | null }>();
        rows.forEach((r) => m.set(r.advertiserId, { notes: r.notes, sector: r.sector }));
        return m;
    } catch (err) {
        console.error("[owner/customers] fetchNotes failed:", err);
        return new Map<string, { notes: string | null; sector: string | null }>();
    }
}

export async function listOwnerCustomers(ownerId: string): Promise<OwnerCustomer[]> {
    const [rentals, notes] = await Promise.all([fetchRentals(ownerId), fetchNotes(ownerId)]);

    const byAdv = new Map<
        string,
        {
            advertiserId: string;
            name: string;
            companyName: string | null;
            email: string;
            phone: string | null;
            rentalCount: number;
            totalSpend: number;
            firstRentalAt: Date | null;
            lastRentalAt: Date | null;
        }
    >();

    for (const r of rentals) {
        const advId = r.advertiser?.id;
        if (!advId) continue;
        const user = r.advertiser.user;
        const entry = byAdv.get(advId) ?? {
            advertiserId: advId,
            name: user?.name || "Müşteri",
            companyName: r.advertiser.companyName ?? null,
            email: user?.email || "",
            phone: user?.phone ?? null,
            rentalCount: 0,
            totalSpend: 0,
            firstRentalAt: null as Date | null,
            lastRentalAt: null as Date | null,
        };
        entry.rentalCount += 1;
        entry.totalSpend += Number(r.totalPrice?.toString?.() ?? 0);
        const created = r.createdAt;
        if (!entry.firstRentalAt || created < entry.firstRentalAt) entry.firstRentalAt = created;
        if (!entry.lastRentalAt || created > entry.lastRentalAt) entry.lastRentalAt = created;
        byAdv.set(advId, entry);
    }

    const list: OwnerCustomer[] = [];
    byAdv.forEach((entry) => {
        const note = notes.get(entry.advertiserId);
        list.push({
            ...entry,
            sector: note?.sector ?? null,
            notes: note?.notes ?? null,
        });
    });

    list.sort((a, b) => b.totalSpend - a.totalSpend);
    return list;
}

export async function getOwnerCustomerDetail(
    ownerId: string,
    advertiserId: string
): Promise<OwnerCustomerDetail | null> {
    const [rentals, notes] = await Promise.all([fetchRentals(ownerId), fetchNotes(ownerId)]);
    const mine = rentals.filter((r) => r.advertiser?.id === advertiserId);
    if (mine.length === 0) return null;
    const user = mine[0].advertiser.user;
    const rentalCount = mine.length;
    const totalSpend = mine.reduce((s, r) => s + Number(r.totalPrice?.toString?.() ?? 0), 0);
    const first = mine.reduce<Date | null>((acc, r) => (!acc || r.createdAt < acc ? r.createdAt : acc), null);
    const last = mine.reduce<Date | null>((acc, r) => (!acc || r.createdAt > acc ? r.createdAt : acc), null);
    const note = notes.get(advertiserId);

    return {
        advertiserId,
        name: user?.name || "Müşteri",
        companyName: mine[0].advertiser.companyName ?? null,
        email: user?.email || "",
        phone: user?.phone ?? null,
        rentalCount,
        totalSpend,
        firstRentalAt: first,
        lastRentalAt: last,
        sector: note?.sector ?? null,
        notes: note?.notes ?? null,
        rentals: mine.map((r) => ({
            id: r.id,
            panelId: r.panel.id,
            panelName: r.panel.name,
            panelCity: r.panel.city,
            panelDistrict: r.panel.district,
            panelType: r.panel.type,
            startDate: r.startDate,
            endDate: r.endDate,
            totalPrice: Number(r.totalPrice?.toString?.() ?? 0),
            status: r.status,
            ownerReviewStatus: r.ownerReviewStatus,
            createdAt: r.createdAt,
        })),
    };
}

/**
 * Geçen yıl bu ay kiralamış müşterileri döndürür (dashboard hatırlatması için).
 * Her müşteri için sadece en son önceki kiralamayı saklar.
 */
export async function getReminderCustomers(ownerId: string): Promise<
    Array<{
        advertiserId: string;
        name: string;
        companyName: string | null;
        email: string;
        lastRentalAt: Date;
        panelName: string;
        yearsAgo: number;
    }>
> {
    const now = new Date();
    const month = now.getMonth();
    const rentals = await fetchRentals(ownerId);
    if (rentals.length === 0) return [];

    const seen = new Map<
        string,
        {
            advertiserId: string;
            name: string;
            companyName: string | null;
            email: string;
            lastRentalAt: Date;
            panelName: string;
            yearsAgo: number;
        }
    >();

    for (const r of rentals) {
        // Aynı ayda başlayan fakat bu yıl olmayan kiralamalar
        const startMonth = r.startDate.getMonth();
        const startYear = r.startDate.getFullYear();
        if (startMonth !== month) continue;
        if (startYear === now.getFullYear()) continue; // bu yıl zaten kiralıyor
        const adv = r.advertiser;
        if (!adv || !adv.user) continue;
        const existing = seen.get(adv.id);
        if (existing && existing.lastRentalAt >= r.startDate) continue;
        seen.set(adv.id, {
            advertiserId: adv.id,
            name: adv.user.name || "Müşteri",
            companyName: adv.companyName ?? null,
            email: adv.user.email,
            lastRentalAt: r.startDate,
            panelName: r.panel.name,
            yearsAgo: Math.max(1, now.getFullYear() - startYear),
        });
    }

    const out: Array<{
        advertiserId: string;
        name: string;
        companyName: string | null;
        email: string;
        lastRentalAt: Date;
        panelName: string;
        yearsAgo: number;
    }> = [];
    seen.forEach((v) => out.push(v));
    out.sort((a, b) => b.lastRentalAt.getTime() - a.lastRentalAt.getTime());
    return out;
}
