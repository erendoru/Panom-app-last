import ContentPageLayout from "@/components/site/ContentPageLayout";

export default function HelpPage() {
    return (
        <ContentPageLayout
            title="Yardım Merkezi"
            subtitle="Sıkça sorulan sorular ve destek."
        >
            <h3>Sıkça Sorulan Sorular</h3>

            <div className="space-y-6">
                <div>
                    <h4 className="font-bold text-lg">Nasıl reklam verebilirim?</h4>
                    <p className="text-slate-600">Ücretsiz hesap oluşturduktan sonra "Kampanya Oluştur" sihirbazını kullanarak lokasyon seçebilir ve görselinizi yükleyebilirsiniz.</p>
                </div>

                <div>
                    <h4 className="font-bold text-lg">Minimum bütçe nedir?</h4>
                    <p className="text-slate-600">Panobu'da minimum bütçe sınırı yoktur. Bütçenize uygun ekranları seçerek reklam verebilirsiniz.</p>
                </div>

                <div>
                    <h4 className="font-bold text-lg">Ödemeyi nasıl yapabilirim?</h4>
                    <p className="text-slate-600">Kredi kartı veya havale/EFT ile güvenli bir şekilde ödeme yapabilirsiniz.</p>
                </div>
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900">Hala sorunuz mu var?</h4>
                <p className="text-blue-700 mb-4">Destek ekibimiz haftanın 7 günü size yardımcı olmaya hazır.</p>
                <a href="mailto:destek@panobu.com" className="text-blue-600 font-bold hover:underline">destek@panobu.com</a>
            </div>
        </ContentPageLayout>
    );
}
