"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, MapPin, CheckCircle2, Navigation, ShoppingCart, Loader2 } from "lucide-react";
import PanelTypeIcon from "@/components/icons/PanelTypeIcon";
import { formatCurrency } from "@/lib/utils";
import { PANEL_TYPE_LABELS } from "@/lib/turkey-data";

interface PanelDetailSidebarProps {
    panel: any;
    isOpen: boolean;
    onClose: () => void;
}

// Location type Turkish labels
const LOCATION_TYPE_LABELS: Record<string, string> = {
    'OPEN_AREA': 'Açık Alan',
    'AVM': 'AVM İçi',
    'HIGHWAY': 'Otoyol',
    'E5': 'E5 Yolu',
    'CITY_CENTER': 'Şehir Merkezi',
    'METRO': 'Metro',
    'STADIUM': 'Stadyum',
    'HOSPITAL': 'Hastane',
    'UNIVERSITY': 'Üniversite',
    'AIRPORT': 'Havalimanı',
};

// Get or create session ID
function getSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
}

export default function PanelDetailSidebar({ panel, isOpen, onClose }: PanelDetailSidebarProps) {
    const [cartLoading, setCartLoading] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [cartError, setCartError] = useState<string | null>(null);

    const handleAddToCart = async () => {
        if (!panel?.id) {
            setCartError('Pano bilgisi bulunamadı');
            return;
        }

        setCartError(null);
        setCartLoading(true);

        try {
            const sessionId = getSessionId();
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId
                },
                body: JSON.stringify({ panelId: panel.id, sessionId })
            });

            const data = await res.json();

            if (!res.ok) {
                setCartError(data.error || 'Bir hata oluştu');
            } else {
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 3000);
            }
        } catch (error) {
            console.error('Cart error:', error);
            setCartError('Bağlantı hatası');
        } finally {
            setCartLoading(false);
        }
    };

    if (!panel) return null;

    return (
        <div
            className={`absolute top-0 left-0 bottom-0 z-30 flex min-w-0 w-full max-w-full flex-col overflow-hidden border-r border-slate-200/80 bg-white shadow-[4px_0_24px_-4px_rgba(15,23,42,0.12)] transition-transform duration-300 ease-in-out sm:w-[22rem] sm:max-w-[22rem] sm:rounded-r-2xl ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            {/* Kompakt görsel — yüksekliği sınırlı, haritaya daha çok alan */}
            <div className="relative aspect-[5/3] max-h-[9.5rem] w-full shrink-0 bg-slate-100">
                <img
                    src={panel.imageUrl || "https://images.unsplash.com/photo-1637606346315-d353ec6d3c81?q=80&w=2000&auto=format&fit=crop"}
                    alt={panel.name}
                    className="h-full w-full object-cover"
                />
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900/55 text-white backdrop-blur-sm transition-colors hover:bg-neutral-900/75"
                    aria-label="Kapat"
                >
                    <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-white/92 px-2 py-1 shadow-sm backdrop-blur-sm">
                    <PanelTypeIcon type={panel.type} size={14} />
                    <span className="text-xs font-semibold text-slate-800">{PANEL_TYPE_LABELS[panel.type] || panel.type}</span>
                </div>
            </div>

            {/* İçerik — dar sütun, sıkı aralıklar */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
                <h2 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-slate-900 sm:text-lg">{panel.name}</h2>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{panel.district}, {panel.city}</span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                    {panel.isAVM ? (
                        <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-0.5 text-[10px] font-medium text-pink-800 ring-1 ring-inset ring-pink-100">
                            AVM
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-800 ring-1 ring-inset ring-sky-100">
                            Açık alan
                        </span>
                    )}
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800 ring-1 ring-inset ring-emerald-100">
                        <CheckCircle2 className="h-3 w-3" />
                        Müsait
                    </span>
                    {panel.type === "CLP" && (
                        <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-800 ring-1 ring-inset ring-violet-100">
                            Çift yüz
                        </span>
                    )}
                </div>

                <div className="mt-3">
                    <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Görünürlük</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-indigo-50/90 to-blue-50/80 p-2.5 text-center">
                            <div className="text-[9px] font-medium uppercase tracking-wide text-blue-600/90">Sınıf</div>
                            <div className="text-2xl font-black leading-none tracking-tight text-blue-700">
                                {panel.socialGrade
                                    ? panel.socialGrade.replace("_PLUS", "+")
                                    : panel.trafficLevel === "VERY_HIGH"
                                      ? "A+"
                                      : panel.trafficLevel === "HIGH"
                                        ? "A"
                                        : panel.trafficLevel === "MEDIUM"
                                          ? "B"
                                          : "C"}
                            </div>
                            <div className="mt-0.5 truncate text-[9px] font-medium text-blue-500/90">
                                {panel.locationType ? LOCATION_TYPE_LABELS[panel.locationType] || panel.locationType : "Lokasyon"}
                            </div>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-center">
                            <div className="text-[9px] font-medium uppercase tracking-wide text-slate-500">Günlük</div>
                            <div className="text-lg font-bold tabular-nums leading-tight text-slate-900">
                                {panel.estimatedDailyImpressions > 0
                                    ? panel.estimatedDailyImpressions.toLocaleString("tr-TR")
                                    : panel.trafficLevel === "VERY_HIGH"
                                      ? "50K+"
                                      : panel.trafficLevel === "HIGH"
                                        ? "30K+"
                                        : panel.trafficLevel === "MEDIUM"
                                          ? "15K+"
                                          : "5K+"}
                            </div>
                            <div className="mt-0.5 flex items-center justify-center gap-0.5 text-[9px] font-medium text-emerald-600">
                                <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                                İzlenme
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-slate-100 bg-slate-100 text-center text-[10px] text-slate-600">
                        <div className="bg-slate-50/90 py-1.5">
                            <div className="font-semibold text-slate-800">OTS</div>
                            <div>Yüksek</div>
                        </div>
                        <div className="bg-slate-50/90 py-1.5">
                            <div className="font-semibold text-slate-800">Açı</div>
                            <div>Tam</div>
                        </div>
                        <div className="bg-slate-50/90 py-1.5">
                            <div className="font-semibold text-slate-800">Süre</div>
                            <div>7/24</div>
                        </div>
                    </div>
                </div>

                <h3 className="mb-1.5 mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Teknik</h3>
                <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                    <div className="flex flex-col rounded-md bg-slate-50/80 px-2 py-1.5">
                        <dt className="text-slate-500">Boyut</dt>
                        <dd className="font-medium text-slate-900">
                            {Number(panel.width)}×{Number(panel.height)} m
                        </dd>
                    </div>
                    <div className="flex flex-col rounded-md bg-slate-50/80 px-2 py-1.5">
                        <dt className="text-slate-500">Alan</dt>
                        <dd className="font-medium text-slate-900">{(Number(panel.width) * Number(panel.height)).toFixed(1)} m²</dd>
                    </div>
                    <div className="flex flex-col rounded-md bg-slate-50/80 px-2 py-1.5">
                        <dt className="text-slate-500">Min. kiralama</dt>
                        <dd className="font-medium text-slate-900">{panel.minRentalDays || 7} gün</dd>
                    </div>
                    <div className="flex flex-col rounded-md bg-slate-50/80 px-2 py-1.5">
                        <dt className="text-slate-500">Aydınlatma</dt>
                        <dd className="font-medium text-slate-900">LED</dd>
                    </div>
                </dl>

                {panel.address && (
                    <div className="mt-2.5 flex gap-2 rounded-md border border-slate-100 bg-slate-50/50 p-2 text-[11px] leading-snug text-slate-600">
                        <Navigation className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="line-clamp-3">{panel.address}</span>
                    </div>
                )}

                {/* Duyuru + fiyat — altta, aksiyonların hemen üstünde */}
                {panel.type === "CLP" && (
                    <div className="mt-3 rounded-lg border border-violet-100 bg-violet-50/80 p-2.5 text-[11px] leading-relaxed text-violet-900">
                        <p>
                            <span className="font-semibold">Çift yüz:</span> Fiyat tek yüz içindir; çift yüz için sepette işaretleyin.
                        </p>
                        {panel.city === "Kocaeli" && (
                            <p className="mt-1 font-medium text-orange-700">
                                20+ CLP → 1.500₺/hafta
                            </p>
                        )}
                    </div>
                )}

                <div className={`rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-3 ${panel.type === "CLP" ? "mt-2" : "mt-3"}`}>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Haftalık kiralama</div>
                    <div className="text-xl font-bold tabular-nums tracking-tight text-slate-900">{formatCurrency(Number(panel.priceWeekly))}</div>
                    <div className="text-[10px] text-slate-400">+ KDV</div>
                </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white/95 px-3 py-2.5 backdrop-blur-sm safe-padding-bottom">
                <Button
                    type="button"
                    onClick={handleAddToCart}
                    variant="outline"
                    className={`h-10 w-full border text-sm font-medium ${addedToCart ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-[#11b981] text-[#11b981] hover:bg-[#11b981]/8"}`}
                    disabled={cartLoading || addedToCart}
                >
                    {cartLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : addedToCart ? (
                        <span className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Sepete eklendi
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <ShoppingCart className="h-4 w-4" /> Sepete ekle
                        </span>
                    )}
                </Button>
                {cartError && <p className="mt-1.5 text-center text-[10px] text-red-500">{cartError}</p>}
                <p className="mt-1.5 text-center text-[10px] leading-tight text-slate-400">Tarih ve ödeme: sepet → ödeme adımları</p>
            </div>
        </div>
    );
}
