"use client";

import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight, ShieldCheck, Zap, Map, Clock, BarChart3,
    Layers, Wallet, Users, TrendingUp, Eye, CalendarCheck,
    Building2, CheckCircle2
} from "lucide-react";

const ADVERTISER_ADVANTAGES = [
    {
        icon: ShieldCheck,
        title: "Sabit & Şeffaf Fiyatlar",
        desc: "Tüm panoların fiyatları platformda sabit ve açıktır. Gizli ücret, sürpriz komisyon veya ek maliyet yoktur. Gördüğünüz fiyat, ödediğiniz fiyattır.",
        color: "emerald",
    },
    {
        icon: Users,
        title: "Her Bütçeye Uygun",
        desc: "Minimum bütçe zorunluluğu yoktur. Küçük esnaftan büyük markaya kadar herkes reklam verebilir. 2.500₺'den başlayan haftalık fiyatlarla açık hava reklamcılığına adım atın.",
        color: "blue",
    },
    {
        icon: Map,
        title: "Harita ile Akıllı Seçim",
        desc: "Panoları harita üzerinde görün, trafik yoğunluğunu kontrol edin ve günlük tahmini gösterim sayısını anlık öğrenin. Veriye dayalı karar verin.",
        color: "indigo",
    },
    {
        icon: Zap,
        title: "5 Dakikada Başlangıç",
        desc: "Haftalarca süren ajans süreçlerine son. Panoyu seçin, tarihi belirleyin, ödeyin — kampanyanız başlasın. Tüm süreç dijital ve anlık.",
        color: "amber",
    },
    {
        icon: Layers,
        title: "Tüm Formatlar Tek Çatıda",
        desc: "Billboard, raket pano, CLP, megalight, dijital ekran — statik ve dijital tüm açık hava formatlarını tek platformdan keşfedin ve yönetin.",
        color: "purple",
    },
    {
        icon: Eye,
        title: "Anlık Müsaitlik & Fiyat",
        desc: "Her panonun müsaitlik takvimini ve güncel fiyatını anında görün. Teklif beklemeye, telefon trafiğine gerek yok — her şey elinizin altında.",
        color: "emerald",
    },
];

const PUBLISHER_ADVANTAGES = [
    {
        icon: ShieldCheck,
        title: "Sıfır Komisyon, Sıfır Sürpriz",
        desc: "Belirlediğiniz fiyat üzerinden satış yapılır. Kesinti, komisyon veya gizli ücret yoktur. Kazancınız doğrudan sizindir.",
        color: "emerald",
    },
    {
        icon: TrendingUp,
        title: "Otomatik Müşteri Eşleşmesi",
        desc: "Satış operasyonuyla uğraşmayın. Reklam verenler platformda sizin panolarınızı bulur, sipariş verir. Siz sadece kazanın.",
        color: "blue",
    },
    {
        icon: Wallet,
        title: "48 Saat İçinde Ödeme",
        desc: "Her kiralama sonrası ödemeniz otomatik olarak hesabınıza aktarılır. Tahsilat riski ve gecikme yok.",
        color: "amber",
    },
    {
        icon: BarChart3,
        title: "Şeffaf Performans Takibi",
        desc: "Her ünitenizin doluluk oranını, gelirini ve performansını tek panelden anlık takip edin.",
        color: "indigo",
    },
];

const STATS = [
    { value: "300+", label: "Reklam Ünitesi", desc: "Tüm Türkiye genelinde" },
    { value: "81", label: "İl Hedefi", desc: "Ülke çapında genişleme" },
    { value: "50K+", label: "Günlük Gösterim", desc: "Ortalama pano başına" },
    { value: "48 saat", label: "Ödeme Süresi", desc: "Otomatik hesaba aktarım" },
];

export default function AdvantagesPage() {
    return (
        <PublicLayout>
            {/* Hero */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] -z-10" />

                <div className="container mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-800 text-sm font-medium mb-6">
                            Avantajlar
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
                            Açık Hava Reklamcılığında <br className="hidden md:block" />
                            <span className="text-blue-800">
                                Yeni Standart
                            </span>
                        </h1>
                        <p className="text-neutral-600 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                            Reklam verenler için şeffaflık ve kolaylık, ünite sahipleri için doluluk ve kazanç.
                            İki taraf için de kazançlı olan tek platform: Panobu.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Advertiser Advantages */}
            <section className="py-24 bg-neutral-50 relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-700 text-sm font-medium mb-4">Reklam Verenler İçin</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4">Markanızı Büyütün</h2>
                        <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
                            Ajans beklemeye son. Panobu ile dakikalar içinde profesyonel açık hava reklamı verin.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {ADVERTISER_ADVANTAGES.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-neutral-50 border border-neutral-200 rounded-2xl p-7 hover:border-neutral-300 transition-all"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                                    item.color === "emerald" ? "bg-emerald-500/15" : item.color === "blue" ? "bg-blue-500/15" : item.color === "indigo" ? "bg-indigo-500/15" : item.color === "amber" ? "bg-amber-500/15" : "bg-purple-500/15"
                                }`}>
                                    <item.icon className={`w-6 h-6 ${
                                        item.color === "emerald" ? "text-emerald-700" : item.color === "blue" ? "text-blue-700" : item.color === "indigo" ? "text-indigo-800" : item.color === "amber" ? "text-amber-400" : "text-purple-400"
                                    }`} />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900 mb-2">{item.title}</h3>
                                <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Button asChild size="lg" className="h-14 px-8 text-base bg-[#11b981] hover:bg-[#0ea472] text-white rounded-full">
                            <Link href="/static-billboards">
                                Panoları Keşfet <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Publisher Advantages */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 text-sm font-medium mb-4">Ünite Sahipleri İçin</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4">Ünitelerinizi Gelire Dönüştürün</h2>
                        <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
                            Satış operasyonuyla uğraşmayın, boş kalan ünitelerinizi Panobu ağıyla doldurun.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {PUBLISHER_ADVANTAGES.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-neutral-50 border border-neutral-200 rounded-2xl p-7 hover:border-emerald-500/20 transition-all"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                                    item.color === "emerald" ? "bg-emerald-500/15" : item.color === "blue" ? "bg-blue-500/15" : item.color === "amber" ? "bg-amber-500/15" : "bg-indigo-500/15"
                                }`}>
                                    <item.icon className={`w-6 h-6 ${
                                        item.color === "emerald" ? "text-emerald-700" : item.color === "blue" ? "text-blue-700" : item.color === "amber" ? "text-amber-400" : "text-indigo-800"
                                    }`} />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900 mb-2">{item.title}</h3>
                                <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Button asChild size="lg" className="h-14 px-8 text-base bg-emerald-600 hover:bg-emerald-500 text-white rounded-full">
                            <Link href="/platform/publishers">
                                Partner Ol <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-neutral-50 border-y border-neutral-200">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4">Rakamlarla Panobu</h2>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {STATS.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-5xl font-bold text-neutral-900 mb-2">{s.value}</div>
                                <div className="text-sm font-medium text-blue-700 mb-1">{s.label}</div>
                                <div className="text-xs text-slate-500">{s.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-600/20 to-purple-600/10 border border-blue-500/20 rounded-3xl p-10 md:p-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4">Hemen Başlayın</h2>
                        <p className="text-neutral-600 text-lg mb-8 max-w-2xl mx-auto">
                            İster reklam verin ister ünitelerinizi listeleyin — Panobu&apos;da herkes kazanır.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="h-14 px-10 text-lg bg-[#11b981] hover:bg-[#0ea472] text-white rounded-full transition-all hover:scale-105">
                                <Link href="/static-billboards">
                                    Reklam Ver <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="h-14 px-10 text-lg bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all hover:scale-105">
                                <Link href="/platform/publishers">
                                    Partner Ol <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
