"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Inbox,
    Search,
    Filter,
    Loader2,
    CalendarRange,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Clock3,
    MapPin,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";
type CreativeStatus = "NONE" | "PENDING" | "APPROVED" | "REVISION_REQUESTED";

type Request = {
    id: string;
    panel: {
        id: string;
        name: string;
        city: string;
        district?: string;
        type: string;
        imageUrl?: string | null;
        imageUrls?: string[];
    };
    advertiser: {
        companyName?: string | null;
        name?: string | null;
        email?: string | null;
        phone?: string | null;
    };
    startDate: string;
    endDate: string;
    totalPrice: string | number;
    currency: string;
    status: string;
    ownerReviewStatus: ReviewStatus;
    ownerReviewNote?: string | null;
    ownerReviewedAt?: string | null;
    creativeUrl?: string | null;
    creativeStatus: CreativeStatus;
    creativeNote?: string | null;
    designRequested?: boolean;
    createdAt: string;
};

type Summary = { PENDING: number; APPROVED: number; REJECTED: number; total: number };

const STATUS_META: Record<ReviewStatus, { label: string; class: string; icon: any }> = {
    PENDING: {
        label: "Beklemede",
        class: "bg-amber-100 text-amber-800 border-amber-200",
        icon: Clock3,
    },
    APPROVED: {
        label: "Onaylandı",
        class: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: CheckCircle2,
    },
    REJECTED: {
        label: "Reddedildi",
        class: "bg-rose-100 text-rose-800 border-rose-200",
        icon: XCircle,
    },
};

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function fmtDateTime(iso: string) {
    return new Date(iso).toLocaleString("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function fmtPrice(n: string | number, currency = "TRY") {
    const num = Number(n);
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: currency || "TRY",
        maximumFractionDigits: 0,
    }).format(num);
}

export default function OwnerRequestsClient() {
    const [items, setItems] = useState<Request[]>([]);
    const [summary, setSummary] = useState<Summary>({
        PENDING: 0,
        APPROVED: 0,
        REJECTED: 0,
        total: 0,
    });
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const [statusFilter, setStatusFilter] = useState<"ALL" | ReviewStatus>("ALL");
    const [sort, setSort] = useState<"newest" | "oldest" | "price">("newest");
    const [query, setQuery] = useState("");
    const [panelFilter, setPanelFilter] = useState<string>("");

    const load = useCallback(async () => {
        setLoading(true);
        setErr(null);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== "ALL") params.set("status", statusFilter);
            if (sort) params.set("sort", sort);
            if (panelFilter) params.set("panelId", panelFilter);
            const res = await fetch(`/api/owner/requests?${params.toString()}`);
            if (!res.ok) throw new Error("Talepler yüklenemedi");
            const data = await res.json();
            setItems(data.items || []);
            setSummary(data.summary || { PENDING: 0, APPROVED: 0, REJECTED: 0, total: 0 });
        } catch (e: any) {
            setErr(e?.message || "Hata");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, sort, panelFilter]);

    useEffect(() => {
        load();
    }, [load]);

    const filtered = useMemo(() => {
        const q = query.trim().toLocaleLowerCase("tr-TR");
        if (!q) return items;
        return items.filter((r) => {
            const hay = [
                r.panel.name,
                r.panel.city,
                r.panel.district,
                r.advertiser.companyName,
                r.advertiser.name,
                r.advertiser.email,
            ]
                .filter(Boolean)
                .join(" ")
                .toLocaleLowerCase("tr-TR");
            return hay.includes(q);
        });
    }, [items, query]);

    const panelOptions = useMemo(() => {
        const seen = new Set<string>();
        const out: { id: string; name: string }[] = [];
        for (const it of items) {
            if (!seen.has(it.panel.id)) {
                seen.add(it.panel.id);
                out.push({ id: it.panel.id, name: it.panel.name });
            }
        }
        return out;
    }, [items]);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                            <Inbox className="w-7 h-7 text-blue-600" /> Gelen Talepler
                        </h1>
                        <p className="text-slate-600 mt-1 text-sm">
                            Reklam verenlerden gelen kiralama taleplerini onaylayın, reddedin veya
                            görsellerini inceleyin.
                        </p>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <StatCard label="Toplam" value={summary.total} tone="slate" />
                    <StatCard label="Bekleyen" value={summary.PENDING} tone="amber" />
                    <StatCard label="Onaylanan" value={summary.APPROVED} tone="emerald" />
                    <StatCard label="Reddedilen" value={summary.REJECTED} tone="rose" />
                </div>

                {/* Filters */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 md:p-4 mb-4 flex flex-col md:flex-row md:items-center gap-3">
                    {/* Status tabs */}
                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 w-full md:w-auto overflow-x-auto">
                        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap ${statusFilter === s
                                    ? "bg-white text-slate-900 shadow-sm font-medium"
                                    : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                {s === "ALL"
                                    ? `Tümü (${summary.total})`
                                    : `${STATUS_META[s].label} (${summary[s]})`}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row gap-2 md:items-center">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ünite, il, reklam veren, email…"
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg"
                            />
                        </div>
                        <select
                            value={panelFilter}
                            onChange={(e) => setPanelFilter(e.target.value)}
                            className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                        >
                            <option value="">Tüm üniteler</option>
                            {panelOptions.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as any)}
                            className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                        >
                            <option value="newest">En yeni</option>
                            <option value="oldest">En eski</option>
                            <option value="price">Fiyata göre</option>
                        </select>
                    </div>
                </div>

                {err && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-lg p-3 text-sm mb-4">
                        {err}
                    </div>
                )}

                {loading ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
                        <Loader2 className="w-5 h-5 inline animate-spin mr-2" /> Yükleniyor...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                        <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                        <h3 className="text-lg font-semibold text-slate-900">Henüz talep yok</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Reklam verenler panolarınızı sepete eklediğinde talepler burada belirecek.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((r) => (
                            <RequestCard key={r.id} r={r} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    tone,
}: {
    label: string;
    value: number;
    tone: "slate" | "amber" | "emerald" | "rose";
}) {
    const colorMap = {
        slate: "bg-slate-50 border-slate-200 text-slate-900",
        amber: "bg-amber-50 border-amber-200 text-amber-900",
        emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
        rose: "bg-rose-50 border-rose-200 text-rose-900",
    } as const;
    return (
        <div className={`rounded-xl border px-4 py-3 ${colorMap[tone]}`}>
            <div className="text-xs font-medium uppercase tracking-wider opacity-75">{label}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
    );
}

function RequestCard({ r }: { r: Request }) {
    const meta = STATUS_META[r.ownerReviewStatus];
    const Icon = meta.icon;
    const img = r.panel.imageUrl || r.panel.imageUrls?.[0] || null;
    const customer = r.advertiser.companyName || r.advertiser.name || "Müşteri";

    return (
        <Link
            href={`/app/owner/requests/${r.id}`}
            className="block bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all overflow-hidden"
        >
            <div className="flex flex-col md:flex-row">
                {/* Pano thumbnail */}
                <div className="w-full md:w-40 h-32 md:h-auto relative bg-slate-100 shrink-0">
                    {img ? (
                        <Image
                            src={img}
                            alt={r.panel.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 160px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <MapPin className="w-8 h-8" />
                        </div>
                    )}
                </div>

                <div className="flex-1 p-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span
                                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${meta.class}`}
                            >
                                <Icon className="w-3.5 h-3.5" /> {meta.label}
                            </span>
                            {r.creativeUrl && (
                                <span
                                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${r.creativeStatus === "APPROVED"
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                        : r.creativeStatus === "REVISION_REQUESTED"
                                            ? "bg-orange-50 border-orange-200 text-orange-800"
                                            : "bg-blue-50 border-blue-200 text-blue-800"
                                        }`}
                                >
                                    <Sparkles className="w-3 h-3" />
                                    Görsel:{" "}
                                    {r.creativeStatus === "APPROVED"
                                        ? "Onaylı"
                                        : r.creativeStatus === "REVISION_REQUESTED"
                                            ? "Revizyon"
                                            : "İnceleme bekliyor"}
                                </span>
                            )}
                            {r.designRequested && (
                                <span className="text-[11px] font-medium bg-violet-50 text-violet-800 px-2 py-0.5 rounded-full border border-violet-200">
                                    Tasarım talebi
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold text-slate-900 mt-1.5 truncate">
                            {r.panel.name}
                        </h3>
                        <div className="text-xs text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {r.panel.city}
                            {r.panel.district ? ` · ${r.panel.district}` : ""}
                        </div>
                        <div className="mt-2 text-sm text-slate-700">
                            <span className="font-medium">{customer}</span>
                            {r.advertiser.email && (
                                <span className="text-slate-500 text-xs ml-2">
                                    {r.advertiser.email}
                                </span>
                            )}
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                                <CalendarRange className="w-3.5 h-3.5" />
                                {fmtDate(r.startDate)} → {fmtDate(r.endDate)}
                            </span>
                            <span>·</span>
                            <span>Talep: {fmtDateTime(r.createdAt)}</span>
                        </div>
                    </div>

                    <div className="flex md:flex-col md:items-end justify-between gap-2 shrink-0">
                        <div className="text-right">
                            <div className="text-xs text-slate-500">Teklif</div>
                            <div className="text-lg font-bold text-slate-900 tabular-nums">
                                {fmtPrice(r.totalPrice, r.currency)}
                            </div>
                        </div>
                        <div className="inline-flex items-center text-blue-600 text-sm font-medium">
                            Detay <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
