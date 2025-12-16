"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import dynamic from "next/dynamic";
import RentalWizard from "@/components/static/RentalWizard";
import FilterSidebar, { FilterState } from "@/components/static/FilterSidebar";
import PanelTypeIcon from "@/components/icons/PanelTypeIcon";
import { PANEL_TYPE_LABELS } from "@/lib/turkey-data";
import PanelDetailSidebar from "@/components/static/PanelDetailSidebar";

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import("@/components/domain/Map"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Harita Yükleniyor...</div>
});

export default function StaticBillboardsClient({ panels: initialPanels }: { panels: any[] }) {
    // Client component for static billboards page
    const [selectedCity, setSelectedCity] = useState("Tümü");
    const [selectedPanel, setSelectedPanel] = useState<any | null>(null);
    const [isRentalWizardOpen, setIsRentalWizardOpen] = useState(false);
    const [showFiltersOverlay, setShowFiltersOverlay] = useState(false);
    const [showDetailSidebar, setShowDetailSidebar] = useState(false);

    // Dropdown states
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 200000],
        sizeRange: [0, 100],
        panelTypes: [],
        trafficLevels: [],
        isAVM: null
    });

    // Top cities for quick access
    const topCities = ["Tümü", "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Kocaeli"];

    // City coordinates for map zoom
    const cityCoordinates: Record<string, [number, number]> = {
        "İstanbul": [41.0082, 28.9784],
        "Ankara": [39.9334, 32.8597],
        "İzmir": [38.4237, 27.1428],
        "Bursa": [40.1826, 29.0665],
        "Antalya": [36.8969, 30.7133],
        "Kocaeli": [40.7654, 29.9404],
    };

    const handleCityClick = (city: string) => {
        setSelectedCity(city);
    };

    // Get center and zoom based on selected city
    const getMapConfig = () => {
        if (selectedCity !== "Tümü" && cityCoordinates[selectedCity]) {
            return { center: cityCoordinates[selectedCity], zoom: 12 };
        }
        return { center: [41.0082, 28.9784] as [number, number], zoom: 6 };
    };

    const mapConfig = getMapConfig();

    // Apply filters
    const filteredPanels = initialPanels.filter(panel => {
        if (selectedCity !== "Tümü" && panel.city !== selectedCity) return false;
        const price = Number(panel.priceWeekly);
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
        const area = Number(panel.width) * Number(panel.height);
        if (area < filters.sizeRange[0] || area > filters.sizeRange[1]) return false;
        if (filters.panelTypes.length > 0 && !filters.panelTypes.includes(panel.type)) return false;
        if (filters.trafficLevels.length > 0 && !filters.trafficLevels.includes(panel.trafficLevel)) return false;
        if (filters.isAVM !== null && panel.isAVM !== filters.isAVM) return false;
        return true;
    });

    const activeFilterCount =
        (filters.panelTypes.length > 0 ? 1 : 0) +
        (filters.trafficLevels.length > 0 ? 1 : 0) +
        (filters.isAVM !== null ? 1 : 0) +
        (filters.priceRange[0] > 0 || filters.priceRange[1] < 200000 ? 1 : 0) +
        (filters.sizeRange[0] > 0 || filters.sizeRange[1] < 100 ? 1 : 0);

    // Toggle panel type filter
    const togglePanelType = (type: string) => {
        const newTypes = filters.panelTypes.includes(type)
            ? filters.panelTypes.filter(t => t !== type)
            : [...filters.panelTypes, type];
        setFilters({ ...filters, panelTypes: newTypes });
    };

    // Toggle dropdown
    const toggleDropdown = (name: string) => {
        if (openDropdown === name) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(name);
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ((event.target as HTMLElement).closest('.custom-dropdown')) return;
            setOpenDropdown(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePanelSelect = (panel: any) => {
        setSelectedPanel(panel);
        setShowDetailSidebar(true);
        setShowFiltersOverlay(false);
    };

    const handleStartRental = () => {
        setIsRentalWizardOpen(true);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden h-[calc(100vh-80px)]">
            {/* Top Filter Bar */}
            <div className="bg-white border-b shadow-sm z-20 px-4 py-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    {/* Left Side: City & Quick Filters */}
                    <div className="flex items-center gap-2 flex-wrap flex-1">

                        {/* City Pills */}
                        <div className="flex items-center gap-1 mr-4 flex-wrap">
                            {topCities.map(city => (
                                <button
                                    key={city}
                                    onClick={() => handleCityClick(city)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCity === city
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>

                        {/* Separator */}
                        <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>

                        {/* Panel Type Dropdown */}
                        <div className="relative custom-dropdown">
                            <button
                                onClick={() => toggleDropdown('type')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${filters.panelTypes.length > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                <span>Pano Tipi</span>
                                {filters.panelTypes.length > 0 && (
                                    <span className="bg-blue-600 text-white text-[10px] px-1.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                                        {filters.panelTypes.length}
                                    </span>
                                )}
                                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                            </button>

                            {openDropdown === 'type' && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="space-y-1 max-h-[300px] overflow-y-auto">
                                        {Object.entries(PANEL_TYPE_LABELS).map(([key, label]) => (
                                            <button
                                                key={key}
                                                onClick={() => togglePanelType(key)}
                                                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-50 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <PanelTypeIcon type={key} size={16} />
                                                    <span className="text-slate-700">{label}</span>
                                                </div>
                                                {filters.panelTypes.includes(key) && (
                                                    <Check className="w-4 h-4 text-blue-600" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Price Dropdown (Simplified) */}
                        <div className="relative custom-dropdown">
                            <button
                                onClick={() => toggleDropdown('price')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${filters.priceRange[0] > 0 || filters.priceRange[1] < 200000 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                <span>Fiyat</span>
                                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                            </button>

                            {openDropdown === 'price' && (
                                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm text-slate-600">
                                            <span>Min: {formatCurrency(filters.priceRange[0])}</span>
                                            <span>Max: {formatCurrency(filters.priceRange[1])}</span>
                                        </div>
                                        {/* Note: Using FilterSidebar for full control is better, this is just a quick view */}
                                        <p className="text-xs text-slate-400 text-center">
                                            Detaylı fiyat ayarı için sağdaki filtre menüsünü kullanın.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Location Type Dropdown */}
                        <div className="relative custom-dropdown">
                            <button
                                onClick={() => toggleDropdown('location')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${filters.isAVM !== null ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                <span>Konum</span>
                                {filters.isAVM !== null && (
                                    <span className="bg-blue-600 text-white text-[10px] px-1.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                                        1
                                    </span>
                                )}
                                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                            </button>

                            {openDropdown === 'location' && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => setFilters({ ...filters, isAVM: null })}
                                            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-50 transition-colors text-left"
                                        >
                                            <span className="text-slate-700">Tümü</span>
                                            {filters.isAVM === null && <Check className="w-4 h-4 text-blue-600" />}
                                        </button>
                                        <button
                                            onClick={() => setFilters({ ...filters, isAVM: true })}
                                            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-50 transition-colors text-left"
                                        >
                                            <span className="text-slate-700">🏬 AVM İçi</span>
                                            {filters.isAVM === true && <Check className="w-4 h-4 text-blue-600" />}
                                        </button>
                                        <button
                                            onClick={() => setFilters({ ...filters, isAVM: false })}
                                            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-50 transition-colors text-left"
                                        >
                                            <span className="text-slate-700">🏙️ Açık Alan</span>
                                            {filters.isAVM === false && <Check className="w-4 h-4 text-blue-600" />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Side: Filter Toggle & Count */}
                    <div className="flex items-center gap-3">
                        <p className="text-xs text-slate-500 font-medium hidden sm:block">
                            {filteredPanels.length} pano bulundu
                        </p>

                        <Button
                            variant={showFiltersOverlay ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowFiltersOverlay(!showFiltersOverlay)}
                            className="relative shadow-sm"
                        >
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            {showFiltersOverlay ? 'Filtreleri Gizle' : 'Tüm Filtreler'}
                            {activeFilterCount > 0 && !showFiltersOverlay && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm border border-white">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Detail Sidebar (Left) */}
                <PanelDetailSidebar
                    panel={selectedPanel}
                    isOpen={showDetailSidebar}
                    onClose={() => setShowDetailSidebar(false)}
                    onRent={handleStartRental}
                />

                {/* Filter Overlay (Right) */}
                {showFiltersOverlay && (
                    <>
                        <div
                            className="absolute inset-0 bg-black/20 z-30 backdrop-blur-[1px] transition-all duration-300"
                            onClick={() => setShowFiltersOverlay(false)}
                        />
                        <div className="absolute top-4 right-4 w-[350px] max-h-[calc(100%-32px)] bg-white rounded-xl shadow-2xl z-40 overflow-hidden border border-slate-100 animate-in slide-in-from-right-10 duration-300">
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={setFilters}
                                onClose={() => setShowFiltersOverlay(false)}
                            />
                        </div>
                    </>
                )}

                {/* Map */}
                <div className="flex-1 relative z-10">
                    <Map
                        panels={filteredPanels}
                        selectedPanel={selectedPanel}
                        onPanelSelect={handlePanelSelect}
                        center={mapConfig.center}
                        zoom={mapConfig.zoom}
                    />
                </div>
            </div>

            {/* Rental Wizard Modal */}
            {selectedPanel && isRentalWizardOpen && (
                <RentalWizard
                    isOpen={isRentalWizardOpen}
                    onClose={() => setIsRentalWizardOpen(false)}
                    panel={selectedPanel}
                />
            )}
        </div>
    );
}
