import ContentPageLayout from "@/components/site/ContentPageLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForPublishersPage() {
    return (
        <ContentPageLayout
            title="Reklam Alanları İçin"
            subtitle="Ekranlarınızı Panobu ağına ekleyin, gelirlerinizi artırın."
        >
            <p>
                Dijital ekran yatırımlarınızın geri dönüşünü hızlandırın. Panobu, ekranlarınızı binlerce potansiyel reklam verene ulaştırır.
            </p>

            <h3>Süreç Nasıl İşler?</h3>
            <ol>
                <li><strong>Başvuru Yapın:</strong> Ekran özelliklerinizi ve lokasyonunuzu sisteme girin.</li>
                <li><strong>Onaylanın:</strong> Ekibimiz ekranınızı incelesin ve platforma dahil etsin.</li>
                <li><strong>Kazanmaya Başlayın:</strong> Reklamlar yayınlandıkça gelir elde edin. Ödemeleriniz düzenli olarak hesabınıza yatsın.</li>
            </ol>

            <h3>Neden Panobu Partneri Olmalısınız?</h3>
            <ul>
                <li>Satış operasyonu ile uğraşmazsınız.</li>
                <li>Boş zamanları değerlendirerek doluluk oranını artırırsınız.</li>
                <li>Tek panelden tüm ekranlarınızı yönetirsiniz.</li>
            </ul>

            <div className="mt-8">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/auth/register">Ekran Sahibi Ol</Link>
                </Button>
            </div>
        </ContentPageLayout>
    );
}
