"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Monitor,
    PlusSquare,
    Inbox,
    CalendarDays,
    BarChart3,
    Store,
    Settings,
    LogOut,
    Bell,
    Menu as MenuIcon,
    X as XIcon,
    ChevronDown,
    Building2,
    ShieldAlert,
    ExternalLink,
} from "lucide-react";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import type { OwnerProfileSummary } from "@/lib/owner/profile";

type Props = {
    profile: OwnerProfileSummary;
    children: React.ReactNode;
};

const navItems = [
    { href: "/app/owner/dashboard", label: "Ana Sayfa", icon: LayoutDashboard },
    { href: "/app/owner/units", label: "Ünitelerim", icon: Monitor },
    { href: "/app/owner/units/new", label: "Ünite Ekle", icon: PlusSquare },
    { href: "/app/owner/requests", label: "Gelen Talepler", icon: Inbox },
    { href: "/app/owner/calendar", label: "Takvim", icon: CalendarDays },
    { href: "/app/owner/reports", label: "Raporlar", icon: BarChart3 },
    { href: "/app/owner/store", label: "Mağaza Görüntüle", icon: Store },
    { href: "/app/owner/settings", label: "Ayarlar", icon: Settings },
];

function initials(name: string): string {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "M";
}

function Sidebar({
    profile,
    pathname,
    onClose,
    onLogout,
}: {
    profile: OwnerProfileSummary;
    pathname: string;
    onClose?: () => void;
    onLogout: () => void;
}) {
    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-blue-600 block" onClick={onClose}>
                    Panobu <span className="text-xs text-slate-500 font-normal">Partner</span>
                </Link>
                {onClose && (
                    <button
                        onClick={onClose}
                        aria-label="Menüyü kapat"
                        className="lg:hidden p-1 rounded hover:bg-slate-100 text-slate-500"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                )}
            </div>

            <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        item.href === "/app/owner/dashboard"
                            ? pathname === item.href
                            : pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                {profile.slug ? (
                    <Link
                        href={`/medya/${profile.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Public mağaza
                    </Link>
                ) : null}
                <button
                    onClick={onLogout}
                    className="mt-1 flex items-center gap-2 px-3 py-2 w-full text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                </button>
            </div>
        </aside>
    );
}

export default function OwnerShell({ profile, children }: Props) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    useEffect(() => {
        setMobileOpen(false);
        setProfileMenuOpen(false);
    }, [pathname]);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/auth/login");
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Desktop sidebar */}
            <div className="hidden lg:flex fixed inset-y-0 left-0 z-20">
                <Sidebar profile={profile} pathname={pathname} onLogout={handleLogout} />
            </div>

            {/* Mobile sidebar */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
                    <div
                        className="absolute inset-0 bg-slate-900/50"
                        onClick={() => setMobileOpen(false)}
                        aria-hidden
                    />
                    <div className="absolute left-0 top-0 h-full shadow-xl">
                        <Sidebar
                            profile={profile}
                            pathname={pathname}
                            onClose={() => setMobileOpen(false)}
                            onLogout={handleLogout}
                        />
                    </div>
                </div>
            )}

            {/* Main column */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
                <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
                    <div className="h-16 px-4 lg:px-8 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden p-2 -ml-2 rounded-md hover:bg-slate-100 text-slate-600"
                                aria-label="Menüyü aç"
                            >
                                <MenuIcon className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-500 shrink-0">
                                    {profile.logoUrl ? (
                                        <Image
                                            src={profile.logoUrl}
                                            alt={profile.companyName}
                                            width={36}
                                            height={36}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <Building2 className="w-4 h-4" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                        {profile.companyName}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate hidden sm:block">
                                        Medya Sahibi Paneli
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600"
                                aria-label="Bildirimler"
                            >
                                <Bell className="w-5 h-5" />
                                {/* Bildirim sayısı bağlanınca gösterilecek */}
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen((v) => !v)}
                                    className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-full hover:bg-slate-100"
                                    aria-haspopup="menu"
                                    aria-expanded={profileMenuOpen}
                                >
                                    <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
                                        {initials(profile.name)}
                                    </span>
                                    <span className="hidden sm:block text-sm font-medium text-slate-800">
                                        {profile.name.split(" ")[0]}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-slate-500" />
                                </button>

                                {profileMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setProfileMenuOpen(false)}
                                            aria-hidden
                                        />
                                        <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1.5 text-sm">
                                            <div className="px-3 py-2 border-b border-slate-100">
                                                <p className="font-medium text-slate-900 truncate">{profile.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{profile.email}</p>
                                            </div>
                                            <Link
                                                href="/app/owner/settings"
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                <Settings className="w-4 h-4" /> Firma ayarları
                                            </Link>
                                            {profile.slug && (
                                                <Link
                                                    href={`/medya/${profile.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700"
                                                    onClick={() => setProfileMenuOpen(false)}
                                                >
                                                    <Store className="w-4 h-4" /> Mağazayı görüntüle
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 px-3 py-2 w-full text-left text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="w-4 h-4" /> Çıkış yap
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {!profile.approved && (
                        <div className="bg-amber-50 border-t border-amber-100 text-amber-800 px-4 lg:px-8 py-2 flex items-start gap-2 text-xs">
                            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>
                                Firma profiliniz onay aşamasında. Onaylanana kadar ünitelerinize gelen talepler Panobu ekibi tarafından incelenir.
                            </span>
                        </div>
                    )}
                </header>

                <EmailVerificationBanner />

                <main className="flex-1 p-4 lg:p-8 min-w-0">{children}</main>
            </div>
        </div>
    );
}
