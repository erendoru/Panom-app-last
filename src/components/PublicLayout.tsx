"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Globe, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PublicLayoutProps {
    children: React.ReactNode;
    activeLink?: "anasayfa" | "klasik" | "dijital" | "nasil" | "blog" | "yenilikler";
}

export default function PublicLayout({ children, activeLink }: PublicLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Anasayfa", key: "anasayfa" },
        { href: "/static-billboards", label: "Klasik Panolar", key: "klasik" },
        { href: "/screens", label: "Dijital Billboard", key: "dijital" },
        { href: "/how-it-works", label: "Nasıl Çalışır?", key: "nasil" },
        { href: "/blog", label: "Blog", key: "blog" },
        { href: "/updates", label: "Yenilikler", key: "yenilikler" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            {/* Navigation */}
            <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Panobu
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.key}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${activeLink === link.key ? "text-white" : "text-slate-300 hover:text-white"}`}
                            >
                                {link.label}
                            </Link>
                        ))}
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
                            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
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
                            className="lg:hidden bg-black/95 backdrop-blur-lg border-t border-white/10"
                        >
                            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.key}
                                        href={link.href}
                                        className={`text-base font-medium py-3 px-4 rounded-lg transition-colors ${activeLink === link.key ? "text-white bg-white/10" : "text-slate-300 hover:text-white hover:bg-white/10"}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
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

            {/* Main Content */}
            <main className="flex-1 pt-16 md:pt-20">
                {children}
            </main>

            {/* Footer */}
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
                                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="/updates" className="hover:text-white transition-colors">Yenilikler</Link></li>
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
