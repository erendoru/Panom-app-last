/**
 * OpenStreetMap Overpass API helpers.
 *
 * - Ücretsiz, API anahtarsız (fair-use politikasına uyulur)
 * - Pano lat/lng'si etrafındaki yolları 150m yarıçapta tarar
 * - Tüm yolları class+distance ağırlığıyla skorlar, en güçlü olanı seçer
 * - `ref=D-100`, `ref=O-5` gibi otoyol kod tag'leri sınıfı yükseltir
 * - `place=square`, `amenity=marketplace` bulunursa meydan ipucu üretir
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
    roadName: string | null; // yolun ismi (varsa)
    roadRef: string | null;  // ref tag — "D-100", "O-5", "E80" vs.
    poiCount: number; // 500m yarıçaptaki POI sayısı
    poiBreakdown: Record<string, number>; // { school: 2, hospital: 1 ... }
    /** Yakında (~60m) meydan/marketplace bulundu mu? */
    isSquareContext: boolean;
    /** 500m radius içinde AVM var mı (shop=mall) */
    hasNearbyMall: boolean;
};

const OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.ru/api/interpreter",
];

const USER_AGENT = "Panobu-TrafficScore/1.1 (https://panobu.com)";
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

/**
 * `ref=*` (D-100, O-5, E80, TEM vs.) değeri varsa otomatik ana arter/otoyol say.
 * - `O-` ile başlayanlar otoyol (Türkiye numaralandırması)
 * - `D-` devlet yolu → ana arter
 * - `E` Avrupa yolu → otoyol
 */
function upgradeByRef(
    currentType: OsmRoadType,
    ref: string | null | undefined,
): OsmRoadType {
    if (!ref) return currentType;
    const r = String(ref).toUpperCase().trim();
    const isMotorway =
        /(^|[\s;])O-?\d/.test(r) ||       // O-5, O5, O-7
        /(^|[\s;])E\d/.test(r) ||          // E80, E-90
        /TEM/.test(r);
    const isMainArter = /(^|[\s;])D-?\d/.test(r); // D-100, D-550
    if (isMotorway) return "HIGHWAY";
    if (isMainArter && classRank(currentType) < classRank("MAIN_ROAD")) {
        return "MAIN_ROAD";
    }
    return currentType;
}

function classRank(t: OsmRoadType): number {
    switch (t) {
        case "HIGHWAY": return 5;
        case "MAIN_ROAD": return 4;
        case "SECONDARY_ROAD": return 3;
        case "PEDESTRIAN": return 2;
        case "RESIDENTIAL": return 1;
    }
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
 * - Yol seçiminde "sınıf ağırlığı 10 − mesafe(m)" formülü kullanılır → uzak ama
 *   motorway olan yol, yakın residential'ı eze eze yener.
 * Başarısız olursa null döner (fallback değerlere bırakırız).
 */
export async function lookupOsmContext(
    lat: number,
    lng: number,
    opts: { radiusM?: number; roadRadiusM?: number; timeoutMs?: number } = {},
): Promise<OsmLookupResult | null> {
    const poiRadius = opts.radiusM ?? 500;
    const roadRadius = opts.roadRadiusM ?? 150; // önceden 60m — artık 150m
    const timeout = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    const query = `
[out:json][timeout:25];
(
  // Yakın yollar (${roadRadius}m)
  way["highway"](around:${roadRadius},${lat},${lng});
  // Meydan/marketplace ipucu (~80m)
  way["place"="square"](around:80,${lat},${lng});
  node["amenity"="marketplace"](around:80,${lat},${lng});
  way["amenity"="marketplace"](around:80,${lat},${lng});
  // POI'ler (500m içinde)
  node["amenity"~"^(school|university|college|hospital|clinic|pharmacy|marketplace|restaurant|cafe|bank|atm|fuel|bus_station)$"](around:${poiRadius},${lat},${lng});
  node["shop"~"^(mall|supermarket|convenience|department_store)$"](around:${poiRadius},${lat},${lng});
  node["tourism"~"^(hotel|attraction)$"](around:${poiRadius},${lat},${lng});
  node["leisure"~"^(stadium|sports_centre|park)$"](around:${poiRadius},${lat},${lng});
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

    // Sınıf önceliği (yüksek sayı = daha önemli)
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

    function haversineM(aLat: number, aLng: number, bLat: number, bLng: number): number {
        const R = 6371000;
        const toRad = (x: number) => (x * Math.PI) / 180;
        const dLat = toRad(bLat - aLat);
        const dLng = toRad(bLng - aLng);
        const s =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(s));
    }

    let bestRoad: {
        tag: string;
        name: string | null;
        ref: string | null;
        weight: number;
        distance: number;
    } | null = null;
    let isSquareContext = false;
    const poiBreakdown: Record<string, number> = {};

    for (const el of elements) {
        const tags = el.tags || {};

        // Yol
        if (el.type === "way" && tags.highway) {
            const tag = String(tags.highway);
            const priority = ROAD_PRIORITY[tag] ?? 0;
            if (priority <= 0) continue;
            // Yolun yaklaşık orta noktasını al (center varsa; yoksa panonun koordinatı — ceza verme)
            const rlat = el.center?.lat ?? lat;
            const rlng = el.center?.lon ?? lng;
            const distance = haversineM(lat, lng, rlat, rlng);
            // Ağırlık = sınıf priority + (yakınlık bonusu)
            // Yakınlık bonusu: 150m'de 0, 0m'de +30. Motorway (100) her zaman tertiary (60) üstü.
            const proximityBonus = Math.max(0, 30 - distance * 0.2);
            const weight = priority + proximityBonus;

            const ref = (tags.ref as string | undefined) ?? null;
            if (!bestRoad || weight > bestRoad.weight) {
                bestRoad = {
                    tag,
                    name: tags.name ?? tags["name:tr"] ?? null,
                    ref,
                    weight,
                    distance,
                };
            }
            continue;
        }

        // Meydan / marketplace
        if (
            (tags.place === "square") ||
            (tags.amenity === "marketplace")
        ) {
            isSquareContext = true;
        }

        // POI sayımı
        if (el.type === "node" && tags) {
            const category = tags.amenity || tags.shop || tags.tourism || tags.leisure;
            if (category) {
                poiBreakdown[category] = (poiBreakdown[category] || 0) + 1;
            }
        }
    }

    const poiCount = Object.values(poiBreakdown).reduce((s, n) => s + n, 0);
    const hasNearbyMall = (poiBreakdown.mall || 0) > 0 ||
        (poiBreakdown.department_store || 0) > 0;

    // Ham highway → enum
    let roadType = mapHighwayToRoadType(bestRoad?.tag ?? null);
    // ref tag'iyle yükselt (D-100, O-5, E80 vs.)
    roadType = upgradeByRef(roadType, bestRoad?.ref ?? null);

    return {
        roadType,
        roadTag: bestRoad?.tag ?? null,
        roadName: bestRoad?.name ?? null,
        roadRef: bestRoad?.ref ?? null,
        poiCount,
        poiBreakdown,
        isSquareContext,
        hasNearbyMall,
    };
}

/**
 * Basit sleep helper — batch rate-limiting için.
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}
