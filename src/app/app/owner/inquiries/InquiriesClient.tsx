"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Inbox,
    Mail,
    Phone,
    Building2,
    Calendar,
    Loader2,
    ArrowRight,
    CheckCircle2,
    Clock,
    Archive,
    Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

type PanelSnap = {
    id: string;
    name: string;
    type: string;
    city: string;
    district: string;
    priceWeekly: number | null;
};

type Inquiry = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    message: string | null;
    startDate: string | null;
    endDate: string | null;
    panels: PanelSnap[];
    status: "NEW" | "CONTACTED" | "CLOSED";
    notes: string | null;
    createdAt: string;
    updatedAt: string;
};

const tabs: { key: "all" | "NEW" | "CONTACTED" | "CLOSED"; label: string; icon: any }[] = [
    { key: "all", label: "Tümü", icon: Inbox },
    { key: "NEW", label: "Yeni", icon: Clock },
    { key: "CONTACTED", label: "İletişim Kuruldu", icon: CheckCircle2 },
    { key: "CLOSED", label: "Kapandı", icon: Archive },
];

function fmtDate(s: string): string {
    try {
        return new Date(s).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    } catch {
        return s;
    }
}

function fmtDateTime(s: string): string {
    try {
        return new Date(s).toLocaleString("tr-TR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return s;
    }
}

function statusBadge(status: Inquiry["status"]) {
    if (status === "NEW")
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-3 h-3" /> Yeni
            </span>
        );
    if (status === "CONTACTED")
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <CheckCircle2 className="w-3 h-3" /> İletişim Kuruldu
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <Archive className="w-3 h-3" /> Kapandı
        </span>
    );
}

export default function InquiriesClient() {
    const [tab, setTab] = useState<"all" | "NEW" | "CONTACTED" | "CLOSED">("all");
    const [items, setItems] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<Inquiry | null>(null);
    const [updating, setUpdating] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const res = await fetch(`/api/owner/inquiries?status=${tab}`, { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                const rows: Inquiry[] = Array.isArray(data?.inquiries) ? data.inquiries : [];
                setItems(rows);
            } else {
                setItems([]);
            }
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    const filtered = useMemo(() => {
        const q = query.trim().toLocaleLowerCase("tr-TR");
        if (!q) return items;
        return items.filter((i) => {
            const hay = [i.name, i.email, i.phone ?? "", i.company ?? "", i.message ?? ""]
                .join(" ")
                .toLocaleLowerCase("tr-TR");
            return hay.includes(q);
        });
    }, [items, query]);

    async function updateStatus(id: string, status: Inquiry["status"]) {
        setUpdating(true);
        try {
            const res = await fetch(`/api/owner/inquiries/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                const updated = (await res.json()) as Inquiry;
                setItems((arr) => {
                    if (tab === "all") {
                        return arr.map((i) => (i.id === updated.id ? updated : i));
                    }
                    // Aktif sekme spesifik bir durum ise, yeni durumu sekmeye uymuyorsa listeden çıkart
                    return arr
                        .map((i) => (i.id === updated.id ? updated : i))
                        .filter((i) => i.status === tab);
                });
                setSelected((s) => (s?.id === updated.id ? updated : s));
            }
        } finally {
            setUpdating(false);
        }
    }

    async function saveNotes(id: string, notes: string) {
        setUpdating(true);
        try {
            const res = await fetch(`/api/owner/inquiries/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes }),
            });
            if (res.ok) {
                const updated = (await res.json()) as Inquiry;
                setItems((arr) => arr.map((i) => (i.id === updated.id ? updated : i)));
                setSelected((s) => (s?.id === updated.id ? updated : s));
            }
        } finally {
            setUpdating(false);
        }
    }

    async function remove(id: string) {
        if (!confirm("Bu talebi silmek istediğinize emin misiniz?")) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/owner/inquiries/${id}`, { method: "DELETE" });
            if (res.ok) {
                setItems((arr) => arr.filter((i) => i.id !== id));
                setSelected(null);
            }
        } finally {
            setUpdating(false);
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
                    <Inbox className="w-6 h-6 text-blue-600" />
                    Mağaza Talepleri
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Public mağaza sayfanız üzerinden gelen teklif ve iletişim talepleri.
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                    {tabs.map((t) => {
                        const Icon = t.icon;
                        const active = tab === t.key;
                        return (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-[7px] inline-flex items-center gap-1.5 transition ${
                                    active
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="İsim, e-posta, firma..."
                        className="pl-9 w-72"
                    />
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_420px] gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="py-20 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 px-6 text-center">
                            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <div className="font-semibold text-slate-900">Henüz talep yok</div>
                            <p className="text-sm text-slate-500 mt-1">
                                Mağaza sayfanızdan gelen teklif istekleri burada listelenir.
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {filtered.map((i) => {
                                const total = (i.panels ?? []).reduce(
                                    (s, p) => s + Number(p.priceWeekly || 0),
                                    0
                                );
                                const isActive = selected?.id === i.id;
                                return (
                                    <li key={i.id}>
                                        <button
                                            onClick={() => setSelected(i)}
                                            className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition ${
                                                isActive ? "bg-slate-50" : ""
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-slate-900 truncate">
                                                            {i.name}
                                                        </span>
                                                        {statusBadge(i.status)}
                                                    </div>
                                                    <div className="text-sm text-slate-600 mt-0.5 flex items-center gap-3 flex-wrap">
                                                        <span className="inline-flex items-center gap-1">
                                                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                            {i.email}
                                                        </span>
                                                        {i.phone && (
                                                            <span className="inline-flex items-center gap-1">
                                                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                                {i.phone}
                                                            </span>
                                                        )}
                                                        {i.company && (
                                                            <span className="inline-flex items-center gap-1">
                                                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                                                {i.company}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1">
                                                        {fmtDateTime(i.createdAt)} ·{" "}
                                                        <span className="font-medium text-slate-700">
                                                            {(i.panels ?? []).length} ünite
                                                        </span>
                                                        {total > 0 && (
                                                            <>
                                                                {" · "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {formatCurrency(total)}
                                                                </span>
                                                                <span className="text-slate-400"> / hf</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-slate-300 mt-1 shrink-0" />
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Detail panel */}
                <aside className="bg-white border border-slate-200 rounded-2xl p-5 h-fit lg:sticky lg:top-20">
                    {selected ? (
                        <InquiryDetail
                            inquiry={selected}
                            updating={updating}
                            onUpdateStatus={(s) => updateStatus(selected.id, s)}
                            onSaveNotes={(n) => saveNotes(selected.id, n)}
                            onDelete={() => remove(selected.id)}
                            onClose={() => setSelected(null)}
                        />
                    ) : (
                        <div className="py-10 text-center">
                            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <div className="font-semibold text-slate-900">Talep seçin</div>
                            <p className="text-sm text-slate-500 mt-1">
                                Sol listeden bir talep seçin; müşteri bilgileri, seçilen üniteler ve iç notlar burada görünür.
                            </p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}

function InquiryDetail({
    inquiry,
    updating,
    onUpdateStatus,
    onSaveNotes,
    onDelete,
    onClose,
}: {
    inquiry: Inquiry;
    updating: boolean;
    onUpdateStatus: (s: Inquiry["status"]) => void;
    onSaveNotes: (n: string) => void;
    onDelete: () => void;
    onClose: () => void;
}) {
    const [notes, setNotes] = useState<string>(inquiry.notes ?? "");
    useEffect(() => setNotes(inquiry.notes ?? ""), [inquiry.id, inquiry.notes]);

    const total = (inquiry.panels ?? []).reduce(
        (s, p) => s + Number(p.priceWeekly || 0),
        0
    );

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <div className="font-semibold text-slate-900 text-base truncate">{inquiry.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{fmtDateTime(inquiry.createdAt)}</div>
                </div>
                <button
                    onClick={onClose}
                    className="text-xs text-slate-400 hover:text-slate-700"
                    aria-label="Kapat"
                >
                    Kapat
                </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">{statusBadge(inquiry.status)}</div>

            {/* Contact */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm space-y-1.5">
                <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
                    <Mail className="w-4 h-4 text-slate-400" /> {inquiry.email}
                </a>
                {inquiry.phone && (
                    <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
                        <Phone className="w-4 h-4 text-slate-400" /> {inquiry.phone}
                    </a>
                )}
                {inquiry.company && (
                    <div className="flex items-center gap-2 text-slate-700">
                        <Building2 className="w-4 h-4 text-slate-400" /> {inquiry.company}
                    </div>
                )}
                {(inquiry.startDate || inquiry.endDate) && (
                    <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {inquiry.startDate ? fmtDate(inquiry.startDate) : "?"}
                        {" → "}
                        {inquiry.endDate ? fmtDate(inquiry.endDate) : "?"}
                    </div>
                )}
            </div>

            {inquiry.message && (
                <div>
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                        Müşteri Mesajı
                    </div>
                    <div className="text-sm text-slate-800 whitespace-pre-line bg-amber-50 border border-amber-200 rounded-lg p-3">
                        {inquiry.message}
                    </div>
                </div>
            )}

            {/* Panels */}
            <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                    Seçilen Üniteler ({(inquiry.panels ?? []).length})
                </div>
                {(inquiry.panels ?? []).length === 0 ? (
                    <div className="text-sm text-slate-500 italic">Genel iletişim talebi — ünite seçilmemiş.</div>
                ) : (
                    <ul className="space-y-1.5 max-h-[220px] overflow-auto pr-1">
                        {inquiry.panels.map((p) => (
                            <li
                                key={p.id}
                                className="flex items-start justify-between gap-2 p-2 rounded-lg border border-slate-200 text-sm"
                            >
                                <div className="min-w-0">
                                    <div className="font-medium text-slate-900 truncate">{p.name}</div>
                                    <div className="text-xs text-slate-500">
                                        {p.type} · {p.district}, {p.city}
                                    </div>
                                </div>
                                <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                                    {p.priceWeekly != null ? (
                                        <>
                                            {formatCurrency(Number(p.priceWeekly))}
                                            <span className="text-slate-400 font-normal"> /hf</span>
                                        </>
                                    ) : (
                                        <span className="text-slate-400 font-normal">Fiyat yok</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {total > 0 && (
                    <div className="mt-2 flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                        <span className="text-slate-500">Toplam (haftalık)</span>
                        <span className="font-bold text-slate-900">{formatCurrency(total)}</span>
                    </div>
                )}
            </div>

            {/* Status actions */}
            <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Durum</div>
                <div className="flex flex-wrap gap-1.5">
                    {(["NEW", "CONTACTED", "CLOSED"] as const).map((s) => (
                        <button
                            key={s}
                            disabled={updating || inquiry.status === s}
                            onClick={() => onUpdateStatus(s)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                                inquiry.status === s
                                    ? "bg-slate-900 border-slate-900 text-white cursor-default"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            {s === "NEW" ? "Yeni" : s === "CONTACTED" ? "İletişim Kuruldu" : "Kapandı"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Internal notes */}
            <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                    İç Notlar
                </div>
                <textarea
                    rows={3}
                    maxLength={2000}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={() => {
                        if ((inquiry.notes ?? "") !== notes) onSaveNotes(notes);
                    }}
                    placeholder="Ekibinize özel notlar (müşteri görmez)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Link
                    href={`mailto:${inquiry.email}?subject=${encodeURIComponent("Teklif talebiniz hakkında")}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                >
                    <Mail className="w-4 h-4" /> E-posta Yaz
                </Link>
                <button
                    onClick={onDelete}
                    disabled={updating}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                    Sil
                </button>
            </div>
        </div>
    );
}
