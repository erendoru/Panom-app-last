import { Metadata } from "next";
import PublicLayout from "@/components/PublicLayout";

export const metadata: Metadata = {
    title: "İade Politikası | Panobu",
    description: "Panobu para iade koşulları ve iptal politikası.",
};

export default function RefundPolicyPage() {
    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">İade ve İptal Politikası</h1>
                <p className="text-slate-400 mb-8">Son güncelleme: 12 Ocak 2026</p>

                <div className="prose prose-invert prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Genel İade Koşulları</h2>
                        <p className="text-slate-300">
                            Panobu platformu üzerinden yapılan pano kiralama işlemleri için aşağıdaki iade
                            koşulları geçerlidir. İade talepleri, işlemin niteliğine göre değerlendirilir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. İptal ve İade Süreleri</h2>
                        <div className="bg-slate-800 p-6 rounded-lg space-y-4">
                            <div className="border-b border-slate-700 pb-4">
                                <h3 className="text-lg font-bold text-green-400">Yayın Başlangıcından 14+ Gün Önce</h3>
                                <p className="text-slate-300 mt-2">%100 iade (tam iade)</p>
                            </div>
                            <div className="border-b border-slate-700 pb-4">
                                <h3 className="text-lg font-bold text-yellow-400">Yayın Başlangıcından 7-14 Gün Önce</h3>
                                <p className="text-slate-300 mt-2">%50 iade</p>
                            </div>
                            <div className="border-b border-slate-700 pb-4">
                                <h3 className="text-lg font-bold text-orange-400">Yayın Başlangıcından 3-7 Gün Önce</h3>
                                <p className="text-slate-300 mt-2">%25 iade</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-red-400">Yayın Başlangıcından 3 Günden Az Önce</h3>
                                <p className="text-slate-300 mt-2">İade yapılmaz</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Tam İade Yapılan Durumlar</h2>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Panobu kaynaklı teknik arızalar</li>
                            <li>Panonun kullanılamaması (bakım, arıza vb.)</li>
                            <li>Hizmetin sunulamaması</li>
                            <li>Mücbir sebepler (doğal afet, yasal engeller vb.)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. İade Yapılmayan Durumlar</h2>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Yayın başladıktan sonra yapılan iptal talepleri</li>
                            <li>Kullanıcı kaynaklı reklam içeriği sorunları</li>
                            <li>Görselin zamanında teslim edilmemesi</li>
                            <li>Kullanıcının hatalı bilgi vermesi</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Tasarım Hizmeti İadeleri</h2>
                        <p className="text-slate-300">
                            Tasarım desteği hizmeti için iade koşulları:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
                            <li>Tasarım başlamadan önce: %100 iade</li>
                            <li>Tasarım süreci başladıysa: %50 iade</li>
                            <li>Tasarım onaylandıktan sonra: İade yapılmaz</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. İade Süreci</h2>
                        <ol className="list-decimal list-inside text-slate-300 space-y-3">
                            <li>İade talebi <strong>destek@panobu.com</strong> adresine e-posta ile gönderilmelidir</li>
                            <li>E-postada sipariş numarası ve iade nedeni belirtilmelidir</li>
                            <li>Talebiniz 3 iş günü içinde değerlendirilecektir</li>
                            <li>Onaylanan iadeler, ödeme yönteminize göre 5-10 iş günü içinde hesabınıza yansır</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. İade Yöntemi</h2>
                        <p className="text-slate-300">
                            İadeler, ödemenin yapıldığı aynı yöntemle (kredi kartı/banka kartı) gerçekleştirilir.
                            İade tutarı, bankanızın işlem süresine bağlı olarak hesabınıza yansır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. İletişim</h2>
                        <p className="text-slate-300 mb-4">İade talepleriniz için:</p>
                        <div className="bg-slate-800 p-6 rounded-lg">
                            <p className="text-white"><strong>E-posta:</strong> destek@panobu.com</p>
                            <p className="text-white mt-2"><strong>Konu:</strong> İade Talebi - [Sipariş Numaranız]</p>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
