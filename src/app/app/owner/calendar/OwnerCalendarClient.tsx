"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    List,
    Lock,
    Unlock,
    Loader2,
    Plus,
    X,
    Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type PanelLite = {
    id: string;
    name: string;
    city: string;
    district?: string;
    type: string;
    imageUrl?: string | null;
    priceWeekly?: number;
    isStartingPrice?: boolean;
    ownerStatus?: string;
    reviewStatus?: string;
    active?: boolean;
    blockedDates?: unknown;
};

type RentalLite = {
    id: string;
    panelId?: string;
    startDate: string;
    endDate: string;
    status: string;
    ownerReviewStatus?: "PENDING" | "APPROVED" | "REJECTED";
    customerName?: string;
    customerEmail?: string | null;
    totalPrice?: number | string;
};

type BlockedRange = { startDate: string; endDate: string; reason?: string };

const STATUS_LEGEND = [
    { label: "Müsait", color: "bg-emerald-500" },
    { label: "Dolu", color: "bg-red-500" },
    { label: "Beklemede", color: "bg-amber-400" },
    { label: "Bloklu", color: "bg-slate-400" },
];

function toDate(iso: string) {
    return new Date(iso);
}
function startOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}
function addDays(d: Date, n: number) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
}
function fmtISO(d: Date) {
    return d.toISOString().slice(0, 10);
}
function fmtLabel(d: Date) {
    return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
}
function monthLabel(d: Date) {
    return d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
}
function firstOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}
function weeksForMonth(anchor: Date) {
    // Pazartesi başlayan 6 haftalık grid
    const first = firstOfMonth(anchor);
    const dayOfWeek = (first.getDay() + 6) % 7; // Mon=0
    const start = addDays(first, -dayOfWeek);
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) days.push(addDays(start, i));
    return days;
}

function isSameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function rangesOverlap(
    aStart: Date,
    aEnd: Date,
    bStart: Date,
    bEnd: Date
) {
    return aStart <= bEnd && bStart <= aEnd;
}

type DayStatus = "free" | "busy" | "pending" | "blocked";

function dayStatus(
    day: Date,
    rentals: RentalLite[],
    blocks: BlockedRange[]
): DayStatus {
    const d0 = startOfDay(day);
    const d1 = addDays(d0, 1);
    for (const r of rentals) {
        if (r.ownerReviewStatus === "REJECTED") continue;
        if (r.status === "CANCELLED") continue;
        const rs = startOfDay(toDate(r.startDate));
        const re = startOfDay(toDate(r.endDate));
        if (rangesOverlap(d0, addDays(d1, -1), rs, re)) {
            if (r.ownerReviewStatus === "APPROVED") return "busy";
            // Onay bekleyen veya ödeme bekleyen → sarı
            return "pending";
        }
    }
    for (const b of blocks) {
        const bs = startOfDay(toDate(b.startDate));
        const be = startOfDay(toDate(b.endDate));
        if (rangesOverlap(d0, addDays(d1, -1), bs, be)) return "blocked";
    }
    return "free";
}

function statusColor(s: DayStatus) {
    switch (s) {
        case "busy":
            return "bg-red-500 text-white";
        case "pending":
            return "bg-amber-400 text-slate-900";
        case "blocked":
            return "bg-slate-400 text-white";
        default:
            return "bg-emerald-50 text-emerald-800 hover:bg-emerald-100";
    }
}

export default function OwnerCalendarClient() {
    const [view, setView] = useState<"single" | "overview">("single");
    const [panels, setPanels] = useState<PanelLite[]>([]);
    const [selectedPanelId, setSelectedPanelId] = useState<string>("");
    const [panelDetail, setPanelDetail] = useState<PanelLite | null>(null);
    const [rentals, setRentals] = useState<RentalLite[]>([]);
    const [blocks, setBlocks] = useState<BlockedRange[]>([]);
    const [monthAnchor, setMonthAnchor] = useState<Date>(() => firstOfMonth(new Date()));
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [rangeStart, setRangeStart] = useState<Date | null>(null);
    const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blockReason, setBlockReason] = useState("");
    const [blockSaving, setBlockSaving] = useState(false);

    // Overview state
    const [overviewRentals, setOverviewRentals] = useState<RentalLite[]>([]);

    const loadOverview = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/owner/calendar`);
            if (!res.ok) throw new Error("Takvim yüklenemedi");
            const data = await res.json();
            const items: PanelLite[] = data.panels || [];
            setPanels(items);
            setOverviewRentals(data.rentals || []);
            if (items.length && !selectedPanelId) {
                setSelectedPanelId(items[0].id);
            }
        } catch (e: any) {
            setError(e?.message || "Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    }, [selectedPanelId]);

    const loadPanelDetail = useCallback(async (panelId: string) => {
        if (!panelId) return;
        setDetailLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/owner/calendar?panelId=${panelId}`);
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.error || "Pano takvimi yüklenemedi");
            }
            const data = await res.json();
            setPanelDetail(data.panel || null);
            setRentals(data.rentals || []);
            setBlocks(
                Array.isArray(data.blocks) ? (data.blocks as BlockedRange[]) : []
            );
        } catch (e: any) {
            setError(e?.message || "Bir hata oluştu");
        } finally {
            setDetailLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOverview();
    }, [loadOverview]);

    useEffect(() => {
        if (view === "single" && selectedPanelId) loadPanelDetail(selectedPanelId);
    }, [view, selectedPanelId, loadPanelDetail]);

    const gridDays = useMemo(() => weeksForMonth(monthAnchor), [monthAnchor]);

    const onDayClick = (day: Date) => {
        const status = dayStatus(day, rentals, blocks);
        // Sadece müsait günler seçilebilir (blok ekleme amaçlı)
        if (status !== "free") return;
        if (!rangeStart || (rangeStart && rangeEnd)) {
            setRangeStart(day);
            setRangeEnd(null);
            return;
        }
        if (rangeStart && !rangeEnd) {
            if (day < rangeStart) {
                setRangeStart(day);
                setRangeEnd(rangeStart);
            } else {
                setRangeEnd(day);
            }
        }
    };

    const isInSelection = (day: Date) => {
        if (!rangeStart) return false;
        const end = rangeEnd ?? rangeStart;
        const a = startOfDay(rangeStart);
        const b = startOfDay(end);
        const [lo, hi] = a <= b ? [a, b] : [b, a];
        const d = startOfDay(day);
        return d >= lo && d <= hi;
    };

    const handleBlockSave = async () => {
        if (!rangeStart || !selectedPanelId) return;
        const end = rangeEnd ?? rangeStart;
        const [start, finish] = rangeStart <= end ? [rangeStart, end] : [end, rangeStart];
        setBlockSaving(true);
        try {
            const res = await fetch(`/api/owner/units/${selectedPanelId}/blocks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    startDate: startOfDay(start).toISOString(),
                    endDate: startOfDay(finish).toISOString(),
                    reason: blockReason || undefined,
                }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.error || "Blok eklenemedi");
            }
            const data = await res.json();
            setBlocks(data.blocks || []);
            setShowBlockModal(false);
            setRangeStart(null);
            setRangeEnd(null);
            setBlockReason("");
        } catch (e: any) {
            alert(e?.message || "Bir hata oluştu");
        } finally {
            setBlockSaving(false);
        }
    };

    const handleBlockRemove = async (index: number) => {
        if (!selectedPanelId) return;
        if (!confirm("Bu bloğu kaldırmak istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(
                `/api/owner/units/${selectedPanelId}/blocks?index=${index}`,
                { method: "DELETE" }
            );
            if (!res.ok) throw new Error("Silinemedi");
            const data = await res.json();
            setBlocks(data.blocks || []);
        } catch (e: any) {
            alert(e?.message || "Bir hata oluştu");
        }
    };

    // Toplu özet: her ünite × 12 hafta heatmap
    const overviewWeeks = useMemo(() => {
        const start = startOfDay(new Date());
        const monday = addDays(start, -((start.getDay() + 6) % 7));
        const weeks: { start: Date; end: Date }[] = [];
        for (let i = 0; i < 12; i++) {
            const s = addDays(monday, i * 7);
            weeks.push({ start: s, end: addDays(s, 6) });
        }
        return weeks;
    }, []);

    const overviewCell = (panelId: string, week: { start: Date; end: Date }) => {
        const rentalsHere = overviewRentals.filter(
            (r) =>
                r.panelId === panelId &&
                r.ownerReviewStatus !== "REJECTED" &&
                r.status !== "CANCELLED" &&
                rangesOverlap(
                    week.start,
                    week.end,
                    startOfDay(toDate(r.startDate)),
                    startOfDay(toDate(r.endDate))
                )
        );
        const panel = panels.find((p) => p.id === panelId);
        const blocks: BlockedRange[] = Array.isArray(panel?.blockedDates)
            ? ((panel?.blockedDates as unknown) as BlockedRange[])
            : [];
        const blocked = blocks.some((b) =>
            rangesOverlap(
                week.start,
                week.end,
                startOfDay(toDate(b.startDate)),
                startOfDay(toDate(b.endDate))
            )
        );
        if (rentalsHere.some((r) => r.ownerReviewStatus === "APPROVED"))
            return "bg-red-500";
        if (rentalsHere.length > 0) return "bg-amber-400";
        if (blocked) return "bg-slate-400";
        return "bg-emerald-200";
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                            <CalendarDays className="w-7 h-7 text-blue-600" />
                            Müsaitlik Takvimi
                        </h1>
                        <p className="text-slate-600 mt-1 text-sm">
                            Ünitelerinizin dolu/boş durumunu görün, kurumsal müşterileriniz için blok açın.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
                            <button
                                onClick={() => setView("single")}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition ${view === "single"
                                    ? "bg-blue-600 text-white shadow"
                                    : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <LayoutGrid className="w-4 h-4" /> Tek Ünite
                            </button>
                            <button
                                onClick={() => setView("overview")}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition ${view === "overview"
                                    ? "bg-blue-600 text-white shadow"
                                    : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <List className="w-4 h-4" /> Toplu Görünüm
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                        <Loader2 className="w-6 h-6 mx-auto animate-spin mb-2" />
                        Yükleniyor...
                    </div>
                ) : panels.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                        <CalendarDays className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                        <h2 className="text-lg font-semibold text-slate-900 mb-1">
                            Henüz bir üniteniz yok
                        </h2>
                        <p className="text-slate-500 text-sm mb-4">
                            Takvimi kullanabilmek için önce bir ünite ekleyin.
                        </p>
                        <Button asChild>
                            <Link href="/app/owner/units/new">Ünite Ekle</Link>
                        </Button>
                    </div>
                ) : view === "single" ? (
                    <div className="grid lg:grid-cols-[320px_1fr] gap-6">
                        {/* Sol: Ünite seçici */}
                        <aside className="bg-white rounded-xl border border-slate-200 p-4 h-fit">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Ünite seçin
                            </label>
                            <select
                                value={selectedPanelId}
                                onChange={(e) => setSelectedPanelId(e.target.value)}
                                className="mt-2 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            >
                                {panels.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} — {p.city}
                                    </option>
                                ))}
                            </select>

                            {panelDetail && (
                                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm">
                                    <div className="font-medium text-slate-900">{panelDetail.name}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        {panelDetail.city}
                                        {panelDetail.district ? ` · ${panelDetail.district}` : ""}
                                    </div>
                                    {panelDetail.priceWeekly ? (
                                        <div className="text-xs text-slate-600 mt-2">
                                            {panelDetail.isStartingPrice ? "Başlayan " : ""}
                                            haftalık: <span className="font-semibold">{Number(panelDetail.priceWeekly).toLocaleString("tr-TR")} ₺</span>
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            <div className="mt-5">
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                    Açıklama
                                </h3>
                                <ul className="space-y-1.5">
                                    {STATUS_LEGEND.map((l) => (
                                        <li key={l.label} className="flex items-center gap-2 text-xs text-slate-600">
                                            <span className={`inline-block w-3 h-3 rounded ${l.color}`} />
                                            {l.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-5 text-xs text-slate-500 flex items-start gap-2">
                                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                <span>
                                    Müsait günlere tıklayarak aralık seçin ve blok oluşturun.
                                </span>
                            </div>
                        </aside>

                        {/* Sağ: Ay takvimi */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
                            {/* Ay navigasyonu */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() =>
                                        setMonthAnchor((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
                                    }
                                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <div className="text-lg font-semibold text-slate-900 capitalize">
                                    {monthLabel(monthAnchor)}
                                </div>
                                <button
                                    onClick={() =>
                                        setMonthAnchor((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
                                    }
                                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {detailLoading && (
                                <div className="text-center text-slate-500 py-6 text-sm">
                                    <Loader2 className="w-4 h-4 inline animate-spin mr-1" />
                                    Yükleniyor...
                                </div>
                            )}

                            {/* Gün başlıkları */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => (
                                    <div
                                        key={d}
                                        className="text-center text-xs font-medium text-slate-500 py-1"
                                    >
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Gün grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {gridDays.map((d) => {
                                    const outOfMonth = d.getMonth() !== monthAnchor.getMonth();
                                    const s = dayStatus(d, rentals, blocks);
                                    const selected = isInSelection(d);
                                    const rentalOnDay = rentals.find((r) => {
                                        const rs = startOfDay(toDate(r.startDate));
                                        const re = startOfDay(toDate(r.endDate));
                                        return rangesOverlap(startOfDay(d), startOfDay(d), rs, re);
                                    });
                                    return (
                                        <button
                                            key={d.toISOString()}
                                            type="button"
                                            onClick={() => onDayClick(d)}
                                            disabled={s !== "free"}
                                            title={
                                                rentalOnDay
                                                    ? `${rentalOnDay.customerName || "Müşteri"} — ${new Date(rentalOnDay.startDate).toLocaleDateString("tr-TR")} → ${new Date(rentalOnDay.endDate).toLocaleDateString("tr-TR")}`
                                                    : s === "blocked"
                                                        ? "Bloklu"
                                                        : "Müsait"
                                            }
                                            className={`relative h-16 rounded-lg border text-xs flex flex-col items-start p-1.5 transition ${outOfMonth ? "opacity-30" : ""
                                                } ${statusColor(s)} ${selected
                                                    ? "ring-2 ring-blue-500 ring-offset-1"
                                                    : "border-slate-100"
                                                }`}
                                        >
                                            <span className="font-semibold">{d.getDate()}</span>
                                            {rentalOnDay && (
                                                <span className="truncate w-full text-[10px] opacity-90">
                                                    {rentalOnDay.customerName}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Seçim bar */}
                            {rangeStart && (
                                <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                                    <div className="text-sm text-blue-900">
                                        Seçim: <strong>{fmtLabel(rangeStart)}</strong>
                                        {rangeEnd && !isSameDay(rangeStart, rangeEnd) ? (
                                            <>
                                                {" "}→ <strong>{fmtLabel(rangeEnd)}</strong>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setRangeStart(null);
                                                setRangeEnd(null);
                                            }}
                                        >
                                            <X className="w-3.5 h-3.5 mr-1" /> İptal
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => setShowBlockModal(true)}
                                            className="bg-slate-700 hover:bg-slate-800"
                                        >
                                            <Lock className="w-3.5 h-3.5 mr-1" /> Blokla
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Mevcut bloklar */}
                            {blocks.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-2">
                                        Mevcut Bloklar
                                    </h3>
                                    <div className="space-y-2">
                                        {blocks.map((b, i) => (
                                            <div
                                                key={`${b.startDate}-${b.endDate}-${i}`}
                                                className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                            >
                                                <div>
                                                    <span className="font-medium text-slate-900">
                                                        {new Date(b.startDate).toLocaleDateString("tr-TR")} —{" "}
                                                        {new Date(b.endDate).toLocaleDateString("tr-TR")}
                                                    </span>
                                                    {b.reason && (
                                                        <span className="text-xs text-slate-500 ml-2">
                                                            ({b.reason})
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleBlockRemove(i)}
                                                    className="text-slate-400 hover:text-red-600 p-1 rounded"
                                                    title="Bloğu kaldır"
                                                >
                                                    <Unlock className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Overview — heatmap
                    <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 overflow-x-auto">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">
                                12 Hafta — Tüm Üniteler
                            </h2>
                            <div className="flex items-center gap-3 ml-auto">
                                {STATUS_LEGEND.map((l) => (
                                    <div key={l.label} className="flex items-center gap-1.5 text-xs text-slate-600">
                                        <span className={`inline-block w-3 h-3 rounded ${l.color}`} />
                                        {l.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <table className="min-w-full text-xs">
                            <thead>
                                <tr>
                                    <th className="text-left font-medium text-slate-500 pb-2 pr-2 sticky left-0 bg-white">
                                        Ünite
                                    </th>
                                    {overviewWeeks.map((w) => (
                                        <th
                                            key={fmtISO(w.start)}
                                            className="text-center font-medium text-slate-500 pb-2 px-1 whitespace-nowrap"
                                        >
                                            {fmtLabel(w.start)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {panels.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="hover:bg-slate-50 cursor-pointer"
                                        onClick={() => {
                                            setSelectedPanelId(p.id);
                                            setView("single");
                                        }}
                                    >
                                        <td className="py-1.5 pr-3 sticky left-0 bg-white">
                                            <div className="font-medium text-slate-900 truncate max-w-[200px]">
                                                {p.name}
                                            </div>
                                            <div className="text-[11px] text-slate-500">{p.city}</div>
                                        </td>
                                        {overviewWeeks.map((w) => (
                                            <td key={fmtISO(w.start)} className="px-0.5 py-1">
                                                <div
                                                    className={`h-6 rounded ${overviewCell(p.id, w)}`}
                                                    title={`${fmtLabel(w.start)} → ${fmtLabel(w.end)}`}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Blok modal */}
            {showBlockModal && rangeStart && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Tarihleri Blokla</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            {fmtLabel(rangeStart)}{" "}
                            {rangeEnd && !isSameDay(rangeStart, rangeEnd)
                                ? `→ ${fmtLabel(rangeEnd)}`
                                : ""}
                        </p>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Not (opsiyonel)
                        </label>
                        <input
                            type="text"
                            value={blockReason}
                            onChange={(e) => setBlockReason(e.target.value)}
                            placeholder="Örn: Kurumsal rezervasyon"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowBlockModal(false)}
                                disabled={blockSaving}
                            >
                                Vazgeç
                            </Button>
                            <Button
                                onClick={handleBlockSave}
                                disabled={blockSaving}
                                className="bg-slate-700 hover:bg-slate-800"
                            >
                                {blockSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Kaydediliyor
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-1" /> Blokla
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
