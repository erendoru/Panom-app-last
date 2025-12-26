"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Monitor, BarChart3, ShieldCheck, Zap, Globe, TrendingUp, Twitter, Instagram, Linkedin, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function LandingPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-black text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">
            {/* Navigation */}
            <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Panobu
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/static-billboards" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Klasik Panolar
                        </Link>
                        <Link href="/screens" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Dijital Billboard
                        </Link>
                        <Link href="/how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Nasıl Çalışır?
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3 md:gap-4">
                        <Link href="/auth/login" className="hidden sm:block text-sm font-medium text-white hover:text-blue-400 transition-colors">
                            Giriş Yap
                        </Link>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 md:px-6 text-sm">
                            <Link href="/auth/register">Hemen Başla</Link>
                        </Button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10"
                        >
                            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                                <Link
                                    href="/static-billboards"
                                    className="text-base font-medium text-slate-300 hover:text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Klasik Panolar
                                </Link>
                                <Link
                                    href="/screens"
                                    className="text-base font-medium text-slate-300 hover:text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Dijital Billboard
                                </Link>
                                <Link
                                    href="/how-it-works"
                                    className="text-base font-medium text-slate-300 hover:text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Nasıl Çalışır?
                                </Link>
                                <div className="border-t border-white/10 mt-2 pt-4">
                                    <Link
                                        href="/auth/login"
                                        className="text-base font-medium text-slate-300 hover:text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors block"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
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
                {/* Hero Section with Scroll Animation */}
                <section className="relative bg-black">
                    {/* Background Gradient Blob */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
                    {/* Looking for patterns... removed for cleanliness in 3D view but can keep if needed */}

                    <ContainerScroll>
                        <div className="relative w-full h-full">
                            <img
                                src="/images/dashboard-preview.jpeg"
                                alt="Panobu Dashboard"
                                className="w-full h-full object-cover rounded-2xl"
                            />

                            {/* Floating Elements (Badge) - Hidden on mobile */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="hidden md:flex absolute -right-20 top-1/4 bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl z-20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-green-500" />
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
                <section className="pt-10 md:pt-20 pb-20 border-y border-white/5 bg-white/5 backdrop-blur-sm relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { label: "Aktif Lokasyon", value: "100+" },
                                { label: "Şehir", value: "81" },
                                { label: "Reklam Formatı", value: "6+" },
                                { label: "Fiyat", value: "En Uygun" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                    <div className="text-slate-400">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Competitive Advantages - Neden Panobu? */}
                <section className="py-24 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Neden Panobu?</h2>
                            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                                Geleneksel outdoor reklam ajanslarıyla uğraşmayın. Panobu ile hızlı, şeffaf ve uygun fiyatlı reklam verin.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {[
                                {
                                    emoji: "⏱️",
                                    traditional: "Günlerce fiyat teklifi bekleme",
                                    panobu: "Anında fiyatları gör, hemen kirala"
                                },
                                {
                                    emoji: "💸",
                                    traditional: "Aracı komisyonları + gizli ücretler",
                                    panobu: "Direkt pano sahibinden, sıfır komisyon"
                                },
                                {
                                    emoji: "📞",
                                    traditional: "Her ajansı tek tek ara",
                                    panobu: "Tüm panolar tek platformda"
                                },
                                {
                                    emoji: "🎯",
                                    traditional: "Sadece büyük bütçeler kabul edilir",
                                    panobu: "En uygun fiyatlar ve boş tarih aralıklarıyla"
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                                >
                                    <div className="text-4xl mb-4">{item.emoji}</div>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <span className="text-red-400 text-xl flex-shrink-0">✗</span>
                                            <p className="text-slate-400 text-sm line-through">{item.traditional}</p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                                            <p className="text-white font-medium">{item.panobu}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-32 relative">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Geleceğin Reklamcılığı</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                                Geleneksel süreçleri unutun. Panobu ile dijital açıkhava reklamcılığı artık online reklam vermek kadar kolay.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: ShieldCheck,
                                    title: "Sabit & Şeffaf Fiyatlar",
                                    desc: "Her ajanstan fiyat almaya son! Tüm billboard ve ekranların fiyatları sabit ve şeffaf. Anında görün, anında kiralayın."
                                },
                                {
                                    icon: Zap,
                                    title: "Direkt Pano Sahibinden",
                                    desc: "Aracıya ödeme yapmayın. Panobu ile direkt ekran ve pano sahipleriyle çalışın, maliyetinizi düşürün."
                                },
                                {
                                    icon: Monitor,
                                    title: "Tüm Formatlar Tek Platformda",
                                    desc: "AVM ekranları, durak billboardları, bina kaplamaları, klasik ve dijital panolar - hepsi Panobu'da."
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    whileHover={{ y: -10 }}
                                    className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                                >
                                    <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-7 h-7 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-24 bg-white text-slate-900">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Panobu Nasıl Çalışır?</h2>
                            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                                Sadece 4 adımda reklamınızı şehrin en görünür noktalarına taşıyın.
                            </p>
                        </motion.div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                            <div className="space-y-12">
                                {[
                                    {
                                        step: "1",
                                        title: "Pano Lokasyonunu Seç",
                                        desc: "Panonun gözükmesini istediğin lokasyonu seç. İstediğin kadar çok ya da bütçenin yettiği kadar az lokasyon seçebilirsin."
                                    },
                                    {
                                        step: "2",
                                        title: "Bütçe ve Tarihleri Belirle",
                                        desc: "Kampanyanın süresini ve bütçeni belirle. Esnek seçenekler sunuyoruz."
                                    },
                                    {
                                        step: "3",
                                        title: "Pano Görsellerinizi Yükleyin",
                                        desc: "Hazırladığınız reklam görsellerini kolayca yükleyin. Gerekirse tasarım desteği de alabilirsiniz."
                                    },
                                    {
                                        step: "4",
                                        title: "Reklam Onayı İçin Bekleyin",
                                        desc: "Reklamınızı hızlıca inceleyip onaylıyoruz. Onay sonrası kampanyanız hemen başlıyor!"
                                    }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-6"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                            <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative h-[600px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-2xl"
                            >
                                <img
                                    src="/images/how-it-works-billboard.png"
                                    alt="Panobu Billboard"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>

                                {/* Badge 1: Top Right - Daily Impressions */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                                    className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl flex items-center gap-3 z-10"
                                >
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 font-medium">Günlük Gösterim</div>
                                        <div className="text-lg font-bold text-slate-900">45.2K</div>
                                    </div>
                                </motion.div>

                                {/* Badge 2: Bottom Left - Fast & Easy */}
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute bottom-4 md:bottom-12 left-4 md:left-8 bg-white/90 backdrop-blur-md px-3 md:px-5 py-2 md:py-3 rounded-full shadow-xl flex items-center gap-2 z-10"
                                >
                                    <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Zap className="w-3 md:w-4 h-3 md:h-4 text-blue-600" />
                                    </div>
                                    <span className="font-bold text-slate-800 text-sm md:text-base">Kolay & Hızlı</span>
                                </motion.div>

                                {/* Badge 3: Bottom Right - Trusted Price */}
                                <motion.div
                                    animate={{ y: [0, -12, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute bottom-16 md:bottom-24 right-4 md:right-8 bg-white/90 backdrop-blur-md px-3 md:px-5 py-2 md:py-3 rounded-full shadow-xl flex items-center gap-2 z-10"
                                >
                                    <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-purple-100 flex items-center justify-center">
                                        <ShieldCheck className="w-3 md:w-4 h-3 md:h-4 text-purple-600" />
                                    </div>
                                    <span className="font-bold text-slate-800 text-sm md:text-base">Güvenilir & Şeffaf</span>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Benefits Grid */}
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "💰 Her Ajanstan Fiyat Almaya Son",
                                    desc: "Tüm billboard ve ekranların fiyatları platformda görünür. Aracı firmalara zaman kaybetmeden direkt kiralayın."
                                },
                                {
                                    title: "🎯 Herkes İçin Uygun",
                                    desc: "Restaurant, emlakçı, showroom, kafe, berber, spor salonu - işletmenizin büyüklüğü fark etmez. Küçük bütçelerle bile reklam verin."
                                },
                                {
                                    title: "📍 Kocaeli'den İstanbul'a",
                                    desc: "Şu an Kocaeli'de aktif! İstanbul, İzmir ve tüm Türkiye'ye genişliyoruz. İlk kullanıcılarımıza özel avantajlar."
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow"
                                >
                                    <h3 className="text-lg font-bold mb-4 text-blue-900">{item.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-50"></div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="max-w-3xl mx-auto"
                        >
                            <h2 className="text-4xl md:text-6xl font-bold mb-8">Markanızı Şehre Duyurun</h2>
                            <p className="text-xl text-slate-300 mb-10">
                                Hemen ücretsiz hesabınızı oluşturun ve ilk kampanyanızı bugün başlatın.
                            </p>
                            <Button asChild size="lg" className="h-16 px-10 text-xl bg-white text-black hover:bg-slate-200 rounded-full">
                                <Link href="/auth/register">
                                    Şimdi Başla - Ücretsiz
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-950 text-white py-16 border-t border-white/10">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-6">
                            <Link href="/" className="text-3xl font-bold block tracking-tight">PANOBU</Link>
                            <div className="flex gap-4">
                                <Link href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><Globe className="w-5 h-5" /></Link>
                                <Link href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><Twitter className="w-5 h-5" /></Link>
                                <Link href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><Instagram className="w-5 h-5" /></Link>
                                <Link href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><Linkedin className="w-5 h-5" /></Link>
                            </div>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-6 font-bold text-lg shadow-lg shadow-blue-900/20 w-full md:w-auto">
                                <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                    Demo Rezervasyon
                                </Link>
                            </Button>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-6">Ürünler</h4>
                            <ul className="space-y-4 text-slate-400">
                                <li><Link href="/screens" className="hover:text-white transition-colors">Açık Hava Reklamcılığı</Link></li>
                                <li><Link href="/screens" className="hover:text-white transition-colors">Dijital Panolar</Link></li>
                                <li><Link href="/static-billboards" className="hover:text-white transition-colors">Billboard Kiralama</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-6">Platform</h4>
                            <ul className="space-y-4 text-slate-400">
                                <li><Link href="/platform/why-panobu" className="hover:text-white transition-colors">Neden Panobu Platformu?</Link></li>
                                <li><Link href="/platform/advantages" className="hover:text-white transition-colors">Panobu Avantajları</Link></li>
                                <li><Link href="/platform/advertisers" className="hover:text-white transition-colors">Reklam Verenler İçin</Link></li>
                                <li><Link href="/platform/publishers" className="hover:text-white transition-colors">Reklam Alanları İçin</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-6">Şirket</h4>
                            <ul className="space-y-4 text-slate-400">
                                <li><Link href="/company/about" className="hover:text-white transition-colors">Hakkımızda</Link></li>
                                <li><Link href="/company/careers" className="hover:text-white transition-colors">Kariyer</Link></li>
                                <li><Link href="/company/blog" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="/company/programmatic" className="hover:text-white transition-colors">Programatik Reklamcılık Merkezi</Link></li>
                                <li><Link href="/company/outdoor-center" className="hover:text-white transition-colors">Açık Hava Reklam Merkezi</Link></li>
                                <li><Link href="/company/help" className="hover:text-white transition-colors">Yardım Merkezi</Link></li>
                                <li><Link href="/company/privacy" className="hover:text-white transition-colors">Gizlilik Politikası</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 text-center text-slate-500 text-sm">
                        <p>&copy; 2025 Panobu. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
