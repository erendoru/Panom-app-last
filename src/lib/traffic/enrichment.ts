/**
 * POI Enrichment (V1)
 *
 * Pano etrafındaki detaylı POI'leri (isim, marka, mesafe, yön) OSM Overpass'tan
 * çeker ve `Poi` + `PanelPoi` tablolarına yazar.
 *
 * - OSM tek başına ~500 TL (zaman) harcamadan %70-90 kapsam verir
 * - İleride fallback olarak Google Places eklenecek (V5)
 */

import prisma from "@/lib/prisma";
import {
    mapOsmTagsToCategory,
    normalizeBrand,
    haversineMeters,
    bearingDegrees,
    bearingToDirection,
    type PoiCategory,
} from "./poiTaxonomy";

const OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.ru/api/interpreter",
];
const USER_AGENT = "Panobu-PoiEnrichment/1.0 (https://panobu.com)";
const DEFAULT_TIMEOUT_MS = 25_000;

export type OsmPoi = {
    osmId: string;           // "w123" | "n456" | "r789"
    name: string;
    brand: string | null;    // normalize Panobu marka kodu (MIGROS, STARBUCKS...)
    category: PoiCategory;
    rawTag: string;          // "shop=supermarket" gibi
    lat: number;
    lng: number;
    distance: number;        // metre — panodan
    bearing: number;         // 0-360
    direction: string;       // "N"/"NE"...
};

export type EnrichPanelResult = {
    panelId: string;
    found: number;           // OSM'den kaç POI geldi
    upserted: number;        // Poi tablosuna kaç kayıt eklendi/güncellendi
    linked: number;          // PanelPoi tablosunda kaç ilişki kuruldu
    removed: number;         // Artık eşleşmediği için kaldırılan ilişki sayısı
    durationMs: number;
};

async function overpassFetch(query: string, signal?: AbortSignal): Promise<any> {
    let lastError: unknown = null;
    for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": USER_AGENT,
                    Accept: "application/json",
                },
                body: `data=${encodeURIComponent(query)}`,
                signal,
            });
            if (!res.ok) {
                lastError = new Error(`Overpass ${endpoint} -> ${res.status}`);
                continue;
            }
            return await res.json();
        } catch (err) {
            lastError = err;
            continue;
        }
    }
    throw lastError instanceof Error
        ? lastError
        : new Error("Overpass tüm endpoint'ler başarısız");
}

/**
 * Pano koordinatı etrafında `radiusM` yarıçap içindeki tüm ilgili POI'leri getirir.
 * Sadece taksonomiye uyanlar dönülür (others atılır).
 */
export async function fetchDetailedPois(
    lat: number,
    lng: number,
    radiusM = 500,
    timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<OsmPoi[]> {
    const query = `
[out:json][timeout:25];
(
  node["shop"~"^(supermarket|convenience|kiosk|general|mall|department_store|electronics|computer|mobile_phone|clothes|shoes|fashion|boutique|jewelry|furniture|houseware|interior_decoration)$"](around:${radiusM},${lat},${lng});
  way["shop"~"^(mall|department_store|supermarket)$"](around:${radiusM},${lat},${lng});
  node["amenity"~"^(pharmacy|bank|atm|fuel|restaurant|fast_food|cafe|ice_cream|bar|pub|nightclub|school|kindergarten|university|college|hospital|clinic|doctors|dentist|marketplace|bus_station)$"](around:${radiusM},${lat},${lng});
  way["amenity"~"^(school|university|college|hospital|marketplace)$"](around:${radiusM},${lat},${lng});
  node["tourism"~"^(hotel|motel|hostel|apartment|attraction|museum|viewpoint)$"](around:${radiusM},${lat},${lng});
  way["tourism"~"^(hotel|attraction|museum)$"](around:${radiusM},${lat},${lng});
  node["leisure"~"^(stadium|sports_centre|fitness_centre|park|garden|playground)$"](around:${radiusM},${lat},${lng});
  way["leisure"~"^(stadium|sports_centre|park)$"](around:${radiusM},${lat},${lng});
  node["railway"="station"](around:${radiusM},${lat},${lng});
  node["public_transport"="station"](around:${radiusM},${lat},${lng});
);
out tags center;
    `.trim();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let data: any;
    try {
        data = await overpassFetch(query, controller.signal);
    } finally {
        clearTimeout(timer);
    }

    const elements: any[] = Array.isArray(data?.elements) ? data.elements : [];
    const out: OsmPoi[] = [];

    for (const el of elements) {
        const tags: Record<string, string> = el.tags || {};
        const poiLat = el.type === "node" ? el.lat : el.center?.lat;
        const poiLng = el.type === "node" ? el.lon : el.center?.lon;
        if (typeof poiLat !== "number" || typeof poiLng !== "number") continue;

        const category = mapOsmTagsToCategory(tags);
        if (!category) continue;

        // Ham tag etiketi (ör. "shop=supermarket")
        const rawTag = (() => {
            if (tags.shop) return `shop=${tags.shop}`;
            if (tags.amenity) return `amenity=${tags.amenity}`;
            if (tags.tourism) return `tourism=${tags.tourism}`;
            if (tags.leisure) return `leisure=${tags.leisure}`;
            if (tags.railway) return `railway=${tags.railway}`;
            if (tags.public_transport) return `public_transport=${tags.public_transport}`;
            return "unknown";
        })();

        const name =
            tags.name ||
            tags["name:tr"] ||
            tags["name:en"] ||
            tags.brand ||
            tags.operator ||
            rawTag; // son çare: "amenity=bank" gibi — UI'da "Banka (isim yok)" olarak yorumlanır

        const brand = normalizeBrand(tags.brand || tags["brand:en"], tags.name);

        const distance = haversineMeters(lat, lng, poiLat, poiLng);
        const bearing = bearingDegrees(lat, lng, poiLat, poiLng);
        const direction = bearingToDirection(bearing);

        const typePrefix =
            el.type === "node" ? "n" : el.type === "way" ? "w" : "r";

        out.push({
            osmId: `${typePrefix}${el.id}`,
            name,
            brand,
            category,
            rawTag,
            lat: poiLat,
            lng: poiLng,
            distance,
            bearing,
            direction,
        });
    }

    // Yakından uzağa sırala
    out.sort((a, b) => a.distance - b.distance);
    return out;
}

/**
 * Tek panonun POI verisini zenginleştirir:
 *  - OSM'den POI'leri çek
 *  - `Poi` tablosuna upsert (source+sourceId unique)
 *  - `PanelPoi` ilişkilerini yeniden kur
 *  - `StaticPanel.poiEnrichedAt` + `nearbyPoiCount` güncelle
 *
 * Hata atmaz — yakalar ve bir özet döner.
 */
export async function enrichPanelPois(
    panelId: string,
    opts: { radiusM?: number } = {},
): Promise<EnrichPanelResult> {
    const t0 = Date.now();
    const radius = opts.radiusM ?? 500;

    const panel = await prisma.staticPanel.findUnique({
        where: { id: panelId },
        select: { id: true, latitude: true, longitude: true },
    });
    if (!panel) {
        return {
            panelId,
            found: 0,
            upserted: 0,
            linked: 0,
            removed: 0,
            durationMs: Date.now() - t0,
        };
    }

    let pois: OsmPoi[] = [];
    try {
        pois = await fetchDetailedPois(panel.latitude, panel.longitude, radius);
    } catch (err) {
        console.warn(`[enrichment] panel ${panelId} OSM fetch failed:`, err);
        return {
            panelId,
            found: 0,
            upserted: 0,
            linked: 0,
            removed: 0,
            durationMs: Date.now() - t0,
        };
    }

    // Aynı OSM id'si (örn. "w123") birden fazla kez gelirse ilk geleni al
    const uniqueByOsmId = new Map<string, OsmPoi>();
    for (const p of pois) {
        if (!uniqueByOsmId.has(p.osmId)) uniqueByOsmId.set(p.osmId, p);
    }
    const unique = Array.from(uniqueByOsmId.values());

    // 1) Poi upsert (source+sourceId unique)
    const poiIds = new Map<string, string>(); // osmId -> poiId (DB)
    for (const p of unique) {
        const up = await prisma.poi.upsert({
            where: {
                source_sourceId: { source: "OSM", sourceId: p.osmId },
            },
            update: {
                name: p.name,
                brand: p.brand,
                category: p.category,
                rawTag: p.rawTag,
                latitude: p.lat,
                longitude: p.lng,
            },
            create: {
                source: "OSM",
                sourceId: p.osmId,
                name: p.name,
                brand: p.brand,
                category: p.category,
                rawTag: p.rawTag,
                latitude: p.lat,
                longitude: p.lng,
            },
            select: { id: true },
        });
        poiIds.set(p.osmId, up.id);
    }

    // 2) Mevcut PanelPoi ilişkilerini yeniden kur
    // - Önce manuel olmayanları temizle (manuel eklenenler korunur)
    const existing = await prisma.panelPoi.findMany({
        where: { panelId },
        select: { id: true, poiId: true, manuallyAdded: true },
    });
    const manualPoiIds = new Set(
        existing.filter((x) => x.manuallyAdded).map((x) => x.poiId),
    );

    await prisma.panelPoi.deleteMany({
        where: { panelId, manuallyAdded: false },
    });

    // 3) Yeni ilişkileri toplu ekle
    const newLinks = unique
        .filter((p) => !manualPoiIds.has(poiIds.get(p.osmId)!))
        .map((p) => ({
            panelId,
            poiId: poiIds.get(p.osmId)!,
            distance: p.distance,
            bearing: p.bearing,
            direction: p.direction,
            isLandmark: false,
            manuallyAdded: false,
        }));

    let linked = 0;
    if (newLinks.length > 0) {
        const created = await prisma.panelPoi.createMany({
            data: newLinks,
            skipDuplicates: true,
        });
        linked = created.count;
    }

    // 4) Panel özeti: enrichment timestamp + POI sayısı
    await prisma.staticPanel.update({
        where: { id: panelId },
        data: {
            poiEnrichedAt: new Date(),
            nearbyPoiCount: unique.length + manualPoiIds.size,
        },
    });

    return {
        panelId,
        found: unique.length,
        upserted: unique.length,
        linked,
        removed: existing.filter((x) => !x.manuallyAdded).length,
        durationMs: Date.now() - t0,
    };
}

/** Basit sleep — batch rate-limiting için */
export function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}
