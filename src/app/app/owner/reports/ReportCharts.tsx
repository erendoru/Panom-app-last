"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const CHART_COLORS = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#0ea5e9",
    "#ec4899",
    "#84cc16",
];

function fmtCurrencyShort(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M₺`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)} K₺`;
    return `${Math.round(n)}₺`;
}

function fmtCurrencyFull(n: number): string {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
    }).format(n);
}

export function RevenueBarChart({
    data,
}: {
    data: { label: string; gross: number; net: number }[];
}) {
    const hasData = data.some((d) => d.gross > 0);
    return (
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={fmtCurrencyShort}
                        width={60}
                    />
                    <Tooltip
                        cursor={{ fill: "#f1f5f9" }}
                        contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                        formatter={(value: number, name: string) => [
                            fmtCurrencyFull(value),
                            name === "gross" ? "Brüt gelir" : "Net gelir",
                        ]}
                    />
                    <Legend
                        formatter={(value) => (value === "gross" ? "Brüt gelir" : "Net gelir")}
                        wrapperStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="gross" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="net" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
            </ResponsiveContainer>
            {!hasData && (
                <p className="-mt-60 text-center text-sm text-slate-400 pointer-events-none relative z-10">
                    Bu dönemde gelir yok.
                </p>
            )}
        </div>
    );
}

export function OccupancyHorizontalBar({
    data,
}: {
    data: { id: string; name: string; occupancyPercent: number }[];
}) {
    const sorted = [...data].sort((a, b) => b.occupancyPercent - a.occupancyPercent).slice(0, 10);
    const hasData = sorted.some((d) => d.occupancyPercent > 0);
    if (!hasData) {
        return (
            <div className="h-60 flex items-center justify-center text-sm text-slate-400">
                Bu dönemde doluluk verisi yok.
            </div>
        );
    }
    return (
        <div style={{ height: Math.max(180, sorted.length * 36 + 20) }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={sorted}
                    layout="vertical"
                    margin={{ top: 6, right: 16, left: 8, bottom: 6 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12, fill: "#334155" }}
                        tickLine={false}
                        axisLine={false}
                        width={140}
                    />
                    <Tooltip
                        cursor={{ fill: "#f1f5f9" }}
                        contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                        formatter={(value: number) => [`${value}%`, "Doluluk"]}
                    />
                    <Bar
                        dataKey="occupancyPercent"
                        fill="#8b5cf6"
                        radius={[0, 6, 6, 0]}
                        maxBarSize={22}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function StatusPie({
    data,
}: {
    data: { PENDING: number; APPROVED: number; REJECTED: number };
}) {
    const entries = [
        { name: "Onaylı", value: data.APPROVED, color: "#10b981" },
        { name: "Beklemede", value: data.PENDING, color: "#f59e0b" },
        { name: "Reddedildi", value: data.REJECTED, color: "#ef4444" },
    ].filter((e) => e.value > 0);
    const total = entries.reduce((s, e) => s + e.value, 0);
    if (!total) {
        return (
            <div className="h-60 flex items-center justify-center text-sm text-slate-400">
                Bu dönemde talep yok.
            </div>
        );
    }
    return (
        <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={entries}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={48}
                        outerRadius={80}
                        paddingAngle={2}
                    >
                        {entries.map((e, i) => (
                            <Cell key={i} fill={e.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                        formatter={(value: number, name: string) => [`${value} talep`, name]}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export function PanelTypePie({
    data,
}: {
    data: { type: string; revenue: number; rentalCount: number }[];
}) {
    const entries = data
        .filter((d) => d.revenue > 0)
        .map((d, i) => ({ ...d, color: CHART_COLORS[i % CHART_COLORS.length] }));
    const total = entries.reduce((s, e) => s + e.revenue, 0);
    if (!total) {
        return (
            <div className="h-60 flex items-center justify-center text-sm text-slate-400">
                Bu dönemde gelir yok.
            </div>
        );
    }
    return (
        <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={entries}
                        dataKey="revenue"
                        nameKey="type"
                        innerRadius={48}
                        outerRadius={80}
                        paddingAngle={2}
                    >
                        {entries.map((e, i) => (
                            <Cell key={i} fill={e.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                        formatter={(value: number, name: string) => [fmtCurrencyFull(value), name]}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
