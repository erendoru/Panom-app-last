"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ShieldCheck,
    Users,
    Monitor,
    LogOut,
    LayoutGrid,
    CalendarDays,
    Menu,
    X,
    FileText,
    Sparkles,
    Zap,
    ShoppingBag,
    MapPin
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [pendingOrderCount, setPendingOrderCount] = useState(0);
    const [assignedCity, setAssignedCity] = useState<string | null>(null);

    // Close sidebar when route changes (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    // Fetch pending order count and user info
    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch pending orders
                const ordersRes = await fetch('/api/admin/orders/pending-count');
                if (ordersRes.ok) {
                    const data = await ordersRes.json();
                    setPendingOrderCount(data.count || 0);
                }

                // Fetch session info (me API returns session with assignedCity)
                const sessionRes = await fetch('/api/auth/me');
                if (sessionRes.ok) {
                    const sessionData = await sessionRes.json();
                    setAssignedCity(sessionData.user?.assignedCity || null);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        }

        fetchData();
        // Refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/auth/login");
    }

    const navItems = [
        { href: "/app/admin/dashboard", label: "Onay Bekleyenler", icon: ShieldCheck },
        { href: "/app/admin/orders", label: "Siparişler", icon: ShoppingBag, badge: pendingOrderCount },
        { href: "/app/admin/panels", label: "Panolar", icon: LayoutGrid },
        { href: "/app/admin/pricing-rules", label: "Fiyatlandırma", icon: Zap },
        { href: "/app/admin/availability", label: "Müsaitlik", icon: CalendarDays },
        { href: "/app/admin/users", label: "Kullanıcılar", icon: Users },
        { href: "/app/admin/screens", label: "Tüm Ekranlar", icon: Monitor },
        { href: "/app/admin/blog", label: "Blog", icon: FileText },
        { href: "/app/admin/updates", label: "Yenilikler", icon: Sparkles },
    ];

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Mobile Header - Only visible on mobile */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-30 flex items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold text-white">
                    Panobu <span className="text-xs text-slate-400 font-normal">Admin</span>
                </Link>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-white hover:bg-slate-800 rounded-lg transition-colors"
                    aria-label="Toggle menu"
                >
                    {isSidebarOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-20"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 h-full z-30 
                    bg-slate-900 text-white w-64 flex-shrink-0
                    transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                    pt-16 lg:pt-0
                `}
            >
                {/* Desktop Logo */}
                <div className="hidden lg:block p-6 border-b border-slate-800">
                    <Link href="/" className="text-2xl font-bold block">
                        Panobu <span className="text-xs text-slate-400 font-normal">Admin</span>
                    </Link>
                </div>

                {/* Regional Admin City Badge */}
                {assignedCity && (
                    <div className="mx-4 mt-4 px-4 py-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-blue-300">{assignedCity} Yöneticisi</span>
                        </div>
                    </div>
                )}

                <nav className={`p-4 space-y-1 ${assignedCity ? 'pt-2' : ''}`}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="flex-1">{item.label}</span>
                                {item.badge && item.badge > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
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
            <main className="flex-1 pt-16 lg:pt-0 lg:ml-64">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
