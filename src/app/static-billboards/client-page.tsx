"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, SlidersHorizontal, ChevronDown, Check, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import dynamic from "next/dynamic";
import FilterSidebar, { FilterState } from "@/components/static/FilterSidebar";
import PanelTypeIcon from "@/components/icons/PanelTypeIcon";
import { PANEL_TYPE_LABELS } from "@/lib/turkey-data";
import PanelDetailSidebar from "@/components/static/PanelDetailSidebar";
import { useSearchParams, useRouter } from "next/navigation";
import { CartProvider } from "@/contexts/CartContext";
import { useAppLocale } from "@/contexts/LocaleContext";
import { staticBillboardsCopy, staticBillboardsCityLabel } from "@/messages/staticBillboards";
import { panelTypeLabel } from "@/lib/panel-labels-locale";

function MapLoadingPlaceholder() {
    const { locale } = useAppLocale();
    const s = staticBillboardsCopy(locale);
    return (
        <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">{s.mapLoading}</div>
    );
}

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import("@/components/domain/Map"), {
    ssr: false,
    loading: MapLoadingPlaceholder,
});

// Cart-wrapped inner component
function StaticBillboardsContent({ panels: initialPanels }: { panels: any[] }) {
    const { locale } = useAppLocale();
    const s = staticBillboardsCopy(locale);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [selectedCity, setSelectedCity] = useState("Tümü");
    const [panels, setPanels] = useState<any[]>(initialPanels);
    const [isLoadingPanels, setIsLoadingPanels] = useState(false);
    const [selectedPanel, setSelectedPanel] = useState<any | null>(null);
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
    const topCities = ["Tümü", "Kocaeli", "Sakarya", "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"];

    // City coordinates for map zoom
    const cityCoordinates: Record<string, [number, number]> = {
        "İstanbul": [41.0082, 28.9784],
        "Ankara": [39.9334, 32.8597],
        "İzmir": [38.4237, 27.1428],
        "Bursa": [40.1826, 29.0665],
        "Antalya": [36.8969, 30.7133],
        "Kocaeli": [40.7654, 29.9404],
        "Sakarya": [40.7569, 30.3781],
    };

    const handleCityClick = (city: string) => {
        setSelectedCity(city);
    };

    // Fetch panels when city changes
    useEffect(() => {
        const fetchPanels = async () => {
            setIsLoadingPanels(true);
            try {
                const res = await fetch(`/api/panels/by-city?city=${encodeURIComponent(selectedCity)}`);
                if (res.ok) {
                    const data = await res.json();
                    setPanels(data.panels);
                }
            } catch (error) {
                console.error("Error fetching panels:", error);
            } finally {
                setIsLoadingPanels(false);
            }
        };

        fetchPanels();
    }, [selectedCity]);

    // Türkiye geneli (Tümü) — yaklaşık merkez ve ülke görünümü zoom
    const turkeyOverview: { center: [number, number]; zoom: number } = {
        center: [39.0, 35.2],
        zoom: 6,
    };

    // Get center and zoom based on selected city
    const getMapConfig = () => {
        if (selectedCity !== "Tümü" && cityCoordinates[selectedCity]) {
            return { center: cityCoordinates[selectedCity], zoom: 12 };
        }
        return turkeyOverview;
    };

    const mapConfig = getMapConfig();

    // Apply filters (now using panels state instead of initialPanels)
    const filteredPanels = panels.filter(panel => {
        const price = Number(panel.priceWeekly);
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
        // Size filter removed - all sizes allowed
        if (filters.panelTypes.length > 0 && !filters.panelTypes.includes(panel.type)) return false;
        if (filters.trafficLevels.length > 0 && !filters.trafficLevels.includes(panel.trafficLevel)) return false;
        if (filters.isAVM !== null && panel.isAVM !== filters.isAVM) return false;
        return true;
    });

    const activeFilterCount =
        (filters.panelTypes.length > 0 ? 1 : 0) +
        (filters.trafficLevels.length > 0 ? 1 : 0) +
        (filters.isAVM !== null ? 1 : 0) +
        (filters.priceRange[0] > 0 || filters.priceRange[1] < 200000 ? 1 : 0);

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

    // Eski "Kirala" sihirbazı giriş sonrası yönlendirmesi: artık tek akış sepet
    useEffect(() => {
        const resumeRental = searchParams.get("resumeRental");
        if (resumeRental !== "true") return;
        localStorage.removeItem("pendingRental");
        const url = new URL(window.location.href);
        url.searchParams.delete("resumeRental");
        window.history.replaceState({}, "", url.toString());
        router.push("/cart");
    }, [searchParams, router]);

    const handlePanelSelect = (panel: any) => {
        setSelectedPanel(panel);
        setShowDetailSidebar(true);
        setShowFiltersOverlay(false);
    };

    // Mobile filter collapsed state
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    return (
        <div className="flex-1 flex flex-col overflow-hidden h-[calc(100vh-80px)]">
            {/* Top Filter Bar */}
            <div className="bg-white border-b shadow-sm z-20">
                {/* Mobile: Compact Header */}
                <div className="md:hidden px-4 py-2">
                    <div className="flex items-center justify-between">
                        {/* Selected City Badge & Toggle */}
                        <button
                            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200"
                        >
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-700">{staticBillboardsCityLabel(selectedCity, locale)}</span>
                            <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <div className="flex items-center gap-2">
                            {/* Panel Count */}
                            <span className="text-xs text-slate-500 font-medium">{s.panelCountMobile(filteredPanels.length)}</span>

                            {/* Full Filters Button */}
                            <Button
                                variant={showFiltersOverlay ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowFiltersOverlay(!showFiltersOverlay)}
                                className="relative"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                {activeFilterCount > 0 && !showFiltersOverlay && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile: Collapsible Filter Section */}
                    {mobileFiltersOpen && (
                        <div className="mt-3 pb-2 space-y-3 animate-in slide-in-from-top-2 duration-200">
                            {/* City Pills - Scrollable */}
                            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                                {topCities.map(city => (
                                    <button
                                        key={city}
                                        onClick={() => {
                                            handleCityClick(city);
                                        }}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${selectedCity === city
                                            ? 'bg-[#11b981] text-white shadow-md'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        {staticBillboardsCityLabel(city, locale)}
                                    </button>
                                ))}
                            </div>

                            {/* Quick Filters Row */}
                            <div className="flex gap-2 flex-wrap">
                                {/* Panel Type - Opens Full Filter */}
                                <button
                                    onClick={() => setShowFiltersOverlay(true)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm ${filters.panelTypes.length > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200'
                                        }`}
                                >
                                    <SlidersHorizontal className="w-3.5 h-3.5" />
                                    <span>{s.panelType}</span>
                                    {filters.panelTypes.length > 0 && (
                                        <span className="bg-[#11b981] text-white text-[10px] px-1 rounded-full">
                                            {filters.panelTypes.length}
                                        </span>
                                    )}
                                </button>

                                {/* Clear Filters if active */}
                                {activeFilterCount > 0 && (
                                    <button
                                        onClick={() => setFilters({
                                            priceRange: [0, 200000],
                                            sizeRange: [0, 100],
                                            panelTypes: [],
                                            trafficLevels: [],
                                            isAVM: null
                                        })}
                                        className="px-3 py-1.5 rounded-lg text-sm text-red-600 border border-red-200 bg-red-50"
                                    >
                                        {s.clearFilters}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop: Full Filter Bar */}
                <div className="hidden md:block px-4 py-3">
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
                                            ? 'bg-[#11b981] text-white shadow-md'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {staticBillboardsCityLabel(city, locale)}
                                    </button>
                                ))}
                            </div>

                            {/* Separator */}
                            <div className="h-6 w-px bg-slate-200 mx-1"></div>

                            {/* Panel Type Dropdown */}
                            <div className="relative custom-dropdown">
                                <button
                                    onClick={() => toggleDropdown('type')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${filters.panelTypes.length > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <span>{s.panelType}</span>
                                    {filters.panelTypes.length > 0 && (
                                        <span className="bg-[#11b981] text-white text-[10px] px-1.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                                            {filters.panelTypes.length}
                                        </span>
                                    )}
                                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                                </button>

                                {openDropdown === 'type' && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="space-y-1 max-h-[300px] overflow-y-auto">
                                            {Object.keys(PANEL_TYPE_LABELS).map((key) => (
                                                <button
                                                    key={key}
                                                    onClick={() => togglePanelType(key)}
                                                    className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-50 transition-colors text-left"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <PanelTypeIcon type={key} size={16} />
                                                        <span className="text-slate-700">{panelTypeLabel(key, locale)}</span>
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

                            {/* Price Dropdown */}
                            <div className="relative custom-dropdown">
                                <button
                                    onClick={() => toggleDropdown('price')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${filters.priceRange[0] > 0 || filters.priceRange[1] < 200000 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <span>{s.price}</span>
                                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                                </button>

                                {openDropdown === 'price' && (
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-sm text-slate-700">
                                                <span>Min: {formatCurrency(filters.priceRange[0])}</span>
                                                <span>Max: {formatCurrency(filters.priceRange[1])}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 text-center">{s.priceDropdownHint}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Location Type Dropdown */}
                            <div className="relative custom-dropdown">
                                <button
                                    onClick={() => toggleDropdown('location')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${filters.isAVM !== null ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <span>{s.location}</span>
                                    {filters.isAVM !== null && (
                                        <span className="bg-[#11b981] text-white text-[10px] px-1.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                                            1
                                        </span>
                                    )}
                                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                                </button>

                                {openDropdown === 'location' && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="space-y-1">
                                            <button
                                                onClick={() => setFilters({ ...filters, isAVM: null })}
                                                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-50 transition-colors text-left"
                                            >
                                                <span className="text-slate-700">{s.allLocations}</span>
                                                {filters.isAVM === null && <Check className="w-4 h-4 text-blue-600" />}
                                            </button>
                                            <button
                                                onClick={() => setFilters({ ...filters, isAVM: true })}
                                                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-50 transition-colors text-left"
                                            >
                                                <span className="text-slate-700">{s.mallInterior}</span>
                                                {filters.isAVM === true && <Check className="w-4 h-4 text-blue-600" />}
                                            </button>
                                            <button
                                                onClick={() => setFilters({ ...filters, isAVM: false })}
                                                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-50 transition-colors text-left"
                                            >
                                                <span className="text-slate-700">{s.openArea}</span>
                                                {filters.isAVM === false && <Check className="w-4 h-4 text-blue-600" />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Right Side: Filter Toggle & Count */}
                        <div className="flex items-center gap-3">
                            <p className="text-xs text-slate-500 font-medium">{s.panelCountDesktop(filteredPanels.length)}</p>

                            <Button
                                variant={showFiltersOverlay ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowFiltersOverlay(!showFiltersOverlay)}
                                className="relative shadow-sm"
                            >
                                <SlidersHorizontal className="w-4 h-4 mr-2" />
                                {showFiltersOverlay ? s.filtersHide : s.filtersShow}
                                {activeFilterCount > 0 && !showFiltersOverlay && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm border border-white">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                        </div>
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
                    {isLoadingPanels && (
                        <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center backdrop-blur-sm">
                            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-lg border border-slate-200">
                                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                <span className="text-slate-700 font-medium">{s.panelsLoading}</span>
                            </div>
                        </div>
                    )}
                    <Map
                        panels={filteredPanels}
                        selectedPanel={selectedPanel}
                        onPanelSelect={handlePanelSelect}
                        center={mapConfig.center}
                        zoom={mapConfig.zoom}
                    />
                </div>
            </div>

        </div>
    );
}

// Export with CartProvider wrapper
export default function StaticBillboardsClient({ panels }: { panels: any[] }) {
    return (
        <CartProvider>
            <StaticBillboardsContent panels={panels} />
        </CartProvider>
    );
}
