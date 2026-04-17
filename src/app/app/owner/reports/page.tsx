import OwnerReportsClient from "./OwnerReportsClient";

export const metadata = { title: "Raporlar | Panobu" };
export const dynamic = "force-dynamic";

export default function ReportsPage() {
    return <OwnerReportsClient />;
}
