import { Metadata } from "next";

export const metadata: Metadata = {
    title: "KVKK Aydınlatma Metni | Panobu",
    description: "Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
};

export default function KvkkPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">KVKK Aydınlatma Metni</h1>
            <div className="prose prose-slate max-w-none">
                <p>
                    6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz;
                    veri sorumlusu olarak Panobu tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">1. Kişisel Verilerin İşlenme Amacı</h2>
                <p>
                    Toplanan kişisel verileriniz, şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri
                    faydalandırmak için gerekli çalışmaların iş birimlerimiz tarafından yapılması amacıyla işlenmektedir.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-4">2. İşlenen Kişisel Veriler</h2>
                <ul className="list-disc pl-5 mb-4">
                    <li>Kimlik Bilgileri (Ad, Soyad)</li>
                    <li>İletişim Bilgileri (E-posta, Telefon, Adres)</li>
                    <li>Müşteri İşlem Bilgileri</li>
                </ul>

                <h2 className="text-xl font-bold mt-6 mb-4">3. Haklarınız</h2>
                <p>
                    KVKK'nın 11. maddesi uyarınca, kişisel verilerinizin işlenip işlenmediğini öğrenme,
                    işlenmişse buna ilişkin bilgi talep etme haklarına sahipsiniz.
                </p>
            </div>
        </div>
    );
}
