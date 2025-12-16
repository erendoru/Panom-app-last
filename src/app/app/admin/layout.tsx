"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShieldCheck,
    Users,
    Monitor,
    LogOut,
    LayoutGrid,
    CalendarDays
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
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
        { href: "/app/admin/dashboard", label: "Onay Bekleyenler", icon: ShieldCheck },
        { href: "/app/admin/panels", label: "Panolar", icon: LayoutGrid },
        { href: "/app/admin/availability", label: "Müsaitlik", icon: CalendarDays },
        { href: "/app/admin/users", label: "Kullanıcılar", icon: Users },
        { href: "/app/admin/screens", label: "Tüm Ekranlar", icon: Monitor },
    ];

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full z-10">
                <div className="p-6 border-b border-slate-800">
                    <Link href="/" className="text-2xl font-bold block">
                        Panobu <span className="text-xs text-slate-400 font-normal">Admin</span>
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
                                className={`flex items - center gap - 3 px - 4 py - 3 rounded - lg text - sm font - medium transition - colors ${isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    } `}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors"
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
