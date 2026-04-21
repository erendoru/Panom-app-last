import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { lookupOsmContext, sleep } from "@/lib/traffic/osm";
import {
    computeFromOsm,
    type PanelTypeKey,
    type PlacementContextKey,
    type RoadTypeKey,
} from "@/lib/traffic/score";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Vercel Pro: 5 dk; aşılırsa batch limit düşür

function hasAdminAccess(session: any) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

/**
 * Batch: tüm panolar (veya seçili pano id'leri) için trafik skorunu hesapla.
 *
 * Body:
 *  - panelIds?: string[]         // verilmezse tüm aktif panolar
 *  - forceAll?: boolean          // true ise trafficScore'u zaten dolu olanları da tekrar hesapla
 *  - limit?: number              // tek seferde maksimum kaç pano (default 40, max 100)
 *  - clusterSnap?: boolean       // true (default): aynı yolda 50m içindeki komşu panolar en yüksek roadType'a snap
 *
 * Rate limit: saniyede ~2 OSM isteği. 40 pano ~= 20sn.
 */
export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: any = {};
    try {
        body = await req.json();
    } catch {
        body = {};
    }

    const requestedIds = Array.isArray(body?.panelIds)
        ? body.panelIds.filter((x: any) => typeof x === "string")
        : null;
    const forceAll = body?.forceAll === true;
    const clusterSnap = body?.clusterSnap !== false; // default on
    const limit = Math.max(1, Math.min(100, Number(body?.limit) || 40));

    // Query oluştur
    const where: any = requestedIds?.length
        ? { id: { in: requestedIds } }
        : forceAll
          ? {}
          : { trafficScore: null };

    if (session.role === "REGIONAL_ADMIN" && session.assignedCity) {
        where.city = session.assignedCity;
    }

    const panels = await prisma.staticPanel.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
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

    if (panels.length === 0) {
        return NextResponse.json({
            ok: true,
            processed: 0,
            updated: 0,
            failed: 0,
            snapped: 0,
            message: "Güncellenmesi gereken pano yok.",
        });
    }

    let processed = 0;
    let updated = 0;
    let failed = 0;
    const errors: Array<{ id: string; error: string }> = [];

    // 1) Her pano için OSM lookup + hesaplama (sıralı, rate-limited)
    type ComputedState = {
        id: string;
        lat: number;
        lng: number;
        roadType: RoadTypeKey;
        osmRoadType: RoadTypeKey | null;
        osmRoadName: string | null;
        osmRoadRef: string | null;
        panelType: string;
        priceWeekly: number | null;
        poiCount: number;
        placementContext: PlacementContextKey | null;
        manualRoadType: RoadTypeKey | null;
        manualPoiCount: number | null;
        manualDailyTraffic: number | null;
        isSquareContext: boolean;
        hasNearbyMall: boolean;
        result: ReturnType<typeof computeFromOsm>;
    };
    const computed: ComputedState[] = [];

    for (const panel of panels) {
        processed++;
        try {
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

            computed.push({
                id: panel.id,
                lat: panel.latitude,
                lng: panel.longitude,
                roadType: result.roadType as RoadTypeKey,
                osmRoadType: osm ? (osm.roadType as RoadTypeKey) : null,
                osmRoadName: osm?.roadName ?? null,
                osmRoadRef: osm?.roadRef ?? null,
                panelType: panel.type,
                priceWeekly: weeklyPrice,
                poiCount: result.poiCount,
                placementContext: (panel.placementContext as PlacementContextKey | null) ?? null,
                manualRoadType: (panel.manualRoadType as RoadTypeKey | null) ?? null,
                manualPoiCount: panel.manualPoiCount ?? null,
                manualDailyTraffic: panel.manualDailyTraffic ?? null,
                isSquareContext: osm?.isSquareContext ?? false,
                hasNearbyMall: osm?.hasNearbyMall ?? false,
                result,
            });
        } catch (err) {
            failed++;
            errors.push({
                id: panel.id,
                error: err instanceof Error ? err.message : String(err),
            });
            console.warn(`[traffic-scores] panel ${panel.id} failed:`, err);
        }

        if (processed < panels.length) {
            await sleep(500);
        }
    }

    // 2) Komşu-snap (consistency pass)
    // Aynı yol üstünde (osmRoadName/osmRoadRef eşleşiyorsa) ve ≤50m mesafedeki
    // panolar için en yüksek roadType'ı yay. placementContext/manualRoadType
    // set olan panolara DOKUNMA (onlar zaten override).
    let snapped = 0;
    if (clusterSnap && computed.length >= 2) {
        const RANK: Record<RoadTypeKey, number> = {
            HIGHWAY: 5,
            MAIN_ROAD: 4,
            SECONDARY_ROAD: 3,
            PEDESTRIAN: 2,
            RESIDENTIAL: 1,
        };
        const haversineM = (a: ComputedState, b: ComputedState) => {
            const R = 6371000;
            const toRad = (x: number) => (x * Math.PI) / 180;
            const dLat = toRad(b.lat - a.lat);
            const dLng = toRad(b.lng - a.lng);
            const s =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
            return 2 * R * Math.asin(Math.sqrt(s));
        };

        for (const p of computed) {
            // Override'lı panolara dokunma
            if (p.placementContext || p.manualRoadType) continue;
            // Aynı yol üstündeki komşuları bul
            const key = (p.osmRoadRef || p.osmRoadName || "").toLowerCase().trim();
            if (!key) continue;

            let maxRoad: RoadTypeKey = p.roadType;
            for (const q of computed) {
                if (q.id === p.id) continue;
                const qkey = (q.osmRoadRef || q.osmRoadName || "").toLowerCase().trim();
                if (qkey !== key) continue;
                const dist = haversineM(p, q);
                if (dist > 50) continue;
                if (RANK[q.roadType] > RANK[maxRoad]) {
                    maxRoad = q.roadType;
                }
            }
            if (RANK[maxRoad] > RANK[p.roadType]) {
                // Yeniden hesapla, yükseltilmiş roadType ile (manualRoadType gibi davranır)
                const reCalc = computeFromOsm(p.panelType as PanelTypeKey, null, {
                    manualRoadType: maxRoad,
                    manualPoiCount: p.poiCount,
                    manualDailyTraffic: p.manualDailyTraffic,
                    weeklyPrice: p.priceWeekly,
                });
                p.result = reCalc;
                p.roadType = maxRoad;
                snapped++;
            }
        }
    }

    // 3) DB'ye yaz
    for (const p of computed) {
        try {
            await prisma.staticPanel.update({
                where: { id: p.id },
                data: {
                    trafficScore: p.result.trafficScore,
                    roadType: p.result.roadType as RoadTypeKey,
                    visibilityScore: p.result.visibilityScore,
                    estimatedDailyImpressions: p.result.dailyImpressions,
                    estimatedWeeklyImpressions: p.result.weeklyImpressions,
                    estimatedCpm: p.result.cpm ?? null,
                    nearbyPoiCount: p.result.poiCount,
                    trafficDataUpdatedAt: new Date(),
                    osmRoadType: p.osmRoadType,
                    osmRoadName: p.osmRoadName ?? p.osmRoadRef ?? null,
                },
            });
            updated++;
        } catch (err) {
            failed++;
            errors.push({
                id: p.id,
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }

    return NextResponse.json({
        ok: true,
        processed,
        updated,
        failed,
        snapped,
        errors: errors.slice(0, 10),
    });
}

/**
 * GET — durum özeti (kaç panonun skoru var / yok).
 */
export async function GET() {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: any = {};
    if (session.role === "REGIONAL_ADMIN" && session.assignedCity) {
        where.city = session.assignedCity;
    }

    const [total, withScore, withoutScore] = await Promise.all([
        prisma.staticPanel.count({ where }),
        prisma.staticPanel.count({ where: { ...where, trafficScore: { not: null } } }),
        prisma.staticPanel.count({ where: { ...where, trafficScore: null } }),
    ]);

    return NextResponse.json({
        total,
        withScore,
        withoutScore,
    });
}
