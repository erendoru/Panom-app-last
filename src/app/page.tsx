"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Monitor, BarChart3, ShieldCheck, Zap, Globe, TrendingUp, Twitter, Instagram, Linkedin, Menu, X, MapPin, Calendar, Layers, Clock, CheckCircle2, Building2, LayoutDashboard, Target, CalendarCheck, Calculator } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

function CountUp({ target, suffix = "", duration = 2 }: { target: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const step = target / (duration * 60);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [isInView, target, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

const BUDGET_PRESETS = [
    { label: "5.000 ₺", value: 5000 },
    { label: "10.000 ₺", value: 10000 },
    { label: "25.000 ₺", value: 25000 },
    { label: "50.000 ₺", value: 50000 },
    { label: "100.000 ₺", value: 100000 },
];

const DURATION_OPTIONS = [
    { label: "1 Hafta", value: 1, multiplier: 1 },
    { label: "2 Hafta", value: 2, multiplier: 2 },
    { label: "1 Ay", value: 4, multiplier: 4 },
    { label: "3 Ay", value: 12, multiplier: 12 },
];

const AVG_WEEKLY_PRICE = 2500;
const AVG_DAILY_IMPRESSIONS = 25000;

function BudgetCalculator() {
    const [budget, setBudget] = useState(10000);
    const [durationIdx, setDurationIdx] = useState(0);
    const duration = DURATION_OPTIONS[durationIdx];

    const results = useMemo(() => {
        const totalWeeks = duration.multiplier;
        const costPerPanel = AVG_WEEKLY_PRICE * totalWeeks;
        const panelCount = Math.max(1, Math.floor(budget / costPerPanel));
        const totalImpressions = panelCount * AVG_DAILY_IMPRESSIONS * totalWeeks * 7;
        const cpm = totalImpressions > 0 ? (budget / totalImpressions) * 1000 : 0;
        return { panelCount, totalImpressions, cpm, costPerPanel };
    }, [budget, duration]);

    const formatNumber = (n: number) => {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
        if (n >= 1000) return (n / 1000).toFixed(0) + "K";
        return n.toString();
    };

    return (
        <section className="py-24 relative bg-[#0f1829]">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
                        <Calculator className="w-4 h-4 inline mr-1.5 -mt-0.5" />Bütçe Hesaplayıcı
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Ne Kadara Ne Alırım?</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Bütçenizi girin, süreyi seçin — kaç panoya ulaşabileceğinizi ve tahmini gösterim sayınızı anında görün.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="bg-[#111827] border border-white/5 rounded-3xl p-6 md:p-10">
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                            {/* Left: Inputs */}
                            <div className="space-y-8">
                                {/* Budget */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-3">Toplam Bütçe</label>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {BUDGET_PRESETS.map((p) => (
                                            <button
                                                key={p.value}
                                                onClick={() => setBudget(p.value)}
                                                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    budget === p.value
                                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                                                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                                                }`}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="range"
                                            min={1000}
                                            max={200000}
                                            step={1000}
                                            value={budget}
                                            onChange={(e) => setBudget(Number(e.target.value))}
                                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-emerald-500/30 [&::-webkit-slider-thumb]:cursor-pointer"
                                        />
                                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                                            <span>1.000 ₺</span>
                                            <span className="text-emerald-400 font-bold text-base">{budget.toLocaleString("tr-TR")} ₺</span>
                                            <span>200.000 ₺</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-3">Kampanya Süresi</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {DURATION_OPTIONS.map((d, i) => (
                                            <button
                                                key={d.value}
                                                onClick={() => setDurationIdx(i)}
                                                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                                                    durationIdx === i
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                                                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                                                }`}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Results */}
                            <div className="flex flex-col justify-center">
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                                        <div className="text-sm text-emerald-400 font-medium mb-1">Ulaşabileceğiniz Pano Sayısı</div>
                                        <div className="text-5xl md:text-6xl font-black text-white mb-1">{results.panelCount}</div>
                                        <div className="text-xs text-slate-500">pano × {duration.label}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
                                            <div className="text-xs text-slate-500 mb-1">Tahmini Gösterim</div>
                                            <div className="text-2xl font-bold text-white">{formatNumber(results.totalImpressions)}</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">toplam kişi</div>
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
                                            <div className="text-xs text-slate-500 mb-1">Bin Gösterim Maliyeti</div>
                                            <div className="text-2xl font-bold text-emerald-400">₺{results.cpm.toFixed(1)}</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">CPM</div>
                                        </div>
                                    </div>

                                    <Button asChild size="lg" className="w-full h-14 text-base bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all hover:scale-[1.02]">
                                        <Link href="/static-billboards">
                                            Panoları Gör ve Seç <ArrowRight className="w-5 h-5 ml-2" />
                                        </Link>
                                    </Button>

                                    <p className="text-[11px] text-slate-600 text-center">
                                        * Ortalama pano fiyatları ve gösterim verileri baz alınmıştır. Gerçek fiyatlar lokasyona göre değişir.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default function LandingPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-[#0B1120] text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">
            {/* Navigation */}
            <header className="fixed top-0 w-full z-50 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                        Panobu
                    </Link>

                    <nav className="hidden lg:flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium text-white transition-colors">Anasayfa</Link>
                        <Link href="/static-billboards" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Klasik Panolar</Link>
                        <Link href="/screens" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Dijital Billboard</Link>
                        <Link href="/how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Nasıl Çalışır?</Link>
                        <Link href="/blog" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Blog</Link>
                        <Link href="/updates" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Yenilikler</Link>
                    </nav>

                    <div className="flex items-center gap-3 md:gap-4">
                        <Link href="/auth/login" className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Giriş Yap
                        </Link>
                        <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-4 md:px-6 text-sm font-medium">
                            <Link href="/auth/register">Hemen Başla</Link>
                        </Button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-[#0B1120]/98 backdrop-blur-xl border-t border-white/5"
                        >
                            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                                {[
                                    { href: "/", label: "Anasayfa", active: true },
                                    { href: "/static-billboards", label: "Klasik Panolar" },
                                    { href: "/screens", label: "Dijital Billboard" },
                                    { href: "/how-it-works", label: "Nasıl Çalışır?" },
                                    { href: "/blog", label: "Blog" },
                                    { href: "/updates", label: "Yenilikler" },
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`text-base font-medium py-3 px-4 rounded-lg transition-colors ${item.active ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="border-t border-white/10 mt-2 pt-4">
                                    <Link href="/auth/login" className="text-base font-medium text-slate-400 hover:text-white py-3 px-4 rounded-lg hover:bg-white/5 transition-colors block" onClick={() => setIsMobileMenuOpen(false)}>
                                        Giriş Yap
                                    </Link>
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-[#0B1120]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/15 rounded-full blur-[150px] -z-10" />
                    <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />

                    <ContainerScroll>
                        <div className="relative w-full h-full">
                            <img src="/images/dashboard-preview.jpeg" alt="Panobu Dashboard" className="w-full h-full object-cover rounded-2xl" />
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="hidden md:flex absolute -right-20 top-1/4 bg-[#1a2332]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl z-20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400">Günlük Gösterim</div>
                                        <div className="text-lg font-bold text-white">45.2K</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </ContainerScroll>
                </section>

                {/* Stats Section */}
                <section className="pt-10 md:pt-20 pb-20 border-y border-white/5 bg-[#0f1829] relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0, duration: 0.5 }} className="text-center py-4 md:py-0 md:border-r border-white/10">
                                <div className="text-4xl md:text-5xl font-bold mb-2 leading-normal pb-1 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                                    <CountUp target={300} suffix="+" duration={2} />
                                </div>
                                <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest">Reklam Ünitesi</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }} className="text-center py-4 md:py-0 md:border-r border-white/10">
                                <div className="text-4xl md:text-5xl font-bold mb-2 leading-normal pb-1 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent whitespace-nowrap">
                                    Tüm Türkiye
                                </div>
                                <div className="text-xs md:text-sm text-emerald-500/80 uppercase tracking-widest">Yakında Global</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }} className="text-center py-4 md:py-0 md:border-r border-white/10">
                                <div className="text-4xl md:text-5xl font-bold mb-2 leading-normal pb-1 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                    En Uygun
                                </div>
                                <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest">Fiyat Garantisi</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.45, duration: 0.5 }} className="text-center py-4 md:py-0">
                                <div className="text-4xl md:text-5xl font-bold mb-2 leading-normal pb-1 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                    <CountUp target={5} suffix=" dk" duration={1.5} />
                                </div>
                                <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest">Hızlı Başlangıç</div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Product Cards */}
                <section className="py-20 bg-[#0B1120]">
                    <div className="container mx-auto px-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Açık Hava Reklamcılığının Yeni Adresi</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                                Planlayın. Kiralayın. Ölçümleyin. Tek platform, sınırsız olanak.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {[
                                { icon: Monitor, title: "Dijital Panolar", desc: "AVM ekranları, dijital billboardlar ve LED duvar panolarını keşfedin. Saniyeler içinde kampanyanızı oluşturun.", link: "/screens", linkText: "Keşfet", color: "blue" },
                                { icon: Layers, title: "Klasik Billboardlar", desc: "Sokak, cadde ve otoyol panolarında markanızı milyonlara ulaştırın. Tüm formatlar, tek çatı altında.", link: "/static-billboards", linkText: "İncele", color: "indigo" },
                                { icon: BarChart3, title: "Fiyat Karşılaştır", desc: "Bütçenize uygun panoları anında filtreleyin. Şehir, ilçe ve format bazında en uygun fiyatları görün.", link: "/static-billboards", linkText: "Hesapla", color: "emerald" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                >
                                    <Link href={item.link} className="group block h-full">
                                        <div className="relative h-full bg-[#111827] border border-white/5 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                                                item.color === 'blue' ? 'bg-blue-500/15' : item.color === 'indigo' ? 'bg-indigo-500/15' : 'bg-emerald-500/15'
                                            }`}>
                                                <item.icon className={`w-6 h-6 ${
                                                    item.color === 'blue' ? 'text-blue-400' : item.color === 'indigo' ? 'text-indigo-400' : 'text-emerald-400'
                                                }`} />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed mb-5">{item.desc}</p>
                                            <span className="inline-flex items-center text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                                                {item.linkText} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Budget Calculator */}
                <BudgetCalculator />

                {/* Neden Panobu */}
                <section className="py-24 relative bg-[#0f1829]">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                    <div className="container mx-auto px-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">Farkımız</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Neden Panobu?</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                                Geleneksel outdoor reklam ajanslarıyla uğraşmayın. Panobu ile hızlı, şeffaf ve uygun fiyatlı reklam verin.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {[
                                { icon: Clock, traditional: "Günlerce fiyat teklifi bekleme", panobu: "Anında fiyatları gör, hemen kirala", color: "blue" },
                                { icon: ShieldCheck, traditional: "Aracı komisyonları + gizli ücretler", panobu: "Direkt pano sahibinden, sıfır komisyon", color: "emerald" },
                                { icon: Globe, traditional: "Her ajansı tek tek ara", panobu: "Tüm panolar tek platformda", color: "indigo" },
                                { icon: Target, traditional: "Sadece büyük bütçeler kabul edilir", panobu: "Her bütçeye uygun, esnek kiralama", color: "amber" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                                        item.color === 'blue' ? 'bg-blue-500/15' : item.color === 'emerald' ? 'bg-emerald-500/15' : item.color === 'indigo' ? 'bg-indigo-500/15' : 'bg-amber-500/15'
                                    }`}>
                                        <item.icon className={`w-5 h-5 ${
                                            item.color === 'blue' ? 'text-blue-400' : item.color === 'emerald' ? 'text-emerald-400' : item.color === 'indigo' ? 'text-indigo-400' : 'text-amber-400'
                                        }`} />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <X className="w-3 h-3 text-red-400" />
                                            </div>
                                            <p className="text-slate-500 text-sm line-through">{item.traditional}</p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                            </div>
                                            <p className="text-white font-medium text-sm">{item.panobu}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Competitive Edge Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-12 max-w-4xl mx-auto"
                        >
                            <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/15 rounded-2xl p-6 md:p-8">
                                <div className="flex items-center justify-center gap-2 mb-5">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                                        Türkiye&apos;nin İlk Aracısız OOH Platformu
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 md:gap-8 text-center mb-5">
                                    <div>
                                        <div className="text-2xl md:text-3xl font-bold text-emerald-400">%0</div>
                                        <div className="text-xs text-slate-500 mt-1">Ajans Komisyonu</div>
                                    </div>
                                    <div className="border-x border-white/10">
                                        <div className="text-2xl md:text-3xl font-bold text-blue-400">Yok</div>
                                        <div className="text-xs text-slate-500 mt-1">Minimum Bütçe</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl md:text-3xl font-bold text-indigo-400">5 dk</div>
                                        <div className="text-xs text-slate-500 mt-1">Başlangıç Süresi</div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <Link href="/platform/why-panobu" className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                        Detaylı karşılaştırmayı gör <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-24 relative bg-[#0B1120]">
                    <div className="container mx-auto px-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">Özellikler</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Geleceğin Reklamcılığı</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                                Geleneksel süreçleri unutun. Panobu ile dijital açıkhava reklamcılığı artık online reklam vermek kadar kolay.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: ShieldCheck,
                                    title: "Sabit & Şeffaf Fiyatlar",
                                    desc: "Tüm billboard ve ekranların fiyatları platformda sabit ve şeffaf olarak listelenir. Sürpriz ücretler, gizli komisyonlar yok. Gördüğünüz fiyat, ödediğiniz fiyattır.",
                                    gradient: "from-blue-500/20 to-indigo-500/20"
                                },
                                {
                                    icon: Zap,
                                    title: "Direkt Pano Sahibinden",
                                    desc: "Aracı firmalara komisyon ödemeye son. Panobu ile doğrudan pano ve ekran sahipleriyle çalışarak maliyetinizi düşürün, sürecinizi hızlandırın.",
                                    gradient: "from-emerald-500/20 to-teal-500/20"
                                },
                                {
                                    icon: Monitor,
                                    title: "Tüm Formatlar Tek Platformda",
                                    desc: "AVM iç mekan ekranları, cadde billboardları, otoyol megaboardları, bina kaplamaları — tüm açıkhava reklam formatlarını tek bir platform üzerinden yönetin.",
                                    gradient: "from-purple-500/20 to-pink-500/20"
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-2xl bg-[#111827] border border-white/5 hover:border-white/10 transition-all group"
                                >
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-24 bg-white text-slate-900">
                    <div className="container mx-auto px-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">Nasıl Çalışır?</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">4 Adımda Reklam Verin</h2>
                            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                                Sadece birkaç dakikada reklamınızı şehrin en görünür noktalarına taşıyın.
                            </p>
                        </motion.div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                            <div className="space-y-10">
                                {[
                                    {
                                        step: "1", icon: MapPin, color: "blue",
                                        title: "Lokasyon Seçin",
                                        desc: "Harita üzerinden şehir, ilçe ve cadde bazında pano lokasyonlarını keşfedin. Trafik yoğunluğu, günlük gösterim tahmini ve çevre analiziyle en doğru noktayı bulun."
                                    },
                                    {
                                        step: "2", icon: CalendarCheck, color: "indigo",
                                        title: "Tarih ve Bütçe Belirleyin",
                                        desc: "Her panonun müsaitlik takvimini anlık kontrol edin. Günlük, haftalık veya aylık esnek kiralama periyotlarıyla bütçenize uygun planı oluşturun."
                                    },
                                    {
                                        step: "3", icon: Layers, color: "emerald",
                                        title: "Görsellerinizi Yükleyin",
                                        desc: "Reklam görsellerinizi platforma yükleyin. Ölçü ve format kılavuzuyla doğru boyutta hazırlayın. İsterseniz tasarım desteği talep edin, biz halledelim."
                                    },
                                    {
                                        step: "4", icon: Zap, color: "amber",
                                        title: "Yayına Geçin",
                                        desc: "Siparişiniz hızlıca incelenir ve onaylanır. Onay sonrası kampanyanız belirlediğiniz tarihte otomatik başlar. Tüm süreci panelden takip edin."
                                    }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-5"
                                    >
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                                            item.color === 'blue' ? 'bg-blue-100' : item.color === 'indigo' ? 'bg-indigo-100' : item.color === 'emerald' ? 'bg-emerald-100' : 'bg-amber-100'
                                        }`}>
                                            <item.icon className={`w-6 h-6 ${
                                                item.color === 'blue' ? 'text-blue-600' : item.color === 'indigo' ? 'text-indigo-600' : item.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'
                                            }`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold mb-1.5 text-slate-900">{item.title}</h3>
                                            <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative h-[550px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-2xl"
                            >
                                <img src="/images/how-it-works-billboard.png" alt="Panobu Billboard" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />

                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-6 right-6 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg flex items-center gap-3 z-10"
                                >
                                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-medium">Günlük Gösterim</div>
                                        <div className="text-base font-bold text-slate-900">45.2K</div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-10"
                                >
                                    <Zap className="w-4 h-4 text-blue-600" />
                                    <span className="font-semibold text-slate-800 text-sm">Kolay & Hızlı</span>
                                </motion.div>
                            </motion.div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { title: "Şeffaf Fiyatlandırma", desc: "Tüm billboard ve ekranların fiyatları platformda anlık görünür. Aracı firmalara zaman kaybetmeden direkt kiralayın.", icon: ShieldCheck },
                                { title: "Herkes İçin Uygun", desc: "Restoran, emlakçı, showroom, kafe — işletmenizin büyüklüğü fark etmez. Küçük bütçelerle bile açık hava reklamı verin.", icon: Target },
                                { title: "Türkiye Geneli Kapsama", desc: "Her ile, her ilçeye genişliyoruz. Stratejik lokasyonlarda markanızı konumlandırın, yerel ve ulusal ölçekte görünür olun.", icon: MapPin },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-50 p-7 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow"
                                >
                                    <item.icon className="w-6 h-6 text-blue-600 mb-3" />
                                    <h3 className="text-base font-bold mb-2 text-slate-900">{item.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Enterprise Section */}
                <section className="py-24 bg-[#0B1120] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                    <div className="absolute -right-40 top-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />

                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6">Enterprise</span>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                                    Büyük Markalar İçin<br />
                                    <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Kurumsal Çözümler</span>
                                </h2>
                                <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                                    Türkiye&apos;nin dört bir yanında, il bazlı stratejik kampanyalar oluşturun. Farklı lokasyonlarla A/B testleri yapın, en yüksek dönüşümü yakalayan kombinasyonu keşfedin.
                                </p>

                                <div className="space-y-6 mb-10">
                                    {[
                                        { icon: MapPin, title: "İl Bazlı Kampanya Yönetimi", desc: "Her ilde stratejik lokasyonlarda markanızı konumlandırın. Bölgesel hedefleme ile reklam bütçenizi en verimli şekilde kullanın." },
                                        { icon: BarChart3, title: "A/B Test & Performans Analizi", desc: "Farklı lokasyonlar ve görseller ile A/B testleri yapın. Kampanyalarınızın performansını karşılaştırın, veriye dayalı kararlar alın." },
                                        { icon: Calendar, title: "Anlık Müsaitlik Takvimi", desc: "Her panonun müsaitlik tarihlerini anlık kontrol edin. Reklamlarınızı önceden planlayarak en uygun zamanlarda yayın yapın." },
                                        { icon: LayoutDashboard, title: "Sipariş Takip Paneli", desc: "Tüm açık hava siparişlerinizi tek bir panelden yönetin. Geçmiş kampanya detaylarını, ödeme geçmişini ve süreç durumunu anlık görüntüleyin." },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-4"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                                <item.icon className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <Button asChild size="lg" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-500 text-white rounded-full">
                                    <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                        Demo Talep Et <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="hidden lg:block"
                            >
                                <div className="bg-[#111827] border border-white/5 rounded-3xl p-8 space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                        <span className="text-xs text-slate-500 ml-2">Panobu Enterprise Dashboard</span>
                                    </div>

                                    {[
                                        { label: "Aktif Kampanyalar", value: "12", change: "+3 bu ay", color: "blue" },
                                        { label: "Toplam Gösterim", value: "2.4M", change: "+18% artış", color: "emerald" },
                                        { label: "Kapsanan İl", value: "28", change: "81 il hedefi", color: "indigo" },
                                        { label: "Aylık Tasarruf", value: "₺45K", change: "aracısız fiyat", color: "amber" },
                                    ].map((stat, i) => (
                                        <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-8 rounded-full ${
                                                    stat.color === 'blue' ? 'bg-blue-500' : stat.color === 'emerald' ? 'bg-emerald-500' : stat.color === 'indigo' ? 'bg-indigo-500' : 'bg-amber-500'
                                                }`} />
                                                <div>
                                                    <div className="text-sm text-slate-400">{stat.label}</div>
                                                    <div className="text-xl font-bold text-white">{stat.value}</div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">{stat.change}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-28 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4aDJ2MmgtMnpNMjIgMThoMnYyaC0yek0yMiAzMmgydjJoLTJ6TTM2IDMyaDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="max-w-3xl mx-auto"
                        >
                            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Markanızı Şehre Duyurun</h2>
                            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-xl mx-auto">
                                Ücretsiz hesabınızı oluşturun ve ilk kampanyanızı bugün başlatın. Açık hava reklamcılığı hiç bu kadar kolay olmamıştı.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button asChild size="lg" className="h-14 px-10 text-lg bg-white text-slate-900 hover:bg-slate-100 rounded-full font-semibold shadow-xl">
                                    <Link href="/static-billboards">
                                        Şimdi Başla — Ücretsiz <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" className="h-14 px-10 text-lg border-2 border-white/30 bg-transparent text-white hover:bg-white/10 rounded-full font-medium">
                                    <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                        Demo Rezervasyon
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <footer className="bg-[#060a14] text-white py-16 border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-6">
                            <Link href="/" className="text-3xl font-bold block tracking-tight">PANOBU</Link>
                            <div className="flex gap-3">
                                <Link href="#" className="bg-white/5 p-2.5 rounded-full hover:bg-white/10 transition-colors"><Globe className="w-4 h-4" /></Link>
                                <Link href="#" className="bg-white/5 p-2.5 rounded-full hover:bg-white/10 transition-colors"><Twitter className="w-4 h-4" /></Link>
                                <Link href="#" className="bg-white/5 p-2.5 rounded-full hover:bg-white/10 transition-colors"><Instagram className="w-4 h-4" /></Link>
                                <Link href="#" className="bg-white/5 p-2.5 rounded-full hover:bg-white/10 transition-colors"><Linkedin className="w-4 h-4" /></Link>
                            </div>
                            <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-5 font-bold text-base shadow-lg shadow-blue-900/20 w-full md:w-auto">
                                <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                    Demo Rezervasyon
                                </Link>
                            </Button>
                        </div>

                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-6">Ürünler</h4>
                            <ul className="space-y-3.5 text-slate-500">
                                <li><Link href="/screens" className="hover:text-white transition-colors text-sm">Açık Hava Reklamcılığı</Link></li>
                                <li><Link href="/screens" className="hover:text-white transition-colors text-sm">Dijital Panolar</Link></li>
                                <li><Link href="/static-billboards" className="hover:text-white transition-colors text-sm">Billboard Kiralama</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-6">Platform</h4>
                            <ul className="space-y-3.5 text-slate-500">
                                <li><Link href="/platform/why-panobu" className="hover:text-white transition-colors text-sm">Neden Panobu?</Link></li>
                                <li><Link href="/platform/advantages" className="hover:text-white transition-colors text-sm">Panobu Avantajları</Link></li>
                                <li><Link href="/platform/advertisers" className="hover:text-white transition-colors text-sm">Reklam Verenler İçin</Link></li>
                                <li><Link href="/platform/publishers" className="hover:text-white transition-colors text-sm">Reklam Alanları İçin</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-6">Şirket</h4>
                            <ul className="space-y-3.5 text-slate-500">
                                <li><Link href="/company/about" className="hover:text-white transition-colors text-sm">Hakkımızda</Link></li>
                                <li><Link href="/company/careers" className="hover:text-white transition-colors text-sm">Kariyer</Link></li>
                                <li><Link href="/blog" className="hover:text-white transition-colors text-sm">Blog</Link></li>
                                <li><Link href="/updates" className="hover:text-white transition-colors text-sm">Yenilikler</Link></li>
                                <li><Link href="/company/help" className="hover:text-white transition-colors text-sm">Yardım Merkezi</Link></li>
                                <li><Link href="/legal/contact" className="hover:text-white transition-colors text-sm">İletişim</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8">
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 mb-4">
                            <Link href="/legal/privacy" className="hover:text-slate-400 transition-colors">Gizlilik Politikası</Link>
                            <span>•</span>
                            <Link href="/legal/refund" className="hover:text-slate-400 transition-colors">İade Politikası</Link>
                            <span>•</span>
                            <Link href="/legal/terms" className="hover:text-slate-400 transition-colors">Hizmet Şartları</Link>
                            <span>•</span>
                            <Link href="/legal/distance-sales" className="hover:text-slate-400 transition-colors">Mesafeli Satış Sözleşmesi</Link>
                            <span>•</span>
                            <Link href="/legal/delivery" className="hover:text-slate-400 transition-colors">Teslimat Koşulları</Link>
                            <span>•</span>
                            <Link href="/legal/contact" className="hover:text-slate-400 transition-colors">İletişim</Link>
                        </div>
                        <div className="text-center text-slate-600 text-xs">
                            <p>&copy; 2026 Panobu. Tüm hakları saklıdır.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
