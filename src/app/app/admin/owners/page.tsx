import AdminOwnersClient from "./AdminOwnersClient";

export const metadata = { title: "Medya Sahipleri | Admin" };
export const dynamic = "force-dynamic";

export default function AdminOwnersPage() {
    return <AdminOwnersClient />;
}
