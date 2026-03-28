"use client";

import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight, CheckCircle2, XCircle, MinusCircle,
    ShieldCheck, Map, Layers, Users, Zap, TrendingUp,
    Calculator, Building2
} from "lucide-react";

const COMPARISON_ROWS = [
    { label: "Komisyon", panobu: "%0 — Sıfır komisyon", panobuOk: true, ajans: "%10-30 ajans payı", ajansOk: false, online: "%5-15 platform payı", onlineOk: "partial" },
    { label: "Fiyat Şeffaflığı", panobu: "Sabit, anında görünür", panobuOk: true, ajans: "Teklif bekle, pazarlık yap", ajansOk: false, online: "Değişken / teklif bazlı", onlineOk: "partial" },
    { label: "Minimum Bütçe", panobu: "Yok — 2.500₺'den başla", panobuOk: true, ajans: "Min. 50.000₺+", ajansOk: false, online: "Min. 10.000₺+", onlineOk: "partial" },
    { label: "Format Çeşitliliği", panobu: "Static + Dijital + CLP + Raket", panobuOk: true, ajans: "Sınırlı portföy", ajansOk: "partial", online: "Sadece dijital (DOOH)", onlineOk: false },
    { label: "Gösterim Tahmini", panobu: "Trafik bazlı anlık tahmin", panobuOk: true, ajans: "Tahmini / belirsiz", ajansOk: false, online: "Kısıtlı veri", onlineOk: "partial" },
    { label: "Harita ile Seçim", panobu: "Harita + trafik yoğunluğu", panobuOk: true, ajans: "Yok", ajansOk: false, online: "Basit harita", onlineOk: "partial" },
    { label: "Başlangıç Süresi", panobu: "5 dakika", panobuOk: true, ajans: "1-4 hafta", ajansOk: false, online: "1-3 gün", onlineOk: "partial" },
    { label: "KOBİ Uygunluğu", panobu: "Bireysel + KOBİ + Kurumsal", panobuOk: true, ajans: "Sadece büyük markalar", ajansOk: false, online: "Orta-büyük markalar", onlineOk: "partial" },
];

function StatusIcon({ status }: { status: boolean | string }) {
    if (status === true) return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    if (status === "partial") return <MinusCircle className="w-4 h-4 text-amber-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
}

const DIFFERENTIATORS = [
    {
        icon: ShieldCheck,
        title: "Gerçek Aracısız Platform",
        desc: "Panobu, Türkiye'de pano sahibiyle reklam vereni doğrudan buluşturan ilk ve tek platformdur. Araya giren ajans, komisyoncu veya aracı yoktur. Ödediğiniz her kuruş, doğrudan reklam alanınıza gider.",
        color: "emerald",
    },
    {
        icon: Map,
        title: "Harita + Trafik + Gösterim Tahmini",
        desc: "Sadece pano listesi değil; harita üzerinde lokasyonu görün, trafik yoğunluğunu analiz edin ve günlük tahmini gösterim sayısını anında öğrenin. Bu üçlü kombinasyonu sunan başka platform yok.",
        color: "blue",
    },
    {
        icon: Layers,
        title: "Tüm Formatlar Tek Çatı Altında",
        desc: "Billboard, raket pano, CLP, megalight, dijital ekran, LED duvar — hem statik hem dijital, hem niş hem yaygın formatları tek platformdan yönetin. Rakipler ya sadece dijitale ya da sınırlı portföye odaklanıyor.",
        color: "indigo",
    },
    {
        icon: Users,
        title: "Küçük Esnaftan Büyük Markaya",
        desc: "Geleneksel ajanslar büyük bütçeli markalara odaklanır. Panobu'da minimum bütçe yoktur. Mahalle eczanesinden ulusal zincire kadar herkes profesyonel açık hava reklamı verebilir.",
        color: "amber",
    },
];

export default function WhyPanobuPage() {
    return (
        <PublicLayout>
            {/* Hero */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -z-10" />

                <div className="container mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
                            Türkiye&apos;nin İlk Aracısız OOH Platformu
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Neden <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Panobu?</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                            Geleneksel ajansların komisyonlarına, belirsiz fiyatlarına ve haftalarca süren süreçlerine son verin.
                            Panobu ile açık hava reklamcılığı şeffaf, hızlı ve herkes için erişilebilir.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all hover:scale-105">
                                <Link href="/static-billboards">
                                    Panoları Gör <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="h-14 px-8 text-lg border border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full">
                                <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                    Demo Talep Et
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 bg-[#0f1829] relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">Karşılaştırma</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Panobu vs Rakipler</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Geleneksel ajanslar ve online rakiplerle madde madde karşılaştırın.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-5xl mx-auto">
                        <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
                            {/* Header */}
                            <div className="grid grid-cols-4 bg-white/[0.03] border-b border-white/5">
                                <div className="p-4 md:p-5 text-sm font-medium text-slate-500"></div>
                                <div className="p-4 md:p-5 text-center">
                                    <div className="text-sm font-bold text-emerald-400">Panobu</div>
                                    <div className="text-[10px] text-emerald-400/60 mt-0.5">Aracısız Platform</div>
                                </div>
                                <div className="p-4 md:p-5 text-center border-x border-white/5">
                                    <div className="text-sm font-bold text-slate-400">Geleneksel Ajans</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">Komisyoncu</div>
                                </div>
                                <div className="p-4 md:p-5 text-center">
                                    <div className="text-sm font-bold text-slate-400">Online Rakipler</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">Dijital Platformlar</div>
                                </div>
                            </div>

                            {/* Rows */}
                            {COMPARISON_ROWS.map((row, i) => (
                                <div key={i} className={`grid grid-cols-4 ${i % 2 === 0 ? "bg-white/[0.01]" : ""} border-b border-white/5 last:border-b-0`}>
                                    <div className="p-4 md:p-5 text-sm font-medium text-slate-300 flex items-center">{row.label}</div>
                                    <div className="p-4 md:p-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <StatusIcon status={row.panobuOk} />
                                        </div>
                                        <div className="text-xs text-emerald-400/80 mt-1 hidden md:block">{row.panobu}</div>
                                    </div>
                                    <div className="p-4 md:p-5 text-center border-x border-white/5">
                                        <div className="flex items-center justify-center gap-2">
                                            <StatusIcon status={row.ajansOk} />
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 hidden md:block">{row.ajans}</div>
                                    </div>
                                    <div className="p-4 md:p-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <StatusIcon status={row.onlineOk} />
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 hidden md:block">{row.online}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 4 Key Differentiators */}
            <section className="py-24 bg-[#0B1120]">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">Farkımız</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Bizi Farklı Kılan 4 Şey</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Panobu&apos;yu benzersiz yapan özellikler — hiçbir rakipte bu kombinasyonu bulamazsınız.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {DIFFERENTIATORS.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#111827] border border-white/5 rounded-2xl p-7 hover:border-white/10 transition-all"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                                    item.color === "emerald" ? "bg-emerald-500/15" : item.color === "blue" ? "bg-blue-500/15" : item.color === "indigo" ? "bg-indigo-500/15" : "bg-amber-500/15"
                                }`}>
                                    <item.icon className={`w-6 h-6 ${
                                        item.color === "emerald" ? "text-emerald-400" : item.color === "blue" ? "text-blue-400" : item.color === "indigo" ? "text-indigo-400" : "text-amber-400"
                                    }`} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Savings Comparison */}
            <section className="py-24 bg-[#0f1829] relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
                            <Calculator className="w-4 h-4 inline mr-1.5 -mt-0.5" />Tasarruf
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ne Kadar Tasarruf Edersiniz?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Panobu&apos;da pano sahibinden komisyonsuz kiralama yaparsınız. Aradaki fark cebinizde kalır.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Ajans */}
                            <div className="bg-[#111827] border border-red-500/10 rounded-2xl p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Geleneksel Ajans</h3>
                                        <p className="text-xs text-slate-500">Aracı üzerinden kiralama</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-slate-400">Pano fiyatı (4 hafta)</span>
                                        <span className="text-white font-medium">10.000 ₺</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-slate-400">Ajans komisyonu (%20)</span>
                                        <span className="text-red-400 font-medium">+2.000 ₺</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-slate-400">Operasyon / hizmet bedeli</span>
                                        <span className="text-red-400 font-medium">+1.500 ₺</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-slate-400">Bekleme süresi</span>
                                        <span className="text-red-400 font-medium">1-4 hafta</span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold pt-2">
                                        <span className="text-white">Toplam</span>
                                        <span className="text-red-400">13.500 ₺</span>
                                    </div>
                                </div>
                            </div>

                            {/* Panobu */}
                            <div className="bg-[#111827] border border-emerald-500/20 rounded-2xl p-8 relative">
                                <div className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">%26 TASARRUF</div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Panobu</h3>
                                        <p className="text-xs text-emerald-400">Direkt pano sahibinden</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-slate-400">Pano fiyatı (4 hafta)</span>
                                        <span className="text-white font-medium">10.000 ₺</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-slate-400">Platform komisyonu</span>
                                        <span className="text-emerald-400 font-medium">0 ₺</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-slate-400">Ekstra ücret</span>
                                        <span className="text-emerald-400 font-medium">0 ₺</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                        <span className="text-slate-400">Başlangıç süresi</span>
                                        <span className="text-emerald-400 font-medium">5 dakika</span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold pt-2">
                                        <span className="text-white">Toplam</span>
                                        <span className="text-emerald-400">10.000 ₺</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-slate-500 text-sm mb-6">
                                * Ortalama pano fiyatları ve sektör komisyon oranları baz alınmıştır.
                            </p>
                            <Button asChild size="lg" className="h-14 px-8 text-base bg-emerald-600 hover:bg-emerald-500 text-white rounded-full">
                                <Link href="/static-billboards">
                                    Şimdi Panoları Gör <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-[#0B1120]">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-3xl p-10 md:p-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Farkı Kendiniz Görün</h2>
                        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                            Komisyonsuz, şeffaf ve hızlı açık hava reklamcılığını deneyimleyin.
                            Ücretsiz keşfedin, beğendiğiniz panoyu hemen kiralayın.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all hover:scale-105">
                                <Link href="/static-billboards">
                                    Panoları Keşfet <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" className="h-14 px-10 text-lg border border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full">
                                <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                    Demo Talep Et
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PublicLayout>
    );
}
