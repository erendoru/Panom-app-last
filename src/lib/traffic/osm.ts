/**
 * OpenStreetMap Overpass API helpers.
 *
 * - Ücretsiz, API anahtarsız (fair-use politikasına uyulur)
 * - Panonun lat/lng'si etrafında en yakın yolun `highway` tag'ini bulur
 * - 500m yarıçapta POI (okul/hastane/AVM/market/restoran vs.) sayar
 *
 * Fair-use: Saniyede 2'den fazla istek atmayın. Batch hesaplamalarda
 * doğal bir delay (rateLimit) bırakıyoruz.
 */

export type OsmRoadType =
    | "HIGHWAY"
    | "MAIN_ROAD"
    | "SECONDARY_ROAD"
    | "RESIDENTIAL"
    | "PEDESTRIAN";

export type OsmLookupResult = {
    roadType: OsmRoadType;
    roadTag: string | null; // ham OSM highway=* değeri
    roadName: string | null; // yolun ismi
    poiCount: number; // 500m yarıçaptaki POI sayısı
    poiBreakdown: Record<string, number>; // { school: 2, hospital: 1 ... }
};

const OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.ru/api/interpreter",
];

const USER_AGENT = "Panobu-TrafficScore/1.0 (https://panobu.com)";
const DEFAULT_TIMEOUT_MS = 20_000;

/**
 * OSM `highway=*` değerini bizim RoadType enum'ına haritalar.
 */
export function mapHighwayToRoadType(tag: string | null | undefined): OsmRoadType {
    if (!tag) return "RESIDENTIAL";
    const t = tag.toLowerCase();
    if (["motorway", "motorway_link", "trunk", "trunk_link"].includes(t)) {
        return "HIGHWAY";
    }
    if (["primary", "primary_link"].includes(t)) {
        return "MAIN_ROAD";
    }
    if (["secondary", "secondary_link", "tertiary", "tertiary_link"].includes(t)) {
        return "SECONDARY_ROAD";
    }
    if (["pedestrian", "footway", "living_street", "path", "steps"].includes(t)) {
        return "PEDESTRIAN";
    }
    // residential, unclassified, service, road, track
    return "RESIDENTIAL";
}

async function overpassQuery(
    query: string,
    signal?: AbortSignal,
): Promise<any> {
    let lastError: unknown = null;
    for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": USER_AGENT,
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
 * Verilen koordinatın yakınındaki en önemli yolu ve 500m POI'leri çeker.
 * Başarısız olursa null döner (fallback değerlere bırakırız).
 */
export async function lookupOsmContext(
    lat: number,
    lng: number,
    opts: { radiusM?: number; timeoutMs?: number } = {},
): Promise<OsmLookupResult | null> {
    const radius = opts.radiusM ?? 500;
    const timeout = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    // Not: yol için 60m yarıçap yeterli, POI için 500m
    const query = `
[out:json][timeout:25];
(
  // Yakın yollar (60m)
  way["highway"](around:60,${lat},${lng});
  // POI'ler (500m içinde)
  node["amenity"~"^(school|university|college|hospital|clinic|pharmacy|marketplace|restaurant|cafe|bank|atm|fuel|bus_station|pharmacy)$"](around:${radius},${lat},${lng});
  node["shop"~"^(mall|supermarket|convenience|department_store)$"](around:${radius},${lat},${lng});
  node["tourism"~"^(hotel|attraction)$"](around:${radius},${lat},${lng});
  node["leisure"~"^(stadium|sports_centre|park)$"](around:${radius},${lat},${lng});
);
out tags center;
`.trim();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    let data: any;
    try {
        data = await overpassQuery(query, controller.signal);
    } catch (err) {
        clearTimeout(timer);
        console.warn("[OSM] lookupOsmContext failed:", err);
        return null;
    }
    clearTimeout(timer);

    const elements: any[] = Array.isArray(data?.elements) ? data.elements : [];

    // En "önemli" yolu seç (hierarchy: motorway > trunk > primary > secondary > tertiary > residential)
    const ROAD_PRIORITY: Record<string, number> = {
        motorway: 100,
        motorway_link: 95,
        trunk: 90,
        trunk_link: 85,
        primary: 80,
        primary_link: 75,
        secondary: 70,
        secondary_link: 65,
        tertiary: 60,
        tertiary_link: 55,
        unclassified: 40,
        residential: 35,
        living_street: 25,
        service: 20,
        pedestrian: 15,
        footway: 10,
        path: 5,
    };

    let bestRoad: { tag: string; name: string | null; priority: number } | null = null;
    const poiBreakdown: Record<string, number> = {};

    for (const el of elements) {
        if (el.type === "way" && el.tags?.highway) {
            const tag = String(el.tags.highway);
            const priority = ROAD_PRIORITY[tag] ?? 0;
            if (!bestRoad || priority > bestRoad.priority) {
                bestRoad = {
                    tag,
                    name: el.tags.name ?? el.tags["name:tr"] ?? null,
                    priority,
                };
            }
        } else if (el.type === "node" && el.tags) {
            // POI kategorisi
            const category =
                el.tags.amenity ||
                el.tags.shop ||
                el.tags.tourism ||
                el.tags.leisure;
            if (category) {
                poiBreakdown[category] = (poiBreakdown[category] || 0) + 1;
            }
        }
    }

    const poiCount = Object.values(poiBreakdown).reduce((s, n) => s + n, 0);

    return {
        roadType: mapHighwayToRoadType(bestRoad?.tag ?? null),
        roadTag: bestRoad?.tag ?? null,
        roadName: bestRoad?.name ?? null,
        poiCount,
        poiBreakdown,
    };
}

/**
 * Basit sleep helper — batch rate-limiting için.
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}
