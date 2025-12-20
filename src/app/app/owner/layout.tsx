"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Monitor,
    Wallet,
    Settings,
    LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";

export default function OwnerLayout({
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
        { href: "/app/owner/dashboard", label: "Panel", icon: LayoutDashboard },
        { href: "/app/owner/screens", label: "Ekranlarım", icon: Monitor },
        { href: "/app/owner/finance", label: "Kazançlar", icon: Wallet },
        { href: "/app/owner/account", label: "Hesap", icon: Settings },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Email Verification Banner */}
            <EmailVerificationBanner />

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-10">
                    <div className="p-6 border-b border-slate-100">
                        <Link href="/" className="text-2xl font-bold text-blue-600 block">
                            Panobu <span className="text-xs text-slate-500 font-normal">Partner</span>
                        </Link>
                    </div>
                    <nav className="p-4 space-y-1">
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
        </div>
    );
}
