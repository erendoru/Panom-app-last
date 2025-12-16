"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Next.js
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
    latitude: number;
    longitude: number;
    onLocationSelect: (lat: number, lng: number) => void;
    height?: string;
}

export default function MapPicker({
    latitude,
    longitude,
    onLocationSelect,
    height = '400px'
}: MapPickerProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only initialize map on client side
        if (typeof window === 'undefined' || !mapContainerRef.current) return;

        // Initialize map if not already initialized
        if (!mapRef.current) {
            const map = L.map(mapContainerRef.current).setView(
                [latitude || 40.7678, longitude || 29.7944], // Default to Kocaeli
                latitude && longitude ? 13 : 10
            );

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);

            mapRef.current = map;

            // Add click handler
            map.on('click', (e: L.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng;
                onLocationSelect(lat, lng);

                // Update or create marker
                if (markerRef.current) {
                    markerRef.current.setLatLng([lat, lng]);
                } else {
                    markerRef.current = L.marker([lat, lng]).addTo(map);
                }
            });
        }

        // Update marker position when props change
        if (latitude && longitude && mapRef.current) {
            if (markerRef.current) {
                markerRef.current.setLatLng([latitude, longitude]);
            } else {
                markerRef.current = L.marker([latitude, longitude]).addTo(mapRef.current);
            }
            mapRef.current.setView([latitude, longitude], 13);
        }

        // Cleanup
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
            }
        };
    }, [latitude, longitude, onLocationSelect]);

    return (
        <div>
            <div
                ref={mapContainerRef}
                style={{ height, width: '100%' }}
                className="rounded-lg border border-slate-300 overflow-hidden"
            />
            <p className="text-xs text-slate-600 mt-2">
                Haritaya tıklayarak pano konumunu seçin
            </p>
        </div>
    );
}
