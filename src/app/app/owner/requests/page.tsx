import OwnerRequestsClient from "./OwnerRequestsClient";

export const metadata = { title: "Gelen Talepler | Panobu" };
export const dynamic = "force-dynamic";

export default function RequestsPage() {
    return <OwnerRequestsClient />;
}
