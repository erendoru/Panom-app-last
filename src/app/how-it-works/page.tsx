"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Search, MapPin, Calendar, CreditCard,
    TrendingUp, Shield, Zap, DollarSign,
    CheckCircle, ArrowRight, Building2, Monitor
} from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import DataDrivenBanner from "@/components/home/DataDrivenBanner";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function HowItWorksPage() {
    return (
        <PublicLayout activeLink="nasil">
            {/* Hero Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                        className="max-w-3xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-neutral-900">
                            Panobu <span className="text-blue-800">Nasıl Çalışır?</span>
                        </h1>
                        <p className="text-xl text-neutral-600 mb-8">
                            Outdoor reklam vermek hiç bu kadar kolay olmamıştı.
                            4 basit adımda markanızı şehrin en görünür noktalarına taşıyın.
                        </p>
                        <Link
                            href="/kampanya-rehberi"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#11b981] hover:bg-[#0ea472] text-white font-medium rounded-full transition-colors"
                        >
                            📸 Görsel Adım Adım Rehber
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* DATA-DRIVEN ADVERTISING BANNER */}
            <section className="pb-4 pt-2">
                <DataDrivenBanner />
            </section>

            {/* Main Steps */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
                        {[
                            {
                                step: "1",
                                icon: Search,
                                title: "Pano Lokasyonunu Seç",
                                description: "Haritada veya listede tüm panolarımızı görün. AVM'ler, meydanlar, duraklar, ana caddeler - istediğiniz lokasyonu seçin.",
                                details: [
                                    "Harita üzerinde gerçek zamanlı pano görünümü",
                                    "Filtrele: Şehir, ilçe, bütçe, format",
                                    "Her panonun fiyatı ve müsaitlik durumu görünür"
                                ],
                                gradient: "from-blue-500 to-blue-600"
                            },
                            {
                                step: "2",
                                icon: Calendar,
                                title: "Tarih ve Bütçe Belirle",
                                description: "Kampanyanızın başlangıç ve bitiş tarihlerini seçin. Bütçenizi belirleyin.",
                                details: [
                                    "Boş tarih aralıkları anında görünür",
                                    "Esnek tarihlendirme seçenekleri",
                                    "Toplam maliyeti anında hesaplıyoruz"
                                ],
                                gradient: "from-slate-600 to-slate-700"
                            },
                            {
                                step: "3",
                                icon: Monitor,
                                title: "Pano Görsellerinizi Yükleyin",
                                description: "Hazırladığınız reklam görsellerini kolayca yükleyin. Tasarım desteğine ihtiyacınız varsa, bizimle iletişime geçin.",
                                details: [
                                    "Dijital: Video, görsel, animasyon",
                                    "Klasik billboard: Yüksek çözünürlük baskı dosyaları",
                                    "Format kontrolü ve önizleme"
                                ],
                                gradient: "from-emerald-500 to-emerald-600"
                            },
                            {
                                step: "4",
                                icon: CheckCircle,
                                title: "Onay ve Yayın",
                                description: "Reklamınızı hızlıca inceliyoruz. Onay sonrası kampanyanız belirlediğiniz tarihlerde yayınlanıyor!",
                                details: [
                                    "Hızlı onay süreci (genelde 24 saat)",
                                    "Pano görsellerini sizlere iletiyoruz.",
                                    "Anlık bildirimler ve raporlama"
                                ],
                                gradient: "from-amber-500 to-amber-600"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="flex gap-6"
                            >
                                <div className="flex-shrink-0">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center font-bold text-2xl shadow-lg`}>
                                        {item.step}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-semibold mb-3 border border-neutral-200">
                                        <item.icon className="w-4 h-4" />
                                        <span>Adım {item.step}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-neutral-900 mb-3">{item.title}</h3>
                                    <p className="text-neutral-600 mb-4 leading-relaxed">{item.description}</p>
                                    <ul className="space-y-2">
                                        {item.details.map((detail, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                                                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Avantajlar - Why Panobu is Better */}
            <section className="py-24 bg-neutral-50 border-y border-neutral-200">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4 text-neutral-900">Neden Panobu Daha İyi?</h2>
                        <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
                            Geleneksel outdoor reklam ajanslarıyla uğraşmayın. Panobu ile her şey daha hızlı, şeffaf ve uygun maliyetli.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {[
                            {
                                icon: DollarSign,
                                title: "Şeffaf Fiyatlar",
                                desc: "Gizli ücret yok. Tüm panoların fiyatları platformda görünür. Ajanslara teklif beklemekle zaman kaybetmeyin."
                            },
                            {
                                icon: Zap,
                                title: "Hızlı Süreç",
                                desc: "Günlerce süren süreçlere son. Panobu ile dakikalar içinde pano seç, rezerve et, yayına al."
                            },
                            {
                                icon: Shield,
                                title: "Güvenli Ödeme",
                                desc: "Ödemeniz güvende. Kampanyanız yayınlanana kadar paranız emanette. Onayladıktan sonra tahsil edilir."
                            },
                            {
                                icon: TrendingUp,
                                title: "Anlık Raporlar",
                                desc: "Kampanyanız ne durumda? Kaç kişiye ulaştı? Dashboard'unuzda tüm metrikleri gerçek zamanlı takip edin."
                            }
                        ].map((advantage, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 transition-all shadow-sm"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                    <advantage.icon className="w-6 h-6 text-blue-800" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-neutral-900">{advantage.title}</h3>
                                <p className="text-neutral-600 text-sm leading-relaxed">{advantage.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Supported Formats */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-neutral-900 mb-4">Tüm Reklam Formatları</h2>
                        <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
                            Dijital ekranlardan klasik billboardlara, durak panolarından bina kaplamalarına - hepsi tek platformda.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                icon: Monitor,
                                title: "Dijital Ekranlar",
                                formats: ["AVM İçi LED Ekranlar", "Meydan Dev Ekranları", "Metro/Durak Dijital Panolar"]
                            },
                            {
                                icon: Building2,
                                title: "Klasik Outdoor",
                                formats: ["Billboard (5x3, 8x3, vs.)", "Megaboard", "Raket Panolar", "Totem"]
                            },
                            {
                                icon: MapPin,
                                title: "Özel Formatlar",
                                formats: ["Bina Kaplamaları", "Araç Giydirme", "Durak Paneleri", "Özel Proje"]
                            }
                        ].map((category, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200 hover:bg-white transition-all shadow-sm"
                            >
                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                    <category.icon className="w-7 h-7 text-blue-800" />
                                </div>
                                <h3 className="text-xl font-bold text-neutral-900 mb-4">{category.title}</h3>
                                <ul className="space-y-2">
                                    {category.formats.map((format, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-neutral-600">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                            {format}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-neutral-100 border-t border-neutral-200 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900">
                            Hemen Başlayın
                        </h2>
                        <p className="text-xl text-neutral-600 mb-10">
                            Ücretsiz hesap oluşturun. Panoları inceleyin. İlk kampanyanızı bugün başlatın.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="h-14 px-8 text-lg bg-neutral-900 text-white hover:bg-neutral-800 rounded-full">
                                <Link href="/auth/register">
                                    Ücretsiz Hesap Aç <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg border-2 border-neutral-300 text-neutral-900 hover:bg-white rounded-full">
                                <Link href="/static-billboards">
                                    Panoları İncele
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* HowTo Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        "name": "Panobu ile Billboard Kiralama",
                        "description": "Türkiye genelinde billboard ve açık hava reklam alanı kiralama adımları",
                        "totalTime": "PT10M",
                        "estimatedCost": {
                            "@type": "MonetaryAmount",
                            "currency": "TRY",
                            "value": "1500"
                        },
                        "step": [
                            {
                                "@type": "HowToStep",
                                "position": 1,
                                "name": "Pano Seçimi",
                                "text": "Harita üzerinden şehir ve lokasyon seçin, uygun panoları filtreleyin",
                                "url": "https://panobu.com/static-billboards"
                            },
                            {
                                "@type": "HowToStep",
                                "position": 2,
                                "name": "Tarihleri Belirleyin",
                                "text": "Kampanya başlangıç ve bitiş tarihlerini seçin, müsaitlik durumunu kontrol edin",
                                "url": "https://panobu.com/static-billboards"
                            },
                            {
                                "@type": "HowToStep",
                                "position": 3,
                                "name": "Sepete Ekleyin",
                                "text": "Beğendiğiniz panoları sepete ekleyin, birden fazla pano seçebilirsiniz",
                                "url": "https://panobu.com/cart"
                            },
                            {
                                "@type": "HowToStep",
                                "position": 4,
                                "name": "Bilgilerinizi Girin",
                                "text": "İletişim bilgilerinizi ve kampanya detaylarını doldurun",
                                "url": "https://panobu.com/checkout"
                            },
                            {
                                "@type": "HowToStep",
                                "position": 5,
                                "name": "Görselinizi Gönderin",
                                "text": "Reklam görselinizi yükleyin veya tasarım desteği talep edin",
                                "url": "https://panobu.com/checkout"
                            }
                        ]
                    })
                }}
            />
        </PublicLayout>
    );
}
