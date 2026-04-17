import { notFound } from "next/navigation";
import { loadStoreOwner, loadStorePanels } from "@/lib/store/loader";
import StorePanelsClient from "./StorePanelsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Panolar" };

export default async function StorePanelsPage(
    { params }: { params: { slug: string } }
) {
    const owner = await loadStoreOwner(params.slug);
    if (!owner) notFound();
    const panels = await loadStorePanels(owner.id);
    return <StorePanelsClient panels={panels} />;
}
