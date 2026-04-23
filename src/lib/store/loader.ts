import { cache } from "react";
import prisma from "@/lib/prisma";

export type StoreOwner = {
    id: string;
    companyName: string;
    slug: string;
    logoUrl: string | null;
    coverUrl: string | null;
    description: string | null;
    website: string | null;
    phone: string | null;
    contactEmail: string | null;
    cities: string[];
    approved: boolean;
    userEmail: string;
    userName: string;
};

export const loadStoreOwner = cache(async (slug: string): Promise<StoreOwner | null> => {
    try {
        const owner = await prisma.screenOwner.findUnique({
            where: { slug },
            select: {
                id: true,
                companyName: true,
                slug: true,
                logoUrl: true,
                coverUrl: true,
                description: true,
                website: true,
                phone: true,
                contactEmail: true,
                cities: true,
                approved: true,
                user: { select: { name: true, email: true } },
            },
        });
        if (!owner || !owner.slug) return null;
        return {
            id: owner.id,
            companyName: owner.companyName,
            slug: owner.slug,
            logoUrl: owner.logoUrl,
            coverUrl: owner.coverUrl,
            description: owner.description,
            website: owner.website,
            phone: owner.phone,
            contactEmail: owner.contactEmail,
            cities: owner.cities ?? [],
            approved: owner.approved,
            userName: owner.user.name,
            userEmail: owner.user.email,
        };
    } catch (err) {
        console.error("[store/loader] loadStoreOwner failed:", err);
        return null;
    }
});

export type StorePanel = {
    id: string;
    name: string;
    type: string;
    subType: string | null;
    city: string;
    district: string;
    address: string;
    latitude: number;
    longitude: number;
    width: number;
    height: number;
    priceWeekly: number | null;
    priceDaily: number | null;
    priceMonthly: number | null;
    price3Month: number | null;
    price6Month: number | null;
    priceYearly: number | null;
    printingFee: number | null;
    isStartingPrice: boolean;
    trafficLevel: string;
    lighting: string | null;
    faceCount: number;
    estimatedDailyImpressions: number;
    isAVM: boolean;
    avmName: string | null;
    imageUrl: string | null;
    imageUrls: string[];
    description: string | null;
};

export async function loadStorePanels(ownerId: string): Promise<StorePanel[]> {
    try {
        const rows = await prisma.staticPanel.findMany({
            where: {
                ownerId,
                active: true,
                reviewStatus: "APPROVED",
                ownerStatus: "ACTIVE",
            },
            orderBy: [{ city: "asc" }, { createdAt: "desc" }],
        });
        return rows.map((p) => ({
            id: p.id,
            name: p.name,
            type: p.type,
            subType: p.subType,
            city: p.city,
            district: p.district,
            address: p.address,
            latitude: p.latitude,
            longitude: p.longitude,
            width: Number(p.width),
            height: Number(p.height),
            priceWeekly: p.priceWeekly != null ? Number(p.priceWeekly) : null,
            priceDaily: p.priceDaily != null ? Number(p.priceDaily) : null,
            priceMonthly: p.priceMonthly != null ? Number(p.priceMonthly) : null,
            price3Month: p.price3Month != null ? Number(p.price3Month) : null,
            price6Month: p.price6Month != null ? Number(p.price6Month) : null,
            priceYearly: p.priceYearly != null ? Number(p.priceYearly) : null,
            printingFee: p.printingFee != null ? Number(p.printingFee) : null,
            isStartingPrice: p.isStartingPrice,
            trafficLevel: p.trafficLevel,
            lighting: p.lighting,
            faceCount: p.faceCount,
            estimatedDailyImpressions: p.estimatedDailyImpressions,
            isAVM: p.isAVM,
            avmName: p.avmName,
            imageUrl: p.imageUrl ?? p.imageUrls?.[0] ?? null,
            imageUrls: p.imageUrls ?? [],
            description: p.description,
        }));
    } catch (err) {
        console.error("[store/loader] loadStorePanels failed:", err);
        return [];
    }
}
