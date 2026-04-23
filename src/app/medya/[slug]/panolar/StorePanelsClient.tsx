"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
    MapPin,
    Check,
    X,
    Layers,
    ShoppingBag,
    Lightbulb,
    Ruler,
    Eye,
    ArrowRight,
    Search,
    List,
    Map as MapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, weeklyEquivalent } from "@/lib/utils";
import { PANEL_TYPE_LABELS } from "@/lib/turkey-data";
import { useStore } from "../StoreContext";
import type { StorePanel } from "@/lib/store/loader";

const Map = dynamic(() => import("./StoreMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-100 animate-pulse" />
    ),
});

export default function StorePanelsClient({ panels }: { panels: StorePanel[] }) {
    const { owner, selected, toggle, isSelected, remove, totalWeekly } = useStore();
    const search = useSearchParams();
    const [detail, setDetail] = useState<StorePanel | null>(null);
    const [query, setQuery] = useState("");
    const [cityFilter, setCityFilter] = useState<string>("Tümü");
    const [typeFilter, setTypeFilter] = useState<string>("Tümü");
    const [view, setView] = useState<"map" | "list">("map");

    // Sayfa açılışında URL'deki panel= varsa detayı aç
    useEffect(() => {
        const id = search.get("panel");
        if (id) {
            const p = panels.find((x) => x.id === id);
            if (p) setDetail(p);
        }
    }, [search, panels]);

    const cities = useMemo(() => {
        const arr = Array.from(new Set(panels.map((p) => p.city))).sort();
        return ["Tümü", ...arr];
    }, [panels]);

    const types = useMemo(() => {
        const arr = Array.from(new Set(panels.map((p) => p.type)));
        return ["Tümü", ...arr];
    }, [panels]);

    const filtered = useMemo(() => {
        const q = query.trim().toLocaleLowerCase("tr-TR");
        return panels.filter((p) => {
            if (cityFilter !== "Tümü" && p.city !== cityFilter) return false;
            if (typeFilter !== "Tümü" && p.type !== typeFilter) return false;
            if (!q) return true;
            const hay = [p.name, p.city, p.district, p.address].join(" ").toLocaleLowerCase("tr-TR");
            return hay.includes(q);
        });
    }, [panels, query, cityFilter, typeFilter]);

    const mapCenter = useMemo<[number, number]>(() => {
        if (!filtered.length) return [39.0, 35.0];
        const lat = filtered.reduce((s, p) => s + p.latitude, 0) / filtered.length;
        const lng = filtered.reduce((s, p) => s + p.longitude, 0) / filtered.length;
        return [lat, lng];
    }, [filtered]);

    const mapZoom = filtered.length <= 1 ? 13 : filtered.length < 5 ? 10 : 7;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            {/* Page header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-5">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Panolar</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {filtered.length} ünite · haritadan seçip toplu teklif alabilirsiniz
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Pano, şehir, ilçe..."
                            className="pl-9 w-64"
                        />
                    </div>

                    <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="h-10 px-3 rounded-md border border-slate-200 text-sm bg-white"
                    >
                        {cities.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="h-10 px-3 rounded-md border border-slate-200 text-sm bg-white"
                    >
                        {types.map((t) => (
                            <option key={t} value={t}>
                                {t === "Tümü" ? "Tümü" : PANEL_TYPE_LABELS[t] ?? t}
                            </option>
                        ))}
                    </select>

                    <div className="hidden md:inline-flex rounded-md border border-slate-200 bg-white p-0.5">
                        <button
                            onClick={() => setView("map")}
                            className={`px-3 py-1.5 text-sm rounded-[5px] inline-flex items-center gap-1.5 ${
                                view === "map" ? "bg-slate-900 text-white" : "text-slate-600"
                            }`}
                        >
                            <MapIcon className="w-4 h-4" /> Harita
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={`px-3 py-1.5 text-sm rounded-[5px] inline-flex items-center gap-1.5 ${
                                view === "list" ? "bg-slate-900 text-white" : "text-slate-600"
                            }`}
                        >
                            <List className="w-4 h-4" /> Liste
                        </button>
                    </div>
                </div>
            </div>

            {/* Main layout */}
            <div className="grid lg:grid-cols-[1fr_340px] gap-4">
                {/* Map / List */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    {view === "map" ? (
                        <div className="h-[560px] md:h-[680px] relative">
                            <Map
                                panels={filtered}
                                selectedPanel={detail}
                                onPanelSelect={(p) => setDetail(p)}
                                center={mapCenter}
                                zoom={mapZoom}
                            />
                        </div>
                    ) : (
                        <div className="p-3 md:p-4 max-h-[680px] overflow-auto">
                            {filtered.length === 0 ? (
                                <div className="text-center text-slate-500 text-sm py-16">
                                    Seçili filtrelere uygun ünite bulunamadı.
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                    {filtered.map((p) => (
                                        <PanelCard
                                            key={p.id}
                                            panel={p}
                                            selected={isSelected(p.id)}
                                            onOpen={() => setDetail(p)}
                                            onToggle={() =>
                                                toggle({
                                                    id: p.id,
                                                    name: p.name,
                                                    city: p.city,
                                                    district: p.district,
                                                    type: p.type,
                                                    priceWeekly: p.priceWeekly,
                                                    priceDaily: p.priceDaily,
                                                    priceMonthly: p.priceMonthly,
                                                    price3Month: p.price3Month,
                                                    price6Month: p.price6Month,
                                                    priceYearly: p.priceYearly,
                                                    printingFee: p.printingFee,
                                                })
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Selection panel */}
                <aside className="bg-white border border-slate-200 rounded-2xl p-4 h-fit lg:sticky lg:top-20">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900 text-sm">Teklif Listesi</div>
                            <div className="text-xs text-slate-500">
                                {selected.length} ünite seçili
                            </div>
                        </div>
                    </div>

                    {selected.length === 0 ? (
                        <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3 border border-dashed border-slate-200">
                            Haritadan ya da listeden ünite seçerek toplu teklif isteyebilirsiniz.
                        </div>
                    ) : (
                        <ul className="space-y-2 max-h-[380px] overflow-auto pr-1">
                            {selected.map((s) => (
                                <li
                                    key={s.id}
                                    className="flex items-start gap-2 p-2 rounded-lg border border-slate-200"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-slate-900 line-clamp-1">
                                            {s.name}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {s.district}, {s.city}
                                        </div>
                                        {(() => {
                                            const w = weeklyEquivalent(s);
                                            return w ? (
                                                <div className="text-xs mt-1">
                                                    <span className="text-slate-400">haftalık</span>{" "}
                                                    <span className="font-semibold text-slate-900">
                                                        {formatCurrency(w)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="text-xs mt-1 text-slate-500">
                                                    Fiyat için iletişime geçin
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <button
                                        onClick={() => remove(s.id)}
                                        className="p-1 text-slate-400 hover:text-red-600"
                                        aria-label="Kaldır"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">Toplam (haftalık)</span>
                            <span className="text-lg font-bold text-slate-900">
                                {formatCurrency(totalWeekly)}
                            </span>
                        </div>
                        <Link
                            href={`/medya/${owner.slug}/teklif`}
                            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition ${
                                selected.length > 0
                                    ? "bg-slate-900 text-white hover:bg-slate-800"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none"
                            }`}
                        >
                            Teklif Al <ArrowRight className="w-4 h-4" />
                        </Link>
                        <p className="text-[11px] text-slate-400 text-center">
                            Seçimleriniz tarayıcınızda kaydedilir. Teklif formu gönderildiğinde {owner.companyName} ekibine iletilir.
                        </p>
                    </div>
                </aside>
            </div>

            {/* Detail modal */}
            {detail && (
                <PanelDetailModal
                    panel={detail}
                    selected={isSelected(detail.id)}
                    onClose={() => setDetail(null)}
                    onToggle={() => {
                        toggle({
                            id: detail.id,
                            name: detail.name,
                            city: detail.city,
                            district: detail.district,
                            type: detail.type,
                            priceWeekly: detail.priceWeekly,
                            priceDaily: detail.priceDaily,
                            priceMonthly: detail.priceMonthly,
                            price3Month: detail.price3Month,
                            price6Month: detail.price6Month,
                            priceYearly: detail.priceYearly,
                            printingFee: detail.printingFee,
                        });
                        setDetail(null);
                    }}
                />
            )}
        </div>
    );
}

function PanelCard({
    panel,
    selected,
    onOpen,
    onToggle,
}: {
    panel: StorePanel;
    selected: boolean;
    onOpen: () => void;
    onToggle: () => void;
}) {
    return (
        <div
            className={`group relative bg-white border rounded-xl overflow-hidden transition ${
                selected ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-200"
            }`}
        >
            <button
                onClick={onOpen}
                className="block w-full text-left"
            >
                <div className="relative aspect-[16/10] bg-slate-100">
                    {panel.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={panel.imageUrl}
                            alt={panel.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm">
                            Görsel yok
                        </div>
                    )}
                    <div className="absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/95 text-slate-700 border border-slate-200">
                        {PANEL_TYPE_LABELS[panel.type] ?? panel.type}
                    </div>
                </div>
                <div className="p-3">
                    <div className="font-semibold text-slate-900 text-sm line-clamp-1">{panel.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {panel.district}, {panel.city}
                    </div>
                    {(() => {
                        const w = weeklyEquivalent(panel);
                        return w ? (
                            <div className="text-sm font-bold text-slate-900 mt-1">
                                {formatCurrency(w)}
                                <span className="text-xs text-slate-500 font-normal ml-1">/hafta</span>
                            </div>
                        ) : (
                            <div className="text-xs font-semibold text-slate-700 mt-1">
                                Fiyat için iletişime geçin
                            </div>
                        );
                    })()}
                </div>
            </button>
            <button
                onClick={onToggle}
                className={`absolute top-2 right-2 w-7 h-7 rounded-full border flex items-center justify-center shadow-sm transition ${
                    selected
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-200 text-slate-400 hover:text-slate-900"
                }`}
                aria-label={selected ? "Seçimi kaldır" : "Seçime ekle"}
            >
                <Check className="w-4 h-4" />
            </button>
        </div>
    );
}

function PanelDetailModal({
    panel,
    selected,
    onClose,
    onToggle,
}: {
    panel: StorePanel;
    selected: boolean;
    onClose: () => void;
    onToggle: () => void;
}) {
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-hidden shadow-2xl flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900"
                    aria-label="Kapat"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative aspect-[16/9] bg-slate-100 shrink-0">
                    {panel.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={panel.imageUrl}
                            alt={panel.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                            Görsel yok
                        </div>
                    )}
                    <div className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/95 text-slate-700 border border-slate-200">
                        {PANEL_TYPE_LABELS[panel.type] ?? panel.type}
                    </div>
                </div>

                <div className="p-5 md:p-6 overflow-auto">
                    <h3 className="text-xl font-bold text-slate-900">{panel.name}</h3>
                    <div className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {panel.address ? `${panel.address}, ` : ""}
                        {panel.district}, {panel.city}
                    </div>

                    {panel.description && (
                        <p className="text-sm text-slate-700 leading-relaxed mt-3 whitespace-pre-line">
                            {panel.description}
                        </p>
                    )}

                    <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <DetailStat icon={Ruler} label="Boyut" value={`${panel.width} x ${panel.height} m`} />
                        <DetailStat icon={Layers} label="Yüz Sayısı" value={String(panel.faceCount)} />
                        {panel.lighting && (
                            <DetailStat icon={Lightbulb} label="Aydınlatma" value={lightLabel(panel.lighting)} />
                        )}
                        {panel.estimatedDailyImpressions > 0 && (
                            <DetailStat
                                icon={Eye}
                                label="Günlük İzlenme"
                                value={panel.estimatedDailyImpressions.toLocaleString("tr-TR")}
                            />
                        )}
                    </div>

                    {panel.imageUrls.length > 1 && (
                        <div className="mt-5">
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                                Daha fazla görsel
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                {panel.imageUrls.slice(0, 8).map((u, i) => (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        key={i}
                                        src={u}
                                        alt={`${panel.name} ${i + 1}`}
                                        className="aspect-square object-cover rounded-lg border border-slate-200"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            {(() => {
                                const w = weeklyEquivalent(panel);
                                return w ? (
                                    <>
                                        <div className="text-xs text-slate-500">
                                            {panel.isStartingPrice ? "Başlayan fiyat" : "Haftalık fiyat"}
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900">
                                            {formatCurrency(w)}
                                            <span className="text-sm text-slate-500 font-normal ml-1">/hafta</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-sm font-semibold text-slate-700">
                                        Fiyat için iletişime geçin
                                    </div>
                                );
                            })()}
                            {panel.priceDaily && (
                                <div className="text-xs text-slate-500 mt-0.5">
                                    Günlük {formatCurrency(panel.priceDaily)}
                                </div>
                            )}
                            {panel.price3Month ? (
                                <div className="text-xs text-slate-500 mt-0.5">
                                    3 Aylık {formatCurrency(panel.price3Month)}
                                </div>
                            ) : null}
                            {panel.price6Month ? (
                                <div className="text-xs text-slate-500 mt-0.5">
                                    6 Aylık {formatCurrency(panel.price6Month)}
                                </div>
                            ) : null}
                            {panel.priceYearly ? (
                                <div className="text-xs text-slate-500 mt-0.5">
                                    12 Aylık {formatCurrency(panel.priceYearly)}
                                </div>
                            ) : null}
                            {panel.printingFee ? (
                                <div className="text-xs text-slate-500 mt-0.5">
                                    Baskı &amp; Montaj {formatCurrency(panel.printingFee)}
                                </div>
                            ) : null}
                        </div>

                        <Button
                            onClick={onToggle}
                            className={
                                selected
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : "bg-slate-900 hover:bg-slate-800 text-white"
                            }
                        >
                            {selected ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Seçildi
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    Teklif Listesine Ekle
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailStat({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <Icon className="w-4 h-4 text-slate-400 mb-1" />
            <div className="text-[11px] text-slate-500">{label}</div>
            <div className="text-sm font-semibold text-slate-900">{value}</div>
        </div>
    );
}

function lightLabel(l: string): string {
    switch (l) {
        case "LIGHTED":
            return "Işıklı";
        case "UNLIGHTED":
            return "Işıksız";
        case "DIGITAL":
            return "Dijital";
        default:
            return l;
    }
}
