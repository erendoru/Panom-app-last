import CustomersClient from "./CustomersClient";
import { getOwnerProfile } from "@/lib/owner/profile";
import { listOwnerCustomers } from "@/lib/owner/customers";

export const dynamic = "force-dynamic";
export const metadata = { title: "Müşteriler | Panobu Partner" };

export default async function CustomersPage() {
    const profile = await getOwnerProfile();
    if (!profile) return null;
    const customers = await listOwnerCustomers(profile.id);
    return <CustomersClient initial={customers} />;
}
