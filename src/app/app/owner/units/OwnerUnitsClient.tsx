"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Monitor,
    MapPin,
    LayoutGrid,
    Rows,
    Search,
    Pencil,
    Pause,
    Play,
    Trash2,
    Wrench,
    AlertTriangle,
    CheckCircle2,
    Hourglass,
} from "lucide-react";
import { PANEL_TYPE_LABELS } from "@/lib/turkey-data";
import { formatCurrency } from "@/lib/utils";

export type UnitItem = {
    id: string;
    kind: "panel" | "screen";
    name: string;
    type: string;
    city: string;
    district: string;
    image: string | null;
    priceWeekly: number | null;
    priceDaily: number | null;
    active: boolean;
    reviewStatus: "PENDING" | "APPROVED" | "REJECTED";
    ownerStatus: "ACTIVE" | "PAUSED" | "MAINTENANCE";
    reviewNote: string | null;
    createdAt: string;
};

type View = "grid" | "table";

const REVIEW_LABEL: Record<UnitItem["reviewStatus"], { label: string; tone: string; icon: any }> = {
    APPROVED: {
        label: "Yayında",
        tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle2,
    },
    PENDING: {
        label: "Admin Onayı Bekliyor",
        tone: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Hourglass,
    },
    REJECTED: {
        label: "Reddedildi",
        tone: "bg-rose-50 text-rose-700 border-rose-200",
        icon: AlertTriangle,
    },
};

const OWNER_STATUS_LABEL: Record<UnitItem["ownerStatus"], string> = {
    ACTIVE: "Aktif",
    PAUSED: "Pasif",
    MAINTENANCE: "Bakımda",
};

function typeLabel(type: string) {
    if (type === "DIGITAL") return "Dijital Ekran";
    return PANEL_TYPE_LABELS[type] || type;
}

export default function OwnerUnitsClient({ items }: { items: UnitItem[] }) {
    const router = useRouter();
    const [view, setView] = useState<View>("grid");
    const [query, setQuery] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | UnitItem["reviewStatus"]>("ALL");
    const [busyId, setBusyId] = useState<string | null>(null);

    const cityOptions = useMemo(
        () => Array.from(new Set(items.map((i) => i.city).filter(Boolean))).sort(),
        [items]
    );
    const typeOptions = useMemo(
        () => Array.from(new Set(items.map((i) => i.type))).sort(),
        [items]
    );

    const filtered = useMemo(() => {
        return items.filter((it) => {
            if (cityFilter && it.city !== cityFilter) return false;
            if (typeFilter && it.type !== typeFilter) return false;
            if (statusFilter !== "ALL" && it.reviewStatus !== statusFilter) return false;
            if (query) {
                const q = query.toLocaleLowerCase("tr-TR");
                const hay = `${it.name} ${it.city} ${it.district}`.toLocaleLowerCase("tr-TR");
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [items, query, cityFilter, typeFilter, statusFilter]);

    const rejectedCount = items.filter((i) => i.reviewStatus === "REJECTED").length;

    async function changeStatus(item: UnitItem, status: UnitItem["ownerStatus"]) {
        if (item.kind !== "panel") return;
        setBusyId(item.id);
        try {
            const res = await fetch(`/api/owner/units/${item.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error((await res.json()).error || "Hata");
            router.refresh();
        } catch (e: any) {
            alert(e.message || "Durum değiştirilemedi");
        } finally {
            setBusyId(null);
        }
    }

    async function removeUnit(item: UnitItem) {
        if (item.kind !== "panel") {
            alert("Dijital ekranlar şu an buradan silinemez.");
            return;
        }
        if (!confirm(`"${item.name}" panosunu silmek istediğinize emin misiniz?`)) return;
        setBusyId(item.id);
        try {
            const res = await fetch(`/api/owner/units/${item.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error((await res.json()).error || "Hata");
            router.refresh();
        } catch (e: any) {
            alert(e.message || "Silinemedi");
        } finally {
            setBusyId(null);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Ünitelerim</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Tüm panolarınız ve dijital ekranlarınız burada listelenir.
                    </p>
                </div>
                <Link href="/app/owner/units/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Ünite
                    </Button>
                </Link>
            </div>

            {rejectedCount > 0 && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-lg px-4 py-3 text-sm flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                        {rejectedCount} pano admin tarafından reddedildi. Detayları görmek için
                        ilgili ünitenin üzerine tıklayın.
                    </div>
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ünite adı, şehir, ilçe ara..."
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:flex lg:items-center lg:gap-2">
                    <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                        <option value="">Tüm İller</option>
                        {cityOptions.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                        <option value="">Tüm Tipler</option>
                        {typeOptions.map((t) => (
                            <option key={t} value={t}>
                                {typeLabel(t)}
                            </option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                        <option value="ALL">Tüm Durumlar</option>
                        <option value="APPROVED">Yayında</option>
                        <option value="PENDING">Onay Bekliyor</option>
                        <option value="REJECTED">Reddedildi</option>
                    </select>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 self-start lg:self-center">
                    <button
                        onClick={() => setView("grid")}
                        className={`p-1.5 rounded ${
                            view === "grid" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
                        }`}
                        aria-label="Kart görünümü"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setView("table")}
                        className={`p-1.5 rounded ${
                            view === "table" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
                        }`}
                        aria-label="Tablo görünümü"
                    >
                        <Rows className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <EmptyState hasItems={items.length > 0} />
            ) : view === "grid" ? (
                <GridView
                    items={filtered}
                    busyId={busyId}
                    onChangeStatus={changeStatus}
                    onDelete={removeUnit}
                />
            ) : (
                <TableView
                    items={filtered}
                    busyId={busyId}
                    onChangeStatus={changeStatus}
                    onDelete={removeUnit}
                />
            )}
        </div>
    );
}

function EmptyState({ hasItems }: { hasItems: boolean }) {
    return (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <Monitor className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-slate-900">
                {hasItems ? "Filtreyle eşleşen ünite yok" : "Henüz ünite eklemediniz"}
            </h3>
            <p className="text-slate-500 text-sm mt-1 mb-5">
                {hasItems
                    ? "Filtreleri temizleyip tekrar deneyin."
                    : "İlk ünitenizi ekleyerek kazanmaya başlayın."}
            </p>
            {!hasItems && (
                <Link href="/app/owner/units/new">
                    <Button variant="outline">Ünite Ekle</Button>
                </Link>
            )}
        </div>
    );
}

function StatusBadge({ item }: { item: UnitItem }) {
    const meta = REVIEW_LABEL[item.reviewStatus];
    const Icon = meta.icon;
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border ${meta.tone}`}
        >
            <Icon className="w-3 h-3" />
            {meta.label}
        </span>
    );
}

function OwnerStatusBadge({ item }: { item: UnitItem }) {
    if (item.reviewStatus !== "APPROVED") return null;
    if (item.ownerStatus === "ACTIVE") return null;
    const tone =
        item.ownerStatus === "PAUSED"
            ? "bg-slate-100 text-slate-700 border-slate-200"
            : "bg-orange-50 text-orange-700 border-orange-200";
    return (
        <span className={`inline-flex px-2 py-1 rounded-full text-[11px] font-medium border ${tone}`}>
            {OWNER_STATUS_LABEL[item.ownerStatus]}
        </span>
    );
}

function ActionButtons({
    item,
    busyId,
    onChangeStatus,
    onDelete,
    compact,
}: {
    item: UnitItem;
    busyId: string | null;
    onChangeStatus: (item: UnitItem, status: UnitItem["ownerStatus"]) => void;
    onDelete: (item: UnitItem) => void;
    compact?: boolean;
}) {
    const isPanel = item.kind === "panel";
    const busy = busyId === item.id;
    const editHref = isPanel ? `/app/owner/units/${item.id}/edit` : `/app/owner/screens/${item.id}`;

    const btnClass = compact ? "h-8 text-xs" : "text-xs h-8";

    return (
        <div className="flex flex-wrap gap-1.5">
            <Link href={editHref}>
                <Button variant="outline" className={btnClass}>
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    Düzenle
                </Button>
            </Link>
            {isPanel && item.ownerStatus !== "PAUSED" && (
                <Button
                    variant="outline"
                    className={btnClass}
                    disabled={busy}
                    onClick={() => onChangeStatus(item, "PAUSED")}
                >
                    <Pause className="w-3.5 h-3.5 mr-1" />
                    Durdur
                </Button>
            )}
            {isPanel && item.ownerStatus === "PAUSED" && (
                <Button
                    variant="outline"
                    className={btnClass}
                    disabled={busy}
                    onClick={() => onChangeStatus(item, "ACTIVE")}
                >
                    <Play className="w-3.5 h-3.5 mr-1" />
                    Aktifleştir
                </Button>
            )}
            {isPanel && item.ownerStatus !== "MAINTENANCE" && (
                <Button
                    variant="outline"
                    className={btnClass}
                    disabled={busy}
                    onClick={() => onChangeStatus(item, "MAINTENANCE")}
                    title="Bakım moduna al"
                >
                    <Wrench className="w-3.5 h-3.5" />
                </Button>
            )}
            {isPanel && (
                <Button
                    variant="outline"
                    className={`${btnClass} text-rose-600 border-rose-200 hover:bg-rose-50`}
                    disabled={busy}
                    onClick={() => onDelete(item)}
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            )}
        </div>
    );
}

function GridView({
    items,
    busyId,
    onChangeStatus,
    onDelete,
}: {
    items: UnitItem[];
    busyId: string | null;
    onChangeStatus: (i: UnitItem, s: UnitItem["ownerStatus"]) => void;
    onDelete: (i: UnitItem) => void;
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it) => (
                <div
                    key={`${it.kind}-${it.id}`}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
                >
                    <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                        {it.image ? (
                            <Image
                                src={it.image}
                                alt={it.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        ) : (
                            <Monitor className="w-10 h-10 text-slate-300" />
                        )}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                            <StatusBadge item={it} />
                            <OwnerStatusBadge item={it} />
                        </div>
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-700 text-[11px] font-medium px-2 py-1 rounded-full border border-slate-200">
                            {typeLabel(it.type)}
                        </span>
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-slate-900 truncate">{it.name}</h3>
                        <p className="flex items-center text-slate-500 text-xs mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            {it.district}
                            {it.district && it.city ? ", " : ""}
                            {it.city}
                        </p>
                        {it.reviewNote && it.reviewStatus === "REJECTED" && (
                            <p className="mt-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded p-2">
                                <strong>Admin notu:</strong> {it.reviewNote}
                            </p>
                        )}
                        <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                            <div>
                                <p className="text-xs text-slate-400">Haftalık</p>
                                <p className="text-slate-800 text-xs font-medium">
                                    {it.priceWeekly != null ? formatCurrency(it.priceWeekly) : "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Günlük</p>
                                <p className="text-slate-800 text-xs font-medium">
                                    {it.priceDaily != null ? formatCurrency(it.priceDaily) : "—"}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <ActionButtons
                                item={it}
                                busyId={busyId}
                                onChangeStatus={onChangeStatus}
                                onDelete={onDelete}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function TableView({
    items,
    busyId,
    onChangeStatus,
    onDelete,
}: {
    items: UnitItem[];
    busyId: string | null;
    onChangeStatus: (i: UnitItem, s: UnitItem["ownerStatus"]) => void;
    onDelete: (i: UnitItem) => void;
}) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
                        <tr>
                            <th className="text-left px-4 py-3">Ünite</th>
                            <th className="text-left px-4 py-3">Tip</th>
                            <th className="text-left px-4 py-3">Konum</th>
                            <th className="text-left px-4 py-3">Fiyat</th>
                            <th className="text-left px-4 py-3">Durum</th>
                            <th className="text-right px-4 py-3">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((it) => (
                            <tr key={`${it.kind}-${it.id}`} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden relative flex items-center justify-center shrink-0">
                                            {it.image ? (
                                                <Image
                                                    src={it.image}
                                                    alt={it.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="48px"
                                                />
                                            ) : (
                                                <Monitor className="w-4 h-4 text-slate-300" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-slate-900 truncate">{it.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{typeLabel(it.type)}</td>
                                <td className="px-4 py-3 text-slate-600 text-xs">
                                    {it.district}
                                    {it.district && it.city ? ", " : ""}
                                    {it.city}
                                </td>
                                <td className="px-4 py-3 text-slate-700 text-xs">
                                    {it.priceWeekly != null
                                        ? `${formatCurrency(it.priceWeekly)} / hafta`
                                        : "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col gap-1">
                                        <StatusBadge item={it} />
                                        <OwnerStatusBadge item={it} />
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end">
                                        <ActionButtons
                                            item={it}
                                            busyId={busyId}
                                            onChangeStatus={onChangeStatus}
                                            onDelete={onDelete}
                                            compact
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
