import ContentPageLayout from "@/components/site/ContentPageLayout";

export default function AdvantagesPage() {
    return (
        <ContentPageLayout
            title="Panobu Avantajları"
            subtitle="Markanızı büyütmek için sunduğumuz benzersiz fırsatlar."
        >
            <h3>Reklam Verenler İçin</h3>
            <p>
                Markanızın görünürlüğünü artırmak hiç bu kadar kolay olmamıştı. Panobu ile şehrin en işlek noktalarındaki dijital ekranlara tek tıkla ulaşın.
            </p>
            <ul>
                <li>Geniş ekran ağına erişim</li>
                <li>Hedef kitle bazlı lokasyon seçimi</li>
                <li>Düşük başlangıç bütçeleri ile reklam verme imkanı</li>
                <li>Kendi tasarımınızı yükleme veya profesyonel destek alma</li>
            </ul>

            <h3>Ekran Sahipleri İçin</h3>
            <p>
                Ekranlarınız boş kalmasın. Panobu ağına katılarak ekranlarınızdan maksimum gelir elde edin.
            </p>
            <ul>
                <li>Otomatik reklam satışı ile pasif gelir</li>
                <li>Ödeme garantisi ve düzenli raporlama</li>
                <li>İçerik kontrolü ve onay mekanizması</li>
            </ul>
        </ContentPageLayout>
    );
}
