import { BarChart3 } from "lucide-react";
import OwnerPagePlaceholder from "@/components/owner/OwnerPagePlaceholder";

export const metadata = { title: "Raporlar | Panobu" };

export default function ReportsPage() {
    return (
        <OwnerPagePlaceholder
            icon={BarChart3}
            title="Raporlar"
            description="Gelir, doluluk ve talep performansınızı detaylı analiz edin."
            phase="Faz 7 — Raporlama ve Analitik"
            features={[
                "Tarih aralığı seçimi (bu ay, son 3 ay, son 6 ay, özel aralık)",
                "Toplam gelir, kiralama sayısı, ortalama doluluk, en çok talep alan ünite",
                "Aylık gelir trendi, ünite bazlı doluluk, sektör dağılımı grafikleri",
                "Ünite bazlı tablo ve CSV export",
                "Panobu komisyonu vs net gelir breakdown",
            ]}
            cta={{ href: "/app/owner/finance", label: "Kazançlarımı Gör" }}
        />
    );
}
