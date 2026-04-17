"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CalendarRange,
    Coins,
    Download,
    FileSpreadsheet,
    Gauge,
    Inbox,
    Loader2,
    TrendingUp,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    OccupancyHorizontalBar,
    PanelTypePie,
    RevenueBarChart,
    StatusPie,
} from "./ReportCharts";

type PeriodKey = "this_month" | "last_3m" | "last_6m" | "this_year" | "custom";

type Report = {
    period: { key: PeriodKey; label: string; start: string; end: string };
    kpis: {
        totalRevenue: number;
        netRevenue: number;
        commission: number;
        rentalCount: number;
        avgOccupancyPercent: number;
        topUnit: { name: string; revenue: number; rentals: number } | null;
    };
    monthly: {
        key: string;
        label: string;
        gross: number;
        commission: number;
        net: number;
        rentals: number;
    }[];
    units: {
        id: string;
        name: string;
        city: string;
        district: string;
        type: string;
        rentalCount: number;
        revenue: number;
        occupancyPercent: number;
        topCustomer: string | null;
    }[];
    statusDistribution: { PENDING: number; APPROVED: number; REJECTED: number };
    panelTypeRevenue: { type: string; revenue: number; rentalCount: number }[];
    topCustomers: { name: string; revenue: number; rentalCount: number }[];
};

const PERIOD_TABS: { key: PeriodKey; label: string }[] = [
    { key: "this_month", label: "Bu ay" },
    { key: "last_3m", label: "Son 3 ay" },
    { key: "last_6m", label: "Son 6 ay" },
    { key: "this_year", label: "Bu yıl" },
    { key: "custom", label: "Özel" },
];

function fmtCurrency(n: number) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
    }).format(n);
}

function fmtDate(d: string | Date) {
    return new Date(d).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function toIsoDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
    const esc = (v: string | number) => {
        const s = String(v ?? "");
        if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
        return s;
    };
    // UTF-8 BOM + CSV — Excel Türkçe karakter uyumu için
    const csv = "\uFEFF" + rows.map((r) => r.map(esc).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function OwnerReportsClient() {
    const [periodKey, setPeriodKey] = useState<PeriodKey>("last_3m");
    const [customFrom, setCustomFrom] = useState<string>(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        d.setDate(1);
        return toIsoDate(d);
    });
    const [customTo, setCustomTo] = useState<string>(() => toIsoDate(new Date()));

    const [data, setData] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setErr(null);
        try {
            const params = new URLSearchParams({ period: periodKey });
            if (periodKey === "custom") {
                params.set("from", customFrom);
                params.set("to", customTo);
            }
            const res = await fetch(`/api/owner/reports?${params.toString()}`, {
                cache: "no-store",
            });
            if (!res.ok) {
                const e = await res.json().catch(() => ({}));
                throw new Error(e?.error || "Rapor yüklenemedi");
            }
            const json = (await res.json()) as Report;
            setData(json);
        } catch (e: any) {
            setErr(e?.message || "Hata");
        } finally {
            setLoading(false);
        }
    }, [periodKey, customFrom, customTo]);

    useEffect(() => {
        load();
    }, [load]);

    const periodLabel = useMemo(() => {
        if (!data) return "";
        return `${fmtDate(data.period.start)} → ${fmtDate(data.period.end)}`;
    }, [data]);

    function exportUnitsCsv() {
        if (!data) return;
        const rows: (string | number)[][] = [
            [
                "Ünite",
                "Şehir",
                "İlçe",
                "Tip",
                "Kiralama sayısı",
                "Gelir (TL)",
                "Doluluk %",
                "En çok kiralayan",
            ],
        ];
        data.units.forEach((u) =>
            rows.push([
                u.name,
                u.city,
                u.district,
                u.type,
                u.rentalCount,
                u.revenue.toFixed(2),
                u.occupancyPercent,
                u.topCustomer || "",
            ])
        );
        downloadCsv(`unite-raporu_${data.period.key}.csv`, rows);
    }

    function exportMonthlyCsv() {
        if (!data) return;
        const rows: (string | number)[][] = [
            ["Ay", "Kiralama sayısı", "Brüt gelir (TL)", "Komisyon (TL)", "Net gelir (TL)"],
        ];
        data.monthly.forEach((m) =>
            rows.push([
                m.label,
                m.rentals,
                m.gross.toFixed(2),
                m.commission.toFixed(2),
                m.net.toFixed(2),
            ])
        );
        downloadCsv(`gelir-raporu_${data.period.key}.csv`, rows);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Raporlar</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Gelir, doluluk ve talep performansınızı dönem bazında analiz edin.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarRange className="w-4 h-4" />
                    {periodLabel || "—"}
                </div>
            </div>

            {/* Period tabs */}
            <div className="bg-white border border-slate-200 rounded-xl p-3">
                <div className="flex flex-wrap items-center gap-2">
                    {PERIOD_TABS.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setPeriodKey(t.key)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                periodKey === t.key
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                    {periodKey === "custom" && (
                        <div className="flex items-center gap-2 ml-1">
                            <input
                                type="date"
                                value={customFrom}
                                onChange={(e) => setCustomFrom(e.target.value)}
                                className="border border-slate-300 rounded-lg px-2 py-1 text-sm"
                            />
                            <span className="text-slate-400">→</span>
                            <input
                                type="date"
                                value={customTo}
                                onChange={(e) => setCustomTo(e.target.value)}
                                className="border border-slate-300 rounded-lg px-2 py-1 text-sm"
                            />
                        </div>
                    )}
                </div>
            </div>

            {err && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-lg p-3 text-sm">
                    {err}
                </div>
            )}

            {loading || !data ? (
                <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
                    <Loader2 className="w-5 h-5 inline animate-spin mr-2" /> Hesaplanıyor...
                </div>
            ) : (
                <>
                    {/* KPI cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <KpiCard
                            title="Toplam Gelir (brüt)"
                            value={fmtCurrency(data.kpis.totalRevenue)}
                            subtitle={`Net: ${fmtCurrency(data.kpis.netRevenue)}`}
                            icon={Coins}
                            accent="emerald"
                        />
                        <KpiCard
                            title="Kiralama Sayısı"
                            value={data.kpis.rentalCount.toString()}
                            subtitle="Onaylı rezervasyonlar"
                            icon={Inbox}
                            accent="blue"
                        />
                        <KpiCard
                            title="Ortalama Doluluk"
                            value={`${data.kpis.avgOccupancyPercent}%`}
                            subtitle="Dönem boyunca"
                            icon={Gauge}
                            accent="violet"
                        />
                        <KpiCard
                            title="En Çok Talep Alan"
                            value={data.kpis.topUnit?.name || "—"}
                            subtitle={
                                data.kpis.topUnit
                                    ? `${data.kpis.topUnit.rentals} kiralama · ${fmtCurrency(data.kpis.topUnit.revenue)}`
                                    : "Bu dönemde onaylı kiralama yok"
                            }
                            icon={TrendingUp}
                            accent="amber"
                        />
                    </div>

                    {/* Monthly revenue */}
                    <section className="bg-white border border-slate-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    Aylık Gelir Trendi
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Brüt ve net gelir (komisyon düşüldükten sonra)
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportMonthlyCsv}
                                disabled={!data.monthly.length}
                            >
                                <Download className="w-4 h-4 mr-1" /> CSV
                            </Button>
                        </div>
                        <RevenueBarChart
                            data={data.monthly.map((m) => ({
                                label: m.label,
                                gross: m.gross,
                                net: m.net,
                            }))}
                        />
                    </section>

                    {/* Charts grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <section className="bg-white border border-slate-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">
                                Ünite Bazlı Doluluk
                            </h3>
                            <p className="text-xs text-slate-500 mb-3">En dolu 10 ünite</p>
                            <OccupancyHorizontalBar
                                data={data.units.map((u) => ({
                                    id: u.id,
                                    name: u.name,
                                    occupancyPercent: u.occupancyPercent,
                                }))}
                            />
                        </section>

                        <section className="bg-white border border-slate-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">
                                Talep Durum Dağılımı
                            </h3>
                            <p className="text-xs text-slate-500 mb-3">
                                Dönemle kesişen tüm talepler
                            </p>
                            <StatusPie data={data.statusDistribution} />
                        </section>

                        <section className="bg-white border border-slate-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">
                                Pano Tipi Bazlı Gelir
                            </h3>
                            <p className="text-xs text-slate-500 mb-3">Brüt gelir payı</p>
                            <PanelTypePie data={data.panelTypeRevenue} />
                        </section>
                    </div>

                    {/* Unit table + top customers */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between p-5 border-b border-slate-100">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        Ünite Bazlı Rapor
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Dönem içi kiralama ve gelir performansı
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={exportUnitsCsv}
                                    disabled={!data.units.length}
                                >
                                    <FileSpreadsheet className="w-4 h-4 mr-1" /> CSV
                                </Button>
                            </div>
                            {data.units.length === 0 ? (
                                <div className="p-10 text-center text-sm text-slate-500">
                                    Henüz ünite yok.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
                                            <tr>
                                                <th className="text-left px-5 py-2 font-medium">Ünite</th>
                                                <th className="text-left px-5 py-2 font-medium">Konum</th>
                                                <th className="text-right px-5 py-2 font-medium">Kiralama</th>
                                                <th className="text-right px-5 py-2 font-medium">Gelir</th>
                                                <th className="text-right px-5 py-2 font-medium">Doluluk</th>
                                                <th className="text-left px-5 py-2 font-medium">
                                                    En çok kiralayan
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {data.units.map((u) => (
                                                <tr key={u.id} className="hover:bg-slate-50">
                                                    <td className="px-5 py-3">
                                                        <div className="font-medium text-slate-900">
                                                            {u.name}
                                                        </div>
                                                        <div className="text-xs text-slate-500">{u.type}</div>
                                                    </td>
                                                    <td className="px-5 py-3 text-slate-600">
                                                        {u.city}
                                                        {u.district ? ` · ${u.district}` : ""}
                                                    </td>
                                                    <td className="px-5 py-3 text-right tabular-nums">
                                                        {u.rentalCount}
                                                    </td>
                                                    <td className="px-5 py-3 text-right font-semibold text-slate-900 tabular-nums">
                                                        {fmtCurrency(u.revenue)}
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        <div className="inline-flex items-center gap-2">
                                                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-violet-500"
                                                                    style={{ width: `${u.occupancyPercent}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-slate-700 tabular-nums w-10 text-right">
                                                                {u.occupancyPercent}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3 text-slate-700">
                                                        {u.topCustomer || "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                        <section className="bg-white border border-slate-200 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="w-4 h-4 text-slate-500" />
                                <h3 className="text-base font-semibold text-slate-900">
                                    En Çok Kiralayan Müşteriler
                                </h3>
                            </div>
                            {data.topCustomers.length === 0 ? (
                                <div className="text-sm text-slate-500 py-8 text-center">
                                    Henüz veri yok.
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100 -mx-1">
                                    {data.topCustomers.map((c, i) => (
                                        <li
                                            key={c.name + i}
                                            className="flex items-center justify-between py-2.5 px-1"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                                                        {i + 1}
                                                    </span>
                                                    <span className="font-medium text-slate-900 truncate">
                                                        {c.name}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-500 ml-7">
                                                    {c.rentalCount} kiralama
                                                </div>
                                            </div>
                                            <div className="text-sm font-semibold text-slate-900 tabular-nums ml-3">
                                                {fmtCurrency(c.revenue)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>

                    {/* Monthly breakdown table */}
                    <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900">
                                    Aylık Gelir Breakdown
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Brüt, Panobu komisyonu ve net gelir
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportMonthlyCsv}
                                disabled={!data.monthly.length}
                            >
                                <FileSpreadsheet className="w-4 h-4 mr-1" /> CSV
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
                                    <tr>
                                        <th className="text-left px-5 py-2 font-medium">Ay</th>
                                        <th className="text-right px-5 py-2 font-medium">
                                            Kiralama
                                        </th>
                                        <th className="text-right px-5 py-2 font-medium">Brüt</th>
                                        <th className="text-right px-5 py-2 font-medium">
                                            Komisyon
                                        </th>
                                        <th className="text-right px-5 py-2 font-medium">Net</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.monthly.map((m) => (
                                        <tr key={m.key} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-medium text-slate-900">
                                                {m.label}
                                            </td>
                                            <td className="px-5 py-3 text-right tabular-nums">
                                                {m.rentals}
                                            </td>
                                            <td className="px-5 py-3 text-right tabular-nums">
                                                {fmtCurrency(m.gross)}
                                            </td>
                                            <td className="px-5 py-3 text-right tabular-nums text-rose-700">
                                                −{fmtCurrency(m.commission)}
                                            </td>
                                            <td className="px-5 py-3 text-right tabular-nums font-semibold text-emerald-700">
                                                {fmtCurrency(m.net)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-slate-50 font-semibold">
                                        <td className="px-5 py-3">Toplam</td>
                                        <td className="px-5 py-3 text-right tabular-nums">
                                            {data.kpis.rentalCount}
                                        </td>
                                        <td className="px-5 py-3 text-right tabular-nums">
                                            {fmtCurrency(data.kpis.totalRevenue)}
                                        </td>
                                        <td className="px-5 py-3 text-right tabular-nums text-rose-700">
                                            −{fmtCurrency(data.kpis.commission)}
                                        </td>
                                        <td className="px-5 py-3 text-right tabular-nums text-emerald-700">
                                            {fmtCurrency(data.kpis.netRevenue)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

function KpiCard({
    title,
    value,
    subtitle,
    icon: Icon,
    accent,
}: {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: "emerald" | "blue" | "violet" | "amber";
}) {
    const map: Record<typeof accent, { bg: string; fg: string }> = {
        emerald: { bg: "bg-emerald-50", fg: "text-emerald-700" },
        blue: { bg: "bg-blue-50", fg: "text-blue-700" },
        violet: { bg: "bg-violet-50", fg: "text-violet-700" },
        amber: { bg: "bg-amber-50", fg: "text-amber-700" },
    } as const;
    const c = map[accent];
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start justify-between gap-3">
            <div className="min-w-0">
                <p className="text-sm text-slate-500">{title}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900 truncate">{value}</p>
                {subtitle && (
                    <p className="mt-0.5 text-xs text-slate-500 truncate">{subtitle}</p>
                )}
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${c.bg}`}>
                <Icon className={`w-5 h-5 ${c.fg}`} />
            </div>
        </div>
    );
}
