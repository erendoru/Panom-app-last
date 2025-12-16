"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar as CalendarIcon, Save } from 'lucide-react';
import { PANEL_TYPE_LABELS } from '@/lib/turkey-data';
import 'react-calendar/dist/Calendar.css';

// Dynamically import Calendar
const Calendar = dynamic(() => import('react-calendar'), {
    ssr: false,
    loading: () => <div className="h-[400px] bg-slate-100 rounded-lg flex items-center justify-center">Takvim yükleniyor...</div>
});

interface Panel {
    id: string;
    name: string;
    type: string;
    city: string;
    district: string;
    blockedDates?: Array<{ startDate: string; endDate: string }>;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function AvailabilityPage() {
    const [panels, setPanels] = useState<Panel[]>([]);
    const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
    const [selectedDates, setSelectedDates] = useState<Value>(null);
    const [blockedRanges, setBlockedRanges] = useState<Array<{ startDate: string; endDate: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPanels();
    }, []);

    const fetchPanels = async () => {
        try {
            const res = await fetch('/api/admin/panels');
            const data = await res.json();
            // Ensure data is an array
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

    const handlePanelSelect = (panel: Panel) => {
        setSelectedPanel(panel);
        setBlockedRanges(panel.blockedDates || []);
        setSelectedDates(null);
    };

    const handleAddBlockedRange = () => {
        if (!selectedDates) {
            alert('Lütfen tarih seçiniz');
            return;
        }

        let startDate: Date;
        let endDate: Date;

        if (Array.isArray(selectedDates)) {
            startDate = selectedDates[0] || new Date();
            endDate = selectedDates[1] || selectedDates[0] || new Date();
        } else {
            startDate = selectedDates;
            endDate = selectedDates;
        }

        const newRange = {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };

        setBlockedRanges([...blockedRanges, newRange]);
        setSelectedDates(null);
    };

    const handleRemoveBlockedRange = (index: number) => {
        setBlockedRanges(blockedRanges.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!selectedPanel) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/panels/${selectedPanel.id}/availability`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blockedDates: blockedRanges })
            });

            if (res.ok) {
                alert('Müsaitlik bilgisi güncellendi!');
                fetchPanels();
            } else {
                alert('Bir hata oluştu');
            }
        } catch (error) {
            console.error('Error saving availability:', error);
            alert('Bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    const isDateBlocked = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return blockedRanges.some(range =>
            dateStr >= range.startDate && dateStr <= range.endDate
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
                <p className="text-slate-600">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button asChild variant="outline" className="mb-4">
                        <Link href="/app/admin/panels">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Geri Dön
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-900">Pano Müsaitlik Yönetimi</h1>
                    <p className="text-slate-600 mt-1">Panoların dolu olacağı tarihleri belirleyin</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Panel List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Panolar</h2>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {panels.map((panel) => (
                                    <button
                                        key={panel.id}
                                        onClick={() => handlePanelSelect(panel)}
                                        className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedPanel?.id === panel.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="font-medium text-slate-900">{panel.name}</div>
                                        <div className="text-sm text-slate-600">{panel.city}, {panel.district}</div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {PANEL_TYPE_LABELS[panel.type]}
                                            {panel.blockedDates && panel.blockedDates.length > 0 && (
                                                <span className="ml-2 text-red-600">
                                                    • {panel.blockedDates.length} bloke tarih
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Calendar & Blocked Dates */}
                    <div className="lg:col-span-2">
                        {selectedPanel ? (
                            <div className="space-y-6">
                                {/* Calendar */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                                    <h2 className="text-lg font-semibold text-slate-900 mb-4">
                                        Tarih Seçimi - {selectedPanel.name}
                                    </h2>
                                    <Calendar
                                        onChange={setSelectedDates}
                                        value={selectedDates}
                                        selectRange={true}
                                        minDate={new Date()}
                                        tileClassName={({ date }) => {
                                            return isDateBlocked(date) ? 'blocked-date' : null;
                                        }}
                                        className="mx-auto"
                                    />
                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            onClick={handleAddBlockedRange}
                                            disabled={!selectedDates}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            <CalendarIcon className="w-4 h-4 mr-2" />
                                            Seçili Tarihleri Bloke Et
                                        </Button>
                                    </div>
                                </div>

                                {/* Blocked Dates List */}
                                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Bloke Tarihler</h2>
                                    {blockedRanges.length === 0 ? (
                                        <p className="text-slate-600 text-sm">Henüz bloke tarih yok</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {blockedRanges.map((range, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                                                >
                                                    <div className="text-sm">
                                                        <span className="font-medium text-slate-900">
                                                            {new Date(range.startDate).toLocaleDateString('tr-TR')}
                                                        </span>
                                                        {range.startDate !== range.endDate && (
                                                            <>
                                                                <span className="mx-2 text-slate-600">→</span>
                                                                <span className="font-medium text-slate-900">
                                                                    {new Date(range.endDate).toLocaleDateString('tr-TR')}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveBlockedRange(index)}
                                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Kaldır
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-6">
                                        <Button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            {saving ? 'Kaydediliyor...' : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Değişiklikleri Kaydet
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                                <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600">Soldan bir pano seçin</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .blocked-date {
                    background-color: #fee2e2 !important;
                    color: #991b1b !important;
                }
                .blocked-date:hover {
                    background-color: #fecaca !important;
                }
            `}</style>
        </div>
    );
}
