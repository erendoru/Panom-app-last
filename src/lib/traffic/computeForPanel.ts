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

        const result = computeFromOsm(panel.type as PanelTypeKey, osm, {
            placementContext: (panel.placementContext as PlacementContextKey | null) ?? null,
            manualRoadType: (panel.manualRoadType as RoadTypeKey | null) ?? null,
            manualPoiCount: panel.manualPoiCount ?? null,
            manualDailyTraffic: panel.manualDailyTraffic ?? null,
            weeklyPrice,
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
