"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
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
    const isInitializedRef = useRef(false);
    const onLocationSelectRef = useRef(onLocationSelect);

    // Keep callback ref updated without triggering re-renders
    useEffect(() => {
        onLocationSelectRef.current = onLocationSelect;
    }, [onLocationSelect]);

    // Debounced coordinates for marker update
    const [debouncedCoords, setDebouncedCoords] = useState({ lat: latitude, lng: longitude });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (latitude && longitude) {
                setDebouncedCoords({ lat: latitude, lng: longitude });
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [latitude, longitude]);

    // Initialize map only once
    useEffect(() => {
        if (typeof window === 'undefined' || !mapContainerRef.current || isInitializedRef.current) return;

        const initialLat = latitude || 40.7678;
        const initialLng = longitude || 29.7944;

        const map = L.map(mapContainerRef.current).setView(
            [initialLat, initialLng],
            latitude && longitude ? 13 : 10
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;
        isInitializedRef.current = true;

        // Add initial marker if coordinates exist
        if (latitude && longitude) {
            markerRef.current = L.marker([latitude, longitude]).addTo(map);
        }

        // Add click handler
        map.on('click', (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            onLocationSelectRef.current(lat, lng);

            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            } else {
                markerRef.current = L.marker([lat, lng]).addTo(map);
            }
        });

        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
                isInitializedRef.current = false;
            }
        };
    }, []); // Empty dependency - only run once

    // Update marker position when debounced coordinates change
    useEffect(() => {
        if (!mapRef.current || !debouncedCoords.lat || !debouncedCoords.lng) return;

        const { lat, lng } = debouncedCoords;

        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
        } else {
            markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
        }

        // Don't animate every time - only pan if significantly different
        const currentCenter = mapRef.current.getCenter();
        const distance = Math.sqrt(
            Math.pow(currentCenter.lat - lat, 2) +
            Math.pow(currentCenter.lng - lng, 2)
        );

        if (distance > 0.0001) { // Pan if moved more than ~10m
            mapRef.current.setView([lat, lng], 13, { animate: true });
        }
    }, [debouncedCoords]);

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
