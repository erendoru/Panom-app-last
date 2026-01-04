"use client";

import PublicLayout from "@/components/PublicLayout";
import { ArrowRight, CheckCircle, ShoppingCart, FileText, Upload, ClipboardList, PartyPopper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
    {
        number: 1,
        title: "Sepetinizi Oluşturun",
        subtitle: "Panoları seçin ve tarihleri belirleyin",
        icon: ShoppingCart,
        image: "/images/guide-step-1-cart.png",
        description: `Haritadan veya listeden istediğiniz panoları seçerek sepetinize ekleyin. Her pano için başlangıç ve bitiş tarihlerini belirleyebilirsiniz.`,
        features: [
            "CLP panolarda tek yüz veya çift yüz seçimi yapabilirsiniz",
            "Çift yüz seçerseniz fiyat 2 katına çıkar",
            "Kocaeli'de 20+ CLP seçerseniz birim fiyat 1.500₺'ye düşer",
            "Tarihleri toplu olarak tüm panolara uygulayabilirsiniz"
        ]
    },
    {
        number: 2,
        title: "Kampanya Bilgilerini Girin",
        subtitle: "İletişim ve kampanya detayları",
        icon: FileText,
        image: "/images/guide-step-2-campaign.png",
        description: `Kampanyanıza bir isim verin ve iletişim bilgilerinizi doldurun. Bu bilgiler size ulaşmamız için kullanılacaktır.`,
        features: [
            "Kampanya Adı: Örn. \"2024 Yaz Kampanyası\"",
            "Ad Soyad, Telefon ve E-posta zorunludur",
            "Şirket Adı opsiyoneldir"
        ]
    },
    {
        number: 3,
        title: "Görsel Durumunu Seçin",
        subtitle: "Tasarımlarınız hazır mı?",
        icon: Upload,
        image: "/images/guide-step-3-creatives.png",
        description: `Reklam görselleriniz hazır mı yoksa tasarım desteği mi istiyorsunuz? İhtiyacınıza göre seçim yapın.`,
        features: [
            "Görsellerim Hazır: Sipariş sonrası ekibimiz sizinle iletişime geçecek",
            "Tasarım Desteği İstiyorum: +2.500₺ karşılığında profesyonel tasarım hizmeti",
            "Kampanya ile ilgili notlarınızı ekleyebilirsiniz"
        ]
    },
    {
        number: 4,
        title: "Siparişinizi Kontrol Edin",
        subtitle: "Son özet ve onay",
        icon: ClipboardList,
        image: "/images/guide-step-4-summary.png",
        description: `Tüm seçimlerinizi gözden geçirin. Kampanya bilgileri, seçilen panolar, görsel durumu ve tahmini toplam tutar burada gösterilir.`,
        features: [
            "CLP panolarda tek/çift yüz seçiminizi değiştirebilirsiniz",
            "20+ CLP kampanyası için otomatik indirim uygulanır",
            "Tasarım desteği seçtiyseniz +2.500₺ eklenir",
            "\"Siparişi Gönder\" butonuyla talebi iletin"
        ]
    },
    {
        number: 5,
        title: "Siparişiniz Alındı!",
        subtitle: "Ekibimiz sizinle iletişime geçecek",
        icon: PartyPopper,
        image: "/images/guide-step-5-confirm.png",
        description: `Siparişiniz başarıyla alındı! Ekibimiz en kısa sürede sizinle iletişime geçerek detayları netleştirecektir.`,
        features: [
            "Sipariş numaranız e-posta ile gönderilir",
            "Ekibimiz paylaştığınız telefon numarasından arayacak",
            "Görselleriniz panolara yerleştirilecek ve fotoğrafları size mail ile iletilecek",
            "Sorularınız için destek@panobu.com adresini kullanabilirsiniz"
        ]
    }
];

export default function CampaignGuidePage() {
    return (
        <PublicLayout activeLink="yenilikler">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 mb-6">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Adım Adım Rehber
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Kampanya Nasıl Oluşturulur?
                    </h1>
                    <p className="text-xl text-slate-400">
                        5 kolay adımda açık hava reklamınızı başlatın. Pano seçiminden sipariş onayına kadar tüm süreci görsellerle anlattık.
                    </p>
                </div>

                {/* Steps */}
                <div className="max-w-5xl mx-auto space-y-20">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isEven = index % 2 === 1;

                        return (
                            <div
                                key={step.number}
                                className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}
                            >
                                {/* Image */}
                                <div className="w-full lg:w-1/2">
                                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            className="w-full h-auto"
                                        />
                                        {/* Step Badge */}
                                        <div className="absolute top-4 left-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                            {step.number}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="w-full lg:w-1/2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-400 font-medium">Adım {step.number}</p>
                                            <h2 className="text-2xl font-bold">{step.title}</h2>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 mb-6">{step.description}</p>

                                    <ul className="space-y-3">
                                        {step.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-slate-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="max-w-3xl mx-auto mt-20 text-center">
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold mb-4">Hemen Başlayın!</h2>
                        <p className="text-slate-400 mb-8">
                            Türkiye genelinde binlerce pano arasından seçim yapın ve kampanyanızı dakikalar içinde oluşturun.
                        </p>
                        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                            <Link href="/static-billboards">
                                Panoları Keşfet
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
