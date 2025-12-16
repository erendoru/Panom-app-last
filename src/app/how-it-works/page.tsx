"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Search, MapPin, Calendar, CreditCard,
    TrendingUp, Shield, Zap, DollarSign,
    CheckCircle, ArrowRight, Building2, Monitor
} from "lucide-react";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Panobu
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/auth/login" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                            Giriş Yap
                        </Link>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                            <Link href="/auth/register">Hemen Başla</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="pt-20">
                {/* Hero Section */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent" />
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={fadeInUp}
                            className="max-w-3xl mx-auto"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Panobu <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Nasıl Çalışır?</span>
                            </h1>
                            <p className="text-xl text-slate-400 mb-8">
                                Outdoor reklam vermek artık bu kadar kolay olmamıştı.
                                4 basit adımda markanızı şehrin en görünür noktalarına taşıyın.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Main Steps */}
                <section className="py-16 bg-white text-slate-900">
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
                                    color: "blue"
                                },
                                {
                                    step: "2",
                                    icon: Calendar,
                                    title: "Tarih ve Bütçe Belirle",
                                    description: "Kampanyanızın başlangıç ve bitiş tarihlerini seçin. Bütçenizi belirleyin - küçük veya büyük, her bütçe kabul edilir.",
                                    details: [
                                        "Boş tarih aralıkları anında görünür",
                                        "Esnek tarihlendirme seçenekleri",
                                        "Toplam maliyeti anında hesaplıyoruz"
                                    ],
                                    color: "purple"
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
                                    color: "green"
                                },
                                {
                                    step: "4",
                                    icon: CheckCircle,
                                    title: "Onay ve Yayın",
                                    description: "Reklamınızı hızlıca inceliyoruz. Onay sonrası ödeme yapın ve kampanyanız belirlediğiniz tarihlerde yayınlanıyor!",
                                    details: [
                                        "Hızlı onay süreci (genelde 24 saat)",
                                        "Güvenli ödeme seçenekleri",
                                        "Anlık bildirimler ve raporlama"
                                    ],
                                    color: "yellow"
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
                                        <div className={`w-16 h-16 rounded-2xl bg-${item.color}-100 text-${item.color}-600 flex items-center justify-center font-bold text-2xl shadow-lg`}>
                                            {item.step}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${item.color}-50 text-${item.color}-700 text-xs font-semibold mb-3`}>
                                            <item.icon className="w-4 h-4" />
                                            <span>Adım {item.step}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                        <p className="text-slate-600 mb-4 leading-relaxed">{item.description}</p>
                                        <ul className="space-y-2">
                                            {item.details.map((detail, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-500">
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
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
                <section className="py-24 bg-gradient-to-br from-slate-900 to-black text-white">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold mb-4">Neden Panobu Daha İyi?</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
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
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                                >
                                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
                                        <advantage.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{advantage.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{advantage.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Supported Formats */}
                <section className="py-24 bg-white text-slate-900">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold mb-4">Tüm Reklam Formatları</h2>
                            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
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
                                    className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all"
                                >
                                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                        <category.icon className="w-7 h-7 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                                    <ul className="space-y-2">
                                        {category.formats.map((format, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
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
                <section className="py-32 bg-gradient-to-r from-blue-900 to-purple-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="max-w-3xl mx-auto"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Hemen Başlayın
                            </h2>
                            <p className="text-xl text-slate-200 mb-10">
                                Ücretsiz hesap oluşturun. Panoları inceleyin. İlk kampanyanızı bugün başlatın.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-slate-200 rounded-full">
                                    <Link href="/auth/register">
                                        Ücretsiz Hesap Aç <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg border-white/30 text-white hover:bg-white/10 rounded-full backdrop-blur-sm">
                                    <Link href="/screens">
                                        Panoları İncele
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-white py-12 border-t border-white/10">
                <div className="container mx-auto px-4 text-center">
                    <Link href="/" className="text-2xl font-bold block mb-4">PANOM</Link>
                    <p className="text-slate-500 text-sm">&copy; 2025 Panobu. Tüm hakları saklıdır.</p>
                </div>
            </footer>
        </div>
    );
}
