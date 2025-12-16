"use client";

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

interface BlockedDateRange {
    startDate: string;
    endDate: string;
    reason?: string;
}

interface AvailabilityCalendarProps {
    blockedDates: BlockedDateRange[];
    onChange: (dates: BlockedDateRange[]) => void;
}

export default function AvailabilityCalendar({ blockedDates, onChange }: AvailabilityCalendarProps) {
    const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null);
    const [reason, setReason] = useState('');

    // Custom tile class name to highlight blocked dates
    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            // Check if date is blocked
            const isBlocked = blockedDates.some(range => {
                const start = parseISO(range.startDate);
                const end = parseISO(range.endDate);
                return isWithinInterval(date, { start: startOfDay(start), end: endOfDay(end) });
            });

            if (isBlocked) {
                return 'bg-red-100 text-red-600 font-bold rounded-full';
            }
        }
        return null;
    };

    const handleAddBlock = () => {
        if (!selectedRange) return;

        const [start, end] = selectedRange;
        const newBlock: BlockedDateRange = {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            reason: reason || 'Admin tarafından engellendi'
        };

        onChange([...blockedDates, newBlock]);
        setSelectedRange(null);
        setReason('');
    };

    const handleRemoveBlock = (index: number) => {
        const newDates = [...blockedDates];
        newDates.splice(index, 1);
        onChange(newDates);
    };

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Calendar View */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold mb-4">Tarih Seçimi</h3>
                    <Calendar
                        onChange={(value: any) => {
                            if (Array.isArray(value)) {
                                setSelectedRange(value as [Date, Date]);
                            } else {
                                setSelectedRange([value, value]);
                            }
                        }}
                        selectRange={true}
                        tileClassName={tileClassName}
                        locale="tr-TR"
                        className="w-full border-none"
                    />

                    {selectedRange && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-sm font-medium text-slate-700 mb-2">
                                Seçilen Aralık: {format(selectedRange[0], 'd MMMM yyyy', { locale: tr })} - {format(selectedRange[1], 'd MMMM yyyy', { locale: tr })}
                            </p>
                            <input
                                type="text"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Engelleme sebebi (Opsiyonel)"
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md mb-3"
                            />
                            <Button
                                onClick={handleAddBlock}
                                className="w-full bg-red-600 hover:bg-red-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Tarihleri Engelle
                            </Button>
                        </div>
                    )}
                </div>

                {/* Blocked Dates List */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold mb-4">Engellenen Tarihler</h3>

                    {blockedDates.length === 0 ? (
                        <p className="text-slate-500 text-sm italic">Henüz engellenmiş tarih bulunmuyor.</p>
                    ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {blockedDates.map((block, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 group hover:border-red-200 transition-colors">
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">
                                            {format(parseISO(block.startDate), 'd MMM yyyy', { locale: tr })} - {format(parseISO(block.endDate), 'd MMM yyyy', { locale: tr })}
                                        </div>
                                        {block.reason && (
                                            <div className="text-xs text-slate-500 mt-1">{block.reason}</div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleRemoveBlock(index)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Engeli Kaldır"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .react-calendar {
                    width: 100%;
                    background: white;
                    border: none;
                    font-family: inherit;
                }
                .react-calendar__tile {
                    padding: 10px 6px;
                }
                .react-calendar__tile--active {
                    background: #2563eb !important;
                    color: white !important;
                    border-radius: 8px;
                }
                .react-calendar__tile--now {
                    background: #eff6ff;
                    border-radius: 8px;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                    background-color: #e2e8f0;
                    border-radius: 8px;
                }
            `}</style>
        </div>
    );
}
