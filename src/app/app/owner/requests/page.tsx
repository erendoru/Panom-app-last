import { Inbox } from "lucide-react";
import OwnerPagePlaceholder from "@/components/owner/OwnerPagePlaceholder";

export const metadata = { title: "Gelen Talepler | Panobu" };

export default function RequestsPage() {
    return (
        <OwnerPagePlaceholder
            icon={Inbox}
            title="Gelen Talepler"
            description="Reklam verenlerden gelen kiralama taleplerini buradan yöneteceksiniz."
            phase="Faz 5 — Talep ve Onay Sistemi"
            features={[
                "Talep kartları: reklam veren, ünite, tarih aralığı, bütçe ve durum rozetleri",
                "Duruma, üniteye ve tarihe göre filtreleme + sıralama",
                "Tek tıkla Onayla / Reddet (opsiyonel red sebebi)",
                "Görsel onay akışı: kampanya görselini uygun/revizyon olarak işaretleme",
                "Yeni talepte anlık bildirim (zil ikonu) ve email uyarısı",
            ]}
            cta={{ href: "/app/owner/dashboard", label: "Ana sayfaya dön" }}
        />
    );
}
