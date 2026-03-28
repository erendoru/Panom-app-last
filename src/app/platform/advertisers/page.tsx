"use client";

import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight, Store, Building2, ShoppingBag, Globe,
    MapPin, Calendar, Image, Zap, ShieldCheck, Clock,
    CheckCircle2, XCircle, Star, Calculator,
    Monitor, Layers, BarChart3
} from "lucide-react";

const TARGET_AUDIENCES = [
    {
        icon: Store,
        title: "Yerel İşletmeler",
        examples: "Kafe, restoran, eczane, kuaför, market",
        desc: "Semtinizde bilinirliğinizi artırın. Yakın çevredeki panolarla müşterilerinize ulaşın.",
        color: "blue",
    },
    {
        icon: Building2,
        title: "KOBİ'ler",
        examples: "Bölgesel markalar, üretici firmalar",
        desc: "Şehrinizde veya bölgenizde marka bilinirliği oluşturun. İl bazlı stratejik panolarla hedef kitlenize ulaşın.",
        color: "indigo",
    },
    {
        icon: ShoppingBag,
        title: "E-Ticaret Markaları",
        examples: "Online mağazalar, D2C markalar",
        desc: "Dijital dünyanın ötesine geçin. Fiziksel dünyada görünürlük kazanarak güven ve bilinirlik inşa edin.",
        color: "emerald",
    },
    {
        icon: Globe,
        title: "Büyük Markalar",
        examples: "Ulusal zincirler, kurumsal şirketler",
        desc: "81 ilde eş zamanlı kampanyalar yürütün. A/B testleri ile en yüksek dönüşümü yakalayın.",
        color: "amber",
    },
];

const STEPS = [
    { step: "1", icon: MapPin, title: "Pano Seçin", desc: "Harita üzerinden lokasyon, format ve bütçenize uygun panoları bulun. Trafik yoğunluğu ve gösterim tahminini görün." },
    { step: "2", icon: Calendar, title: "Tarih Belirleyin", desc: "Müsaitlik takviminden istediğiniz tarihleri seçin. Minimum 1 hafta, dilediğiniz kadar uzun." },
    { step: "3", icon: Image, title: "Görsel Yükleyin", desc: "Reklam görselinizi yükleyin veya tasarım desteği talep edin. Boyut ve format otomatik ayarlanır." },
    { step: "4", icon: Zap, title: "Yayına Geçin", desc: "Ödemenizi yapın, siparişiniz onaylansın ve belirlediğiniz tarihte kampanyanız başlasın." },
];

const FORMATS = [
    { name: "Billboard", icon: "🖼️", desc: "Cadde & otoyol" },
    { name: "Raket Pano", icon: "🏷️", desc: "Kaldırım kenarı" },
    { name: "CLP", icon: "📋", desc: "Durak & AVM" },
    { name: "Megalight", icon: "💡", desc: "Büyük boy aydınlatmalı" },
    { name: "Dijital Ekran", icon: "📺", desc: "LED & LCD" },
    { name: "LED Duvar", icon: "🔲", desc: "Bina cephesi" },
];

const SUCCESS_STORIES = [
    {
        title: "Yerel Kafe — Kocaeli",
        scenario: "3 haftalık billboard kampanyası",
        result: "Günlük müşteri sayısında %40 artış, sosyal medya takipçilerinde %25 büyüme.",
        metric: "%40",
        metricLabel: "Müşteri artışı",
    },
    {
        title: "E-Ticaret Markası — 5 İl",
        scenario: "Eş zamanlı çoklu il kampanyası",
        result: "Marka bilinirliğinde %60 artış, web trafiğinde %35 yükseliş.",
        metric: "%60",
        metricLabel: "Bilinirlik artışı",
    },
    {
        title: "Restoran Zinciri — İstanbul",
        scenario: "AVM içi CLP + cadde billboard kombinasyonu",
        result: "Yeni şube açılışında hedef müşteri sayısına 2 hafta erken ulaşıldı.",
        metric: "2x",
        metricLabel: "Hızlı büyüme",
    },
];

const FAQ = [
    { q: "Reklam vermek için minimum bütçe nedir?", a: "Minimum bütçe zorunluluğu yoktur. Haftalık 2.500₺'den başlayan fiyatlarla reklam verebilirsiniz. Bütçenize uygun panoları harita üzerinden filtreleyebilirsiniz." },
    { q: "Kendi görselim yok, tasarım desteği alabilir miyim?", a: "Evet! Sipariş sırasında 'tasarım desteği istiyorum' seçeneğini işaretleyin, ekibimiz sizinle iletişime geçsin." },
    { q: "Kampanyamı ne kadar süreyle yayınlayabilirim?", a: "Minimum 1 hafta, maksimum süre sınırı yoktur. İhtiyacınıza göre esnek sürelerde kiralama yapabilirsiniz." },
    { q: "Hangi şehirlerde pano mevcut?", a: "Şu anda Kocaeli başta olmak üzere birçok ilde panolarımız mevcuttur. 81 il hedefiyle hızla genişliyoruz." },
    { q: "Kampanya sonuçlarını nasıl takip ederim?", a: "Her panonun günlük tahmini gösterim sayısını görebilirsiniz. Kampanya süresince trafik ve gösterim verilerine panelinizden ulaşabilirsiniz." },
    { q: "İptal veya değişiklik yapabilir miyim?", a: "Kampanya başlamadan önce ücretsiz iptal veya tarih değişikliği yapabilirsiniz. Detaylar için ekibimizle iletişime geçin." },
];

export default function ForAdvertisersPage() {
    return (
        <PublicLayout>
            {/* Hero */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -z-10" />
                <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />

                <div className="container mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
                            Reklam Verenler İçin
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Markanızı Şehrin <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
                                Her Köşesine Ulaştırın
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                            Küçük işletmelerden büyük markalara, herkes için açık hava reklamı.
                            Komisyonsuz, şeffaf fiyatlarla dakikalar içinde yayına geçin.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all hover:scale-105">
                                <Link href="/static-billboards">
                                    Panoları Gör <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="h-14 px-8 text-lg border border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full">
                                <Link href="/#budget-calculator">
                                    Bütçe Hesapla <Calculator className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Target Audiences */}
            <section className="py-24 bg-[#0f1829] relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">Kimler İçin?</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Her Ölçekte İşletme İçin</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            İster tek şubeli yerel bir işletme olun, ister 81 ilde faaliyet gösteren bir marka — Panobu size göre.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {TARGET_AUDIENCES.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all text-center"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto ${
                                    item.color === "blue" ? "bg-blue-500/15" : item.color === "indigo" ? "bg-indigo-500/15" : item.color === "emerald" ? "bg-emerald-500/15" : "bg-amber-500/15"
                                }`}>
                                    <item.icon className={`w-7 h-7 ${
                                        item.color === "blue" ? "text-blue-400" : item.color === "indigo" ? "text-indigo-400" : item.color === "emerald" ? "text-emerald-400" : "text-amber-400"
                                    }`} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                <p className="text-xs text-blue-400 mb-3">{item.examples}</p>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-[#0B1120]">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">Süreç</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">4 Adımda Reklam Verin</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Dakikalar içinde profesyonel açık hava reklamınızı yayınlayın.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {STEPS.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-blue-500/20 transition-all relative"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                    <span className="text-lg font-bold text-blue-400">{item.step}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agency vs Panobu */}
            <section className="py-24 bg-[#0f1829] relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Neden Ajans Değil, Panobu?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Geleneksel ajanslarla çalışmak yerine direkt pano sahibinden kiralayarak %30-40 tasarruf edin.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Ajans */}
                            <div className="bg-[#111827] border border-red-500/10 rounded-2xl p-7">
                                <div className="flex items-center gap-2 mb-6">
                                    <XCircle className="w-6 h-6 text-red-400" />
                                    <h3 className="text-lg font-bold text-white">Geleneksel Ajans</h3>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        "%10-30 komisyon ücreti",
                                        "Minimum 50.000₺+ bütçe",
                                        "1-4 hafta bekleme süresi",
                                        "Sınırlı format ve lokasyon",
                                        "Şeffaf olmayan fiyatlandırma",
                                        "Büyük markalara öncelik",
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-400">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Panobu */}
                            <div className="bg-[#111827] border border-emerald-500/20 rounded-2xl p-7 relative">
                                <div className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">TAVSİYE</div>
                                <div className="flex items-center gap-2 mb-6">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                    <h3 className="text-lg font-bold text-white">Panobu</h3>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        "Sıfır komisyon — direkt pano sahibinden",
                                        "2.500₺'den başlayan fiyatlar",
                                        "5 dakikada yayına geçiş",
                                        "Static + dijital + niş tüm formatlar",
                                        "Sabit ve şeffaf fiyatlandırma",
                                        "KOBİ'den büyük markaya herkese açık",
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-white font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Format Variety */}
            <section className="py-24 bg-[#0B1120]">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Tüm Reklam Formatları</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            İhtiyacınıza göre doğru formatı seçin — hepsi tek platformda.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                        {FORMATS.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-[#111827] border border-white/5 rounded-xl p-5 text-center hover:border-blue-500/20 transition-all"
                            >
                                <div className="text-3xl mb-2">{f.icon}</div>
                                <div className="text-sm font-medium text-white mb-1">{f.name}</div>
                                <div className="text-[10px] text-slate-500">{f.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="py-24 bg-[#0f1829] relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Başarı Senaryoları</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Panobu ile açık hava reklamının gücünü keşfeden işletmeler.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {SUCCESS_STORIES.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#111827] border border-white/5 rounded-2xl p-7"
                            >
                                <div className="text-4xl font-black text-blue-400 mb-2">{s.metric}</div>
                                <div className="text-xs text-blue-400/60 uppercase tracking-wider mb-4">{s.metricLabel}</div>
                                <h3 className="text-white font-bold mb-1">{s.title}</h3>
                                <p className="text-xs text-slate-500 mb-3">{s.scenario}</p>
                                <p className="text-slate-400 text-sm leading-relaxed">{s.result}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-[#0B1120]">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Sıkça Sorulan Sorular</h2>
                    </motion.div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {FAQ.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-[#111827] border border-white/5 rounded-xl p-6"
                            >
                                <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-[#0f1829] relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-3xl p-10 md:p-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">İlk Reklamınızı Bugün Verin</h2>
                        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                            Komisyon yok, minimum bütçe yok, bekleme yok. Panoları keşfedin, beğendiğinizi seçin, 5 dakikada yayına geçin.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all hover:scale-105">
                                <Link href="/static-billboards">
                                    Panoları Gör <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="h-14 px-10 text-lg border border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full">
                                <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                    Demo Talep Et
                                </Link>
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500 mt-6">
                            Ücretsiz keşfet · 0 komisyon · 5 dakikada başla
                        </p>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
