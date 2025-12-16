import ContentPageLayout from "@/components/site/ContentPageLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForAdvertisersPage() {
    return (
        <ContentPageLayout
            title="Reklam Verenler İçin"
            subtitle="Markanızı milyonlara ulaştırmanın en akıllı yolu."
        >
            <p>
                Panobu, her ölçekten işletmenin profesyonel açık hava reklamcılığı yapmasını sağlar.
                Küçük bir yerel işletme veya global bir marka olun, ihtiyaçlarınıza uygun çözümlerimiz var.
            </p>

            <h3>Nasıl Başlarım?</h3>
            <ol>
                <li><strong>Ücretsiz Hesap Oluşturun:</strong> Sadece birkaç saniyede kayıt olun.</li>
                <li><strong>Lokasyon Seçin:</strong> Harita üzerinden hedef kitlenizin olduğu bölgeleri belirleyin.</li>
                <li><strong>Görsel Yükleyin:</strong> Reklam kreatifi yükleyin veya şablonlarımızı kullanın.</li>
                <li><strong>Yayınlayın:</strong> Bütçenizi belirleyin ve onay sonrası hemen yayına girin.</li>
            </ol>

            <div className="mt-8">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/auth/register">Hemen Reklam Ver</Link>
                </Button>
            </div>
        </ContentPageLayout>
    );
}
