import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gizlilik Politikası | Panobu",
    description: "Panobu Gizlilik Politikası ve veri işleme kuralları.",
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Gizlilik Politikası</h1>
            <div className="prose prose-slate max-w-none">
                <p className="mb-4">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
                <p>
                    Panobu olarak gizliliğinize önem veriyoruz. Bu Gizlilik Politikası, web sitemizi kullandığınızda
                    kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">1. Toplanan Veriler</h2>
                <p>
                    Hizmetlerimizi kullanırken adınız, e-posta adresiniz, telefon numaranız ve fatura bilgileriniz
                    gibi kişisel verileri toplayabiliriz.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">2. Verilerin Kullanımı</h2>
                <p>
                    Toplanan veriler, rezervasyon işlemlerinizi gerçekleştirmek, sizinle iletişim kurmak ve
                    hizmet kalitemizi artırmak amacıyla kullanılır.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">3. Veri Güvenliği</h2>
                <p>
                    Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri
                    uygulamaktayız.
                </p>
            </div>
        </div>
    );
}
