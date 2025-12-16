import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kullanım Koşulları | Panobu",
    description: "Panobu platformu kullanım koşulları ve üyelik sözleşmesi.",
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Kullanım Koşulları</h1>
            <div className="prose prose-slate max-w-none">
                <p className="mb-4">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
                <p>
                    Panobu platformunu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">1. Hizmet Tanımı</h2>
                <p>
                    Panobu, reklam verenler ile pano sahiplerini bir araya getiren bir pazaryeri platformudur.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">2. Üyelik ve Hesap Güvenliği</h2>
                <p>
                    Platforma üye olurken verdiğiniz bilgilerin doğruluğundan siz sorumlusunuz. Hesap şifrenizin
                    güvenliğini sağlamak sizin sorumluluğunuzdadır.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">3. Rezervasyon ve İptal</h2>
                <p>
                    Yapılan rezervasyonlar, pano sahibinin onayına tabidir. İptal koşulları her pano için
                    farklılık gösterebilir.
                </p>
            </div>
        </div>
    );
}
