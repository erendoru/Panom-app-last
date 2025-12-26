"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Pencil, Trash2, MapPin, Zap } from 'lucide-react';
import {
    TURKEY_CITIES,
    TURKEY_DISTRICTS,
    PANEL_TYPE_LABELS,
    TRAFFIC_LEVEL_LABELS,
    TRAFFIC_LEVEL_COLORS
} from '@/lib/turkey-data';

interface Panel {
    id: string;
    name: string;
    type: string;
    city: string;
    district: string;
    address: string;
    width: number;
    height: number;
    priceWeekly: number;
    isAVM: boolean;
    avmName?: string;
    trafficLevel: string;
    estimatedDailyImpressions: number;
    active: boolean;
    rentals: any[];
    createdAt: string;
}

export default function AdminPanelsPage() {
    const [panels, setPanels] = useState<Panel[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedAVM, setSelectedAVM] = useState(false);

    useEffect(() => {
        fetchPanels();
    }, []);

    const fetchPanels = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCity) params.append('city', selectedCity);
            if (selectedDistrict) params.append('district', selectedDistrict);
            if (selectedType) params.append('type', selectedType);
            if (selectedAVM) params.append('isAVM', 'true');

            const res = await fetch(`/api/admin/panels?${params.toString()}`);
            const data = await res.json();

            // Ensure data is always an array
            if (Array.isArray(data)) {
                setPanels(data);
            } else {
                console.error('API response is not an array:', data);
                setPanels([]);
            }
        } catch (error) {
            console.error('Error fetching panels:', error);
            setPanels([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu panoyu silmek istediğinizden emin misiniz?')) return;

        try {
            const res = await fetch(`/api/admin/panels/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchPanels();
            } else {
                const data = await res.json();
                alert(data.error || 'Silme işlemi başarısız');
            }
        } catch (error) {
            console.error('Error deleting panel:', error);
            alert('Bir hata oluştu');
        }
    };

    const applyFilters = () => {
        fetchPanels();
    };

    const clearFilters = () => {
        setSelectedCity('');
        setSelectedDistrict('');
        setSelectedType('');
        setSelectedAVM(false);
        setTimeout(() => fetchPanels(), 100);
    };

    const districts = selectedCity ? TURKEY_DISTRICTS[selectedCity] || [] : [];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Pano Yönetimi</h1>
                        <p className="text-slate-600 mt-1 text-sm md:text-base">Tüm klasik panoları görüntüleyin ve yönetin</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button asChild variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 flex-1 sm:flex-none">
                            <Link href="/app/admin/panels/quick-add">
                                <Zap className="w-4 h-4 mr-2" />
                                Hızlı Ekle
                            </Link>
                        </Button>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
                            <Link href="/app/admin/panels/new">
                                <Plus className="w-4 h-4 mr-2" />
                                Yeni Pano Ekle
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 md:p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-slate-600" />
                        <h2 className="text-lg font-semibold text-slate-900">Filtreler</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">İl</label>
                            <select
                                value={selectedCity}
                                onChange={(e) => {
                                    setSelectedCity(e.target.value);
                                    setSelectedDistrict('');
                                }}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Tüm İller</option>
                                {TURKEY_CITIES.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">İlçe</label>
                            <select
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                disabled={!selectedCity || districts.length === 0}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
                            >
                                <option value="">Tüm İlçeler</option>
                                {districts.map((district) => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Pano Türü</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Tüm Türler</option>
                                {Object.entries(PANEL_TYPE_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">AVM</label>
                            <label className="flex items-center space-x-2 mt-2">
                                <input
                                    type="checkbox"
                                    checked={selectedAVM}
                                    onChange={(e) => setSelectedAVM(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700">Sadece AVM Panoları</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
                            Filtrele
                        </Button>
                        <Button onClick={clearFilters} variant="outline">
                            Temizle
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <p className="text-sm text-slate-600">Toplam Pano</p>
                        <p className="text-2xl font-bold text-slate-900">{panels.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <p className="text-sm text-slate-600">Aktif Panolar</p>
                        <p className="text-2xl font-bold text-green-600">
                            {panels.filter(p => p.active).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <p className="text-sm text-slate-600">AVM Panoları</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {panels.filter(p => p.isAVM).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                        <p className="text-sm text-slate-600">Kiralanan</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {panels.filter(p => p.rentals.some((r: any) => r.status === 'ACTIVE')).length}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <p className="text-slate-600">Yükleniyor...</p>
                        </div>
                    ) : panels.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-slate-600">Pano bulunamadı</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Pano Adı
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Tür
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Lokasyon
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Ölçü
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Fiyat/Hafta
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Trafik
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                Durum
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                                                İşlemler
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {panels.map((panel) => (
                                            <tr key={panel.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-900">{panel.name}</div>
                                                            {panel.isAVM && (
                                                                <div className="text-xs text-purple-600">🏬 {panel.avmName}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                        {PANEL_TYPE_LABELS[panel.type]}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-slate-900">{panel.city}, {panel.district}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {panel.address.substring(0, 30)}...
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                                    {panel.width}m × {panel.height}m
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                    ₺{Number(panel.priceWeekly).toLocaleString('tr-TR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded ${TRAFFIC_LEVEL_COLORS[panel.trafficLevel]}`}>
                                                        {TRAFFIC_LEVEL_LABELS[panel.trafficLevel]}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {panel.active ? (
                                                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                                            Pasif
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/app/admin/panels/${panel.id}/edit`}
                                                            className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-blue-600 hover:text-blue-700 transition-colors"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(panel.id)}
                                                            className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-red-600 hover:text-red-700 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden divide-y divide-slate-200">
                                {panels.map((panel) => (
                                    <div key={panel.id} className="p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-medium text-slate-900">{panel.name}</h3>
                                                {panel.isAVM && (
                                                    <p className="text-xs text-purple-600">🏬 {panel.avmName}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/app/admin/panels/${panel.id}/edit`}
                                                    className="p-2 rounded-md border border-slate-300 bg-white text-blue-600"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(panel.id)}
                                                    className="p-2 rounded-md border border-slate-300 bg-white text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                {PANEL_TYPE_LABELS[panel.type]}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${TRAFFIC_LEVEL_COLORS[panel.trafficLevel]}`}>
                                                {TRAFFIC_LEVEL_LABELS[panel.trafficLevel]}
                                            </span>
                                            {panel.active ? (
                                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                                    Pasif
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-slate-500">Lokasyon</p>
                                                <p className="text-slate-900">{panel.city}, {panel.district}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">Ölçü</p>
                                                <p className="text-slate-900">{panel.width}m × {panel.height}m</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">Fiyat/Hafta</p>
                                                <p className="font-medium text-slate-900">₺{Number(panel.priceWeekly).toLocaleString('tr-TR')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
