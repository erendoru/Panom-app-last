import { CalendarDays } from "lucide-react";
import OwnerPagePlaceholder from "@/components/owner/OwnerPagePlaceholder";

export const metadata = { title: "Takvim | Panobu" };

export default function CalendarPage() {
    return (
        <OwnerPagePlaceholder
            icon={CalendarDays}
            title="Takvim"
            description="Ünitelerinizin müsaitliğini takvim üzerinden görün ve yönetin."
            phase="Faz 4 — Müsaitlik ve Fiyat Yönetimi"
            features={[
                "Ünite bazlı aylık takvim (yeşil: müsait, kırmızı: dolu, sarı: beklemede, gri: bloklu)",
                "Blok tıklayarak manuel kapatma / açma (kurumsal müşterileriniz için)",
                "Dönemsel fiyatlandırma (bayram, seçim dönemi, yaz sezonu vb.)",
                "&quot;Fiyatlar başlangıçtır&quot; seçeneği",
                "Toplu takvim (tüm üniteleriniz için ısı haritası)",
            ]}
            cta={{ href: "/app/owner/units", label: "Ünitelerime dön" }}
        />
    );
}
