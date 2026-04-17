"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Building2,
    CheckCircle2,
    Clock3,
    ExternalLink,
    Loader2,
    Mail,
    Phone,
    Search,
    Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Owner = {
    id: string;
    companyName: string;
    approved: boolean;
    slug?: string | null;
    phone?: string | null;
    contactEmail?: string | null;
    website?: string | null;
    cities?: string[];
    createdAt: string;
    user: { name: string; email: string; createdAt: string };
    counts: { screens: number; panels: number };
};

type Summary = { pending: number; approved: number; total: number };

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function AdminOwnersClient() {
    const [items, setItems] = useState<Owner[]>([]);
    const [summary, setSummary] = useState<Summary>({ pending: 0, approved: 0, total: 0 });
    const [status, setStatus] = useState<"all" | "pending" | "approved">("pending");
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setErr(null);
        try {
            const params = new URLSearchParams();
            params.set("status", status);
            if (q.trim()) params.set("q", q.trim());
            const res = await fetch(`/api/admin/owners?${params.toString()}`);
            if (!res.ok) throw new Error("Yüklenemedi");
            const data = await res.json();
            setItems(data.items || []);
            setSummary(data.summary || { pending: 0, approved: 0, total: 0 });
        } catch (e: any) {
            setErr(e?.message || "Hata");
        } finally {
            setLoading(false);
        }
    }, [status, q]);

    useEffect(() => {
        const id = setTimeout(load, q ? 250 : 0);
        return () => clearTimeout(id);
    }, [load, q]);

    async function approve(owner: Owner, next: boolean) {
        setBusyId(owner.id);
        setErr(null);
        try {
            const res = await fetch(`/api/admin/owners/${owner.id}/approve`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ approved: next }),
            });
            if (!res.ok) {
                const d = await res.json().catch(() => ({}));
                throw new Error(d?.error || "İşlem başarısız");
            }
            await load();
        } catch (e: any) {
            setErr(e?.message || "Hata");
        } finally {
            setBusyId(null);
        }
    }

    const counts = useMemo(
        () => ({
            all: summary.total,
            pending: summary.pending,
            approved: summary.approved,
        }),
        [summary]
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-7 h-7 text-blue-600" /> Medya Sahipleri
                    </h1>
                    <p className="text-slate-600 mt-1 text-sm">
                        Yeni başvuruları inceleyin; firmaları onayladıktan sonra panoları Panobu.com'da
                        görünmeye başlar.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                <Stat label="Toplam" value={counts.all} tone="slate" />
                <Stat label="Onay Bekliyor" value={counts.pending} tone="amber" />
                <Stat label="Onaylı" value={counts.approved} tone="emerald" />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 md:p-4 mb-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 w-full md:w-auto">
                    {(["pending", "approved", "all"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s)}
                            className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap ${status === s
                                ? "bg-white text-slate-900 shadow-sm font-medium"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            {s === "pending"
                                ? `Bekleyen (${counts.pending})`
                                : s === "approved"
                                    ? `Onaylı (${counts.approved})`
                                    : `Tümü (${counts.all})`}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Firma, yetkili, email…"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg"
                    />
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
            ) : items.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                    <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                    <h3 className="text-lg font-semibold text-slate-900">Kayıt bulunamadı</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Seçili filtreye uyan medya sahibi yok.
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {items.map((o) => (
                            <div
                                key={o.id}
                                className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-slate-900 truncate">
                                            {o.companyName}
                                        </h3>
                                        {o.approved ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-emerald-50 border-emerald-200 text-emerald-800">
                                                <CheckCircle2 className="w-3 h-3" /> Onaylı
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-amber-50 border-amber-200 text-amber-800">
                                                <Clock3 className="w-3 h-3" /> Beklemede
                                            </span>
                                        )}
                                        {o.slug && (
                                            <a
                                                href={`/medya/${o.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center"
                                            >
                                                /medya/{o.slug}
                                                <ExternalLink className="w-3 h-3 ml-0.5" />
                                            </a>
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        Yetkili: <span className="text-slate-700 font-medium">{o.user.name}</span>
                                        {" · "}
                                        Başvuru: {fmtDate(o.user.createdAt)}
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                                        <span className="inline-flex items-center gap-1">
                                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                                            {o.contactEmail || o.user.email}
                                        </span>
                                        {o.phone && (
                                            <span className="inline-flex items-center gap-1">
                                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                {o.phone}
                                            </span>
                                        )}
                                        {o.website && (
                                            <a
                                                href={o.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                {o.website.replace(/^https?:\/\//, "")}
                                            </a>
                                        )}
                                    </div>
                                    {o.cities && o.cities.length > 0 && (
                                        <div className="mt-1 text-xs text-slate-500">
                                            Şehirler: {o.cities.join(", ")}
                                        </div>
                                    )}
                                    <div className="mt-1 text-xs text-slate-500">
                                        Panolar: {o.counts.panels} · Ekranlar: {o.counts.screens}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {!o.approved ? (
                                        <Button
                                            onClick={() => approve(o, true)}
                                            disabled={busyId === o.id}
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            {busyId === o.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                            )}
                                            Onayla
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() => approve(o, false)}
                                            disabled={busyId === o.id}
                                        >
                                            {busyId === o.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                            ) : (
                                                <Undo2 className="w-4 h-4 mr-1" />
                                            )}
                                            Onayı Geri Al
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function Stat({
    label,
    value,
    tone,
}: {
    label: string;
    value: number;
    tone: "slate" | "amber" | "emerald";
}) {
    const colorMap = {
        slate: "bg-slate-50 border-slate-200 text-slate-900",
        amber: "bg-amber-50 border-amber-200 text-amber-900",
        emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
    } as const;
    return (
        <div className={`rounded-xl border px-4 py-3 ${colorMap[tone]}`}>
            <div className="text-xs font-medium uppercase tracking-wider opacity-75">{label}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
    );
}
