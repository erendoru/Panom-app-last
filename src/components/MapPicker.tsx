"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from "react-dom/server";
import PanelTypeIcon from "@/components/icons/PanelTypeIcon";

// Fix for default marker icon in Next.js (kullanıcı panelType vermezse fallback)
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
    latitude: number;
    longitude: number;
    onLocationSelect: (lat: number, lng: number) => void;
    height?: string;
    /**
     * Pano tipi verilirse marker, static-billboards haritasındaki gibi
     * PanelTypeIcon'lu yuvarlak beyaz rozet olarak çizilir.
     */
    panelType?: string;
}

function createPanelIcon(panelType: string) {
    const html = renderToStaticMarkup(
        <div className="relative">
            <div className="bg-white rounded-full p-1 shadow-lg border-2 border-white">
                <PanelTypeIcon type={panelType} size={20} />
            </div>
        </div>,
    );
    return L.divIcon({
        html,
        className: "custom-panel-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
}

export default function MapPicker({
    latitude,
    longitude,
    onLocationSelect,
    height = "400px",
    panelType,
}: MapPickerProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const isInitializedRef = useRef(false);
    const onLocationSelectRef = useRef(onLocationSelect);

    useEffect(() => {
        onLocationSelectRef.current = onLocationSelect;
    }, [onLocationSelect]);

    const [debouncedCoords, setDebouncedCoords] = useState({
        lat: latitude,
        lng: longitude,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (latitude && longitude) {
                setDebouncedCoords({ lat: latitude, lng: longitude });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [latitude, longitude]);

    // Initialize map only once
    useEffect(() => {
        if (
            typeof window === "undefined" ||
            !mapContainerRef.current ||
            isInitializedRef.current
        )
            return;

        const initialLat = latitude || 40.7678;
        const initialLng = longitude || 29.7944;

        const map = L.map(mapContainerRef.current).setView(
            [initialLat, initialLng],
            latitude && longitude ? 13 : 10,
        );

        // static-billboards haritasıyla aynı tile seti (CARTO Voyager)
        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
            {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom: 19,
            },
        ).addTo(map);

        mapRef.current = map;
        isInitializedRef.current = true;

        const iconFor = panelType ? createPanelIcon(panelType) : undefined;

        if (latitude && longitude) {
            markerRef.current = L.marker(
                [latitude, longitude],
                iconFor ? { icon: iconFor } : {},
            ).addTo(map);
        }

        map.on("click", (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            onLocationSelectRef.current(lat, lng);
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            } else {
                markerRef.current = L.marker(
                    [lat, lng],
                    iconFor ? { icon: iconFor } : {},
                ).addTo(map);
            }
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
                isInitializedRef.current = false;
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Pano tipi değişirse mevcut marker'ın ikonunu güncelle
    useEffect(() => {
        if (!markerRef.current) return;
        if (panelType) {
            markerRef.current.setIcon(createPanelIcon(panelType));
        } else {
            markerRef.current.setIcon(DefaultIcon);
        }
    }, [panelType]);

    // Debounced marker pan
    useEffect(() => {
        if (!mapRef.current || !debouncedCoords.lat || !debouncedCoords.lng)
            return;
        const { lat, lng } = debouncedCoords;
        const iconFor = panelType ? createPanelIcon(panelType) : DefaultIcon;
        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
        } else {
            markerRef.current = L.marker([lat, lng], { icon: iconFor }).addTo(
                mapRef.current,
            );
        }
        const currentCenter = mapRef.current.getCenter();
        const distance = Math.sqrt(
            Math.pow(currentCenter.lat - lat, 2) +
                Math.pow(currentCenter.lng - lng, 2),
        );
        if (distance > 0.0001) {
            mapRef.current.setView([lat, lng], 13, { animate: true });
        }
    }, [debouncedCoords, panelType]);

    return (
        <div>
            <style jsx global>{`
                .custom-panel-marker {
                    background: transparent !important;
                    border: none !important;
                }
            `}</style>
            <div
                ref={mapContainerRef}
                style={{ height, width: "100%" }}
                className="rounded-lg border border-slate-300 overflow-hidden"
            />
            <p className="text-xs text-slate-600 mt-2">
                Haritaya tıklayarak pano konumunu seçin
            </p>
        </div>
    );
}
