import ContentPageLayout from "@/components/site/ContentPageLayout";

export default function OutdoorCenterPage() {
    return (
        <ContentPageLayout
            title="Açık Hava Reklam Merkezi"
            subtitle="Sektör hakkında bilmeniz gereken her şey."
        >
            <h3>Açık Hava Reklamcılığı Nedir?</h3>
            <p>
                Ev dışı reklamcılık (OOH), tüketicilere evlerinin dışındayken ulaşan her türlü reklam mecrasını kapsar.
                Billboardlar, otobüs durakları, dijital ekranlar ve daha fazlası bu kategoriye girer.
            </p>

            <h3>Neden Önemli?</h3>
            <p>
                Dijital reklamların aksine, açık hava reklamları "kapatılamaz" veya "bloklanamaz".
                Şehrin doğal bir parçası olarak tüketicinin karşısına çıkar ve yüksek marka bilinirliği sağlar.
            </p>

            <h3>Terimler Sözlüğü</h3>
            <dl>
                <dt className="font-bold mt-2">DOOH (Digital Out of Home)</dt>
                <dd className="text-slate-600 ml-4">Dijital ekranlar üzerinden yapılan açık hava reklamcılığı.</dd>

                <dt className="font-bold mt-2">OTS (Opportunity to See)</dt>
                <dd className="text-slate-600 ml-4">Reklamı görme potansiyeli olan kişi sayısı.</dd>

                <dt className="font-bold mt-2">Programatik</dt>
                <dd className="text-slate-600 ml-4">Reklam alanlarının yazılım aracılığıyla otomatik olarak alınıp satılması.</dd>
            </dl>
        </ContentPageLayout>
    );
}
