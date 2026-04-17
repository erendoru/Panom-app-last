import AdminOwnerDetailClient from "./AdminOwnerDetailClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Medya Sahibi Detayı | Admin" };

export default function AdminOwnerDetailPage({ params }: { params: { id: string } }) {
    return <AdminOwnerDetailClient id={params.id} />;
}
