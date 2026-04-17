import prisma from "@/lib/prisma";
import { getOwnerProfile } from "@/lib/owner/profile";
import OwnerUnitsClient, { type UnitItem } from "./OwnerUnitsClient";

export const dynamic = "force-dynamic";

export default async function OwnerUnitsPage() {
    const profile = await getOwnerProfile();
    if (!profile) return null;

    const [panels, screens] = await Promise.all([
        prisma.staticPanel.findMany({
            where: { ownerId: profile.id },
            orderBy: { createdAt: "desc" },
        }),
        prisma.screen.findMany({
            where: { ownerId: profile.id },
            orderBy: { createdAt: "desc" },
        }),
    ]);

    const panelItems: UnitItem[] = panels.map((p) => ({
        id: p.id,
        kind: "panel",
        name: p.name,
        type: p.type,
        city: p.city,
        district: p.district,
        image: (p.imageUrls?.[0] as string | undefined) || p.imageUrl || null,
        priceWeekly: p.priceWeekly ? Number(p.priceWeekly) : null,
        priceDaily: p.priceDaily ? Number(p.priceDaily) : null,
        active: p.active,
        reviewStatus: p.reviewStatus,
        ownerStatus: p.ownerStatus,
        reviewNote: p.reviewNote ?? null,
        createdAt: p.createdAt.toISOString(),
    }));

    const screenItems: UnitItem[] = screens.map((s) => ({
        id: s.id,
        kind: "screen",
        name: s.name,
        type: "DIGITAL",
        city: s.city ?? "",
        district: s.district ?? "",
        image: s.previewImageUrl ?? null,
        priceWeekly: null,
        priceDaily: null,
        active: s.active,
        reviewStatus: s.active ? "APPROVED" : "PENDING",
        ownerStatus: "ACTIVE",
        reviewNote: null,
        createdAt: s.createdAt.toISOString(),
    }));

    const items = [...panelItems, ...screenItems].sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1
    );

    return <OwnerUnitsClient items={items} />;
}
