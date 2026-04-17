import { cache } from "react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export type OwnerProfileSummary = {
    id: string;
    userId: string;
    name: string;
    email: string;
    companyName: string;
    logoUrl: string | null;
    slug: string | null;
    approved: boolean;
    cities: string[];
};

/** Resolves the logged-in user's ScreenOwner profile + key fields for the dashboard chrome. */
export const getOwnerProfile = cache(async (): Promise<OwnerProfileSummary | null> => {
    const session = await getSession();
    if (!session?.userId) return null;

    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session.userId },
        select: {
            id: true,
            userId: true,
            companyName: true,
            logoUrl: true,
            slug: true,
            approved: true,
            cities: true,
            user: { select: { name: true, email: true } },
        },
    });

    if (!owner) return null;

    return {
        id: owner.id,
        userId: owner.userId,
        name: owner.user.name,
        email: owner.user.email,
        companyName: owner.companyName,
        logoUrl: owner.logoUrl,
        slug: owner.slug,
        approved: owner.approved,
        cities: owner.cities,
    };
});
