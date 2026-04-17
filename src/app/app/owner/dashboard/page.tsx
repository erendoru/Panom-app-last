import Link from "next/link";
import {
    Monitor,
    Activity,
    Inbox,
    Gauge,
    ArrowRight,
    PlusCircle,
    CalendarDays,
    BarChart3,
    Store,
} from "lucide-react";
import { getOwnerProfile } from "@/lib/owner/profile";
import {
    getOwnerStats,
    getRecentRequests,
    getMonthlyRequestTrend,
    translateCampaignStatus,
    type RecentRequest,
} from "@/lib/owner/stats";
import RequestTrendChart from "./RequestTrendChart";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const TONE_CLASSES: Record<string, string> = {
    amber: "bg-amber-50 text-amber-700 border border-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    rose: "bg-rose-50 text-rose-700 border border-rose-200",
    sky: "bg-sky-50 text-sky-700 border border-sky-200",
    slate: "bg-slate-100 text-slate-700 border border-slate-200",
};

function formatDate(d: Date | null): string {
    if (!d) return "—";
    return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

function formatAmount(n: number | null): string {
    if (n == null) return "—";
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconBg,
    iconColor,
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
    iconColor: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start justify-between">
            <div>
                <p className="text-sm text-slate-500">{title}</p>
                <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
                {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
        </div>
    );
}

function RequestRow({ r }: { r: RecentRequest }) {
    const status = translateCampaignStatus(r.status);
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{r.advertiserName}</p>
                <p className="text-xs text-slate-500 truncate">
                    {r.unitName} · {formatDate(r.startDate)} — {formatDate(r.endDate)}
                </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-medium text-slate-600 hidden sm:inline">{formatAmount(r.amount)}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${TONE_CLASSES[status.tone]}`}>
                    {status.label}
                </span>
                <Link
                    href={`/app/owner/requests/${r.id}`}
                    className="text-xs font-medium text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
                >
                    Detay <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}

function QuickAction({
    href,
    icon: Icon,
    label,
    description,
}: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all flex items-start gap-3"
        >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{description}</p>
            </div>
        </Link>
    );
}

export default async function OwnerDashboardPage() {
    const profile = await getOwnerProfile();
    if (!profile) {
        return null;
    }

    const [stats, recentRequests, trend] = await Promise.all([
        getOwnerStats(profile.id),
        getRecentRequests(profile.id, 5),
        getMonthlyRequestTrend(profile.id),
    ]);

    const firstName = profile.name.split(" ")[0];

    return (
        <div className="space-y-6 lg:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <p className="text-sm text-slate-500">Hoşgeldiniz, {firstName}</p>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{profile.companyName}</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Ünitelerinizin durumunu ve gelen talepleri buradan takip edin.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/app/owner/units/new">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Ünite Ekle
                        </Button>
                    </Link>
                    <Link href="/app/owner/requests">
                        <Button variant="outline">
                            <Inbox className="w-4 h-4 mr-2" />
                            Gelen Talepler
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <StatCard
                    title="Toplam Ünite"
                    value={stats.totalUnits}
                    subtitle={`${stats.activeUnits} aktif`}
                    icon={Monitor}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-700"
                />
                <StatCard
                    title="Aktif Üniteler"
                    value={stats.activeUnits}
                    subtitle="Yayında olan üniteler"
                    icon={Activity}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-700"
                />
                <StatCard
                    title="Bu Ay Gelen Talepler"
                    value={stats.requestsLast30Days}
                    subtitle="Son 30 gün"
                    icon={Inbox}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-700"
                />
                <StatCard
                    title="Doluluk Oranı"
                    value={`${stats.occupancyPercent}%`}
                    subtitle="Önümüzdeki 4 hafta"
                    icon={Gauge}
                    iconBg="bg-violet-50"
                    iconColor="text-violet-700"
                />
            </div>

            {/* Chart + recent requests */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <section className="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-3">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">Talep Trendi</h2>
                            <p className="text-xs text-slate-500">Son 6 ay</p>
                        </div>
                    </div>
                    <RequestTrendChart data={trend} />
                </section>

                <section className="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">Son Talepler</h2>
                            <p className="text-xs text-slate-500">En yeni 5 kiralama talebi</p>
                        </div>
                        <Link
                            href="/app/owner/requests"
                            className="text-xs font-medium text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
                        >
                            Tümü <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {recentRequests.length === 0 ? (
                        <div className="py-10 text-center">
                            <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">Henüz bir talep yok.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {recentRequests.map((r) => (
                                <RequestRow key={r.id} r={r} />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Quick actions */}
            <section>
                <h2 className="text-sm font-semibold text-slate-900 mb-3">Hızlı Erişim</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <QuickAction
                        href="/app/owner/units"
                        icon={Monitor}
                        label="Ünitelerim"
                        description="Envanterinizi yönetin"
                    />
                    <QuickAction
                        href="/app/owner/calendar"
                        icon={CalendarDays}
                        label="Takvim"
                        description="Doluluk ve bloklama"
                    />
                    <QuickAction
                        href="/app/owner/reports"
                        icon={BarChart3}
                        label="Raporlar"
                        description="Gelir ve performans"
                    />
                    <QuickAction
                        href={profile.slug ? `/medya/${profile.slug}` : "/app/owner/settings"}
                        icon={Store}
                        label="Mağaza Görüntüle"
                        description={profile.slug ? `panobu.com/medya/${profile.slug}` : "Public mağaza için slug tanımlayın"}
                    />
                </div>
            </section>
        </div>
    );
}
