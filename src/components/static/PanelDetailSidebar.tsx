"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, MapPin, Calendar, CheckCircle2, Navigation, ShoppingCart, Loader2 } from "lucide-react";
import PanelTypeIcon from "@/components/icons/PanelTypeIcon";
import { formatCurrency } from "@/lib/utils";
import { PANEL_TYPE_LABELS } from "@/lib/turkey-data";

interface PanelDetailSidebarProps {
    panel: any;
    isOpen: boolean;
    onClose: () => void;
    onRent: () => void;
}

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

export default function PanelDetailSidebar({ panel, isOpen, onClose, onRent }: PanelDetailSidebarProps) {
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
            className={`absolute top-0 left-0 bottom-0 w-full sm:w-[400px] bg-white shadow-2xl z-30 transform transition-transform duration-300 ease-in-out border-r border-slate-200 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            {/* Header / Image */}
            <div className="relative h-64 bg-slate-100 shrink-0">
                <img
                    src={panel.imageUrl || "https://images.unsplash.com/photo-1637606346315-d353ec6d3c81?q=80&w=2000&auto=format&fit=crop"}
                    alt={panel.name}
                    className="w-full h-full object-cover"
                />
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                    <PanelTypeIcon type={panel.type} size={18} />
                    <span className="text-sm font-semibold">{PANEL_TYPE_LABELS[panel.type] || panel.type}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{panel.name}</h2>
                    <div className="flex items-center text-slate-500 text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-1 shrink-0" />
                        <span>{panel.district}, {panel.city}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        {panel.isAVM ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                🏬 AVM İçi
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                🏙️ Açık Alan
                            </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Müsait
                        </span>
                    </div>

                    {/* Price Box */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
                        <div className="text-sm text-slate-500 mb-1">Haftalık Kiralama Bedeli</div>
                        <div className="text-3xl font-bold text-slate-900">{formatCurrency(Number(panel.priceWeekly))}</div>
                        <div className="text-xs text-slate-400 mt-1">+ KDV</div>
                    </div>

                    {/* Detailed Stats / Analytics */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-slate-900 mb-3">Görünürlük & Etki Analizi</h3>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            {/* Social Grade Card */}
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                <div className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wide">Sosyal Sınıf</div>
                                <div className="text-4xl font-black text-blue-700 tracking-tight">
                                    {panel.socialGrade ? panel.socialGrade.replace('_PLUS', '+') : (
                                        // Fallback for old records
                                        panel.trafficLevel === 'VERY_HIGH' ? 'A+' :
                                            panel.trafficLevel === 'HIGH' ? 'A' :
                                                panel.trafficLevel === 'MEDIUM' ? 'B' : 'C'
                                    )}
                                </div>
                                <div className="text-[10px] text-blue-400 mt-1 font-medium">{panel.locationType || "Lokasyon"}</div>
                            </div>

                            {/* Impressions Card */}
                            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wide">Günlük Görüş</div>
                                <div className="text-2xl font-bold text-slate-900">
                                    {panel.estimatedDailyImpressions > 0
                                        ? panel.estimatedDailyImpressions.toLocaleString('tr-TR')
                                        : (panel.trafficLevel === 'VERY_HIGH' ? '50K+' :
                                            panel.trafficLevel === 'HIGH' ? '30K+' :
                                                panel.trafficLevel === 'MEDIUM' ? '15K+' : '5K+')}
                                </div>
                                <div className="text-[10px] text-green-600 mt-1 flex items-center font-medium">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                                    Aktif İzlenme
                                </div>
                            </div>
                        </div>

                        {/* Additional Metrics Row */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div>
                                <div className="font-semibold text-slate-900">OTS</div>
                                <div>Yüksek</div>
                            </div>
                            <div className="border-l border-slate-200">
                                <div className="font-semibold text-slate-900">Görüş Açısı</div>
                                <div>Tam Karşı</div>
                            </div>
                            <div className="border-l border-slate-200">
                                <div className="font-semibold text-slate-900">Süre</div>
                                <div>7/24</div>
                            </div>
                        </div>
                    </div>

                    {/* Specs List (Simplified) */}
                    <h3 className="font-semibold text-slate-900 mb-3">Teknik Detaylar</h3>
                    <div className="space-y-2 mb-6 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500">Pano Boyutları</span>
                            <span className="font-medium text-slate-900">{Number(panel.width)}m x {Number(panel.height)}m</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500">Toplam Yüzey</span>
                            <span className="font-medium text-slate-900">{(Number(panel.width) * Number(panel.height)).toFixed(1)} m²</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500">Minimum Kiralama</span>
                            <span className="font-medium text-slate-900">{panel.minRentalDays || 7} Gün</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500">Aydınlatma</span>
                            <span className="font-medium text-slate-900">Var (LED)</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Navigation className="w-4 h-4 text-slate-400" />
                            <span>{panel.address}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t bg-white safe-padding-bottom">
                <div className="flex gap-2 mb-2">
                    <Button
                        onClick={handleAddToCart}
                        variant="outline"
                        className={`flex-1 h-12 border-2 ${addedToCart ? 'border-green-500 text-green-600 bg-green-50' : 'border-blue-500 text-blue-600 hover:bg-blue-50'}`}
                        disabled={cartLoading || addedToCart}
                    >
                        {cartLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : addedToCart ? (
                            <><CheckCircle2 className="w-5 h-5 mr-2" /> Sepete Eklendi!</>
                        ) : (
                            <><ShoppingCart className="w-5 h-5 mr-2" /> Sepete Ekle</>
                        )}
                    </Button>
                    <Button onClick={onRent} className="flex-1 text-lg h-12" size="lg">
                        📅 Hemen Kirala
                    </Button>
                </div>
                {cartError && (
                    <p className="text-xs text-red-500 text-center mb-2">{cartError}</p>
                )}
                <p className="text-xs text-center text-slate-400">
                    Toplu kiralama için sepete ekleyin • İndirim fırsatları sepette!
                </p>
            </div>
        </div>
    );
}
