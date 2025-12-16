"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { renderToStaticMarkup } from "react-dom/server";
import PanelTypeIcon from "@/components/icons/PanelTypeIcon";
import { PANEL_TYPE_LABELS } from "@/lib/turkey-data";
import { useEffect } from "react";

// Component to handle map view updates
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, {
            duration: 1.5
        });
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
        <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
            <MapController center={center} zoom={zoom} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {panels.map((panel) => (
                <Marker
                    key={panel.id}
                    position={[panel.latitude, panel.longitude]}
                    icon={createCustomIcon(panel.type, selectedPanel?.id === panel.id)}
                    eventHandlers={{
                        click: () => {
                            onPanelSelect?.(panel);
                        },
                    }}
                    zIndexOffset={selectedPanel?.id === panel.id ? 1000 : 0}
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

                            <h3 className="font-bold text-base mb-1">{panel.name}</h3>
                            <p className="text-sm text-slate-500 mb-2">{panel.district}, {panel.city}</p>

                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded">
                                <div>
                                    <span className="block font-semibold">Boyut</span>
                                    {Number(panel.width)}m x {Number(panel.height)}m
                                </div>
                                <div>
                                    <span className="block font-semibold">Fiyat (Haftalık)</span>
                                    {formatCurrency(Number(panel.priceWeekly))}
                                </div>
                            </div>

                            {panel.isAVM && (
                                <div className="flex items-center gap-1 text-xs text-pink-600 mb-2">
                                    <span>🏬</span>
                                    <span className="font-medium">AVM İçi</span>
                                </div>
                            )}

                            <Button size="sm" className="w-full mt-2" onClick={() => onPanelSelect?.(panel)}>Detayları Gör</Button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
