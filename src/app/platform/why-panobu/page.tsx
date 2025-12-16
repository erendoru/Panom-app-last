import ContentPageLayout from "@/components/site/ContentPageLayout";

export default function WhyPanobuPage() {
    return (
        <ContentPageLayout
            title="Neden Panobu Platformu?"
            subtitle="Geleneksel açık hava reklamcılığını dijital çağın hızıyla buluşturuyoruz."
        >
            <p>
                Panobu, açık hava reklamcılığını demokratize eden, şeffaf ve ölçülebilir bir pazar yeridir.
                Geleneksel süreçlerin aksine, Panobu ile dakikalar içinde kampanya oluşturabilir, bütçenizi yönetebilir ve sonuçları anlık olarak takip edebilirsiniz.
            </p>
            <h3>Neden Biz?</h3>
            <ul>
                <li><strong>Hız:</strong> Haftalar süren pazarlık ve operasyon süreçleri yerine dakikalar içinde yayına çıkın.</li>
                <li><strong>Şeffaflık:</strong> Tüm fiyatlar ve müsaitlik durumları açıktır. Gizli maliyet yok.</li>
                <li><strong>Ölçülebilirlik:</strong> Kampanyanızın kaç kişiye ulaştığını tahmini verilerle değil, gerçek zamanlı raporlarla görün.</li>
                <li><strong>Esneklik:</strong> İster bir saatlik, ister bir aylık kiralama yapın. Bütçenize uygun seçenekler.</li>
            </ul>
        </ContentPageLayout>
    );
}
