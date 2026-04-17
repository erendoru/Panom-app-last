"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Globe, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CartProvider } from "@/contexts/CartContext";
import { useAppLocale } from "@/contexts/LocaleContext";
import CartIcon from "@/components/CartIcon";
import LanguageToggle from "@/components/LanguageToggle";
import { navLabel, type PublicNavKey } from "@/messages/publicNav";
import { footerCopy } from "@/messages/footer";

interface PublicLayoutProps {
    children: React.ReactNode;
    activeLink?: "anasayfa" | "klasik" | "dijital" | "nasil" | "blog" | "yenilikler";
}

const NAV_DEF: { href: string; key: PublicLayoutProps["activeLink"]; msg: PublicNavKey }[] = [
    { href: "/", key: "anasayfa", msg: "home" },
    { href: "/static-billboards", key: "klasik", msg: "classic" },
    { href: "/screens", key: "dijital", msg: "digital" },
    { href: "/how-it-works", key: "nasil", msg: "howItWorks" },
    { href: "/blog", key: "blog", msg: "blog" },
    { href: "/updates", key: "yenilikler", msg: "updates" },
];

export default function PublicLayout({ children, activeLink }: PublicLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { locale } = useAppLocale();
    const foot = footerCopy(locale);

    const navLinks = NAV_DEF.map((row) => ({
        ...row,
        label: navLabel(locale, row.msg),
    }));

    return (
        <CartProvider>
        <div className="min-h-screen flex flex-col bg-white text-neutral-900">
            <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-200 shadow-sm">
                <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-neutral-900 tracking-tight">
                        Panobu
                    </Link>

                    <nav className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.key}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${
                                    activeLink === link.key
                                        ? "text-neutral-900"
                                        : "text-neutral-600 hover:text-neutral-900"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <LanguageToggle className="shrink-0" />
                        <CartIcon />
                        <Link
                            href="/auth/login"
                            className="hidden sm:block text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                            {navLabel(locale, "login")}
                        </Link>
                        <Button asChild className="bg-[#11b981] hover:bg-[#0ea472] text-white rounded-full px-4 md:px-6 text-sm shadow-sm shadow-[#11b981]/20">
                            <Link href="/auth/register">{navLabel(locale, "getStarted")}</Link>
                        </Button>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
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
                            className="lg:hidden bg-white border-t border-neutral-200 shadow-md"
                        >
                            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.key}
                                        href={link.href}
                                        className={`text-base font-medium py-3 px-4 rounded-lg transition-colors ${
                                            activeLink === link.key
                                                ? "text-neutral-900 bg-neutral-100"
                                                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="border-t border-neutral-200 mt-2 pt-4">
                                    <Link
                                        href="/auth/login"
                                        className="text-base font-medium text-neutral-600 hover:text-neutral-900 py-3 px-4 rounded-lg hover:bg-neutral-50 transition-colors block"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {navLabel(locale, "login")}
                                    </Link>
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="flex-1 pt-16 md:pt-20">{children}</main>

            <footer className="bg-neutral-50 text-neutral-900 py-16 border-t border-neutral-200">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-6">
                            <Link href="/" className="text-3xl font-bold block tracking-tight text-neutral-900">
                                PANOBU
                            </Link>
                            <div className="flex gap-4">
                                <Link
                                    href="#"
                                    className="bg-neutral-200/80 p-2 rounded-full text-neutral-700 hover:bg-neutral-300 transition-colors"
                                >
                                    <Globe className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="#"
                                    className="bg-neutral-200/80 p-2 rounded-full text-neutral-700 hover:bg-neutral-300 transition-colors"
                                >
                                    <Twitter className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="#"
                                    className="bg-neutral-200/80 p-2 rounded-full text-neutral-700 hover:bg-neutral-300 transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="#"
                                    className="bg-neutral-200/80 p-2 rounded-full text-neutral-700 hover:bg-neutral-300 transition-colors"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </Link>
                            </div>
                            <Button
                                asChild
                                className="bg-[#11b981] hover:bg-[#0ea472] text-white rounded-full px-6 py-6 font-bold text-lg w-full md:w-auto shadow-md shadow-[#11b981]/25"
                            >
                                <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                                    {foot.demoBooking}
                                </Link>
                            </Button>
                        </div>

                        <div>
                            <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-500 mb-6">{foot.colProducts}</h4>
                            <ul className="space-y-4 text-neutral-600">
                                <li>
                                    <Link href="/screens" className="hover:text-neutral-900 transition-colors">
                                        {foot.products.outdoor}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/screens" className="hover:text-neutral-900 transition-colors">
                                        {foot.products.digital}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/static-billboards" className="hover:text-neutral-900 transition-colors">
                                        {foot.products.rental}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-500 mb-6">{foot.colPlatform}</h4>
                            <ul className="space-y-4 text-neutral-600">
                                <li>
                                    <Link href="/platform/why-panobu" className="hover:text-neutral-900 transition-colors">
                                        {foot.platform.why}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/platform/advantages" className="hover:text-neutral-900 transition-colors">
                                        {foot.platform.advantages}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/platform/advertisers" className="hover:text-neutral-900 transition-colors">
                                        {foot.platform.advertisers}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/platform/publishers" className="hover:text-neutral-900 transition-colors">
                                        {foot.platform.publishers}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-500 mb-6">{foot.colCompany}</h4>
                            <ul className="space-y-4 text-neutral-600">
                                <li>
                                    <Link href="/company/about" className="hover:text-neutral-900 transition-colors">
                                        {foot.company.about}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/company/careers" className="hover:text-neutral-900 transition-colors">
                                        {foot.company.careers}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog" className="hover:text-neutral-900 transition-colors">
                                        {foot.company.blog}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/updates" className="hover:text-neutral-900 transition-colors">
                                        {foot.company.updates}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/company/help" className="hover:text-neutral-900 transition-colors">
                                        {foot.company.help}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/legal/contact" className="hover:text-neutral-900 transition-colors">
                                        {foot.company.contact}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 py-6 border-t border-b border-neutral-200 mb-6">
                        <img
                            src="/images/payment-methods.png"
                            alt={foot.paymentAlt}
                            className="h-8"
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-500 mb-6">
                        <Link href="/legal/privacy" className="hover:text-neutral-900 transition-colors">
                            {foot.legal.privacy}
                        </Link>
                        <span className="text-neutral-300">•</span>
                        <Link href="/legal/refund" className="hover:text-neutral-900 transition-colors">
                            {foot.legal.refund}
                        </Link>
                        <span className="text-neutral-300">•</span>
                        <Link href="/legal/terms" className="hover:text-neutral-900 transition-colors">
                            {foot.legal.terms}
                        </Link>
                        <span className="text-neutral-300">•</span>
                        <Link href="/legal/distance-sales" className="hover:text-neutral-900 transition-colors">
                            {foot.legal.distance}
                        </Link>
                        <span className="text-neutral-300">•</span>
                        <Link href="/legal/delivery" className="hover:text-neutral-900 transition-colors">
                            {foot.legal.delivery}
                        </Link>
                        <span className="text-neutral-300">•</span>
                        <Link href="/legal/contact" className="hover:text-neutral-900 transition-colors">
                            {foot.company.contact}
                        </Link>
                    </div>

                    <div className="text-center text-neutral-500 text-sm">
                        <p>{foot.copyright}</p>
                    </div>
                </div>
            </footer>
        </div>
        </CartProvider>
    );
}
