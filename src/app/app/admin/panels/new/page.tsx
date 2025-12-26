"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import {
    TURKEY_CITIES,
    TURKEY_DISTRICTS,
    PANEL_TYPE_LABELS
} from '@/lib/turkey-data';

// Dynamically import MapPicker (client-only component)
const MapPicker = dynamic(() => import('@/components/MapPicker'), {
    ssr: false,
    loading: () => <div className="h-[400px] bg-slate-100 rounded-lg flex items-center justify-center">Harita yükleniyor...</div>
});

export default function NewPanelPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
        active: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));

            // İl değiştiğinde ilçeyi sıfırla
            if (name === 'city') {
                setFormData(prev => ({ ...prev, district: '' }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/panels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Pano başarıyla eklendi!');
                router.push('/app/admin/panels');
            } else {
                const data = await res.json();
                alert(data.error || 'Bir hata oluştu');
            }
        } catch (error) {
            console.error('Error creating panel:', error);
            alert('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const districts = formData.city ? TURKEY_DISTRICTS[formData.city] || [] : [];

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button asChild variant="outline" className="mb-4">
                        <Link href="/app/admin/panels">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Geri Dön
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-900">Yeni Pano Ekle</h1>
                    <p className="text-slate-600 mt-1">Klasik billboard/outdoor pano ekleyin</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-8 space-y-6 md:space-y-8">
                    {/* Temel Bilgiler */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Temel Bilgiler</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Pano Adı <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Örn: Gebze Center AVM Girişi"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Pano Türü <span className="text-red-500">*</span>
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
                                    İl <span className="text-red-500">*</span>
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
                                    İlçe <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.city || districts.length === 0}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
                                >
                                    <option value="">Seçiniz</option>
                                    {districts.map((district) => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Adres <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    rows={2}
                                    placeholder="Tam adres giriniz"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Enlem (Latitude) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    required
                                    placeholder="40.7897..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Boylam (Longitude) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    required
                                    placeholder="29.4104..."
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
                                    Genişlik <span className="text-red-500">*</span>
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
                                    Yükseklik <span className="text-red-500">*</span>
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
                                    Haftalık Fiyat (₺) <span className="text-red-500">*</span>
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
                                    Minimum Kiralama Süresi <span className="text-red-500">*</span>
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
                                    <option value="14">2 Haftalık (14 gün)</option>
                                    <option value="30">Aylık (30 gün)</option>
                                </select>
                                <p className="text-xs text-slate-500 mt-1">Müşteriler bu panoyu minimum bu süre için kiralayabilir.</p>
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
                                        AVM Adı <span className="text-red-500">*</span>
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

                    {/* Görsel Yükleme */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Pano Görseli</h2>
                        <ImageUploader
                            imageUrl={formData.imageUrl}
                            onImageChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                            disabled={loading}
                        />
                    </div>

                    {/* Diğer */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Diğer Ayarlar</h2>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-700">Panoyu aktif olarak yayınla</span>
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? 'Kaydediliyor...' : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Panoyu Kaydet
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
