"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Monitor, BarChart3, ShieldCheck, Zap, Globe, TrendingUp, Twitter, Instagram, Linkedin, Menu, X, MapPin, Calendar, Layers, Clock, CheckCircle2, Building2, LayoutDashboard, Target, CalendarCheck, Calculator } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import LiveActivityTicker from "@/components/home/LiveActivityTicker";
import LanguageToggle from "@/components/LanguageToggle";
import { useAppLocale } from "@/contexts/LocaleContext";
import { navLabel } from "@/messages/publicNav";
import { budgetStrings } from "@/messages/landing/budget";
import { landingMainStrings } from "@/messages/landing/main";
import { footerCopy } from "@/messages/footer";

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

const AVG_WEEKLY_PRICE = 3000;
const AVG_DAILY_IMPRESSIONS = 25000;

function BudgetCalculator() {
    const { locale } = useAppLocale();
    const b = budgetStrings(locale);
    const [budget, setBudget] = useState(10000);
    const [durationIdx, setDurationIdx] = useState(0);
    const duration = b.durations[durationIdx];

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
        <section className="py-24 relative bg-neutral-50">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#11b981]/25 to-transparent" />
            <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#11b981]/10 text-[#0d9e6e] text-sm font-medium mb-4">
                        <Calculator className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                        {b.badge}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-neutral-900">{b.title}</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">{b.subtitle}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="bg-white border border-neutral-200 shadow-sm rounded-3xl p-6 md:p-10">
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                            {/* Left: Inputs */}
                            <div className="space-y-8">
                                {/* Budget */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-3">{b.totalBudget}</label>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {b.presets.map((p) => (
                                            <button
                                                key={p.value}
                                                onClick={() => setBudget(p.value)}
                                                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    budget === p.value
                                                        ? "bg-[#11b981] text-white shadow-lg shadow-[#11b981]/30"
                                                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
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
                                            className="w-full h-2 bg-neutral-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#11b981] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-[#11b981]/35 [&::-webkit-slider-thumb]:cursor-pointer"
                                        />
                                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                                            <span>{b.rangeMin}</span>
                                            <span className="text-[#11b981] font-bold text-base">
                                                {budget.toLocaleString(locale === "en" ? "en-US" : "tr-TR")} {locale === "en" ? "TRY" : "₺"}
                                            </span>
                                            <span>{b.rangeMax}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-3">{b.duration}</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {b.durations.map((d, i) => (
                                            <button
                                                key={d.value}
                                                onClick={() => setDurationIdx(i)}
                                                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                                                    durationIdx === i
                                                        ? "bg-[#11b981] text-white shadow-lg shadow-[#11b981]/30"
                                                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
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
                                    <div className="bg-[#11b981]/8 border border-[#11b981]/25 rounded-2xl p-6 text-center">
                                        <div className="text-sm text-[#0d9e6e] font-medium mb-1">{b.panelsTitle}</div>
                                        <div className="text-5xl md:text-6xl font-black text-neutral-900 mb-1">{results.panelCount}</div>
                                        <div className="text-xs text-slate-500">{b.panelsSub(duration.label)}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-center">
                                            <div className="text-xs text-slate-500 mb-1">{b.impressions}</div>
                                            <div className="text-2xl font-bold text-neutral-900">{formatNumber(results.totalImpressions)}</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">{b.impressionsSub}</div>
                                        </div>
                                        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-center">
                                            <div className="text-xs text-slate-500 mb-1">{b.cpm}</div>
                                            <div className="text-2xl font-bold text-[#11b981]">₺{results.cpm.toFixed(1)}</div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">{b.cpmSub}</div>
                                        </div>
                                    </div>

                                    <Button asChild size="lg" className="w-full h-14 text-base bg-[#11b981] hover:bg-[#0ea472] text-white rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-[#11b981]/25">
                                        <Link href="/static-billboards">
                                            {b.cta} <ArrowRight className="w-5 h-5 ml-2" />
                                        </Link>
                                    </Button>

                                    <p className="text-[11px] text-slate-600 text-center">{b.disclaimer}</p>
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
    const { locale } = useAppLocale();
    const lm = landingMainStrings(locale);
    const foot = footerCopy(locale);

    return (
        <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-blue-100 selection:text-neutral-900 overflow-x-clip">
            {/* Masaüstü: en üstte, kaydırınca gider — header ile birleşik sabit değil */}
            <LiveActivityTicker />

            {/* Navigation: sticky; ticker kaybolunca viewport üstüne oturur */}
            <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-neutral-200">
                <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-neutral-900 tracking-tight">
                        Panobu
                    </Link>

                    <nav className="hidden lg:flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium text-neutral-900 transition-colors">{navLabel(locale, "home")}</Link>
                        <Link href="/static-billboards" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">{navLabel(locale, "classic")}</Link>
                        <Link href="/screens" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">{navLabel(locale, "digital")}</Link>
                        <Link href="/how-it-works" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">{navLabel(locale, "howItWorks")}</Link>
                        <Link href="/blog" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">{navLabel(locale, "blog")}</Link>
                        <Link href="/updates" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">{navLabel(locale, "updates")}</Link>
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <LanguageToggle className="shrink-0 lg:hidden" />
                        <Link href="/auth/login" className="hidden sm:block text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                            {navLabel(locale, "login")}
                        </Link>
                        <Button asChild className="bg-[#11b981] hover:bg-[#0ea472] text-white rounded-full px-4 md:px-6 text-sm font-medium shadow-sm shadow-[#11b981]/20">
                            <Link href="/auth/register">{navLabel(locale, "getStarted")}</Link>
                        </Button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                            aria-label={navLabel(locale, "ariaMenu")}
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
                            className="lg:hidden bg-white backdrop-blur-xl border-t border-neutral-200"
                        >
                            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                                {[
                                    { href: "/", label: navLabel(locale, "home"), active: true },
                                    { href: "/static-billboards", label: navLabel(locale, "classic") },
                                    { href: "/screens", label: navLabel(locale, "digital") },
                                    { href: "/how-it-works", label: navLabel(locale, "howItWorks") },
                                    { href: "/blog", label: navLabel(locale, "blog") },
                                    { href: "/updates", label: navLabel(locale, "updates") },
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`text-base font-medium py-3 px-4 rounded-lg transition-colors ${item.active ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="border-t border-neutral-200 mt-2 pt-4">
                                    <Link href="/auth/login" className="text-base font-medium text-neutral-600 hover:text-neutral-900 py-3 px-4 rounded-lg hover:bg-neutral-100 transition-colors block" onClick={() => setIsMobileMenuOpen(false)}>
                                        {navLabel(locale, "login")}
                                    </Link>
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="flex-1 overflow-x-clip">
                {/* Hero Section */}
                <section className="relative bg-white">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/15 rounded-full blur-[150px] -z-10" />
                    <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />

                    <ContainerScroll hero={lm.hero}>
                        {/* Önizleme görseli: dosyayı değiştirmek için public/images/dashboard-preview.jpeg (veya src'yi aşağıda güncelleyin) */}
                        <div className="relative h-full w-full min-h-0 overflow-hidden rounded-2xl bg-neutral-200">
                            <img
                                src="/images/dashboard-preview.jpeg"
                                alt={lm.dashboardAlt}
                                className="absolute inset-0 h-full w-full object-contain object-top p-1 md:p-2 rounded-2xl"
                            />
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="hidden md:flex absolute -right-20 top-1/4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-neutral-200 shadow-2xl z-20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400">{lm.overlayImpressionsLabel}</div>
                                        <div className="text-lg font-bold text-neutral-900">45.2K</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </ContainerScroll>
                </section>

                {/* Stats Section */}
                <section className="pt-10 md:pt-20 pb-20 border-y border-neutral-200 bg-neutral-50 relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0, duration: 0.5 }} className="text-center py-4 md:py-0 md:border-r border-neutral-200">
                                <div className="text-4xl md:text-5xl font-bold mb-2 leading-normal pb-1 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                                    <CountUp target={300} suffix="+" duration={2} />
                                </div>
                                <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest">{lm.stats.units}</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }} className="text-center py-4 md:py-0 md:border-r border-neutral-200">
                                <div className="text-4xl md:text-5xl font-bold mb-2 leading-normal pb-1 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent whitespace-nowrap">
                                    {lm.stats.allTurkey}
                                </div>
                                <div className="text-xs md:text-sm text-emerald-500/80 uppercase tracking-widest">{lm.stats.globalSoon}</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }} className="text-center py-4 md:py-0 md:border-r border-neutral-200">
                                <div className="text-4xl md:text-5xl font-bold mb-2 leading-normal pb-1 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                    {lm.stats.bestPrice}
                                </div>
                                <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest">{lm.stats.priceGuarantee}</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.45, duration: 0.5 }} className="text-center py-4 md:py-0">
                                <div className="text-4xl md:text-5xl font-bold mb-2 leading-normal pb-1 text-neutral-900">
                                    <CountUp target={5} suffix={lm.stats.fastSuffix} duration={1.5} />
                                </div>
                                <div className="text-xs md:text-sm text-slate-500 uppercase tracking-widest">{lm.stats.fastStart}</div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Product Cards */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">{lm.products.title}</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">{lm.products.subtitle}</p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {[
                                { icon: Monitor, title: lm.products.cards[0].title, desc: lm.products.cards[0].desc, link: "/screens", linkText: lm.products.cards[0].linkText, color: "blue" },
                                { icon: Layers, title: lm.products.cards[1].title, desc: lm.products.cards[1].desc, link: "/static-billboards", linkText: lm.products.cards[1].linkText, color: "indigo" },
                                { icon: BarChart3, title: lm.products.cards[2].title, desc: lm.products.cards[2].desc, link: "/static-billboards", linkText: lm.products.cards[2].linkText, color: "emerald" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                >
                                    <Link href={item.link} className="group block h-full">
                                        <div className="relative h-full bg-white border border-neutral-200 shadow-sm border border-neutral-200 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                                                item.color === 'blue' ? 'bg-blue-500/15' : item.color === 'indigo' ? 'bg-indigo-500/15' : 'bg-emerald-500/15'
                                            }`}>
                                                <item.icon className={`w-6 h-6 ${
                                                    item.color === 'blue' ? 'text-blue-400' : item.color === 'indigo' ? 'text-indigo-400' : 'text-emerald-400'
                                                }`} />
                                            </div>
                                            <h3 className="text-xl font-bold text-neutral-900 mb-3">{item.title}</h3>
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
                <section className="py-24 relative bg-neutral-50">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                    <div className="container mx-auto px-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">{lm.why.badge}</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-neutral-900">{lm.why.title}</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">{lm.why.subtitle}</p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {lm.why.rows.map((row, i) => {
                                const meta = [
                                    { icon: Clock, color: "blue" as const },
                                    { icon: ShieldCheck, color: "emerald" as const },
                                    { icon: Globe, color: "indigo" as const },
                                    { icon: Target, color: "amber" as const },
                                ][i];
                                const item = { ...meta, traditional: row.traditional, panobu: row.panobu };
                                return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white border border-neutral-200 shadow-sm border border-neutral-200 rounded-2xl p-6 hover:border-neutral-200 transition-all"
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
                                            <p className="text-neutral-900 font-medium text-sm">{item.panobu}</p>
                                        </div>
                                    </div>
                                </motion.div>
                                );
                            })}
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
                                        {lm.why.barBadge}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 md:gap-8 text-center mb-5">
                                    <div>
                                        <div className="text-2xl md:text-3xl font-bold text-emerald-400">{lm.why.barCol1}</div>
                                        <div className="text-xs text-slate-500 mt-1">{lm.why.barCol1Sub}</div>
                                    </div>
                                    <div className="border-x border-neutral-200">
                                        <div className="text-2xl md:text-3xl font-bold text-blue-400">{lm.why.barCol2}</div>
                                        <div className="text-xs text-slate-500 mt-1">{lm.why.barCol2Sub}</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl md:text-3xl font-bold text-indigo-400">{lm.why.barCol3}</div>
                                        <div className="text-xs text-slate-500 mt-1">{lm.why.barCol3Sub}</div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <Link href="/platform/why-panobu" className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                        {lm.why.compareLink} <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-24 relative bg-white">
                    <div className="container mx-auto px-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">{lm.features.badge}</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">{lm.features.title}</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">{lm.features.subtitle}</p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: ShieldCheck,
                                    title: lm.features.items[0].title,
                                    desc: lm.features.items[0].desc,
                                    gradient: "from-blue-500/20 to-indigo-500/20"
                                },
                                {
                                    icon: Zap,
                                    title: lm.features.items[1].title,
                                    desc: lm.features.items[1].desc,
                                    gradient: "from-emerald-500/20 to-teal-500/20"
                                },
                                {
                                    icon: Monitor,
                                    title: lm.features.items[2].title,
                                    desc: lm.features.items[2].desc,
                                    gradient: "from-slate-200 to-slate-100"
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-sm border border-neutral-200 hover:border-neutral-200 transition-all group"
                                >
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-7 h-7 text-neutral-800" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-neutral-900">{feature.title}</h3>
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
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">{lm.how.badge}</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">{lm.how.title}</h2>
                            <p className="text-slate-500 max-w-2xl mx-auto text-lg">{lm.how.subtitle}</p>
                        </motion.div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                            <div className="space-y-10">
                                {lm.how.steps.map((stepText, i) => {
                                    const meta = [
                                        { step: "1", icon: MapPin, color: "blue" as const },
                                        { step: "2", icon: CalendarCheck, color: "indigo" as const },
                                        { step: "3", icon: Layers, color: "emerald" as const },
                                        { step: "4", icon: Zap, color: "amber" as const },
                                    ][i];
                                    const item = { ...meta, title: stepText.title, desc: stepText.desc };
                                    return (
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
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-semibold mb-3 border border-neutral-200">
                                                <item.icon className="w-4 h-4" />
                                                <span>{locale === "en" ? `Step ${item.step}` : `Adım ${item.step}`}</span>
                                            </div>
                                            <h3 className="text-lg font-bold mb-1.5 text-slate-900">{item.title}</h3>
                                            <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                );
                                })}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative h-[550px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-2xl"
                            >
                                <img src="/images/how-it-works-billboard.png" alt="" className="w-full h-full object-cover" />
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
                                        <div className="text-[10px] text-slate-500 font-medium">{lm.how.overlayImp}</div>
                                        <div className="text-base font-bold text-slate-900">45.2K</div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-10"
                                >
                                    <Zap className="w-4 h-4 text-blue-600" />
                                    <span className="font-semibold text-slate-800 text-sm">{lm.how.overlayEasy}</span>
                                </motion.div>
                            </motion.div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { title: lm.how.bottomCards[0].title, desc: lm.how.bottomCards[0].desc, icon: ShieldCheck },
                                { title: lm.how.bottomCards[1].title, desc: lm.how.bottomCards[1].desc, icon: Target },
                                { title: lm.how.bottomCards[2].title, desc: lm.how.bottomCards[2].desc, icon: MapPin },
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
                <section className="py-24 bg-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                    <div className="absolute -right-40 top-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />

                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6">{lm.enterprise.badge}</span>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900 leading-tight">
                                    {lm.enterprise.titleLine1}
                                    <br />
                                    <span className="text-blue-700">{lm.enterprise.titleLine2}</span>
                                </h2>
                                <p className="text-slate-400 text-lg mb-10 leading-relaxed">{lm.enterprise.lead}</p>

                                <div className="space-y-6 mb-10">
                                    {lm.enterprise.bullets.map((bul, i) => {
                                        const icons = [MapPin, BarChart3, Calendar, LayoutDashboard] as const;
                                        const item = { icon: icons[i], title: bul.title, desc: bul.desc };
                                        return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-4"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-[#11b981]/12 flex items-center justify-center flex-shrink-0">
                                                <item.icon className="w-5 h-5 text-[#11b981]" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-neutral-900 mb-1">{item.title}</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                        );
                                    })}
                                </div>

                                <Button asChild size="lg" className="h-14 px-8 text-base bg-[#11b981] hover:bg-[#0ea472] text-white rounded-full shadow-md shadow-[#11b981]/25">
                                    <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                        {lm.enterprise.cta} <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="hidden lg:block"
                            >
                                <div className="bg-white border border-neutral-200 shadow-sm rounded-3xl p-8 space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                        <span className="text-xs text-slate-500 ml-2">{lm.enterprise.dashTitle}</span>
                                    </div>

                                    {lm.enterprise.stats.map((st, i) => {
                                        const colors = ["blue", "emerald", "indigo", "amber"] as const;
                                        const stat = { label: st.label, value: ["12", "2.4M", "28", "₺45K"][i], change: st.change, color: colors[i] };
                                        return (
                                        <div key={i} className="flex items-center justify-between py-4 border-b border-neutral-200 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-8 rounded-full ${
                                                    stat.color === 'blue' ? 'bg-blue-500' : stat.color === 'emerald' ? 'bg-emerald-500' : stat.color === 'indigo' ? 'bg-indigo-500' : 'bg-amber-500'
                                                }`} />
                                                <div>
                                                    <div className="text-sm text-slate-400">{stat.label}</div>
                                                    <div className="text-xl font-bold text-neutral-900">{stat.value}</div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">{stat.change}</span>
                                        </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-28 relative overflow-hidden bg-neutral-100 border-y border-neutral-200">
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="max-w-3xl mx-auto"
                        >
                            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-neutral-900">{lm.cta.title}</h2>
                            <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-xl mx-auto">{lm.cta.subtitle}</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button asChild size="lg" className="h-14 px-10 text-lg bg-white text-slate-900 hover:bg-slate-100 rounded-full font-semibold shadow-xl">
                                    <Link href="/static-billboards">
                                        {lm.cta.primary} <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg border-2 border-[#11b981] text-[#11b981] bg-white hover:bg-[#11b981]/10 rounded-full font-medium">
                                    <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                        {lm.cta.secondary}
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <footer className="bg-neutral-50 text-neutral-900 py-16 border-t border-neutral-200">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-6">
                            <Link href="/" className="text-3xl font-bold block tracking-tight">PANOBU</Link>
                            <div className="flex gap-3">
                                <Link href="#" className="bg-neutral-100 p-2.5 rounded-full hover:bg-neutral-100 transition-colors"><Globe className="w-4 h-4" /></Link>
                                <Link href="#" className="bg-neutral-100 p-2.5 rounded-full hover:bg-neutral-100 transition-colors"><Twitter className="w-4 h-4" /></Link>
                                <Link href="#" className="bg-neutral-100 p-2.5 rounded-full hover:bg-neutral-100 transition-colors"><Instagram className="w-4 h-4" /></Link>
                                <Link href="#" className="bg-neutral-100 p-2.5 rounded-full hover:bg-neutral-100 transition-colors"><Linkedin className="w-4 h-4" /></Link>
                            </div>
                            <Button asChild className="bg-[#11b981] hover:bg-[#0ea472] text-white rounded-full px-6 py-5 font-bold text-base shadow-lg shadow-[#11b981]/30 w-full md:w-auto">
                                <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                    {foot.demoBooking}
                                </Link>
                            </Button>
                        </div>

                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-6">{foot.colProducts}</h4>
                            <ul className="space-y-3.5 text-slate-500">
                                <li><Link href="/screens" className="hover:text-neutral-900 transition-colors text-sm">{foot.products.outdoor}</Link></li>
                                <li><Link href="/screens" className="hover:text-neutral-900 transition-colors text-sm">{foot.products.digital}</Link></li>
                                <li><Link href="/static-billboards" className="hover:text-neutral-900 transition-colors text-sm">{foot.products.rental}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-6">{foot.colPlatform}</h4>
                            <ul className="space-y-3.5 text-slate-500">
                                <li><Link href="/platform/why-panobu" className="hover:text-neutral-900 transition-colors text-sm">{foot.platform.why}</Link></li>
                                <li><Link href="/platform/advantages" className="hover:text-neutral-900 transition-colors text-sm">{foot.platform.advantages}</Link></li>
                                <li><Link href="/platform/advertisers" className="hover:text-neutral-900 transition-colors text-sm">{foot.platform.advertisers}</Link></li>
                                <li><Link href="/platform/publishers" className="hover:text-neutral-900 transition-colors text-sm">{foot.platform.publishers}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-6">{foot.colCompany}</h4>
                            <ul className="space-y-3.5 text-slate-500">
                                <li><Link href="/company/about" className="hover:text-neutral-900 transition-colors text-sm">{foot.company.about}</Link></li>
                                <li><Link href="/company/careers" className="hover:text-neutral-900 transition-colors text-sm">{foot.company.careers}</Link></li>
                                <li><Link href="/blog" className="hover:text-neutral-900 transition-colors text-sm">{foot.company.blog}</Link></li>
                                <li><Link href="/updates" className="hover:text-neutral-900 transition-colors text-sm">{foot.company.updates}</Link></li>
                                <li><Link href="/company/help" className="hover:text-neutral-900 transition-colors text-sm">{foot.company.help}</Link></li>
                                <li><Link href="/legal/contact" className="hover:text-neutral-900 transition-colors text-sm">{foot.company.contact}</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-neutral-200 pt-8">
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 mb-4">
                            <Link href="/legal/privacy" className="hover:text-slate-400 transition-colors">{foot.legal.privacy}</Link>
                            <span>•</span>
                            <Link href="/legal/refund" className="hover:text-slate-400 transition-colors">{foot.legal.refund}</Link>
                            <span>•</span>
                            <Link href="/legal/terms" className="hover:text-slate-400 transition-colors">{foot.legal.terms}</Link>
                            <span>•</span>
                            <Link href="/legal/distance-sales" className="hover:text-slate-400 transition-colors">{foot.legal.distance}</Link>
                            <span>•</span>
                            <Link href="/legal/delivery" className="hover:text-slate-400 transition-colors">{foot.legal.delivery}</Link>
                            <span>•</span>
                            <Link href="/legal/contact" className="hover:text-slate-400 transition-colors">{foot.company.contact}</Link>
                        </div>
                        <div className="text-center text-slate-600 text-xs">
                            <p>{foot.copyright}</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
