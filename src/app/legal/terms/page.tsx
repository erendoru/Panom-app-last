import { Metadata } from "next";
import PublicLayout from "@/components/PublicLayout";

export const metadata: Metadata = {
    title: "Hizmet Şartları | Panobu",
    description: "Panobu kullanım şartları ve koşulları.",
};

export default function TermsOfServicePage() {
    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Hizmet Şartları</h1>
                <p className="text-slate-400 mb-8">Son güncelleme: 12 Ocak 2026</p>

                <div className="prose prose-invert prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Genel Hükümler</h2>
                        <p className="text-slate-300">
                            Bu kullanım şartları, Panobu platformu ("Platform") ile kullanıcılar ("Kullanıcı") arasındaki
                            ilişkiyi düzenler. Platformu kullanarak bu şartları kabul etmiş sayılırsınız.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Hizmet Tanımı</h2>
                        <p className="text-slate-300">
                            Panobu, açık hava reklamcılığı alanında dijital ve klasik pano kiralama hizmeti sunan
                            bir platformdur. Platform üzerinden:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
                            <li>Dijital billboard kiralaması</li>
                            <li>Klasik (statik) pano kiralaması</li>
                            <li>Reklam görseli tasarım hizmeti</li>
                            <li>Kampanya yönetimi hizmetleri sunulmaktadır</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Üyelik ve Hesap</h2>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Hizmetlerden yararlanmak için üyelik oluşturulması gerekmektedir</li>
                            <li>Üyelik bilgilerinin doğruluğundan kullanıcı sorumludur</li>
                            <li>Hesap güvenliğinden kullanıcı sorumludur</li>
                            <li>Hesap paylaşımı yasaktır</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Ödeme Koşulları</h2>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Tüm fiyatlar Türk Lirası (TRY) cinsindendir ve KDV dahildir</li>
                            <li>Ödemeler iyzico güvencesiyle gerçekleştirilir</li>
                            <li>Kiralama ücreti, rezervasyon anında tahsil edilir</li>
                            <li>Kabul edilen ödeme yöntemleri: Kredi kartı, banka kartı</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Reklam İçeriği</h2>
                        <p className="text-slate-300 mb-4">Yayınlanacak reklam içerikleri aşağıdaki kurallara uygun olmalıdır:</p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Türkiye Cumhuriyeti yasalarına uygun olmalıdır</li>
                            <li>Yanıltıcı veya aldatıcı içerik bulunmamalıdır</li>
                            <li>Telif hakkı ihlali içermemelidir</li>
                            <li>Ahlaka ve genel ahlaka aykırı olmamalıdır</li>
                            <li>Nefret söylemi veya ayrımcılık içermemelidir</li>
                        </ul>
                        <p className="text-slate-300 mt-4">
                            Panobu, uygunsuz içerik tespit ettiğinde yayını durdurma hakkını saklı tutar.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Kullanıcı Yükümlülükleri</h2>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Doğru ve güncel bilgi sağlamak</li>
                            <li>Platformu yasal amaçlarla kullanmak</li>
                            <li>Diğer kullanıcıların haklarına saygı göstermek</li>
                            <li>Platformun güvenliğini tehlikeye atacak eylemlerden kaçınmak</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Sorumluluk Sınırları</h2>
                        <p className="text-slate-300">
                            Panobu, aşağıdaki durumlardan kaynaklanan zararlardan sorumlu tutulamaz:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
                            <li>Mücbir sebepler (doğal afet, savaş, pandemi vb.)</li>
                            <li>Üçüncü taraf hizmetlerindeki kesintiler</li>
                            <li>Kullanıcının kendi hatası veya ihmali</li>
                            <li>Yetkisiz erişimler</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Fikri Mülkiyet</h2>
                        <p className="text-slate-300">
                            Platform üzerindeki tüm içerik, tasarım, logo ve yazılımlar Panobu'ya aittir ve
                            telif hakkı ile korunmaktadır. İzinsiz kullanım yasaktır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Sözleşme Değişiklikleri</h2>
                        <p className="text-slate-300">
                            Bu kullanım şartları önceden bildirimde bulunmaksızın güncellenebilir.
                            Güncellemeler yayınlandığı anda yürürlüğe girer. Platformu kullanmaya devam
                            etmeniz, değişiklikleri kabul ettiğiniz anlamına gelir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Uygulanacak Hukuk</h2>
                        <p className="text-slate-300">
                            Bu sözleşme Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklarda Kocaeli
                            Mahkemeleri ve İcra Daireleri yetkilidir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. İletişim</h2>
                        <div className="bg-slate-800 p-6 rounded-lg">
                            <p className="text-white"><strong>E-posta:</strong> destek@panobu.com</p>
                            <p className="text-white mt-2"><strong>Adres:</strong> Kocaeli, Türkiye</p>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
