"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthlyRequestPoint } from "@/lib/owner/stats";

export default function RequestTrendChart({ data }: { data: MonthlyRequestPoint[] }) {
    const hasData = data.some((d) => d.total > 0);
    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 12, right: 12, left: -8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} width={32} />
                    <Tooltip
                        cursor={{ fill: "#f1f5f9" }}
                        contentStyle={{
                            borderRadius: 8,
                            border: "1px solid #e2e8f0",
                            fontSize: 12,
                        }}
                        labelStyle={{ color: "#0f172a", fontWeight: 600 }}
                        formatter={(value: number) => [`${value} talep`, ""]}
                    />
                    <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
            </ResponsiveContainer>
            {!hasData && (
                <p className="-mt-56 text-center text-sm text-slate-400 pointer-events-none relative z-10">
                    Henüz talep verisi yok.
                </p>
            )}
        </div>
    );
}
