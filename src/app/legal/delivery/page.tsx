import { Metadata } from "next";
import PublicLayout from "@/components/PublicLayout";

export const metadata: Metadata = {
    title: "Teslimat Koşulları | Panobu",
    description: "Panobu dijital reklam teslimat ve yayın koşulları.",
};

export default function DeliveryPolicyPage() {
    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Teslimat ve Yayın Koşulları</h1>
                <p className="text-slate-400 mb-8">Son güncelleme: 12 Ocak 2026</p>

                <div className="prose prose-invert prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Hizmet Türü</h2>
                        <p className="text-slate-300">
                            Panobu, dijital hizmet sunmaktadır. Fiziksel bir ürün teslimatı bulunmamaktadır.
                            Hizmetlerimiz açık hava reklam alanlarının dijital ortamda kiralanması ve
                            reklam görsellerinin bu alanlarda yayınlanmasını kapsar.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Yayın Süreci</h2>
                        <ol className="list-decimal list-inside text-slate-300 space-y-3">
                            <li><strong>Rezervasyon:</strong> Ödeme onaylandıktan sonra pano sizin adınıza rezerve edilir</li>
                            <li><strong>Görsel Teslimi:</strong> Reklam görselinizi yüklemeniz veya tasarım hizmeti almanız gerekir</li>
                            <li><strong>Onay:</strong> Görsel, yayın standartlarına uygunluk açısından kontrol edilir</li>
                            <li><strong>Yayın:</strong> Belirlenen tarihte reklamınız yayına alınır</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Görsel Teslim Koşulları</h2>
                        <div className="bg-slate-800 p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-white mb-4">Teknik Gereksinimler:</h3>
                            <ul className="list-disc list-inside text-slate-300 space-y-2">
                                <li><strong>Formatlar:</strong> JPG, PNG, PDF</li>
                                <li><strong>Maksimum Dosya Boyutu:</strong> 10 MB</li>
                                <li><strong>Çözünürlük:</strong> Minimum 300 DPI önerilir</li>
                                <li><strong>Boyutlar:</strong> Panonun ölçülerine uygun olmalıdır</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Görsel Teslim Süreleri</h2>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Görsel, yayın başlangıcından <strong>en az 48 saat önce</strong> teslim edilmelidir</li>
                            <li>Geç teslim edilen görseller, yayın başlangıcının ertelenmesine neden olabilir</li>
                            <li>Görsel teslim edilmezse, rezervasyon iptal edilebilir (iade koşulları geçerlidir)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Tasarım Hizmeti</h2>
                        <p className="text-slate-300 mb-4">
                            Tasarım hizmeti satın aldıysanız:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Ekibimiz 2-3 iş günü içinde taslak tasarım sunar</li>
                            <li>2 revizyon hakkınız bulunmaktadır</li>
                            <li>Onayınız alındıktan sonra yayın için hazırlanır</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Yayın Doğrulama</h2>
                        <p className="text-slate-300">
                            Reklamınızın yayına alındığına dair:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
                            <li>E-posta bildirimi gönderilir</li>
                            <li>Fotoğraflı yayın kanıtı sunulabilir (talep üzerine)</li>
                            <li>Dashboard üzerinden yayın durumunuzu takip edebilirsiniz</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Yayın Garantisi</h2>
                        <p className="text-slate-300">
                            Teknik arıza veya mücbir sebeplerle reklamınız yayınlanamadığı takdirde:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
                            <li>Yayınlanamayan süre kadar ek yayın süresi verilir veya</li>
                            <li>Oransal iade yapılır</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. İletişim</h2>
                        <p className="text-slate-300 mb-4">Teslimat ve yayın konularında sorularınız için:</p>
                        <div className="bg-slate-800 p-6 rounded-lg">
                            <p className="text-white"><strong>E-posta:</strong> destek@panobu.com</p>
                            <p className="text-white mt-2"><strong>Telefon:</strong> +90 (262) 123 45 67</p>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
