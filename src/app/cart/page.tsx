"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { ArrowLeft, Trash2, Calendar, ShoppingCart, Zap, MapPin, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PANEL_TYPE_LABELS } from '@/lib/turkey-data';

function CartPageContent() {
    const { items, count, totals, removeFromCart, updateItemDates, clearCart, loading, calculateTotals } = useCart();
    const [dateSelections, setDateSelections] = useState<Record<string, { start: string; end: string }>>({});

    // Initialize date selections when items load
    useEffect(() => {
        const newSelections: Record<string, { start: string; end: string }> = {};
        items.forEach(item => {
            if (!dateSelections[item.id]) {
                // Default: start tomorrow, end next week
                const start = new Date();
                start.setDate(start.getDate() + 1);
                const end = new Date(start);
                end.setDate(end.getDate() + 7);

                newSelections[item.id] = {
                    start: item.startDate || start.toISOString().split('T')[0],
                    end: item.endDate || end.toISOString().split('T')[0]
                };
            }
        });
        if (Object.keys(newSelections).length > 0) {
            setDateSelections(prev => ({ ...prev, ...newSelections }));
        }
    }, [items]);

    const handleDateChange = async (itemId: string, type: 'start' | 'end', value: string) => {
        setDateSelections(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], [type]: value }
        }));

        const sel = dateSelections[itemId];
        const start = type === 'start' ? value : sel?.start;
        const end = type === 'end' ? value : sel?.end;

        if (start && end) {
            await updateItemDates(itemId, start, end);
        }
    };

    const applyToAll = () => {
        if (items.length === 0) return;
        const firstDates = dateSelections[items[0].id];
        if (!firstDates) return;

        const newSelections: Record<string, { start: string; end: string }> = {};
        items.forEach(async item => {
            newSelections[item.id] = { ...firstDates };
            await updateItemDates(item.id, firstDates.start, firstDates.end);
        });
        setDateSelections(newSelections);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(price);
    };

    const getPanelTypeLabel = (type: string) => {
        return PANEL_TYPE_LABELS[type as keyof typeof PANEL_TYPE_LABELS] || type;
    };

    if (count === 0) {
        return (
            <div className="min-h-screen bg-slate-50 pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center py-16">
                        <ShoppingCart className="w-24 h-24 mx-auto text-slate-300 mb-6" />
                        <h1 className="text-3xl font-bold text-slate-900 mb-4">Sepetiniz Boş</h1>
                        <p className="text-slate-600 mb-8">Henüz sepetinize pano eklemediniz.</p>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link href="/static-billboards">
                                <MapPin className="w-4 h-4 mr-2" />
                                Panoları Keşfet
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Button asChild variant="outline" className="mb-4">
                        <Link href="/static-billboards">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Panolara Dön
                        </Link>
                    </Button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Sepetim</h1>
                            <p className="text-slate-600">{count} pano seçili</p>
                        </div>
                        <Button variant="outline" onClick={clearCart} className="text-red-600 border-red-300 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Sepeti Temizle
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Apply to All Date */}
                        {items.length > 1 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm text-blue-800">İlk panonun tarihlerini tümüne uygula</span>
                                </div>
                                <Button size="sm" variant="outline" onClick={applyToAll} className="text-blue-600 border-blue-300">
                                    Tümüne Uygula
                                </Button>
                            </div>
                        )}

                        <AnimatePresence>
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image */}
                                        <div className="md:w-48 h-40 md:h-auto bg-slate-100 relative flex-shrink-0">
                                            {item.panel.imageUrl ? (
                                                <Image
                                                    src={item.panel.imageUrl}
                                                    alt={item.panel.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <MapPin className="w-12 h-12" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        {getPanelTypeLabel(item.panel.type)}
                                                    </span>
                                                    <h3 className="text-lg font-semibold text-slate-900 mt-2">{item.panel.name}</h3>
                                                    <p className="text-sm text-slate-500">{item.panel.city}, {item.panel.district}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Sepetten Çıkar"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {/* Date Selection */}
                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">Başlangıç</label>
                                                    <input
                                                        type="date"
                                                        value={dateSelections[item.id]?.start || ''}
                                                        onChange={(e) => handleDateChange(item.id, 'start', e.target.value)}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">Bitiş</label>
                                                    <input
                                                        type="date"
                                                        value={dateSelections[item.id]?.end || ''}
                                                        onChange={(e) => handleDateChange(item.id, 'end', e.target.value)}
                                                        min={dateSelections[item.id]?.start || new Date().toISOString().split('T')[0]}
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="mt-4 text-right">
                                                <p className="text-lg font-bold text-slate-900">{formatPrice(item.panel.priceWeekly)}<span className="text-sm font-normal text-slate-500">/hafta</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Sipariş Özeti</h2>

                            {/* Discount Suggestions */}
                            {totals.suggestions.length > 0 && (
                                <div className="mb-6 space-y-2">
                                    {totals.suggestions.map((suggestion, i) => (
                                        <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2">
                                                <Zap className="w-4 h-4 text-yellow-600" />
                                                <span className="text-sm font-medium text-yellow-800">
                                                    {suggestion.neededCount} adet daha {getPanelTypeLabel(suggestion.panelType)} ekle!
                                                </span>
                                            </div>
                                            <p className="text-xs text-yellow-700 mt-1">
                                                {suggestion.discountPercent
                                                    ? `%${suggestion.discountPercent} indirim kazan`
                                                    : `Birim fiyat ${formatPrice(suggestion.fixedUnitPrice || 0)}'ye düşer`
                                                }
                                            </p>
                                            <p className="text-xs text-yellow-600 mt-1">
                                                Potansiyel tasarruf: {formatPrice(suggestion.potentialSavings)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>Ara Toplam</span>
                                    <span>{formatPrice(totals.subtotal)}</span>
                                </div>
                                {totals.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>İndirim</span>
                                        <span>-{formatPrice(totals.discount)}</span>
                                    </div>
                                )}
                                <hr className="border-slate-200" />
                                <div className="flex justify-between text-xl font-bold text-slate-900">
                                    <span>Toplam</span>
                                    <span>{formatPrice(totals.total)}</span>
                                </div>
                            </div>

                            <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                                <Link href="/checkout">
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Devam Et
                                </Link>
                            </Button>

                            <p className="text-xs text-slate-500 text-center mt-4">
                                Sonraki adımda kampanya bilgilerinizi girin
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CartPage() {
    return (
        <CartProvider>
            <CartPageContent />
        </CartProvider>
    );
}
