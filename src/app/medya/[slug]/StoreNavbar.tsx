"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Building2, ShoppingBag, Phone } from "lucide-react";
import { useStore } from "./StoreContext";

export default function StoreNavbar() {
    const { owner, selected } = useStore();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const base = `/medya/${owner.slug}`;
    const links = [
        { href: base, label: "Anasayfa" },
        { href: `${base}/panolar`, label: "Panoları Görüntüle" },
        { href: `${base}/teklif`, label: "Teklif Al" },
        { href: `${base}/iletisim`, label: "İletişim" },
    ];

    const isActive = (href: string) => {
        if (href === base) return pathname === base;
        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-6">
                {/* Logo / brand */}
                <Link href={base} className="flex items-center gap-2 min-w-0 shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                        {owner.logoUrl ? (
                            <Image
                                src={owner.logoUrl}
                                alt={owner.companyName}
                                width={36}
                                height={36}
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <Building2 className="w-5 h-5 text-slate-400" />
                        )}
                    </div>
                    <span className="font-semibold text-slate-900 truncate">{owner.companyName}</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1 flex-1">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                                isActive(l.href)
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Right actions */}
                <div className="hidden md:flex items-center gap-2 ml-auto">
                    {owner.phone && (
                        <a
                            href={`tel:${owner.phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <Phone className="w-4 h-4" />
                            <span className="hidden lg:inline">{owner.phone}</span>
                        </a>
                    )}
                    <Link
                        href={`${base}/teklif`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 relative"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Teklif İste
                        {selected.length > 0 && (
                            <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full bg-emerald-500 text-white font-semibold">
                                {selected.length}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden ml-auto p-2 rounded-lg border border-slate-200"
                    onClick={() => setMobileOpen((v) => !v)}
                    aria-label="Menü"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {mobileOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white">
                    <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                                    isActive(l.href)
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                {l.label}
                            </Link>
                        ))}
                        <div className="pt-2 flex flex-wrap gap-2">
                            {owner.phone && (
                                <a
                                    href={`tel:${owner.phone}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700"
                                >
                                    <Phone className="w-4 h-4" />
                                    {owner.phone}
                                </a>
                            )}
                            <Link
                                href={`${base}/teklif`}
                                onClick={() => setMobileOpen(false)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Teklif İste
                                {selected.length > 0 && (
                                    <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full bg-emerald-500 text-white font-semibold">
                                        {selected.length}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
