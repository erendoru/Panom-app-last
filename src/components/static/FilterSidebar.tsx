"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X, SlidersHorizontal } from 'lucide-react';
import { PANEL_TYPE_LABELS, TRAFFIC_LEVEL_LABELS } from '@/lib/turkey-data';
import PanelTypeIcon from '@/components/icons/PanelTypeIcon';
import { formatCurrency } from '@/lib/utils';

export interface FilterState {
    priceRange: [number, number];
    sizeRange: [number, number];
    panelTypes: string[];
    trafficLevels: string[];
    isAVM: boolean | null;
}

interface FilterSidebarProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    onClose?: () => void;
    isMobile?: boolean;
}

export default function FilterSidebar({ filters, onFilterChange, onClose, isMobile = false }: FilterSidebarProps) {
    const [openSections, setOpenSections] = useState({
        price: true,
        size: true,
        type: true,
        traffic: true,
        location: true
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handlePriceChange = (value: number[]) => {
        onFilterChange({ ...filters, priceRange: [value[0], value[1]] });
    };

    const handleSizeChange = (value: number[]) => {
        onFilterChange({ ...filters, sizeRange: [value[0], value[1]] });
    };

    const togglePanelType = (type: string) => {
        const newTypes = filters.panelTypes.includes(type)
            ? filters.panelTypes.filter(t => t !== type)
            : [...filters.panelTypes, type];
        onFilterChange({ ...filters, panelTypes: newTypes });
    };

    const toggleTrafficLevel = (level: string) => {
        const newLevels = filters.trafficLevels.includes(level)
            ? filters.trafficLevels.filter(l => l !== level)
            : [...filters.trafficLevels, level];
        onFilterChange({ ...filters, trafficLevels: newLevels });
    };

    const handleAVMChange = (value: boolean | null) => {
        onFilterChange({ ...filters, isAVM: value });
    };

    const resetFilters = () => {
        onFilterChange({
            priceRange: [0, 200000],
            sizeRange: [0, 100],
            panelTypes: [],
            trafficLevels: [],
            isAVM: null
        });
    };

    const activeFilterCount =
        (filters.panelTypes.length > 0 ? 1 : 0) +
        (filters.trafficLevels.length > 0 ? 1 : 0) +
        (filters.isAVM !== null ? 1 : 0) +
        (filters.priceRange[0] > 0 || filters.priceRange[1] < 200000 ? 1 : 0) +
        (filters.sizeRange[0] > 0 || filters.sizeRange[1] < 100 ? 1 : 0);

    return (
        <div className={`bg-white ${isMobile ? 'h-full' : 'border-r'} flex flex-col`}>
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-slate-600" />
                    <h2 className="font-bold text-lg">Filtreler</h2>
                    {activeFilterCount > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                {isMobile && onClose && (
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Price Range */}
                <div>
                    <button
                        onClick={() => toggleSection('price')}
                        className="w-full flex items-center justify-between mb-3"
                    >
                        <Label className="text-sm font-semibold">Fiyat Aralığı</Label>
                        <span className="text-xs text-slate-500">
                            {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}
                        </span>
                    </button>
                    {openSections.price && (
                        <div className="space-y-3">
                            <Slider
                                min={0}
                                max={200000}
                                step={5000}
                                value={filters.priceRange}
                                onValueChange={handlePriceChange}
                                className="w-full"
                            />
                        </div>
                    )}
                </div>

                {/* Size Range */}
                <div>
                    <button
                        onClick={() => toggleSection('size')}
                        className="w-full flex items-center justify-between mb-3"
                    >
                        <Label className="text-sm font-semibold">Pano Boyutu (m²)</Label>
                        <span className="text-xs text-slate-500">
                            {filters.sizeRange[0]}-{filters.sizeRange[1]} m²
                        </span>
                    </button>
                    {openSections.size && (
                        <div className="space-y-3">
                            <Slider
                                min={0}
                                max={100}
                                step={5}
                                value={filters.sizeRange}
                                onValueChange={handleSizeChange}
                                className="w-full"
                            />
                        </div>
                    )}
                </div>

                {/* Panel Types */}
                <div>
                    <button
                        onClick={() => toggleSection('type')}
                        className="w-full flex items-center justify-between mb-3"
                    >
                        <Label className="text-sm font-semibold">Pano Türü</Label>
                        {filters.panelTypes.length > 0 && (
                            <span className="text-xs text-blue-600 font-medium">
                                {filters.panelTypes.length} seçili
                            </span>
                        )}
                    </button>
                    {openSections.type && (
                        <div className="space-y-2">
                            {Object.entries(PANEL_TYPE_LABELS).map(([key, label]) => (
                                <label
                                    key={key}
                                    className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.panelTypes.includes(key)}
                                        onChange={() => togglePanelType(key)}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <PanelTypeIcon type={key} size={20} />
                                    <span className="text-sm">{label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Traffic Level */}
                <div>
                    <button
                        onClick={() => toggleSection('traffic')}
                        className="w-full flex items-center justify-between mb-3"
                    >
                        <Label className="text-sm font-semibold">Trafik Yoğunluğu</Label>
                        {filters.trafficLevels.length > 0 && (
                            <span className="text-xs text-blue-600 font-medium">
                                {filters.trafficLevels.length} seçili
                            </span>
                        )}
                    </button>
                    {openSections.traffic && (
                        <div className="space-y-2">
                            {Object.entries(TRAFFIC_LEVEL_LABELS).map(([key, label]) => (
                                <label
                                    key={key}
                                    className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.trafficLevels.includes(key)}
                                        onChange={() => toggleTrafficLevel(key)}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">{label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>


            </div>

            {/* Footer */}
            <div className="p-4 border-t">
                <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="w-full"
                    disabled={activeFilterCount === 0}
                >
                    <X className="w-4 h-4 mr-2" />
                    Filtreleri Temizle
                </Button>
            </div>
        </div>
    );
}
