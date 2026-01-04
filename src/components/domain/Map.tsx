"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { renderToStaticMarkup } from "react-dom/server";
import PanelTypeIcon from "@/components/icons/PanelTypeIcon";
import { PANEL_TYPE_LABELS } from "@/lib/turkey-data";
import { useEffect, useRef } from "react";

// Component to handle map view updates
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    const prevCenterRef = useRef<[number, number] | null>(null);

    useEffect(() => {
        // Only fly if center coordinates have actually changed (city change)
        const prevCenter = prevCenterRef.current;
        const centerChanged = !prevCenter ||
            prevCenter[0] !== center[0] ||
            prevCenter[1] !== center[1];

        if (centerChanged) {
            map.flyTo(center, zoom, {
                duration: 1.5
            });
            prevCenterRef.current = center;
        }
    }, [center, zoom, map]);

    return null;
}

// Function to create custom marker icon for each panel
function createCustomIcon(panelType: string, isSelected: boolean) {
    const iconHtml = renderToStaticMarkup(
        <div className={`relative ${isSelected ? 'scale-110' : ''} transition-transform`}>
            <div className="bg-white rounded-full p-1 shadow-lg border-2 border-white">
                <PanelTypeIcon type={panelType} size={20} />
            </div>
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: 'custom-panel-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
}

// Custom cluster icon
function createClusterCustomIcon(cluster: any) {
    const count = cluster.getChildCount();
    return L.divIcon({
        html: `<div class="cluster-icon">${count}</div>`,
        className: 'custom-cluster-marker',
        iconSize: L.point(40, 40, true),
    });
}

export default function Map({
    panels,
    selectedPanel,
    onPanelSelect,
    center = [41.0082, 28.9784],
    zoom = 11
}: {
    panels: any[],
    selectedPanel?: any,
    onPanelSelect?: (panel: any) => void,
    center?: [number, number],
    zoom?: number
}) {
    return (
        <>
            <style jsx global>{`
                .custom-cluster-marker {
                    background: transparent !important;
                    border: none !important;
                }
                .cluster-icon {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                    border: 3px solid white;
                }
                .cluster-icon:hover {
                    transform: scale(1.1);
                    transition: transform 0.2s;
                }
            `}</style>
            <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
                <MapController center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createClusterCustomIcon}
                    maxClusterRadius={50}
                    spiderfyOnMaxZoom={false}
                    showCoverageOnHover={false}
                    zoomToBoundsOnClick={false}
                    disableClusteringAtZoom={16}
                    spiderLegPolylineOptions={{ weight: 1.5, color: '#3b82f6', opacity: 0.5 }}
                    animate={true}
                    removeOutsideVisibleBounds={false}
                    spiderfyDistanceMultiplier={2}
                    onClick={(e: any) => {
                        // Force spiderfy on any cluster click
                        if (e.layer && e.layer.spiderfy) {
                            e.layer.spiderfy();
                        }
                    }}
                >
                    {panels.map((panel) => (
                        <Marker
                            key={panel.id}
                            position={[panel.latitude, panel.longitude]}
                            zIndexOffset={selectedPanel?.id === panel.id ? 1000 : 0}
                            icon={createCustomIcon(panel.type, selectedPanel?.id === panel.id)}
                        >
                            <Popup className="min-w-[250px]">
                                <div className="p-1">
                                    <img
                                        src={panel.imageUrl || "https://images.unsplash.com/photo-1637606346315-d353ec6d3c81?q=80&w=2000&auto=format&fit=crop"}
                                        alt={panel.name}
                                        className="w-full h-32 object-cover rounded mb-2"
                                    />

                                    {/* Panel Type Badge */}
                                    <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded">
                                        <PanelTypeIcon type={panel.type} size={20} />
                                        <span className="text-xs font-semibold">{PANEL_TYPE_LABELS[panel.type] || panel.type}</span>
                                    </div>

                                    <h3 className="font-bold text-base mb-1">{panel.name || 'Pano'}</h3>
                                    <p className="text-sm text-slate-500 mb-2">{panel.district}, {panel.city}</p>

                                    {/* Price highlight */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3 text-center">
                                        <span className="text-lg font-bold text-green-700">{formatCurrency(Number(panel.priceWeekly))}</span>
                                        <span className="text-xs text-green-600 ml-1">/hafta</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded">
                                        <div>
                                            <span className="block font-semibold">Boyut</span>
                                            {Number(panel.width)}cm x {Number(panel.height)}cm
                                        </div>
                                        <div>
                                            <span className="block font-semibold">Konum</span>
                                            {panel.district}
                                        </div>
                                    </div>

                                    {panel.isAVM && (
                                        <div className="flex items-center gap-1 text-xs text-pink-600 mb-2">
                                            <span>🏬</span>
                                            <span className="font-medium">AVM İçi</span>
                                        </div>
                                    )}

                                    {/* CLP badges - compact */}
                                    {panel.type === 'CLP' && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700">
                                                📋 Çift yüzlü
                                            </span>
                                            {panel.city === 'Kocaeli' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-100 text-orange-700">
                                                    🔥 20+ = 1.500₺
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <Button size="sm" className="w-full mt-2" onClick={() => onPanelSelect?.(panel)}>Detayları Gör</Button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </>
    );
}

