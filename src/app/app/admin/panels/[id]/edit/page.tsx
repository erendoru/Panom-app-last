"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
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
    const [uploading, setUploading] = useState(false);
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
        blockedDates: [] as BlockedDateRange[]
    });

    useEffect(() => {
        fetchPanel();
    }, []);

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];
        setUploading(true);

        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: data
            });

            if (!res.ok) throw new Error("Upload failed");

            const json = await res.json();
            setFormData(prev => ({ ...prev, imageUrl: json.url }));
        } catch (error) {
            console.error("Upload error:", error);
            alert("Görsel yüklenirken bir hata oluştu.");
        } finally {
            setUploading(false);
        }
    };

    // ... (existing code)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting form...', formData);
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/admin/panels/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                console.log('Update successful');
                router.refresh();
                router.push('/app/admin/panels');
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
            <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
                <p className="text-slate-600">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Button asChild variant="outline" className="mb-4">
                        <Link href="/app/admin/panels">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Geri Dön
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-900">Pano Düzenle</h1>
                    <p className="text-slate-600 mt-1">{formData.name}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-8">
                    {/* Same form fields as create page */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Temel Bilgiler</h2>
                        <div className="grid md:grid-cols-2 gap-4">
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

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    İlçe <span className="text-red-500">*</span>
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
                                    Adres <span className="text-red-500">*</span>
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
                                    Enlem (Latitude) <span className="text-red-500">*</span>
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
                                    Boylam (Longitude) <span className="text-red-500">*</span>
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

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Genişlik (m) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="width"
                                    value={formData.width}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Yükseklik (m) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
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

                            <div className="md:col-span-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={formData.active}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-700">Pano aktif</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Pano Görseli */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Pano Görseli</h2>
                        <div className="space-y-4">
                            {formData.imageUrl ? (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                    <Image src={formData.imageUrl} alt="Panel" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-2 text-slate-500">
                                        {uploading ? (
                                            <>
                                                <Loader2 className="w-8 h-8 animate-spin" />
                                                <p>Yükleniyor...</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8" />
                                                <p>Görsel yüklemek için tıklayın veya sürükleyin</p>
                                                <p className="text-xs text-slate-400">PNG, JPG (Max 10MB)</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Availability Calendar */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Müsaitlik ve Engellemeler</h2>
                        <AvailabilityCalendar
                            blockedDates={formData.blockedDates}
                            onChange={(newDates) => setFormData(prev => ({ ...prev, blockedDates: newDates }))}
                        />
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
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
