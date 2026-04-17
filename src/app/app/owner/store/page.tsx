import Link from "next/link";
import { Store, Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import OwnerPagePlaceholder from "@/components/owner/OwnerPagePlaceholder";
import { getOwnerProfile } from "@/lib/owner/profile";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mağaza Görüntüle | Panobu" };

export default async function StorePage() {
    const profile = await getOwnerProfile();
    if (!profile) return null;

    if (!profile.slug) {
        return (
            <div className="space-y-6">
                <OwnerPagePlaceholder
                    icon={Store}
                    title="Mağaza Görüntüle"
                    description="Firmanızın public profil sayfası."
                    phase="Faz 8 — Public Mağaza"
                    features={[
                        "Firmanız için özel bir URL: panobu.com/medya/[firma-slug]",
                        "Logo, kapak görseli, hizmet verilen iller, iletişim bilgileri",
                        "Tüm aktif ünitelerinizi gösteren interaktif harita",
                        "Ünite kartları (fotoğraf, tür, fiyat) ve detay yönlendirmesi",
                        "Sosyal medya paylaşımı için Open Graph etiketleri",
                    ]}
                    cta={{ href: "/app/owner/settings", label: "Firma Ayarları" }}
                />
            </div>
        );
    }

    const publicUrl = `/medya/${profile.slug}`;
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Mağaza Görüntüle</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Müşterilerinize gönderebileceğiniz public profil sayfanız.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                        <Link2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-slate-500">Mağaza bağlantınız</p>
                        <p className="text-sm font-medium text-slate-900 truncate">
                            panobu.com{publicUrl}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Link href={publicUrl} target="_blank" rel="noreferrer">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Store className="w-4 h-4 mr-2" />
                            Mağazayı Görüntüle
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="text-slate-700"
                        // Server component; "Copy" interaction will be implemented with a small client wrapper in Phase 8.
                        disabled
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Linki Kopyala (Faz 8)
                    </Button>
                </div>
            </div>

            <OwnerPagePlaceholder
                icon={Store}
                title="Mağaza Özelleştirme"
                description="Mağaza sayfanızın görünümünü kısa süre sonra özelleştirebileceksiniz."
                phase="Faz 8 — Public Mağaza"
                features={[
                    "Kapak görseli, logo ve kısa firma tanıtımı",
                    "Öne çıkarmak istediğiniz üniteleri sıralama",
                    "Hizmet bölgeleri ve iletişim kanalları",
                    "Sosyal medya paylaşımı için özel meta etiketleri",
                ]}
            />
        </div>
    );
}
