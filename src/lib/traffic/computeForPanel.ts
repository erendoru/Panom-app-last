/**
 * Tek panonun trafik skorunu hesaplar ve DB'ye yazar.
 *
 * Öncelik sırası (en güçlüden en zayıfa):
 *  1. placementContext (admin/sahip seçtiyse)
 *  2. manualRoadType (OSM'e itiraz varsa)
 *  3. OSM road lookup (ref tag + distance bias)
 *  4. POI density floor + meydan ipucu
 *
 * - Pano create / update endpoint'lerinden fire-and-forget çağrılır.
 * - OSM lookup başarısız olursa fallback ile yine de skor yazılır.
 * - Hata fırlatmaz — sadece log'lar (ana işlemi bloklamasın).
 */

import prisma from "@/lib/prisma";
import { lookupOsmContext } from "./osm";
import {
    computeFromOsm,
    type PanelTypeKey,
    type PlacementContextKey,
    type RoadTypeKey,
} from "./score";

export async function computeAndSaveTrafficForPanel(
    panelId: string,
): Promise<void> {
    try {
        const panel = await prisma.staticPanel.findUnique({
            where: { id: panelId },
            select: {
                id: true,
                type: true,
                latitude: true,
                longitude: true,
                priceWeekly: true,
                manualDailyTraffic: true,
                placementContext: true,
                manualRoadType: true,
                manualPoiCount: true,
            },
        });
        if (!panel) return;

        const osm = await lookupOsmContext(panel.latitude, panel.longitude).catch(
            () => null,
        );
        const weeklyPrice = panel.priceWeekly ? Number(panel.priceWeekly) : null;

        // V5: Zenginleştirilmiş POI sinyalleri (varsa)
        const enrichSignals = await derivePoiSignals(panelId);

        const result = computeFromOsm(panel.type as PanelTypeKey, osm, {
            placementContext: (panel.placementContext as PlacementContextKey | null) ?? null,
            manualRoadType: (panel.manualRoadType as RoadTypeKey | null) ?? null,
            manualPoiCount: panel.manualPoiCount ?? null,
            manualDailyTraffic: panel.manualDailyTraffic ?? null,
            weeklyPrice,
            ...enrichSignals,
        });

        await prisma.staticPanel.update({
            where: { id: panelId },
            data: {
                trafficScore: result.trafficScore,
                roadType: result.roadType as RoadTypeKey,
                visibilityScore: result.visibilityScore,
                estimatedDailyImpressions: result.dailyImpressions,
                estimatedWeeklyImpressions: result.weeklyImpressions,
                estimatedCpm: result.cpm ?? null,
                nearbyPoiCount: result.poiCount,
                trafficDataUpdatedAt: new Date(),
                // Ham OSM bulgularını referans/debug için sakla
                osmRoadType: osm ? (osm.roadType as RoadTypeKey) : null,
                osmRoadName: osm?.roadName ?? osm?.roadRef ?? null,
            },
        });
    } catch (err) {
        console.warn(
            `[traffic] computeAndSaveTrafficForPanel(${panelId}) failed:`,
            err,
        );
    }
}

/**
 * Fire-and-forget sarmalayıcı — await edilmeden, arka planda çalıştırır.
 * Next.js serverless'te process hemen kapanırsa dropout olabilir; kritik
 * olmadığı için tolere ediyoruz (haftalık batch zaten toplayabilir).
 */
export function triggerTrafficComputeInBackground(panelId: string): void {
    void computeAndSaveTrafficForPanel(panelId);
}

/**
 * V5 — PanelPoi/Poi kayıtlarından "zenginleştirme sinyalleri"ni türet.
 * Yoksa boş döner (skor hesaplama default'lara düşer).
 */
async function derivePoiSignals(panelId: string): Promise<{
    brandedPoiCount?: number;
    categoryDiversity?: number;
    hasMajorAttractor?: boolean;
    supermarketCount?: number;
}> {
    try {
        const links = await prisma.panelPoi.findMany({
            where: { panelId, distance: { lte: 600 } },
            select: {
                distance: true,
                poi: { select: { brand: true, category: true } },
            },
            take: 300,
        });
        if (links.length === 0) return {};

        const categories = new Set<string>();
        let branded = 0;
        let supermarkets = 0;
        let majorAttractor = false;

        for (const l of links) {
            categories.add(l.poi.category);
            if (l.poi.brand) branded++;
            if (l.poi.category === "SUPERMARKET") supermarkets++;
            if (
                l.poi.category === "MALL" ||
                l.poi.category === "STADIUM" ||
                l.poi.category === "UNIVERSITY" ||
                l.poi.category === "HOSPITAL" ||
                l.poi.category === "TRAIN_STATION" ||
                l.poi.category === "BUS_STATION" ||
                l.poi.category === "DEPARTMENT_STORE"
            ) {
                // Major attractor: 400m içinde olmalı
                if (l.distance <= 400) majorAttractor = true;
            }
        }

        return {
            brandedPoiCount: branded,
            categoryDiversity: categories.size,
            hasMajorAttractor: majorAttractor,
            supermarketCount: supermarkets,
        };
    } catch {
        return {};
    }
}
