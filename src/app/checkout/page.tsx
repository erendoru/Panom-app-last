"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, Upload, MapPin, Calendar, User, Phone, Mail, Building2, FileText, HelpCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PANEL_TYPE_LABELS } from '@/lib/turkey-data';

interface CartItem {
    id: string;
    panelId: string;
    startDate: string | null;
    endDate: string | null;
    panel: {
        id: string;
        name: string;
        type: string;
        city: string;
        district: string;
        imageUrl?: string;
        priceWeekly: number;
        width: number;
        height: number;
    };
}

interface OrderData {
    campaignName: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    companyName: string;
    notes: string;
    hasOwnCreatives: boolean;
    needsDesignHelp: boolean;
}

const STEPS = [
    { id: 1, title: 'Kampanya', icon: FileText },
    { id: 2, title: 'Görseller', icon: Upload },
    { id: 3, title: 'Özet', icon: Check },
    { id: 4, title: 'Onay', icon: CheckCircle2 }
];

// Tasarım desteği ücreti
const DESIGN_FEE = 2500;

function getSessionId(): string {
    if (typeof window === 'undefined') return '';
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
}

export default function CheckoutPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [creativeUrls, setCreativeUrls] = useState<Record<string, string>>({});
    const [orderNumber, setOrderNumber] = useState<string>('');

    const [formData, setFormData] = useState<OrderData>({
        campaignName: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        companyName: '',
        notes: '',
        hasOwnCreatives: false,
        needsDesignHelp: false
    });

    // Fetch cart items
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const sessionId = getSessionId();
                const res = await fetch('/api/cart', {
                    headers: { 'x-session-id': sessionId }
                });
                const data = await res.json();

                if (!data.items || data.items.length === 0) {
                    router.push('/cart');
                    return;
                }

                setCartItems(data.items);
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [router]);

    // CLP double-sided selection state: panelId -> true/false
    const [clpDoubleSided, setClpDoubleSided] = useState<Record<string, boolean>>({});

    const toggleClpDoubleSided = (panelId: string) => {
        setClpDoubleSided(prev => ({
            ...prev,
            [panelId]: !prev[panelId]
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Count CLP panels in Kocaeli for bulk discount
    const kocaeliClpCount = cartItems.filter(item =>
        item.panel.type === 'CLP' && item.panel.city === 'Kocaeli'
    ).length;
    const clpBulkDiscount = kocaeliClpCount >= 20;

    const calculateTotal = () => {
        let panelsTotal = cartItems.reduce((sum, item) => {
            const weeks = item.startDate && item.endDate
                ? Math.ceil((new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / (7 * 24 * 60 * 60 * 1000))
                : 1;

            let itemPrice = item.panel.priceWeekly;

            // CLP bulk discount for Kocaeli (20+ CLP = 1500 TL)
            if (item.panel.type === 'CLP' && item.panel.city === 'Kocaeli' && clpBulkDiscount) {
                itemPrice = 1500;
            }

            // CLP double-sided: 2x price
            if (item.panel.type === 'CLP' && clpDoubleSided[item.panel.id]) {
                itemPrice = itemPrice * 2;
            }

            return sum + (itemPrice * Math.max(1, weeks));
        }, 0);

        // Tasarım desteği seçildiyse ekle
        if (formData.needsDesignHelp) {
            panelsTotal += DESIGN_FEE;
        }

        return panelsTotal;
    };

    const formatCurrency = (price: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(price);
    };

    const canProceed = () => {
        if (currentStep === 1) {
            return formData.campaignName && formData.contactName && formData.contactPhone && formData.contactEmail;
        }
        if (currentStep === 2) {
            return formData.hasOwnCreatives || formData.needsDesignHelp;
        }
        return true;
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const sessionId = getSessionId();

            // Get first item's dates as campaign dates
            const firstItem = cartItems[0];
            const startDate = firstItem?.startDate || new Date().toISOString();
            const endDate = firstItem?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId
                },
                body: JSON.stringify({
                    ...formData,
                    startDate,
                    endDate,
                    items: cartItems.map(item => ({
                        panelId: item.panel.id,
                        startDate: item.startDate || startDate,
                        endDate: item.endDate || endDate,
                        weeklyPrice: item.panel.priceWeekly,
                        creativeUrl: creativeUrls[item.panel.id] || null
                    }))
                })
            });

            const data = await res.json();

            if (res.ok) {
                setOrderNumber(data.order.orderNumber);
                setCurrentStep(4);
            } else {
                alert(data.error || 'Bir hata oluştu');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Sipariş gönderilemedi');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    {currentStep < 4 && (
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/cart">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Sepete Dön
                            </Link>
                        </Button>
                    )}
                    <h1 className="text-3xl font-bold text-slate-900">Sipariş Oluştur</h1>
                </div>

                {/* Steps Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isCompleted ? 'bg-green-500 text-white' :
                                        isActive ? 'bg-blue-600 text-white' :
                                            'bg-slate-200 text-slate-500'
                                        }`}>
                                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <span className={`ml-2 text-sm font-medium hidden sm:block ${isActive ? 'text-blue-600' : 'text-slate-500'
                                        }`}>{step.title}</span>
                                    {index < STEPS.length - 1 && (
                                        <div className={`w-12 sm:w-24 h-1 mx-2 sm:mx-4 ${isCompleted ? 'bg-green-500' : 'bg-slate-200'
                                            }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                    >
                        {/* Step 1: Campaign Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-slate-900">Kampanya Bilgileri</h2>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <FileText className="w-4 h-4 inline mr-2" />
                                        Kampanya Adı *
                                    </label>
                                    <input
                                        type="text"
                                        name="campaignName"
                                        value={formData.campaignName}
                                        onChange={handleInputChange}
                                        placeholder="Örn: 2024 Yaz Kampanyası"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <hr />
                                <h3 className="text-lg font-medium text-slate-800">İletişim Bilgileri</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            Ad Soyad *
                                        </label>
                                        <input
                                            type="text"
                                            name="contactName"
                                            value={formData.contactName}
                                            onChange={handleInputChange}
                                            placeholder="Adınız Soyadınız"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Phone className="w-4 h-4 inline mr-2" />
                                            Telefon *
                                        </label>
                                        <input
                                            type="tel"
                                            name="contactPhone"
                                            value={formData.contactPhone}
                                            onChange={handleInputChange}
                                            placeholder="0532 123 4567"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            E-posta *
                                        </label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleInputChange}
                                            placeholder="ornek@sirket.com"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Building2 className="w-4 h-4 inline mr-2" />
                                            Şirket Adı (Opsiyonel)
                                        </label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            placeholder="Şirket Adı"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Creatives */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-slate-900">Görsel Durumu</h2>
                                <p className="text-slate-600">Reklam görselleriniz hazır mı, yoksa tasarım desteği mi istiyorsunuz?</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label
                                        className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${formData.hasOwnCreatives
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            name="hasOwnCreatives"
                                            checked={formData.hasOwnCreatives}
                                            onChange={(e) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    hasOwnCreatives: e.target.checked,
                                                    needsDesignHelp: e.target.checked ? false : prev.needsDesignHelp
                                                }));
                                            }}
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.hasOwnCreatives ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900">Görsellerim Hazır</h3>
                                                <p className="text-sm text-slate-500">Tasarımlarım mevcut</p>
                                            </div>
                                        </div>
                                    </label>

                                    <label
                                        className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${formData.needsDesignHelp
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            name="needsDesignHelp"
                                            checked={formData.needsDesignHelp}
                                            onChange={(e) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    needsDesignHelp: e.target.checked,
                                                    hasOwnCreatives: e.target.checked ? false : prev.hasOwnCreatives
                                                }));
                                            }}
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.needsDesignHelp ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                <HelpCircle className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-900">Tasarım Desteği İstiyorum</h3>
                                                <p className="text-sm text-slate-500">Profesyonel tasarım hizmeti</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-purple-600">+{formatCurrency(DESIGN_FEE)}</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                {formData.hasOwnCreatives && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-800">
                                            <strong>Görsel Boyutları:</strong> Sipariş onaylandıktan sonra Panobu ekibi sizinle paylaştığınız telefon numarasıyla iletişime geçecek. Görselleriniz panolara yerleştirilecek ve fotoğrafları size mail ile iletilecek.
                                        </p>
                                    </div>
                                )}

                                {formData.needsDesignHelp && (
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                        <p className="text-sm text-purple-800">
                                            <strong>Tasarım Hizmeti:</strong> Ekibimiz sizinle iletişime geçerek bilgi alacak ve tasarımlarınızı hazırlayacak.
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Notlarınız (Opsiyonel)
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Kampanya ile ilgili eklemek istediğiniz notlar..."
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Summary */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-slate-900">Sipariş Özeti</h2>

                                {/* Campaign Info Summary */}
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <h3 className="font-medium text-slate-900 mb-2">Kampanya: {formData.campaignName}</h3>
                                    <div className="text-sm text-slate-600 space-y-1">
                                        <p><User className="w-4 h-4 inline mr-2" />{formData.contactName}</p>
                                        <p><Phone className="w-4 h-4 inline mr-2" />{formData.contactPhone}</p>
                                        <p><Mail className="w-4 h-4 inline mr-2" />{formData.contactEmail}</p>
                                        {formData.companyName && <p><Building2 className="w-4 h-4 inline mr-2" />{formData.companyName}</p>}
                                    </div>
                                </div>

                                {/* CLP Bulk Discount Notice */}
                                {kocaeliClpCount > 0 && (
                                    <div className={`rounded-lg p-3 mb-4 ${clpBulkDiscount ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                                        {clpBulkDiscount ? (
                                            <p className="text-sm text-green-700">
                                                <span className="font-bold">🎉 Tebrikler!</span> {kocaeliClpCount} CLP ile toplu indirim kazandınız! Her CLP <span className="font-bold">1.500₺/hafta</span>
                                            </p>
                                        ) : (
                                            <p className="text-sm text-orange-700">
                                                <span className="font-bold">🔥 Kampanya:</span> 20+ CLP ile her biri 1.500₺/hafta! Şu an {kocaeliClpCount} CLP seçili ({20 - kocaeliClpCount} eksik)
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Panels */}
                                <div>
                                    <h3 className="font-medium text-slate-900 mb-3">Seçilen Panolar ({cartItems.length})</h3>
                                    <div className="space-y-3">
                                        {cartItems.map(item => {
                                            const isCLP = item.panel.type === 'CLP';
                                            const isDoubleSided = clpDoubleSided[item.panel.id];
                                            let displayPrice = item.panel.priceWeekly;

                                            // Apply bulk discount
                                            if (isCLP && item.panel.city === 'Kocaeli' && clpBulkDiscount) {
                                                displayPrice = 1500;
                                            }

                                            // Apply double-sided multiplier
                                            if (isCLP && isDoubleSided) {
                                                displayPrice = displayPrice * 2;
                                            }

                                            return (
                                                <div key={item.id} className="bg-slate-50 rounded-lg p-3">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                                                            {item.panel.imageUrl ? (
                                                                <Image src={item.panel.imageUrl} alt={item.panel.name} width={64} height={64} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <MapPin className="w-6 h-6 text-slate-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-slate-900">{item.panel.name}</p>
                                                            <p className="text-sm text-slate-500">{item.panel.city}, {item.panel.district}</p>
                                                            <p className="text-xs text-blue-600">{PANEL_TYPE_LABELS[item.panel.type as keyof typeof PANEL_TYPE_LABELS]} • {item.panel.width}cm x {item.panel.height}cm</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-slate-900">{formatCurrency(displayPrice)}</p>
                                                            <p className="text-xs text-slate-500">/hafta{isDoubleSided ? ' (çift yüz)' : ''}</p>
                                                        </div>
                                                    </div>

                                                    {/* CLP Double-sided toggle */}
                                                    {isCLP && (
                                                        <div className="mt-3 pt-3 border-t border-slate-200">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-purple-700">📋 Çift Yüzlü Panel</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => setClpDoubleSided(prev => ({ ...prev, [item.panel.id]: false }))}
                                                                        className={`px-3 py-1 text-xs rounded-full transition-colors ${!isDoubleSided
                                                                            ? 'bg-purple-600 text-white'
                                                                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                                                            }`}
                                                                    >
                                                                        Tek Yüz
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setClpDoubleSided(prev => ({ ...prev, [item.panel.id]: true }))}
                                                                        className={`px-3 py-1 text-xs rounded-full transition-colors ${isDoubleSided
                                                                            ? 'bg-purple-600 text-white'
                                                                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                                                            }`}
                                                                    >
                                                                        Çift Yüz (2x)
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Creative Status */}
                                <div className="flex items-center justify-between gap-3 bg-slate-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        {formData.hasOwnCreatives ? (
                                            <>
                                                <Upload className="w-5 h-5 text-blue-600" />
                                                <span className="text-slate-700">Görseller hazır - sipariş sonrası yüklenecek</span>
                                            </>
                                        ) : (
                                            <>
                                                <HelpCircle className="w-5 h-5 text-purple-600" />
                                                <span className="text-slate-700">Tasarım desteği talep edildi</span>
                                            </>
                                        )}
                                    </div>
                                    {formData.needsDesignHelp && (
                                        <span className="font-semibold text-purple-600">+{formatCurrency(DESIGN_FEE)}</span>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center text-xl font-bold">
                                        <span>Tahmini Toplam</span>
                                        <span className="text-green-600">{formatCurrency(calculateTotal())}</span>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* Step 4: Confirmation */}
                        {currentStep === 4 && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>

                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Siparişiniz Alındı!</h2>
                                <p className="text-lg text-slate-600 mb-4">Sipariş No: <span className="font-semibold text-blue-600">{orderNumber}</span></p>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-left">
                                    <h3 className="font-semibold text-blue-900 mb-2">📞 En kısa sürede sizinle iletişime geçeceğiz</h3>
                                    <p className="text-sm text-blue-700">
                                        Ekibimiz siparişinizi inceleyecek ve detaylar için sizi arayacaktır.
                                    </p>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-6 mb-6">
                                    <h3 className="font-semibold text-slate-900 mb-3">Destek</h3>
                                    <p className="text-slate-600 mb-2">Sorularınız için bize ulaşın:</p>
                                    <a href="mailto:destek@panobu.com" className="text-blue-600 font-medium hover:underline">
                                        📧 destek@panobu.com
                                    </a>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button asChild variant="outline">
                                        <Link href="/faq">
                                            <HelpCircle className="w-4 h-4 mr-2" />
                                            Sıkça Sorulan Sorular
                                        </Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/static-billboards">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Panoları Keşfet
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                {currentStep < 4 && (
                    <div className="flex justify-between mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                            disabled={currentStep === 1}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Geri
                        </Button>

                        {currentStep < 3 ? (
                            <Button
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                disabled={!canProceed()}
                            >
                                İleri
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {submitting ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gönderiliyor...</>
                                ) : (
                                    <><Check className="w-4 h-4 mr-2" /> Siparişi Gönder</>
                                )}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
