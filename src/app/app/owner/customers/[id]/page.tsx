import { notFound } from "next/navigation";
import CustomerDetailClient from "./CustomerDetailClient";
import { getOwnerProfile } from "@/lib/owner/profile";
import { getOwnerCustomerDetail } from "@/lib/owner/customers";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const profile = await getOwnerProfile();
    if (!profile) return null;

    const detail = await getOwnerCustomerDetail(profile.id, params.id);
    if (!detail) notFound();

    // Mağaza slug'ını owner'a özel teklif e-postası için geç
    return <CustomerDetailClient detail={detail} />;
}
