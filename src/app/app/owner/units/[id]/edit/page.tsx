import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getOwnerProfile } from "@/lib/owner/profile";
import OwnerUnitForm from "../../OwnerUnitForm";

export const dynamic = "force-dynamic";

export default async function OwnerUnitEditPage({
    params,
}: {
    params: { id: string };
}) {
    const profile = await getOwnerProfile();
    if (!profile) redirect("/app/owner/settings");

    const panel = await prisma.staticPanel.findUnique({
        where: { id: params.id },
    });
    if (!panel || panel.ownerId !== profile.id) notFound();

    return (
        <OwnerUnitForm
            mode="edit"
            panelId={panel.id}
            initial={{
                name: panel.name,
                type: panel.type,
                subType: panel.subType ?? "",
                city: panel.city,
                district: panel.district,
                address: panel.address,
                latitude: panel.latitude ? String(panel.latitude) : "",
                longitude: panel.longitude ? String(panel.longitude) : "",
                width: panel.width ? String(panel.width) : "",
                height: panel.height ? String(panel.height) : "",
                faceCount: panel.faceCount ?? 1,
                lighting: panel.lighting ?? "LIGHTED",
                priceWeekly: panel.priceWeekly ? String(panel.priceWeekly) : "",
                priceDaily: panel.priceDaily ? String(panel.priceDaily) : "",
                priceMonthly: panel.priceMonthly ? String(panel.priceMonthly) : "",
                estimatedDailyImpressions: panel.estimatedDailyImpressions
                    ? String(panel.estimatedDailyImpressions)
                    : "",
                estimatedCpm: panel.estimatedCpm ? String(panel.estimatedCpm) : "",
                description: panel.description ?? "",
                isStartingPrice: Boolean(panel.isStartingPrice),
            }}
            initialImages={
                panel.imageUrls && panel.imageUrls.length > 0
                    ? panel.imageUrls
                    : panel.imageUrl
                    ? [panel.imageUrl]
                    : []
            }
            initialNearbyTags={panel.nearbyTags || []}
        />
    );
}
