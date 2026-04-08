"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Megaphone,
    CreditCard,
    Settings,
    LogOut,
    PlusCircle,
    Menu,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";

export default function AdvertiserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (typeof document === "undefined") return;
        const root = document.documentElement;
        if (isSidebarOpen) {
            root.style.overflow = "hidden";
        } else {
            root.style.overflow = "";
        }
        return () => {
            root.style.overflow = "";
        };
    }, [isSidebarOpen]);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/auth/login");
    }

    const navItems = [
        { href: "/app/advertiser/dashboard", label: "Genel Bakış", icon: LayoutDashboard },
        { href: "/app/advertiser/campaigns", label: "Kampanyalarım", icon: Megaphone },
        { href: "/app/advertiser/billing", label: "Ödemeler", icon: CreditCard },
        { href: "/app/advertiser/account", label: "Hesap", icon: Settings },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <div className="flex flex-1 relative">
                {/* Mobile top bar */}
                <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
                    <Link href="/" className="text-lg font-bold text-blue-600 truncate pr-2">
                        Panobu{" "}
                        <span className="text-xs text-slate-500 font-normal hidden sm:inline">
                            Reklamveren
                        </span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen((open) => !open)}
                        className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                        aria-expanded={isSidebarOpen}
                        aria-label={isSidebarOpen ? "Menüyü kapat" : "Menüyü aç"}
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </header>

                {/* Mobile overlay */}
                {isSidebarOpen && (
                    <button
                        type="button"
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        aria-label="Menüyü kapat"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`
                        fixed left-0 top-0 h-full w-64 max-w-[85vw] z-50
                        bg-white border-r border-slate-200 flex flex-col
                        transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        lg:translate-x-0
                        pt-14 lg:pt-0
                    `}
                >
                    <div className="hidden lg:block p-6 border-b border-slate-100 shrink-0">
                        <Link href="/" className="text-2xl font-bold text-blue-600 block">
                            Panobu <span className="text-xs text-slate-500 font-normal">Reklamveren</span>
                        </Link>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto min-h-0">
                        <div className="lg:hidden flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                            <span className="text-sm font-semibold text-slate-800">Menü</span>
                            <button
                                type="button"
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                                aria-label="Kapat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <Link
                            href="/app/advertiser/campaigns/new"
                            onClick={() => setIsSidebarOpen(false)}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-4"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Yeni Kampanya
                        </Link>

                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                            isActive
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 shrink-0" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="shrink-0 p-4 border-t border-slate-100 bg-white">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Çıkış Yap
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 w-full min-w-0 pt-14 lg:pt-0 lg:ml-64 flex flex-col">
                    <EmailVerificationBanner />
                    <div className="p-4 sm:p-6 md:p-8 flex-1 min-w-0">{children}</div>
                </main>
            </div>
        </div>
    );
}
