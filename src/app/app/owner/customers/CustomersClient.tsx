"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    Users,
    Search,
    ArrowRight,
    Mail,
    Phone,
    Building2,
    TrendingUp,
    Calendar,
    ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import type { OwnerCustomer } from "@/lib/owner/customers";

type SortKey = "spend" | "recent" | "frequency" | "alpha";

const sortOptions: { key: SortKey; label: string }[] = [
    { key: "spend", label: "En çok harcayan" },
    { key: "recent", label: "En son kiralayan" },
    { key: "frequency", label: "En sık kiralayan" },
    { key: "alpha", label: "Alfabetik" },
];

function fmtDate(d: string | Date | null): string {
    if (!d) return "—";
    try {
        return new Date(d).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    } catch {
        return "—";
    }
}

export default function CustomersClient({ initial }: { initial: OwnerCustomer[] }) {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<SortKey>("spend");

    const filtered = useMemo(() => {
        const q = query.trim().toLocaleLowerCase("tr-TR");
        let list = [...initial];
        if (q) {
            list = list.filter((c) =>
                [c.name, c.companyName ?? "", c.email, c.phone ?? "", c.sector ?? ""]
                    .join(" ")
                    .toLocaleLowerCase("tr-TR")
                    .includes(q)
            );
        }
        list.sort((a, b) => {
            if (sort === "spend") return b.totalSpend - a.totalSpend;
            if (sort === "frequency") return b.rentalCount - a.rentalCount;
            if (sort === "alpha") return a.name.localeCompare(b.name, "tr");
            const ad = a.lastRentalAt ? new Date(a.lastRentalAt).getTime() : 0;
            const bd = b.lastRentalAt ? new Date(b.lastRentalAt).getTime() : 0;
            return bd - ad;
        });
        return list;
    }, [initial, query, sort]);

    const totalSpend = initial.reduce((s, c) => s + c.totalSpend, 0);
    const totalRentals = initial.reduce((s, c) => s + c.rentalCount, 0);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-600" />
                    Müşteriler
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Size daha önce kiralama yapmış müşterilerin özeti.
                </p>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <StatCard label="Toplam Müşteri" value={initial.length.toString()} />
                <StatCard label="Toplam Kiralama" value={totalRentals.toString()} />
                <StatCard label="Toplam Gelir" value={formatCurrency(totalSpend)} accent />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="İsim, firma, e-posta..."
                        className="pl-9 w-80"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                        <ArrowUpDown className="w-3.5 h-3.5" /> Sırala
                    </span>
                    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                        {sortOptions.map((o) => (
                            <button
                                key={o.key}
                                onClick={() => setSort(o.key)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-[7px] transition ${
                                    sort === o.key
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-20 px-6 text-center">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <div className="font-semibold text-slate-900">
                            {initial.length === 0
                                ? "Henüz müşteri kaydınız yok"
                                : "Aramaya uyan müşteri bulunamadı"}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            {initial.length === 0
                                ? "Panolarınız kiralandıkça müşterileriniz burada listelenir."
                                : "Farklı anahtar kelime deneyin."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-left border-b border-slate-200">
                                    <th className="px-4 py-3 font-semibold text-slate-600">Müşteri</th>
                                    <th className="px-4 py-3 font-semibold text-slate-600">İletişim</th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 text-right">Kiralama</th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 text-right">Harcama</th>
                                    <th className="px-4 py-3 font-semibold text-slate-600">Son Kiralama</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((c) => (
                                    <tr key={c.advertiserId} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 align-top">
                                            <div className="font-semibold text-slate-900">
                                                {c.companyName || c.name}
                                            </div>
                                            {c.companyName && c.companyName !== c.name && (
                                                <div className="text-xs text-slate-500">{c.name}</div>
                                            )}
                                            {c.sector && (
                                                <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                                    {c.sector}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 align-top text-slate-700">
                                            <div className="flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-slate-400" /> {c.email}
                                            </div>
                                            {c.phone && (
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {c.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 align-top text-right font-semibold text-slate-900">
                                            {c.rentalCount}
                                        </td>
                                        <td className="px-4 py-3 align-top text-right font-semibold text-slate-900">
                                            {formatCurrency(c.totalSpend)}
                                        </td>
                                        <td className="px-4 py-3 align-top text-slate-700">
                                            {fmtDate(c.lastRentalAt as unknown as string)}
                                        </td>
                                        <td className="px-4 py-3 align-top text-right">
                                            <Link
                                                href={`/app/owner/customers/${c.advertiserId}`}
                                                className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 text-xs font-medium"
                                            >
                                                Detay <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    accent,
}: {
    label: string;
    value: string;
    accent?: boolean;
}) {
    return (
        <div
            className={`rounded-xl border px-4 py-3 ${
                accent
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-slate-200"
            }`}
        >
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                {label}
            </div>
            <div
                className={`mt-1 text-xl font-bold ${
                    accent ? "text-blue-700" : "text-slate-900"
                }`}
            >
                {value}
            </div>
        </div>
    );
}

// Unused icon imports kept for future use; silence with no-op references
void Building2;
void TrendingUp;
void Calendar;
