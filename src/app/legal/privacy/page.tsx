import { Metadata } from "next";
import PublicLayout from "@/components/PublicLayout";

export const metadata: Metadata = {
    title: "Gizlilik Politikası | Panobu",
    description: "Panobu gizlilik politikası - Kişisel verilerinizin nasıl korunduğunu öğrenin.",
};

export default function PrivacyPolicyPage() {
    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Gizlilik Politikası</h1>
                <p className="text-slate-400 mb-8">Son güncelleme: 12 Ocak 2026</p>

                <div className="prose prose-invert prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Giriş</h2>
                        <p className="text-slate-300">
                            Panobu olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu gizlilik politikası,
                            kişisel verilerinizin nasıl toplandığını, kullanıldığını, saklandığını ve korunduğunu açıklamaktadır.
                            Platformumuzu kullanarak bu politikayı kabul etmiş sayılırsınız.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Toplanan Veriler</h2>
                        <p className="text-slate-300 mb-4">Hizmetlerimizi sunabilmek için aşağıdaki verileri topluyoruz:</p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, e-posta adresi, telefon numarası</li>
                            <li><strong>İletişim Bilgileri:</strong> Adres, şirket bilgileri</li>
                            <li><strong>Finansal Bilgiler:</strong> Ödeme işlemleri için gerekli bilgiler (iyzico güvencesiyle işlenir)</li>
                            <li><strong>Kullanım Verileri:</strong> Platform kullanım istatistikleri, IP adresi, tarayıcı bilgileri</li>
                            <li><strong>Reklam Verileri:</strong> Yüklenen görseller, kampanya bilgileri</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Verilerin Kullanımı</h2>
                        <p className="text-slate-300 mb-4">Toplanan veriler aşağıdaki amaçlarla kullanılmaktadır:</p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Hizmetlerin sunulması ve işlemlerin gerçekleştirilmesi</li>
                            <li>Kullanıcı hesabının yönetimi</li>
                            <li>Ödeme işlemlerinin güvenli şekilde tamamlanması</li>
                            <li>Müşteri destek hizmetlerinin sağlanması</li>
                            <li>Platform güvenliğinin sağlanması</li>
                            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                            <li>Hizmet kalitesinin iyileştirilmesi</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Verilerin Paylaşımı</h2>
                        <p className="text-slate-300 mb-4">
                            Kişisel verileriniz aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li><strong>Ödeme İşlemleri:</strong> iyzico ödeme altyapısı (PCI-DSS uyumlu)</li>
                            <li><strong>Yasal Zorunluluklar:</strong> Mahkeme kararı veya yasal düzenlemeler gereği</li>
                            <li><strong>Hizmet Sağlayıcılar:</strong> Hosting, e-posta servisleri (veri işleme sözleşmeleri dahilinde)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Çerezler (Cookies)</h2>
                        <p className="text-slate-300">
                            Platformumuz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır.
                            Çerezler, oturum yönetimi, tercih hatırlama ve analitik amaçlarla kullanılır.
                            Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bu durumda
                            bazı özellikler düzgün çalışmayabilir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Veri Güvenliği</h2>
                        <p className="text-slate-300">
                            Verilerinizi korumak için endüstri standardı güvenlik önlemleri uyguluyoruz:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
                            <li>SSL/TLS şifreleme</li>
                            <li>Güvenli veri merkezleri</li>
                            <li>Düzenli güvenlik denetimleri</li>
                            <li>Erişim kontrolü ve yetkilendirme</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. KVKK Kapsamındaki Haklarınız</h2>
                        <p className="text-slate-300 mb-4">
                            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                            <li>Silinmesini veya yok edilmesini isteme</li>
                            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. İletişim</h2>
                        <p className="text-slate-300">
                            Gizlilik politikası hakkında sorularınız veya KVKK kapsamındaki talepleriniz için:
                        </p>
                        <div className="bg-slate-800 p-6 rounded-lg mt-4">
                            <p className="text-white"><strong>E-posta:</strong> destek@panobu.com</p>
                            <p className="text-white mt-2"><strong>Adres:</strong> Kocaeli, Türkiye</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Değişiklikler</h2>
                        <p className="text-slate-300">
                            Bu gizlilik politikası zaman zaman güncellenebilir. Değişiklikler bu sayfada yayınlanacak
                            ve önemli değişiklikler için kullanıcılara bildirim yapılacaktır.
                        </p>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
