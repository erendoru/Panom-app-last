"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Megaphone,
    CreditCard,
    Settings,
    LogOut,
    PlusCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdvertiserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

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
        <div className="min-h-screen flex bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-10">
                <div className="p-6 border-b border-slate-100">
                    <Link href="/" className="text-2xl font-bold text-blue-600 block">
                        Panobu <span className="text-xs text-slate-500 font-normal">Reklamveren</span>
                    </Link>
                </div>

                <div className="p-4">
                    <Link href="/app/advertiser/campaigns/new">
                        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-4">
                            <PlusCircle className="w-4 h-4" />
                            Yeni Kampanya
                        </button>
                    </Link>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
