import { Metadata } from "next";
import PublicLayout from "@/components/PublicLayout";

export const metadata: Metadata = {
    title: "Mesafeli Satış Sözleşmesi | Panobu",
    description: "Panobu mesafeli satış sözleşmesi - Uzaktan yapılan satışlarda geçerli koşullar.",
};

export default function DistanceSalesPage() {
    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Mesafeli Satış Sözleşmesi</h1>
                <p className="text-slate-400 mb-8">Son güncelleme: 12 Ocak 2026</p>

                <div className="prose prose-invert prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">MADDE 1 - TARAFLAR</h2>
                        <div className="bg-slate-800 p-6 rounded-lg space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">1.1 SATICI</h3>
                                <p className="text-slate-300"><strong>Unvan:</strong> Pufero Mobilya Ticaret Limited Şirketi</p>
                                <p className="text-slate-300"><strong>Adres:</strong> Esentepe Mah. İplik Sk. No: 23 İç Kapı No: 1 Körfez/Kocaeli</p>
                                <p className="text-slate-300"><strong>Telefon:</strong> +90 (262) 123 45 67</p>
                                <p className="text-slate-300"><strong>E-Posta:</strong> destek@panobu.com</p>
                                <p className="text-slate-300"><strong>Vergi Dairesi:</strong> Körfez Vergi Dairesi</p>
                                <p className="text-slate-300"><strong>Vergi No:</strong> 7331202819</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">1.2 ALICI</h3>
                                <p className="text-slate-300">
                                    Panobu platformu üzerinden hizmet satın alan gerçek veya tüzel kişi.
                                    Alıcı bilgileri, sipariş sırasında alıcı tarafından sağlanan bilgilerdir.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">MADDE 2 - KONU</h2>
                        <p className="text-slate-300">
                            İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait www.panobu.com internet sitesinden
                            elektronik ortamda siparişini verdiği aşağıda nitelikleri ve satış fiyatı belirtilen
                            hizmetin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması
                            Hakkında Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince
                            tarafların hak ve yükümlülüklerinin belirlenmesidir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">MADDE 3 - HİZMET BİLGİLERİ</h2>
                        <p className="text-slate-300 mb-4">Satın alınan hizmetin temel özellikleri:</p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li><strong>Hizmet Türü:</strong> Açık hava reklam alanı kiralama hizmeti</li>
                            <li><strong>Hizmet Kapsamı:</strong> Dijital veya klasik billboard/pano kiralama</li>
                            <li><strong>Hizmet Süresi:</strong> Sipariş sırasında belirlenen tarih aralığı</li>
                            <li><strong>Hizmet Bedeli:</strong> Sipariş özeti ve ödeme sayfasında belirtilen tutar</li>
                        </ul>
                        <p className="text-slate-300 mt-4">
                            Hizmetin temel nitelikleri ve vergiler dahil satış fiyatı, sipariş onay sayfasında
                            ve ALICI'ya gönderilen onay e-postasında belirtilmektedir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">MADDE 4 - ÖDEME VE TESLİMAT</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">4.1 Ödeme</h3>
                                <ul className="list-disc list-inside text-slate-300 space-y-2">
                                    <li>Ödemeler kredi kartı veya banka kartı ile yapılabilir</li>
                                    <li>Tüm ödemeler iyzico güvencesiyle gerçekleştirilir</li>
                                    <li>Ödeme bilgileri şifrelenmiş olarak iletilir (SSL/TLS)</li>
                                    <li>Tüm fiyatlar KDV dahildir</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">4.2 Hizmet Teslimi</h3>
                                <ul className="list-disc list-inside text-slate-300 space-y-2">
                                    <li>Reklam görseli, belirlenen tarihte ilgili panoda yayınlanır</li>
                                    <li>Dijital hizmet olduğundan fiziksel teslimat yapılmaz</li>
                                    <li>Yayın başlangıcı e-posta ile bildirilir</li>
                                    <li>Talep halinde yayın fotoğrafı gönderilir</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">MADDE 5 - CAYMA HAKKI</h2>
                        <p className="text-slate-300 mb-4">
                            ALICI, hizmet teslim edilmeden önce cayma hakkını kullanabilir. Cayma koşulları:
                        </p>
                        <div className="bg-slate-800 p-6 rounded-lg space-y-3">
                            <p className="text-green-400"><strong>Yayın başlangıcından 14+ gün önce:</strong> %100 iade</p>
                            <p className="text-yellow-400"><strong>Yayın başlangıcından 7-14 gün önce:</strong> %50 iade</p>
                            <p className="text-orange-400"><strong>Yayın başlangıcından 3-7 gün önce:</strong> %25 iade</p>
                            <p className="text-red-400"><strong>Yayın başlangıcından 3 günden az önce veya yayın başladıktan sonra:</strong> İade yapılmaz</p>
                        </div>
                        <p className="text-slate-300 mt-4">
                            Cayma hakkının kullanılması için destek@panobu.com adresine yazılı bildirim yapılması gerekmektedir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">MADDE 6 - GENEL HÜKÜMLER</h2>
                        <ul className="list-disc list-inside text-slate-300 space-y-3">
                            <li>ALICI, sipariş vermeden önce sözleşme koşullarını okuduğunu ve kabul ettiğini beyan eder.</li>
                            <li>Siparişin gerçekleşmesi durumunda ALICI, işbu sözleşmenin tüm koşullarını kabul etmiş sayılır.</li>
                            <li>SATICI, siparişi kabul etmeme veya iptal etme hakkını saklı tutar.</li>
                            <li>SATICI, teknik nedenlerle hizmeti sağlayamadığı takdirde ALICI'yı bilgilendirir ve ödeme iade edilir.</li>
                            <li>ALICI'nın verdiği bilgilerin doğruluğundan ALICI sorumludur.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">MADDE 7 - UYUŞMAZLIK ÇÖZÜMÜ</h2>
                        <p className="text-slate-300 mb-4">
                            İşbu sözleşmeden kaynaklanan uyuşmazlıklarda:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Türkiye Cumhuriyeti kanunları uygulanır</li>
                            <li>Tüketici şikayetleri için Tüketici Hakem Heyetleri yetkilidir</li>
                            <li>Mahkeme uyuşmazlıklarında Kocaeli Mahkemeleri ve İcra Daireleri yetkilidir</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">MADDE 8 - YÜRÜRLÜK</h2>
                        <p className="text-slate-300">
                            ALICI, işbu sözleşmede yazılı tüm koşulları kabul ettiğini, sipariş vermeden önce
                            ön bilgilendirme formunu okuduğunu ve anladığını kabul ve beyan eder.
                            Bu sözleşme, siparişin onaylanması ile yürürlüğe girer.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">İLETİŞİM</h2>
                        <div className="bg-slate-800 p-6 rounded-lg">
                            <p className="text-white"><strong>E-posta:</strong> destek@panobu.com</p>
                            <p className="text-white mt-2"><strong>Telefon:</strong> +90 (262) 123 45 67</p>
                            <p className="text-white mt-2"><strong>Adres:</strong> Esentepe Mah. İplik Sk. No: 23 İç Kapı No: 1 Körfez/Kocaeli</p>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
