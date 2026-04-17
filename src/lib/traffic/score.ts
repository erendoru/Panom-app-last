/**
 * Pano Trafik Skoru ve Tahmini Gösterim hesaplamaları.
 *
 * Türkiye OOH sektör standart katsayıları baz alınmıştır.
 * Formül dokümantasyonu: docs/panobu_media_owner_dashboard_prompts.md (Faz T2)
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

/** Yaya trafiği mi? (PEDESTRIAN) → araç çarpanı uygulanmaz */
export function isPedestrian(roadType: RoadTypeKey): boolean {
    return roadType === "PEDESTRIAN";
}

// --- Ana fonksiyonlar ----------------------------------------------------

export type ComputeTrafficInput = {
    panelType: PanelTypeKey | string;
    roadType: RoadTypeKey;
    poiCount: number;
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
 */
export function computeTraffic(input: ComputeTrafficInput): ComputeTrafficOutput {
    const notes: string[] = [];
    const roadType = input.roadType;

    // --- 1) Trafik Skoru -------------------------------------------------
    const baseScore = BASE_SCORE_BY_ROAD_TYPE[roadType];
    const multiplier = poiMultiplierFromCount(input.poiCount);
    const bonus = poiBonusFromCount(input.poiCount);

    let trafficScore = Math.round(baseScore * multiplier + bonus);
    trafficScore = Math.max(1, Math.min(100, trafficScore));

    // --- 2) Günlük Trafik -----------------------------------------------
    let dailyTraffic: number;
    if (typeof input.manualDailyTraffic === "number" && input.manualDailyTraffic > 0) {
        dailyTraffic = Math.round(input.manualDailyTraffic);
        notes.push("Manuel günlük trafik kullanıldı.");
    } else {
        const base = BASE_TRAFFIC_BY_ROAD_TYPE[roadType];
        // Prompt formülü: base * (trafficScore / 50)
        dailyTraffic = Math.round(base * (trafficScore / 50));
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
        poiCount: input.poiCount,
        notes,
    };
}

/**
 * OSM lookup'ı yoksa / başarısızsa fallback: sadece yol tipi default + düşük skor.
 */
export function computeTrafficFallback(params: {
    panelType: PanelTypeKey | string;
    roadType?: RoadTypeKey;
    manualDailyTraffic?: number | null;
    weeklyPrice?: number | null;
}): ComputeTrafficOutput {
    return computeTraffic({
        panelType: params.panelType,
        roadType: params.roadType ?? "SECONDARY_ROAD",
        poiCount: 0,
        manualDailyTraffic: params.manualDailyTraffic,
        weeklyPrice: params.weeklyPrice,
    });
}

/**
 * OSM lookup sonucundan tam hesaplama.
 */
export function computeFromOsm(
    panelType: string,
    osm: OsmLookupResult | null,
    opts: { manualDailyTraffic?: number | null; weeklyPrice?: number | null } = {},
): ComputeTrafficOutput {
    if (!osm) {
        return computeTrafficFallback({
            panelType,
            roadType: "SECONDARY_ROAD",
            manualDailyTraffic: opts.manualDailyTraffic,
            weeklyPrice: opts.weeklyPrice,
        });
    }
    return computeTraffic({
        panelType,
        roadType: osm.roadType,
        poiCount: osm.poiCount,
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
