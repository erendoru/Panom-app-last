"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import PanelTypeIcon from "@/components/icons/PanelTypeIcon";
import { useEffect, useRef } from "react";
import type { StorePanel } from "@/lib/store/loader";

function MapController({
    center,
    zoom,
}: {
    center: [number, number];
    zoom: number;
}) {
    const map = useMap();
    const prev = useRef<[number, number] | null>(null);
    useEffect(() => {
        const p = prev.current;
        if (!p || p[0] !== center[0] || p[1] !== center[1]) {
            map.flyTo(center, zoom, { duration: 1.2 });
            prev.current = center;
        }
    }, [center, zoom, map]);
    return null;
}

function createIcon(panelType: string, isSelected: boolean) {
    const html = renderToStaticMarkup(
        <div
            style={{
                transform: isSelected ? "scale(1.15)" : "scale(1)",
                transition: "transform .15s ease",
            }}
        >
            <div
                style={{
                    background: isSelected ? "#0f172a" : "#fff",
                    borderRadius: "9999px",
                    padding: 4,
                    boxShadow: "0 4px 10px rgba(15,23,42,.25)",
                    border: `2px solid ${isSelected ? "#0f172a" : "#fff"}`,
                    display: "flex",
                }}
            >
                <PanelTypeIcon type={panelType} size={18} />
            </div>
        </div>
    );
    return L.divIcon({
        html,
        className: "store-panel-marker",
        iconSize: [26, 26],
        iconAnchor: [13, 13],
    });
}

function createClusterIcon(cluster: { getChildCount: () => number }) {
    const count = cluster.getChildCount();
    return L.divIcon({
        html: `<div class="store-cluster-icon">${count}</div>`,
        className: "store-cluster-marker",
        iconSize: L.point(40, 40, true),
    });
}

export default function StoreMap({
    panels,
    selectedPanel,
    onPanelSelect,
    center,
    zoom,
}: {
    panels: StorePanel[];
    selectedPanel: StorePanel | null;
    onPanelSelect: (p: StorePanel) => void;
    center: [number, number];
    zoom: number;
}) {
    return (
        <>
            <style jsx global>{`
                .store-cluster-marker {
                    background: transparent !important;
                    border: none !important;
                }
                .store-cluster-icon {
                    background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
                    color: #fff;
                    width: 40px;
                    height: 40px;
                    border-radius: 9999px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.35);
                    border: 3px solid #fff;
                }
                .store-cluster-icon:hover {
                    transform: scale(1.06);
                    transition: transform 0.15s;
                }
                .store-panel-marker {
                    background: transparent !important;
                    border: none !important;
                }
            `}</style>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom
            >
                <MapController center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createClusterIcon}
                    maxClusterRadius={50}
                    spiderfyOnMaxZoom
                    showCoverageOnHover={false}
                    zoomToBoundsOnClick
                    disableClusteringAtZoom={17}
                    animate
                    removeOutsideVisibleBounds={false}
                >
                    {panels.map((p) => (
                        <Marker
                            key={p.id}
                            position={[p.latitude, p.longitude]}
                            icon={createIcon(p.type, selectedPanel?.id === p.id)}
                            eventHandlers={{
                                click: () => onPanelSelect(p),
                            }}
                        />
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </>
    );
}
