import OwnerRequestDetailClient from "./OwnerRequestDetailClient";

export const metadata = { title: "Talep Detayı | Panobu" };
export const dynamic = "force-dynamic";

export default function OwnerRequestDetailPage({ params }: { params: { id: string } }) {
    return <OwnerRequestDetailClient id={params.id} />;
}
