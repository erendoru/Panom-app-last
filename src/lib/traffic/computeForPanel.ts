/**
 * Tek panonun trafik skorunu hesaplar ve DB'ye yazar.
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
            },
        });
        if (!panel) return;

        const osm = await lookupOsmContext(panel.latitude, panel.longitude).catch(
            () => null,
        );
        const weeklyPrice = panel.priceWeekly ? Number(panel.priceWeekly) : null;

        const result = computeFromOsm(panel.type as PanelTypeKey, osm, {
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
                nearbyPoiCount: osm?.poiCount ?? 0,
                trafficDataUpdatedAt: new Date(),
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
