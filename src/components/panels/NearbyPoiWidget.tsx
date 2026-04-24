"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Store,
    ShoppingCart,
    ShoppingBag,
    Coffee,
    UtensilsCrossed,
    Pizza,
    School,
    GraduationCap,
    Stethoscope,
    HeartPulse,
    Cross,
    Fuel,
    Landmark,
    CreditCard,
    Bed,
    Trophy,
    Dumbbell,
    Trees,
    Camera,
    Bus,
    TrainFront,
    Monitor,
    Shirt,
    Armchair,
    Beer,
    MapPin,
    Loader2,
} from "lucide-react";
import { POI_CATEGORY_LABELS } from "@/lib/traffic/poiTaxonomy";

type Poi = {
    id: string;
    name: string;
    brand: string | null;
    category: string;
    distance: number;
    direction: string;
    isLandmark: boolean;
};

type ApiResponse = {
    panel: { id: string; poiEnrichedAt: string | null; nearbyPoiCount: number | null };
    withinM: number;
    total: number;
    topPois: Poi[];
    categoryCounts: Record<string, number>;
    brandCounts: Record<string, number>;
};

const CATEGORY_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
    SUPERMARKET: ShoppingCart,
    CONVENIENCE: Store,
    MALL: ShoppingBag,
    DEPARTMENT_STORE: Store,
    PHARMACY: Cross,
    BANK: Landmark,
    ATM: CreditCard,
    FUEL: Fuel,
    RESTAURANT: UtensilsCrossed,
    FAST_FOOD: Pizza,
    CAFE: Coffee,
    BAR: Beer,
    SCHOOL: School,
    UNIVERSITY: GraduationCap,
    HOSPITAL: Stethoscope,
    CLINIC: HeartPulse,
    HOTEL: Bed,
    MARKETPLACE: Store,
    PARK: Trees,
    STADIUM: Trophy,
    SPORTS_CENTRE: Dumbbell,
    TOURIST_ATTRACTION: Camera,
    BUS_STATION: Bus,
    TRAIN_STATION: TrainFront,
    ELECTRONICS: Monitor,
    CLOTHING: Shirt,
    FURNITURE: Armchair,
    OTHER: MapPin,
};

const DIRECTION_TR: Record<string, string> = {
    N: "kuzeyinde",
    NE: "kuzeydoğusunda",
    E: "doğusunda",
    SE: "güneydoğusunda",
    S: "güneyinde",
    SW: "güneybatısında",
    W: "batısında",
    NW: "kuzeybatısında",
};

const DIRECTION_SHORT_TR: Record<string, string> = {
    N: "K",
    NE: "KD",
    E: "D",
    SE: "GD",
    S: "G",
    SW: "GB",
    W: "B",
    NW: "KB",
};

function prettyBrand(code: string): string {
    return code
        .replace(/_/g, " ")
        .split(" ")
        .map((w) => (w.length <= 2 ? w : w[0] + w.slice(1).toLowerCase()))
        .join(" ");
}

function humanSummary(topPois: Poi[]): string | null {
    const branded = topPois.filter((p) => p.brand).slice(0, 3);
    if (branded.length === 0) {
        const nearest = topPois.slice(0, 2);
        if (nearest.length === 0) return null;
        const parts = nearest.map((p) => {
            const catLabel = POI_CATEGORY_LABELS[p.category as keyof typeof POI_CATEGORY_LABELS] || p.category;
            return `${p.distance}m ${DIRECTION_TR[p.direction] || p.direction} ${catLabel.toLowerCase()}`;
        });
        return `Bu panonun ${parts.join(", ")} bulunuyor.`;
    }
    const parts = branded.map((p) => {
        const brand = prettyBrand(p.brand!);
        return `${p.distance}m ${DIRECTION_TR[p.direction] || p.direction} ${brand}`;
    });
    return `Bu panonun ${parts.join(", ")} bulunuyor.`;
}

export default function NearbyPoiWidget({
    panelId,
    compact = false,
    initialData,
}: {
    panelId: string;
    compact?: boolean;
    initialData?: ApiResponse | null;
}) {
    const [data, setData] = useState<ApiResponse | null>(initialData ?? null);
    const [loading, setLoading] = useState<boolean>(!initialData);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) return;
        let cancelled = false;
        setLoading(true);
        fetch(`/api/panels/${panelId}/nearby-pois?limit=${compact ? 8 : 15}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
                if (!cancelled && d) setData(d);
            })
            .catch(() => {
                /* ignore */
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [panelId, compact, initialData]);

    const categorySummary = useMemo(() => {
        if (!data) return [];
        return Object.entries(data.categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, compact ? 6 : 10);
    }, [data, compact]);

    const filteredTop = useMemo(() => {
        if (!data) return [];
        if (!categoryFilter) return data.topPois;
        return data.topPois.filter((p) => p.category === categoryFilter);
    }, [data, categoryFilter]);

    if (loading) {
        return (
            <div className={`${compact ? "p-3" : "p-4"} bg-white rounded-lg border border-slate-200`}>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Çevre bilgileri yükleniyor...
                </div>
            </div>
        );
    }

    if (!data || data.total === 0) {
        return (
            <div className={`${compact ? "p-3" : "p-4"} bg-white rounded-lg border border-slate-200`}>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Store className="w-4 h-4 text-slate-400" />
                    <span>Bu pano için çevre bilgisi henüz hazırlanmadı.</span>
                </div>
            </div>
        );
    }

    const summaryText = humanSummary(data.topPois);

    return (
        <div
            className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${
                compact ? "" : "shadow-sm"
            }`}
        >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-white border-b border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Store className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-slate-900">
                            Panonun Çevresi
                        </div>
                        <div className="text-[11px] text-slate-500">
                            {data.withinM}m yarıçap · {data.total} nokta
                        </div>
                    </div>
                </div>
            </div>

            {/* İnsan okunabilir özet */}
            {summaryText && (
                <div className="px-4 py-3 bg-emerald-50/50 border-b border-emerald-100 text-[13px] leading-relaxed text-slate-800">
                    {summaryText}
                </div>
            )}

            {/* Kategori özeti (ikonlu chipler) */}
            {categorySummary.length > 0 && (
                <div className="px-4 py-3 border-b border-slate-100">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
                        Çevrede neler var
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            type="button"
                            onClick={() => setCategoryFilter(null)}
                            className={`text-[11px] px-2.5 py-1 rounded-full border inline-flex items-center gap-1 transition ${
                                categoryFilter === null
                                    ? "bg-slate-900 text-white border-slate-900"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            Tümü · {data.total}
                        </button>
                        {categorySummary.map(([cat, cnt]) => {
                            const Icon = CATEGORY_ICON[cat] || MapPin;
                            const active = categoryFilter === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategoryFilter(active ? null : cat)}
                                    className={`text-[11px] px-2.5 py-1 rounded-full border inline-flex items-center gap-1 transition ${
                                        active
                                            ? "bg-emerald-600 text-white border-emerald-600"
                                            : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300"
                                    }`}
                                >
                                    <Icon className="w-3 h-3" />
                                    {POI_CATEGORY_LABELS[cat as keyof typeof POI_CATEGORY_LABELS] || cat}
                                    <span className="tabular-nums opacity-80">· {cnt}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* En yakın POI listesi */}
            <ul className="divide-y divide-slate-100">
                {filteredTop.map((p) => {
                    const Icon = CATEGORY_ICON[p.category] || MapPin;
                    return (
                        <li
                            key={p.id}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50"
                        >
                            <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                                <Icon className="w-4 h-4 text-slate-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-slate-900 truncate">
                                    {p.name}
                                    {p.brand && (
                                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                            {prettyBrand(p.brand)}
                                        </span>
                                    )}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                    {POI_CATEGORY_LABELS[p.category as keyof typeof POI_CATEGORY_LABELS] || p.category}
                                </div>
                            </div>
                            <div className="shrink-0 text-right tabular-nums">
                                <div className="text-sm font-semibold text-slate-900">
                                    {p.distance}
                                    <span className="text-[10px] text-slate-400 ml-0.5">m</span>
                                </div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                                    {DIRECTION_SHORT_TR[p.direction] || p.direction}
                                </div>
                            </div>
                        </li>
                    );
                })}
                {filteredTop.length === 0 && (
                    <li className="px-4 py-5 text-center text-xs text-slate-500">
                        Bu kategori için sonuç yok.
                    </li>
                )}
            </ul>

            {!compact && (
                <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-100 text-[10px] text-slate-400">
                    Panobu İçgörü Motoru · Çevre Analizi
                </div>
            )}
        </div>
    );
}
