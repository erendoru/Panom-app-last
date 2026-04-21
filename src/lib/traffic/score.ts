/**
 * Pano Trafik Skoru ve Tahmini Gösterim hesaplamaları.
 *
 * Katmanlı çözüm:
 *  1. `placementContext` (admin/sahip manuel seçer) → en güçlü sinyal
 *  2. `manualRoadType` override'ı → OSM'e itiraz ederse
 *  3. OSM road lookup (ref tag + mesafe bias)
 *  4. OSM POI density → çarpan + bonus + floor
 *  5. `isSquareContext` / meydan ipucu → MAIN_ROAD minimum
 *
 * Türkiye OOH sektör standart katsayıları baz alınmıştır.
 */

import type { OsmLookupResult } from "./osm";

export type PanelTypeKey =
    | "BILLBOARD"
    | "BILLBOARD_PLUS"
    | "GIANTBOARD"
    | "MEGALIGHT"
    | "CLP"
    | "MEGABOARD"
    | "KULEBOARD"
    | "ALINLIK"
    | "LIGHTBOX"
    | "MAXIBOARD"
    | "YOL_PANOSU";

export type RoadTypeKey =
    | "HIGHWAY"
    | "MAIN_ROAD"
    | "SECONDARY_ROAD"
    | "RESIDENTIAL"
    | "PEDESTRIAN";

export type PlacementContextKey =
    | "HIGHWAY_SIDE"
    | "MAIN_JUNCTION"
    | "URBAN_MAIN"
    | "SQUARE"
    | "BUILDING_WRAP"
    | "MALL_OUTDOOR"
    | "PEDESTRIAN"
    | "RESIDENTIAL_EDGE";

// --- Katsayılar ----------------------------------------------------------

/** Görünürlük çarpanı — panonun tipine göre reklam dikkatini temsil eder. */
export const VISIBILITY_MULTIPLIERS: Record<PanelTypeKey, number> = {
    BILLBOARD: 0.5,
    BILLBOARD_PLUS: 0.55,
    GIANTBOARD: 0.6,
    MEGALIGHT: 0.7,
    MEGABOARD: 0.65,
    KULEBOARD: 0.5,
    ALINLIK: 0.4,
    LIGHTBOX: 0.35,
    MAXIBOARD: 0.55,
    CLP: 0.4,
    YOL_PANOSU: 0.5,
};

/** Türkiye ortalaması — araç başına yolcu (AVG_VEHICLE_OCCUPANCY). */
export const AVG_VEHICLE_OCCUPANCY = 1.6;

/** Yol tipine göre tahmini günlük araç/yaya trafiği (taban değer). */
export const BASE_TRAFFIC_BY_ROAD_TYPE: Record<RoadTypeKey, number> = {
    HIGHWAY: 50_000,
    MAIN_ROAD: 25_000,
    SECONDARY_ROAD: 10_000,
    RESIDENTIAL: 3_000,
    PEDESTRIAN: 8_000,
};

/** Yol tipine göre bazal skor (0-100). */
const BASE_SCORE_BY_ROAD_TYPE: Record<RoadTypeKey, number> = {
    HIGHWAY: 70,
    MAIN_ROAD: 50,
    SECONDARY_ROAD: 30,
    RESIDENTIAL: 15,
    PEDESTRIAN: 40,
};

/**
 * Yerleşim bağlamı skoru — OSM'den bağımsız, en güçlü sinyal.
 * Admin/sahip "buraya bir meydan" diyince, arka sokak tespiti ezilir.
 */
export const BASE_SCORE_BY_PLACEMENT: Record<PlacementContextKey, number> = {
    HIGHWAY_SIDE: 75,
    MAIN_JUNCTION: 65,
    URBAN_MAIN: 55,
    SQUARE: 65,
    BUILDING_WRAP: 55,
    MALL_OUTDOOR: 60,
    PEDESTRIAN: 45,
    RESIDENTIAL_EDGE: 20,
};

/**
 * Yerleşim → ham günlük trafik haritası (araç/yaya toplam).
 * OSM'den gelecek değer yoksa buna bakarız.
 */
export const BASE_TRAFFIC_BY_PLACEMENT: Record<PlacementContextKey, number> = {
    HIGHWAY_SIDE: 55_000,
    MAIN_JUNCTION: 30_000,
    URBAN_MAIN: 22_000,
    SQUARE: 28_000,
    BUILDING_WRAP: 18_000,
    MALL_OUTDOOR: 20_000,
    PEDESTRIAN: 12_000,
    RESIDENTIAL_EDGE: 4_000,
};

/**
 * Yerleşim → RoadType eşlemesi. Impression/CPM hesaplaması için roadType da
 * türetilebilsin diye.
 */
export const ROAD_TYPE_FROM_PLACEMENT: Record<PlacementContextKey, RoadTypeKey> = {
    HIGHWAY_SIDE: "HIGHWAY",
    MAIN_JUNCTION: "MAIN_ROAD",
    URBAN_MAIN: "MAIN_ROAD",
    SQUARE: "MAIN_ROAD",
    BUILDING_WRAP: "MAIN_ROAD",
    MALL_OUTDOOR: "MAIN_ROAD",
    PEDESTRIAN: "PEDESTRIAN",
    RESIDENTIAL_EDGE: "RESIDENTIAL",
};

/** OSM POI sayısından çıkarılacak "yaya yoğunluğu" çarpanı. */
function poiMultiplierFromCount(count: number): number {
    if (count >= 40) return 1.5; // çok yoğun
    if (count >= 20) return 1.3; // yüksek
    if (count >= 8) return 1.0; // orta
    return 0.7; // düşük
}

/** POI sayısından bonus puan (0-15). */
function poiBonusFromCount(count: number): number {
    return Math.min(15, Math.round(count / 3));
}

/**
 * POI yoğunluğuna göre skor tabanı (floor).
 * Meydan/çarşı yoğunluğunda OSM yolu residential dese bile tabanı yükseltir.
 */
function poiScoreFloor(count: number): number {
    if (count >= 40) return 65;
    if (count >= 20) return 50;
    if (count >= 10) return 35;
    return 0;
}

/** Yaya trafiği mi? (PEDESTRIAN) → araç çarpanı uygulanmaz */
export function isPedestrian(roadType: RoadTypeKey): boolean {
    return roadType === "PEDESTRIAN";
}

// --- Ana fonksiyonlar ----------------------------------------------------

export type ComputeTrafficInput = {
    panelType: PanelTypeKey | string;
    /** OSM'den türetilen yol tipi */
    roadType: RoadTypeKey;
    poiCount: number;
    /** Yerleşim bağlamı (en güçlü sinyal, tüm roadType'ı ezebilir). */
    placementContext?: PlacementContextKey | null;
    /** Admin OSM'e itiraz etti mi? Bu değer set ise roadType yerine bu kullanılır. */
    manualRoadType?: RoadTypeKey | null;
    /** Admin POI sayısını elle girdiyse OSM'i bypass eder. */
    manualPoiCount?: number | null;
    /** Meydan/marketplace ipucu yakalandı mı (OSM'den gelir) */
    isSquareContext?: boolean;
    /** Yakında AVM var mı */
    hasNearbyMall?: boolean;
    /** Opsiyonel: owner/admin manuel günlük trafik girmişse, bu değer kullanılır. */
    manualDailyTraffic?: number | null;
    /** Opsiyonel: haftalık fiyat (CPM hesabı için) */
    weeklyPrice?: number | null;
};

export type ComputeTrafficOutput = {
    trafficScore: number; // 1-100
    roadType: RoadTypeKey;
    dailyTraffic: number; // ham trafik (araç veya yaya)
    dailyImpressions: number;
    weeklyImpressions: number;
    monthlyImpressions: number;
    visibilityScore: number; // 0..1
    cpm: number | null; // TL / 1.000 gösterim (haftalık fiyat verildiyse)
    poiCount: number;
    notes: string[];
};

/**
 * Ana hesaplama: skor + günlük/haftalık/aylık gösterim + CPM.
 *
 * Öncelik sırası:
 *  placementContext > manualRoadType > OSM roadType
 *  manualPoiCount > OSM poiCount
 */
export function computeTraffic(input: ComputeTrafficInput): ComputeTrafficOutput {
    const notes: string[] = [];

    // --- 0) Giriş verisini normalize et --------------------------------
    const poiCount =
        typeof input.manualPoiCount === "number" && input.manualPoiCount >= 0
            ? input.manualPoiCount
            : input.poiCount;
    if (typeof input.manualPoiCount === "number") {
        notes.push("Manuel POI sayısı kullanıldı.");
    }

    // roadType önceliği: placement > manual > osm
    let roadType: RoadTypeKey;
    let baseScore: number;
    let baseTraffic: number;

    if (input.placementContext) {
        roadType = ROAD_TYPE_FROM_PLACEMENT[input.placementContext];
        baseScore = BASE_SCORE_BY_PLACEMENT[input.placementContext];
        baseTraffic = BASE_TRAFFIC_BY_PLACEMENT[input.placementContext];
        notes.push(`Yerleşim bağlamı: ${input.placementContext}`);
    } else if (input.manualRoadType) {
        roadType = input.manualRoadType;
        baseScore = BASE_SCORE_BY_ROAD_TYPE[roadType];
        baseTraffic = BASE_TRAFFIC_BY_ROAD_TYPE[roadType];
        notes.push(`Manuel yol tipi override: ${roadType}`);
    } else {
        roadType = input.roadType;
        baseScore = BASE_SCORE_BY_ROAD_TYPE[roadType];
        baseTraffic = BASE_TRAFFIC_BY_ROAD_TYPE[roadType];
    }

    // Meydan ipucu: placement yoksa bile OSM "meydan" diyorsa tabanı MAIN_ROAD'a çıkar
    if (
        !input.placementContext &&
        !input.manualRoadType &&
        input.isSquareContext &&
        classRank(roadType) < classRank("MAIN_ROAD")
    ) {
        roadType = "MAIN_ROAD";
        baseScore = Math.max(baseScore, BASE_SCORE_BY_ROAD_TYPE.MAIN_ROAD);
        baseTraffic = Math.max(baseTraffic, BASE_TRAFFIC_BY_ROAD_TYPE.MAIN_ROAD);
        notes.push("OSM meydan/çarşı ipucuyla MAIN_ROAD'a yükseltildi.");
    }

    // --- 1) Trafik Skoru -------------------------------------------------
    const multiplier = poiMultiplierFromCount(poiCount);
    const bonus = poiBonusFromCount(poiCount);
    let trafficScore = Math.round(baseScore * multiplier + bonus);

    // POI yoğunluk tabanı (floor): 40+ POI → min 65, 20+ → min 50 vs.
    const floor = poiScoreFloor(poiCount);
    if (floor > trafficScore) {
        notes.push(`POI yoğunluk tabanı uygulandı (${poiCount} POI → min ${floor}).`);
        trafficScore = floor;
    }

    // AVM yakınlığı küçük bir bonus
    if (input.hasNearbyMall) {
        trafficScore = Math.min(100, trafficScore + 5);
        notes.push("Yakında AVM (+5).");
    }

    trafficScore = Math.max(1, Math.min(100, trafficScore));

    // --- 2) Günlük Trafik -----------------------------------------------
    let dailyTraffic: number;
    if (typeof input.manualDailyTraffic === "number" && input.manualDailyTraffic > 0) {
        dailyTraffic = Math.round(input.manualDailyTraffic);
        notes.push("Manuel günlük trafik kullanıldı.");
    } else {
        // base * (score / 50) — 50 referans skorda base'i verir
        dailyTraffic = Math.round(baseTraffic * (trafficScore / 50));
    }

    // --- 3) Görünürlük ---------------------------------------------------
    const visibilityScore =
        VISIBILITY_MULTIPLIERS[input.panelType as PanelTypeKey] ?? 0.5;
    const occupancy = isPedestrian(roadType) ? 1 : AVG_VEHICLE_OCCUPANCY;

    // --- 4) Gösterim -----------------------------------------------------
    const dailyImpressions = Math.round(dailyTraffic * visibilityScore * occupancy);
    const weeklyImpressions = dailyImpressions * 7;
    const monthlyImpressions = dailyImpressions * 30;

    // --- 5) CPM ----------------------------------------------------------
    let cpm: number | null = null;
    if (
        typeof input.weeklyPrice === "number" &&
        input.weeklyPrice > 0 &&
        weeklyImpressions > 0
    ) {
        cpm = +((input.weeklyPrice / weeklyImpressions) * 1000).toFixed(2);
    }

    return {
        trafficScore,
        roadType,
        dailyTraffic,
        dailyImpressions,
        weeklyImpressions,
        monthlyImpressions,
        visibilityScore,
        cpm,
        poiCount,
        notes,
    };
}

function classRank(t: RoadTypeKey): number {
    switch (t) {
        case "HIGHWAY": return 5;
        case "MAIN_ROAD": return 4;
        case "SECONDARY_ROAD": return 3;
        case "PEDESTRIAN": return 2;
        case "RESIDENTIAL": return 1;
    }
}

/**
 * OSM lookup'ı yoksa / başarısızsa fallback: sadece yol tipi default + düşük skor.
 * placementContext ve manual override'lar varsa onları kullanır.
 */
export function computeTrafficFallback(params: {
    panelType: PanelTypeKey | string;
    roadType?: RoadTypeKey;
    placementContext?: PlacementContextKey | null;
    manualRoadType?: RoadTypeKey | null;
    manualPoiCount?: number | null;
    manualDailyTraffic?: number | null;
    weeklyPrice?: number | null;
}): ComputeTrafficOutput {
    return computeTraffic({
        panelType: params.panelType,
        roadType: params.roadType ?? "SECONDARY_ROAD",
        poiCount: 0,
        placementContext: params.placementContext ?? null,
        manualRoadType: params.manualRoadType ?? null,
        manualPoiCount: params.manualPoiCount ?? null,
        manualDailyTraffic: params.manualDailyTraffic,
        weeklyPrice: params.weeklyPrice,
    });
}

/**
 * OSM lookup sonucundan tam hesaplama.
 * placementContext / manual override'lar varsa onları da input'a katar.
 */
export function computeFromOsm(
    panelType: string,
    osm: OsmLookupResult | null,
    opts: {
        placementContext?: PlacementContextKey | null;
        manualRoadType?: RoadTypeKey | null;
        manualPoiCount?: number | null;
        manualDailyTraffic?: number | null;
        weeklyPrice?: number | null;
    } = {},
): ComputeTrafficOutput {
    if (!osm) {
        return computeTrafficFallback({
            panelType,
            roadType: "SECONDARY_ROAD",
            placementContext: opts.placementContext,
            manualRoadType: opts.manualRoadType,
            manualPoiCount: opts.manualPoiCount,
            manualDailyTraffic: opts.manualDailyTraffic,
            weeklyPrice: opts.weeklyPrice,
        });
    }
    return computeTraffic({
        panelType,
        roadType: osm.roadType,
        poiCount: osm.poiCount,
        placementContext: opts.placementContext,
        manualRoadType: opts.manualRoadType,
        manualPoiCount: opts.manualPoiCount,
        isSquareContext: osm.isSquareContext,
        hasNearbyMall: osm.hasNearbyMall,
        manualDailyTraffic: opts.manualDailyTraffic,
        weeklyPrice: opts.weeklyPrice,
    });
}

// --- Yardımcı: UI tarafı için renk / label -------------------------------

export function trafficLevelLabel(score: number | null | undefined): string {
    if (score == null) return "Veri hazırlanıyor";
    if (score >= 70) return "Yüksek trafik";
    if (score >= 40) return "Orta trafik";
    return "Düşük trafik";
}

export const ROAD_TYPE_LABELS: Record<RoadTypeKey, string> = {
    HIGHWAY: "Otoyol / Ana arter",
    MAIN_ROAD: "Ana cadde",
    SECONDARY_ROAD: "Tali yol",
    RESIDENTIAL: "Ara sokak",
    PEDESTRIAN: "Yaya bölgesi",
};

export const PLACEMENT_CONTEXT_LABELS: Record<PlacementContextKey, string> = {
    HIGHWAY_SIDE: "Otoyol / çevre yolu kenarı",
    MAIN_JUNCTION: "Ana cadde kavşağı",
    URBAN_MAIN: "Ana cadde / bulvar üstü",
    SQUARE: "Meydan / plaza",
    BUILDING_WRAP: "Bina giydirme / cephe",
    MALL_OUTDOOR: "AVM önü / otopark",
    PEDESTRIAN: "Yaya bölgesi / çarşı",
    RESIDENTIAL_EDGE: "Mahalle kenarı / servis yolu",
};

export const PLACEMENT_CONTEXT_DESCRIPTIONS: Record<PlacementContextKey, string> = {
    HIGHWAY_SIDE: "Yüksek hızlı, yoğun taşıt trafiği — otoyol veya çevre yolu.",
    MAIN_JUNCTION: "Ana arter kesişimi, ışıklı kavşak — uzun bakış süresi.",
    URBAN_MAIN: "Şehir içi ana cadde/bulvar — düzenli taşıt + yaya.",
    SQUARE: "Meydan, forum, plaza — çok yönlü görünür, yüksek yaya.",
    BUILDING_WRAP: "Bina cephesi / giydirme reklam — büyük ölçek görünürlük.",
    MALL_OUTDOOR: "AVM girişi, otopark — hedeflenmiş alışveriş kitlesi.",
    PEDESTRIAN: "Yaya bölgesi, çarşı içi — yakın mesafe, orta trafik.",
    RESIDENTIAL_EDGE: "Mahalle kenarı, servis/ara yol — düşük akış.",
};
