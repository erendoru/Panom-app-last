"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, ChevronUp, ChevronDown } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import {
    TURKEY_CITIES,
    TURKEY_DISTRICTS,
    PANEL_TYPE_LABELS
} from '@/lib/turkey-data';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';

// Dynamically import MapPicker (client-only component)
const MapPicker = dynamic(() => import('@/components/MapPicker'), {
    ssr: false,
    loading: () => <div className="h-[400px] bg-slate-100 rounded-lg flex items-center justify-center">Harita yükleniyor...</div>
});

interface BlockedDateRange {
    startDate: string;
    endDate: string;
    reason?: string;
}

export default function EditPanelPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        type: 'BILLBOARD',
        subType: '',
        city: '',
        district: '',
        address: '',
        latitude: '',
        longitude: '',
        width: '',
        height: '',
        priceWeekly: '',
        priceDaily: '',
        minRentalDays: 7,
        isAVM: false,
        avmName: '',
        estimatedDailyImpressions: '',
        trafficLevel: 'MEDIUM',
        imageUrl: '',
        active: true,
        ownerName: '',
        ownerPhone: '',
        blockedDates: [] as BlockedDateRange[]
    });

    // Panel navigation state
    const [panelIds, setPanelIds] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    // Fetch all panel IDs for navigation
    useEffect(() => {
        const fetchPanelIds = async () => {
            try {
                const res = await fetch('/api/admin/panels');
                const data = await res.json();
                if (Array.isArray(data)) {
                    const ids = data.map((p: any) => p.id);
                    setPanelIds(ids);
                    const idx = ids.indexOf(params.id as string);
                    setCurrentIndex(idx);
                }
            } catch (error) {
                console.error('Error fetching panel list:', error);
            }
        };
        fetchPanelIds();
    }, [params.id]);

    // Navigate to next panel
    const goToNextPanel = useCallback(() => {
        if (currentIndex < panelIds.length - 1) {
            const nextId = panelIds[currentIndex + 1];
            router.push(`/app/admin/panels/${nextId}/edit`);
        }
    }, [currentIndex, panelIds, router]);

    // Navigate to previous panel
    const goToPreviousPanel = useCallback(() => {
        if (currentIndex > 0) {
            const prevId = panelIds[currentIndex - 1];
            router.push(`/app/admin/panels/${prevId}/edit`);
        }
    }, [currentIndex, panelIds, router]);

    // Keyboard navigation - J for next, K for previous
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if user is typing in an input/textarea
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLSelectElement
            ) {
                return;
            }

            if (e.key === 'j' || e.key === 'J') {
                e.preventDefault();
                goToNextPanel();
            } else if (e.key === 'k' || e.key === 'K') {
                e.preventDefault();
                goToPreviousPanel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToNextPanel, goToPreviousPanel]);

    useEffect(() => {
        fetchPanel();
    }, [params.id]);

    const fetchPanel = async () => {
        try {
            const res = await fetch(`/api/admin/panels/${params.id}`);
            const data = await res.json();

            setFormData({
                name: data.name || '',
                type: data.type || 'BILLBOARD',
                subType: data.subType || '',
                city: data.city || '',
                district: data.district || '',
                address: data.address || '',
                latitude: String(data.latitude || ''),
                longitude: String(data.longitude || ''),
                width: String(data.width || ''),
                height: String(data.height || ''),
                priceWeekly: String(data.priceWeekly || ''),
                priceDaily: data.priceDaily ? String(data.priceDaily) : '',
                minRentalDays: data.minRentalDays || 7,
                isAVM: data.isAVM || false,
                avmName: data.avmName || '',
                estimatedDailyImpressions: String(data.estimatedDailyImpressions || ''),
                trafficLevel: data.trafficLevel || 'MEDIUM',
                imageUrl: data.imageUrl || '',
                active: data.active !== undefined ? data.active : true,
                ownerName: data.ownerName || '',
                ownerPhone: data.ownerPhone || '',
                blockedDates: (data.blockedDates as BlockedDateRange[]) || []
            });
        } catch (error) {
            console.error('Error fetching panel:', error);
            alert('Pano yüklenemedi');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));

            if (name === 'city') {
                setFormData(prev => ({ ...prev, district: '' }));
            }
        }
    };

    const [error, setError] = useState('');

    // ... (existing code)

    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting form...', formData);
        setLoading(true);
        setError('');
        setSaveSuccess(false);

        try {
            const res = await fetch(`/api/admin/panels/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                console.log('Update successful');
                setSaveSuccess(true);
                // Auto-hide success message after 3 seconds
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                const data = await res.json();
                console.error('Update failed:', data);
                setError(data.error || 'Bir hata oluştu');
            }
        } catch (error) {
            console.error('Error updating panel:', error);
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const districts = formData.city ? TURKEY_DISTRICTS[formData.city] || [] : [];

    if (fetching) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
                <p className="text-slate-600">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <Button asChild variant="outline">
                            <Link href="/app/admin/panels">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Geri Dön
                            </Link>
                        </Button>

                        {/* Panel Navigation */}
                        {panelIds.length > 1 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500 hidden sm:inline">
                                    {currentIndex + 1} / {panelIds.length}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={goToPreviousPanel}
                                        disabled={currentIndex <= 0}
                                        className="p-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Önceki pano (K)"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={goToNextPanel}
                                        disabled={currentIndex >= panelIds.length - 1}
                                        className="p-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Sonraki pano (J)"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-xs text-slate-400 hidden md:inline ml-2">
                                    K/J tuşları
                                </span>
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Pano Düzenle</h1>
                    <p className="text-slate-600 mt-1">{formData.name}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Success Toast */}
                {saveSuccess && (
                    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
                        <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-medium">Kaydedildi!</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-8 space-y-6 md:space-y-8">

                    {/* Durum - En üstte ve belirgin */}
                    <div className={`p-4 rounded-xl border-2 ${formData.active ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Pano Durumu</h2>
                                <p className={`text-sm ${formData.active ? 'text-green-700' : 'text-yellow-700'}`}>
                                    {formData.active ? '✓ Pano sitede görünür durumda' : '⚠ Pano taslak/pasif durumda'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                                className="flex items-center gap-3"
                            >
                                <span className={`text-sm font-medium ${formData.active ? 'text-green-700' : 'text-slate-500'}`}>
                                    {formData.active ? 'Aktif' : 'Pasif'}
                                </span>
                                <div className={`relative w-14 h-8 rounded-full transition-colors ${formData.active ? 'bg-green-500' : 'bg-slate-300'}`}>
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${formData.active ? 'translate-x-7' : 'translate-x-1'}`} />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Temel Bilgiler */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Temel Bilgiler</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Pano Adı
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Pano Türü
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {Object.entries(PANEL_TYPE_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Alt Tür (Opsiyonel)
                                </label>
                                <input
                                    type="text"
                                    name="subType"
                                    value={formData.subType}
                                    onChange={handleChange}
                                    placeholder="Örn: İçmekan, Dışmekan, Işıklı"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lokasyon */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Lokasyon Bilgileri</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    İl
                                </label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seçiniz</option>
                                    {TURKEY_CITIES.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    İlçe
                                </label>
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seçiniz</option>
                                    {districts.map((district) => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Adres
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    rows={2}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Enlem (Latitude)
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Boylam (Longitude)
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-900 mb-2">
                                    Haritadan Konum Seç
                                </label>
                                <MapPicker
                                    latitude={parseFloat(formData.latitude) || 40.7678}
                                    longitude={parseFloat(formData.longitude) || 29.7944}
                                    onLocationSelect={(lat, lng) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            latitude: lat.toFixed(6),
                                            longitude: lng.toFixed(6)
                                        }));
                                    }}
                                    height="400px"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ölçüler ve Fiyat */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Ölçüler ve Fiyatlandırma</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Genişlik
                                </label>
                                <input
                                    type="text"
                                    name="width"
                                    value={formData.width}
                                    onChange={handleChange}
                                    required
                                    placeholder="Örn: 5m veya 150cm"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">metre (m) veya santimetre (cm) olarak girebilirsiniz</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Yükseklik
                                </label>
                                <input
                                    type="text"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    required
                                    placeholder="Örn: 3m veya 200cm"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">metre (m) veya santimetre (cm) olarak girebilirsiniz</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Haftalık Fiyat (₺)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="priceWeekly"
                                    value={formData.priceWeekly}
                                    onChange={handleChange}
                                    required
                                    placeholder="Örn: 15000"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Günlük Fiyat (₺) (Opsiyonel)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="priceDaily"
                                    value={formData.priceDaily}
                                    onChange={handleChange}
                                    placeholder="Örn: 2500"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Minimum Kiralama Süresi
                                </label>
                                <select
                                    name="minRentalDays"
                                    value={formData.minRentalDays}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="1">Günlük (1 gün)</option>
                                    <option value="7">Haftalık (7 gün)</option>
                                    <option value="10">10 Günlük</option>
                                    <option value="14">2 Haftalık (14 gün)</option>
                                    <option value="30">Aylık (30 gün)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Analytics */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Analytics ve Trafik</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Tahmini Günlük Gösterim
                                </label>
                                <input
                                    type="number"
                                    name="estimatedDailyImpressions"
                                    value={formData.estimatedDailyImpressions}
                                    onChange={handleChange}
                                    placeholder="Örn: 50000"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Trafik Seviyesi
                                </label>
                                <select
                                    name="trafficLevel"
                                    value={formData.trafficLevel}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="LOW">Düşük Trafik</option>
                                    <option value="MEDIUM">Orta Trafik</option>
                                    <option value="HIGH">Yüksek Trafik</option>
                                    <option value="VERY_HIGH">Çok Yüksek Trafik</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* AVM */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">AVM Bilgileri</h2>
                        <div className="space-y-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isAVM"
                                    checked={formData.isAVM}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700">Bu pano bir AVM'de bulunuyor</span>
                            </label>

                            {formData.isAVM && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        AVM Adı
                                    </label>
                                    <input
                                        type="text"
                                        name="avmName"
                                        value={formData.avmName}
                                        onChange={handleChange}
                                        required={formData.isAVM}
                                        placeholder="Örn: Gebze Center AVM"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pano Sahibi Bilgileri (Sadece Admin görür) */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">🔒 Pano Sahibi Bilgileri</h2>
                        <p className="text-xs text-yellow-700 mb-4">Bu bilgiler sadece admin panelinde görünür, müşteriler göremez.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Pano Sahibi Adı
                                </label>
                                <input
                                    type="text"
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleChange}
                                    placeholder="Örn: Kentvizyon"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">İndirim kuralları için kullanılır</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Pano Sahibi Telefonu
                                </label>
                                <input
                                    type="text"
                                    name="ownerPhone"
                                    value={formData.ownerPhone}
                                    onChange={handleChange}
                                    placeholder="Örn: 0532 123 4567"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pano Görseli */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Pano Görseli</h2>
                        <ImageUploader
                            imageUrl={formData.imageUrl}
                            onImageChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                            disabled={loading}
                        />
                    </div>

                    {/* Availability Calendar */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Müsaitlik ve Engellemeler</h2>
                        <AvailabilityCalendar
                            blockedDates={formData.blockedDates}
                            onChange={(newDates) => setFormData(prev => ({ ...prev, blockedDates: newDates }))}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 touch-manipulation"
                            onClick={(e) => {
                                // Ensure form submits on mobile
                                if (!loading) {
                                    e.currentTarget.closest('form')?.requestSubmit();
                                }
                            }}
                        >
                            {loading ? 'Kaydediliyor...' : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Değişiklikleri Kaydet
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => router.push('/app/admin/panels')}
                            variant="outline"
                        >
                            İptal
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
