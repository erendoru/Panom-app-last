import ContentPageLayout from "@/components/site/ContentPageLayout";

export default function ProgrammaticPage() {
    return (
        <ContentPageLayout
            title="Programatik Reklamcılık Merkezi"
            subtitle="Veri odaklı, otomatik ve akıllı reklam yönetimi."
        >
            <p>
                Programatik DOOH (pDOOH), dijital açık hava reklamlarının satın alma, satma ve yayınlama süreçlerinin otomatikleştirilmesidir.
                Panobu, bu teknolojiyi Türkiye'de en ileri düzeyde uygulayan platformdur.
            </p>

            <h3>Nasıl Çalışır?</h3>
            <p>
                Geleneksel yöntemlerdeki manuel rezervasyonlar yerine, pDOOH algoritmaları kullanarak reklam alanlarını gerçek zamanlı olarak satın almanızı sağlar.
            </p>

            <h3>Avantajları</h3>
            <ul>
                <li><strong>Hedefleme:</strong> Hava durumu, saat, trafik yoğunluğu gibi verilere göre reklam gösterimi.</li>
                <li><strong>Verimlilik:</strong> Sadece hedef kitlenizin olduğu zamanlarda yayın yaparak bütçenizi koruyun.</li>
                <li><strong>Esneklik:</strong> Kampanyalarınızı anlık olarak başlatın, durdurun veya değiştirin.</li>
            </ul>
        </ContentPageLayout>
    );
}
