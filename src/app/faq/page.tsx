import Link from 'next/link';
import { ArrowLeft, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import PublicLayout from '@/components/PublicLayout';

const FAQ_ITEMS = [
    {
        question: "Pano kiralaması nasıl yapılıyor?",
        answer: "Panoları harita üzerinden görüntüleyip sepete ekleyebilirsiniz. Ardından kampanya bilgilerinizi girerek sipariş oluşturabilirsiniz. Ekibimiz siparişinizi inceleyip sizinle iletişime geçecektir."
    },
    {
        question: "Minimum kiralama süresi nedir?",
        answer: "Minimum kiralama süresi pano türüne göre değişmekle birlikte genellikle 1 haftadır. Bazı özel lokasyonlarda 2 hafta minimum süre uygulanabilir."
    },
    {
        question: "Reklam görselimi nasıl göndereceğim?",
        answer: "Sipariş onaylandıktan sonra size her pano için gerekli boyut ve format bilgilerini ileteceğiz. Görselleri e-posta yoluyla veya sistemimiz üzerinden yükleyebilirsiniz."
    },
    {
        question: "Tasarım hizmeti sunuyor musunuz?",
        answer: "Evet! Sipariş oluştururken 'Tasarım Desteği İstiyorum' seçeneğini işaretleyebilirsiniz. Ekibimiz sizden bilgi alarak tasarımlarınızı hazırlayacaktır."
    },
    {
        question: "Fiyatlar neye göre belirleniyor?",
        answer: "Fiyatlar pano türüne, boyutuna, lokasyonuna ve trafik yoğunluğuna göre belirlenir. Toplu kiramalarda özel indirimler uygulanabilir."
    },
    {
        question: "Ödeme nasıl yapılıyor?",
        answer: "Sipariş onaylandıktan sonra size ödeme detayları iletilecektir. Havale/EFT veya kredi kartı ile ödeme yapabilirsiniz."
    },
    {
        question: "Sipariş iptali yapabilir miyim?",
        answer: "Montaj başlamadan önce siparişinizi iptal edebilirsiniz. Detaylı bilgi için lütfen destek ekibimizle iletişime geçin."
    },
    {
        question: "Montaj ne zaman yapılıyor?",
        answer: "Montaj tarihi, kampanya başlangıç tarihinize göre planlanır. Genellikle kampanya başlangıcından 1-2 gün önce montaj tamamlanır."
    },
    {
        question: "Pano bakımı sizin sorumluluğunuzda mı?",
        answer: "Evet, kiralama süresi boyunca panoların bakımı ve olası hasarların onarımı bizim sorumluluğumuzdadır."
    },
    {
        question: "Hangi şehirlerde hizmet veriyorsunuz?",
        answer: "Şu anda Kocaeli, Sakarya başta olmak üzere İstanbul, Ankara, İzmir, Bursa ve Antalya'da hizmet vermekteyiz. Sürekli olarak yeni lokasyonlar ekliyoruz."
    }
];

export default function FAQPage() {
    return (
        <PublicLayout>
            <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-white mb-4">Sıkça Sorulan Sorular</h1>
                        <p className="text-xl text-slate-300">Merak ettiklerinizi burada bulabilirsiniz</p>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                        {FAQ_ITEMS.map((item, index) => (
                            <details
                                key={index}
                                className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                            >
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <h3 className="text-lg font-medium text-white pr-4">{item.question}</h3>
                                    <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="px-6 pb-6">
                                    <p className="text-slate-300 leading-relaxed">{item.answer}</p>
                                </div>
                            </details>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Cevabını Bulamadınız mı?</h2>
                        <p className="text-slate-300 mb-6">Bize ulaşın, size yardımcı olalım.</p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <a
                                href="mailto:destek@panobu.com"
                                className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                                <span>destek@panobu.com</span>
                            </a>
                        </div>
                    </div>

                    {/* Back Link */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/static-billboards"
                            className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Panoları Keşfet
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
