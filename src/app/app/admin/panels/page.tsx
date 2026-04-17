"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Pencil, Trash2, MapPin, Zap, Save, X, CheckSquare, Upload, Images, Loader2, Activity, RefreshCw } from 'lucide-react';
import {
    TURKEY_CITIES,
    TURKEY_DISTRICTS,
    PANEL_TYPE_LABELS,
    TRAFFIC_LEVEL_LABELS,
    TRAFFIC_LEVEL_COLORS
} from '@/lib/turkey-data';
import PendingPanelsBanner from '@/components/admin/PendingPanelsBanner';

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
    ownerName?: string;
    ownerPhone?: string;
    ownerId?: string | null;
    owner?: {
        id: string;
        companyName: string;
        slug: string | null;
        user?: { name?: string | null; email?: string | null } | null;
    } | null;
}

interface EditedPanel {
    name?: string;
    priceWeekly?: number;
    width?: number;
    height?: number;
    ownerName?: string;
    ownerPhone?: string;
}

export default function AdminPanelsPage() {
    const [panels, setPanels] = useState<Panel[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Inline editing state
    const [editedPanels, setEditedPanels] = useState<Record<string, EditedPanel>>({});
    const [selectedPanels, setSelectedPanels] = useState<Set<string>>(new Set());

    // Bulk update state
    const [showBulkUpdate, setShowBulkUpdate] = useState(false);
    const [bulkPrice, setBulkPrice] = useState('');
    const [showBulkRename, setShowBulkRename] = useState(false);
    const [bulkName, setBulkName] = useState('');
    const [bulkActionLoading, setBulkActionLoading] = useState(false);

    const [mirrorPending, setMirrorPending] = useState<number | null>(null);
    const [mirrorHasKey, setMirrorHasKey] = useState(true);
    const [mirrorBusy, setMirrorBusy] = useState(false);

    // T2: Traffic score batch
    const [trafficMissing, setTrafficMissing] = useState<number | null>(null);
    const [trafficTotal, setTrafficTotal] = useState<number | null>(null);
    const [trafficBusy, setTrafficBusy] = useState(false);
    const [trafficAllBusy, setTrafficAllBusy] = useState(false);
    const [trafficProgress, setTrafficProgress] = useState<{ done: number; total: number; updated: number; failed: number } | null>(null);

    // Filters
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedAVM, setSelectedAVM] = useState(false);

    useEffect(() => {
        fetchPanels();
    }, []);

    const refreshMirrorPending = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/panels/mirror-images');
            const data = await res.json();
            if (res.ok && typeof data.pending === 'number') {
                setMirrorPending(data.pending);
                setMirrorHasKey(data.hasServiceKey !== false);
            }
        } catch {
            /* ignore */
        }
    }, []);

    const refreshTrafficStatus = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/panels/traffic-scores');
            const data = await res.json();
            if (res.ok) {
                if (typeof data.withoutScore === 'number') setTrafficMissing(data.withoutScore);
                if (typeof data.total === 'number') setTrafficTotal(data.total);
            }
        } catch {
            /* ignore */
        }
    }, []);

    useEffect(() => {
        refreshMirrorPending();
        refreshTrafficStatus();
    }, [refreshMirrorPending, refreshTrafficStatus, panels.length]);

    const runTrafficBatch = async () => {
        if (trafficBusy) return;
        const confirmed = window.confirm(
            `Trafik skoru olmayan ${trafficMissing ?? 0} pano için skor hesaplansın mı?\n\nOpenStreetMap'ten veri çekilecek; tahmini süre ~${Math.ceil(((trafficMissing ?? 0) * 0.6))} saniye.`
        );
        if (!confirmed) return;
        setTrafficBusy(true);
        try {
            const res = await fetch('/api/admin/panels/traffic-scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ limit: 40 }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Hesaplama başarısız');
            alert(
                `Tamamlandı:\n• İşlenen: ${data.processed}\n• Güncellenen: ${data.updated}\n• Hata: ${data.failed}`
            );
            refreshTrafficStatus();
            fetchPanels();
        } catch (err: any) {
            alert(`Hata: ${err?.message || 'bilinmeyen'}`);
        } finally {
            setTrafficBusy(false);
        }
    };

    const runMirrorExternalImages = async () => {
        if (!mirrorHasKey) {
            alert(
                'SUPABASE_SERVICE_ROLE_KEY .env dosyasında tanımlı değil. Supabase → Project Settings → API → service_role anahtarını ekleyin; ardından sunucuyu yeniden başlatın.'
            );
            return;
        }
        if (
            !confirm(
                'Google / harici sunucudaki görsel bağlantıları indirip kendi Supabase depomuza yükleyeceğiz (tek seferde en fazla 100 pano). Devam edilsin mi?'
            )
        ) {
            return;
        }
        setMirrorBusy(true);
        try {
            const res = await fetch('/api/admin/panels/mirror-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ limit: 100 }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'İşlem başarısız');
                return;
            }
            const failed = (data.results || []).filter((r: { ok: boolean }) => !r.ok) as { name: string; error?: string }[];
            const lines = failed.slice(0, 8).map((r) => `• ${r.name}: ${r.error || 'bilinmeyen'}`);
            alert([data.message, failed.length > 8 ? `…ve ${failed.length - 8} hata daha` : '', '', ...lines].filter(Boolean).join('\n'));
            await fetchPanels();
            await refreshMirrorPending();
        } catch {
            alert('Bağlantı hatası');
        } finally {
            setMirrorBusy(false);
        }
    };

    const runTrafficBatchAll = async () => {
        if (trafficAllBusy || trafficBusy) return;

        const totalPanels = trafficTotal ?? panels.length;
        if (totalPanels === 0) {
            alert('Hesaplanacak pano bulunamadı.');
            return;
        }

        const estSec = Math.ceil(totalPanels * 0.6);
        const confirmed = window.confirm(
            `Tüm ${totalPanels} pano için trafik skoru YENİDEN hesaplanacak.\n` +
            `(Zaten skoru olanlar da yeniden hesaplanır — OSM'den güncel veri çekilir)\n\n` +
            `Tahmini süre: ~${Math.floor(estSec / 60)} dk ${estSec % 60} sn\n\n` +
            `Devam edilsin mi?`
        );
        if (!confirmed) return;

        setTrafficAllBusy(true);
        setTrafficProgress({ done: 0, total: totalPanels, updated: 0, failed: 0 });

        try {
            // Tüm panel ID'lerini çek
            const listRes = await fetch('/api/admin/panels');
            const list = await listRes.json();
            if (!Array.isArray(list)) throw new Error('Pano listesi alınamadı');

            const ids: string[] = list.map((p: { id: string }) => p.id);
            const BATCH = 40; // API tarafında rate-limit (500ms/OSM req) ile uyumlu
            let doneTotal = 0;
            let updatedTotal = 0;
            let failedTotal = 0;

            for (let i = 0; i < ids.length; i += BATCH) {
                const slice = ids.slice(i, i + BATCH);
                try {
                    const res = await fetch('/api/admin/panels/traffic-scores', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ panelIds: slice, limit: BATCH }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data?.error || `Batch ${i / BATCH + 1} başarısız`);
                    doneTotal += data.processed || slice.length;
                    updatedTotal += data.updated || 0;
                    failedTotal += data.failed || 0;
                } catch (err) {
                    console.error('Batch error:', err);
                    failedTotal += slice.length;
                    doneTotal += slice.length;
                }
                setTrafficProgress({ done: doneTotal, total: ids.length, updated: updatedTotal, failed: failedTotal });
            }

            alert(
                `Tüm panolar için hesaplama tamamlandı:\n` +
                `• Toplam: ${doneTotal}\n` +
                `• Güncellenen: ${updatedTotal}\n` +
                `• Hata: ${failedTotal}`
            );
            await refreshTrafficStatus();
            await fetchPanels();
        } catch (err: any) {
            alert(`Hata: ${err?.message || 'bilinmeyen'}`);
        } finally {
            setTrafficAllBusy(false);
            setTrafficProgress(null);
        }
    };

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

    // Handle inline edit change
    const handleEditChange = (panelId: string, field: keyof EditedPanel, value: string | number) => {
        setEditedPanels(prev => ({
            ...prev,
            [panelId]: {
                ...prev[panelId],
                [field]: value
            }
        }));
    };

    // Get current value (edited or original)
    const getValue = (panel: Panel, field: keyof EditedPanel) => {
        if (editedPanels[panel.id] && editedPanels[panel.id][field] !== undefined) {
            return editedPanels[panel.id][field];
        }
        return panel[field];
    };

    // Check if panel has unsaved changes
    const hasChanges = (panelId: string) => {
        return editedPanels[panelId] && Object.keys(editedPanels[panelId]).length > 0;
    };

    // Count total unsaved changes
    const unsavedCount = Object.keys(editedPanels).filter(id => hasChanges(id)).length;

    // Save all changes
    const saveAllChanges = async () => {
        setSaving(true);
        try {
            const updates = Object.entries(editedPanels).filter(([_, changes]) =>
                Object.keys(changes).length > 0
            );

            for (const [panelId, changes] of updates) {
                const panel = panels.find(p => p.id === panelId);
                if (!panel) continue;

                await fetch(`/api/admin/panels/${panelId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...panel,
                        ...changes
                    })
                });
            }

            setEditedPanels({});
            await fetchPanels();
            alert('Değişiklikler kaydedildi!');
        } catch (error) {
            console.error('Error saving:', error);
            alert('Kaydetme hatası');
        } finally {
            setSaving(false);
        }
    };

    // Discard changes
    const discardChanges = () => {
        setEditedPanels({});
    };

    // Toggle panel selection
    const toggleSelection = (panelId: string) => {
        setSelectedPanels(prev => {
            const newSet = new Set(prev);
            if (newSet.has(panelId)) {
                newSet.delete(panelId);
            } else {
                newSet.add(panelId);
            }
            return newSet;
        });
    };

    // Select all visible panels
    const selectAll = () => {
        if (selectedPanels.size === panels.length) {
            setSelectedPanels(new Set());
        } else {
            setSelectedPanels(new Set(panels.map(p => p.id)));
        }
    };

    const applyBulkPrice = () => {
        const price = parseFloat(bulkPrice);
        if (isNaN(price)) {
            alert('Geçerli bir fiyat girin');
            return;
        }

        const updates: Record<string, EditedPanel> = {};
        selectedPanels.forEach(panelId => {
            updates[panelId] = {
                ...editedPanels[panelId],
                priceWeekly: price
            };
        });

        setEditedPanels(prev => ({ ...prev, ...updates }));
        setShowBulkUpdate(false);
        setBulkPrice('');
    };

    const executeBulkAction = async (action: string, value?: any) => {
        setBulkActionLoading(true);
        try {
            const res = await fetch('/api/admin/panels/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    panelIds: Array.from(selectedPanels),
                    value
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message || 'İşlem başarılı');
                setSelectedPanels(new Set());
                await fetchPanels();
            } else {
                alert(data.error || 'İşlem başarısız');
            }
        } catch (error) {
            console.error('Bulk action error:', error);
            alert('Bir hata oluştu');
        } finally {
            setBulkActionLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`${selectedPanels.size} panoyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;
        await executeBulkAction('delete');
    };

    const handleBulkStatus = async (active: boolean) => {
        const label = active ? 'aktif' : 'pasif';
        if (!confirm(`${selectedPanels.size} panoyu ${label} yapmak istediğinize emin misiniz?`)) return;
        await executeBulkAction('updateStatus', active);
    };

    const handleBulkRename = async () => {
        if (!bulkName.trim()) {
            alert('Ad boş olamaz');
            return;
        }
        await executeBulkAction('rename', bulkName.trim());
        setShowBulkRename(false);
        setBulkName('');
    };

    const handleBulkPriceServer = async () => {
        const price = parseFloat(bulkPrice);
        if (isNaN(price) || price < 0) {
            alert('Geçerli bir fiyat girin');
            return;
        }
        await executeBulkAction('updatePrice', price);
        setShowBulkUpdate(false);
        setBulkPrice('');
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
                    <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                        {trafficMissing !== null && trafficMissing > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                className="border-blue-500 text-blue-800 hover:bg-blue-50 flex-1 sm:flex-none"
                                disabled={trafficBusy || trafficAllBusy}
                                onClick={runTrafficBatch}
                                title="Yalnızca trafik skoru olmayan panolar için hesapla"
                            >
                                {trafficBusy ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
                                ) : (
                                    <Activity className="w-4 h-4 mr-2 shrink-0" />
                                )}
                                Eksikleri Hesapla ({trafficMissing})
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            className="border-indigo-500 text-indigo-800 hover:bg-indigo-50 flex-1 sm:flex-none"
                            disabled={trafficBusy || trafficAllBusy}
                            onClick={runTrafficBatchAll}
                            title="Tüm panolar için OSM'den veri çekip trafik skorlarını yeniden hesapla"
                        >
                            {trafficAllBusy ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
                            ) : (
                                <RefreshCw className="w-4 h-4 mr-2 shrink-0" />
                            )}
                            {trafficAllBusy && trafficProgress
                                ? `Hesaplanıyor ${trafficProgress.done}/${trafficProgress.total}`
                                : `Tümünü Hesapla${trafficTotal ? ` (${trafficTotal})` : ''}`}
                        </Button>
                        {mirrorPending !== null && mirrorPending > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                className="border-amber-500 text-amber-800 hover:bg-amber-50 flex-1 sm:flex-none"
                                disabled={mirrorBusy || !mirrorHasKey}
                                onClick={runMirrorExternalImages}
                            >
                                {mirrorBusy ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
                                ) : (
                                    <Images className="w-4 h-4 mr-2 shrink-0" />
                                )}
                                Görselleri depoya taşı ({mirrorPending})
                            </Button>
                        )}
                        <Button asChild variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50 flex-1 sm:flex-none">
                            <Link href="/app/admin/panels/import">
                                <Upload className="w-4 h-4 mr-2" />
                                Toplu Import
                            </Link>
                        </Button>
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

                <PendingPanelsBanner />

                {mirrorPending !== null && mirrorPending > 0 ? (
                    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                        <p>
                            <strong className="font-semibold">Harici görseller:</strong> {mirrorPending} pano — Google
                            URL&apos;si.{' '}
                            {!mirrorHasKey ? (
                                <span className="text-red-800">
                                    <code className="rounded bg-white/80 px-1">SUPABASE_SERVICE_ROLE_KEY</code> ekleyin.
                                </span>
                            ) : (
                                <span>«Görselleri depoya taşı» ile Supabase&apos;e alın.</span>
                            )}
                        </p>
                    </div>
                ) : null}

                {/* Unsaved Changes Bar */}
                {unsavedCount > 0 && (
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-700 font-medium">
                                {unsavedCount} panoda kaydedilmemiş değişiklik var
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={discardChanges} variant="outline" size="sm">
                                <X className="w-4 h-4 mr-1" />
                                İptal
                            </Button>
                            <Button onClick={saveAllChanges} disabled={saving} className="bg-green-600 hover:bg-green-700" size="sm">
                                <Save className="w-4 h-4 mr-1" />
                                {saving ? 'Kaydediliyor...' : 'Tümünü Kaydet'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Bulk Actions Bar */}
                {selectedPanels.size > 0 && (
                    <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
                        <span className="text-blue-700 font-medium">
                            {selectedPanels.size} pano seçildi
                        </span>
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                onClick={() => setShowBulkUpdate(true)}
                                variant="outline"
                                size="sm"
                                disabled={bulkActionLoading}
                            >
                                💰 Toplu Fiyat Güncelle
                            </Button>
                            <Button
                                onClick={() => setShowBulkRename(true)}
                                variant="outline"
                                size="sm"
                                disabled={bulkActionLoading}
                            >
                                ✏️ Toplu Ad Değiştir
                            </Button>
                            <Button
                                onClick={() => handleBulkStatus(true)}
                                variant="outline"
                                size="sm"
                                className="border-green-400 text-green-700 hover:bg-green-50"
                                disabled={bulkActionLoading}
                            >
                                ✅ Aktif Yap
                            </Button>
                            <Button
                                onClick={() => handleBulkStatus(false)}
                                variant="outline"
                                size="sm"
                                className="border-orange-400 text-orange-700 hover:bg-orange-50"
                                disabled={bulkActionLoading}
                            >
                                ⏸️ Pasif Yap
                            </Button>
                            <Button
                                onClick={handleBulkDelete}
                                variant="outline"
                                size="sm"
                                className="border-red-400 text-red-700 hover:bg-red-50"
                                disabled={bulkActionLoading}
                            >
                                🗑️ Toplu Sil
                            </Button>
                            <Button
                                onClick={() => setSelectedPanels(new Set())}
                                variant="outline"
                                size="sm"
                                disabled={bulkActionLoading}
                            >
                                Seçimi Temizle
                            </Button>
                        </div>
                    </div>
                )}

                {/* Bulk Price Update Modal */}
                {showBulkUpdate && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                            <h3 className="text-lg font-semibold mb-4">Toplu Fiyat Güncelle</h3>
                            <p className="text-slate-600 mb-4">
                                {selectedPanels.size} pano için yeni haftalık fiyat:
                            </p>
                            <input
                                type="number"
                                value={bulkPrice}
                                onChange={(e) => setBulkPrice(e.target.value)}
                                placeholder="Örn: 2000"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-4"
                            />
                            <div className="flex gap-2 justify-end">
                                <Button onClick={() => { setShowBulkUpdate(false); setBulkPrice(''); }} variant="outline">
                                    İptal
                                </Button>
                                <Button onClick={handleBulkPriceServer} disabled={bulkActionLoading} className="bg-blue-600 hover:bg-blue-700">
                                    {bulkActionLoading ? 'Kaydediliyor...' : 'Kaydet & Uygula'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bulk Rename Modal */}
                {showBulkRename && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                            <h3 className="text-lg font-semibold mb-4">Toplu Ad Değiştir</h3>
                            <p className="text-slate-600 mb-4">
                                {selectedPanels.size} pano için yeni ad (birden fazla pano seçildiyse sıra numarası eklenir):
                            </p>
                            <input
                                type="text"
                                value={bulkName}
                                onChange={(e) => setBulkName(e.target.value)}
                                placeholder="Örn: Körfez Billboard"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2"
                            />
                            <p className="text-xs text-slate-500 mb-4">
                                Sonuç: &quot;{bulkName || 'Körfez Billboard'} 1&quot;, &quot;{bulkName || 'Körfez Billboard'} 2&quot;, ...
                            </p>
                            <div className="flex gap-2 justify-end">
                                <Button onClick={() => { setShowBulkRename(false); setBulkName(''); }} variant="outline">
                                    İptal
                                </Button>
                                <Button onClick={handleBulkRename} disabled={bulkActionLoading} className="bg-blue-600 hover:bg-blue-700">
                                    {bulkActionLoading ? 'Kaydediliyor...' : 'Kaydet & Uygula'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

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

                {/* Table with Inline Editing */}
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
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedPanels.size === panels.length && panels.length > 0}
                                                onChange={selectAll}
                                                className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                                            Pano Adı
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                                            Tür
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                                            Lokasyon
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                                            Ölçü (cm)
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                                            Fiyat/Hafta
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                                            Sahip
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                                            Durum
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase">
                                            İşlemler
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {panels.map((panel) => (
                                        <tr key={panel.id} className={`hover:bg-slate-50 ${hasChanges(panel.id) ? 'bg-yellow-50' : ''}`}>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPanels.has(panel.id)}
                                                    onChange={() => toggleSelection(panel.id)}
                                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={getValue(panel, 'name') as string}
                                                    onChange={(e) => handleEditChange(panel.id, 'name', e.target.value)}
                                                    className="w-full px-2 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-sm bg-transparent focus:bg-white"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                    {PANEL_TYPE_LABELS[panel.type]}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-slate-900">{panel.city}, {panel.district}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {panel.address?.substring(0, 20) || '...'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        value={getValue(panel, 'width') as number}
                                                        onChange={(e) => handleEditChange(panel.id, 'width', parseFloat(e.target.value) || 0)}
                                                        className="w-16 px-2 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-sm text-center bg-transparent focus:bg-white"
                                                    />
                                                    <span className="text-slate-400">×</span>
                                                    <input
                                                        type="number"
                                                        value={getValue(panel, 'height') as number}
                                                        onChange={(e) => handleEditChange(panel.id, 'height', parseFloat(e.target.value) || 0)}
                                                        className="w-16 px-2 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-sm text-center bg-transparent focus:bg-white"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center">
                                                    <span className="text-slate-500 mr-1">₺</span>
                                                    <input
                                                        type="number"
                                                        value={getValue(panel, 'priceWeekly') as number}
                                                        onChange={(e) => handleEditChange(panel.id, 'priceWeekly', parseFloat(e.target.value) || 0)}
                                                        className="w-20 px-2 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-sm bg-transparent focus:bg-white"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {panel.ownerId ? (
                                                    <div className="flex flex-col gap-0.5 min-w-[140px]">
                                                        <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-900">
                                                            <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                            {panel.owner?.companyName || panel.ownerName || '—'}
                                                        </span>
                                                        <span className="text-[10px] text-emerald-700 font-medium uppercase tracking-wide">
                                                            Panobu hesabı
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={(getValue(panel, 'ownerName') as string) || ''}
                                                        onChange={(e) => handleEditChange(panel.id, 'ownerName', e.target.value)}
                                                        placeholder="Sahip adı"
                                                        className="w-24 px-2 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-sm bg-transparent focus:bg-white"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
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
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/app/admin/panels/${panel.id}/edit`}
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-blue-600"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(panel.id)}
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-red-600"
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
                    )}
                </div>
            </div>
        </div>
    );
}
