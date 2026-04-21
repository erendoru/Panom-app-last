import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { lookupOsmContext } from "@/lib/traffic/osm";
import {
    computeFromOsm,
    type PanelTypeKey,
    type PlacementContextKey,
    type RoadTypeKey,
} from "@/lib/traffic/score";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const VALID_ROAD_TYPES: RoadTypeKey[] = [
    "HIGHWAY",
    "MAIN_ROAD",
    "SECONDARY_ROAD",
    "RESIDENTIAL",
    "PEDESTRIAN",
];

const VALID_PLACEMENTS: PlacementContextKey[] = [
    "HIGHWAY_SIDE",
    "MAIN_JUNCTION",
    "URBAN_MAIN",
    "SQUARE",
    "BUILDING_WRAP",
    "MALL_OUTDOOR",
    "PEDESTRIAN",
    "RESIDENTIAL_EDGE",
];

function hasAdminAccess(session: any) {
    return (
        session?.role === "ADMIN" ||
        session?.role === "REGIONAL_ADMIN" ||
        session?.role === "SCREEN_OWNER"
    );
}

/**
 * Tek panonun trafik skorunu yeniden hesapla.
 * - Admin / Regional Admin: her panoya erişebilir
 * - SCREEN_OWNER: sadece kendi panosuna erişebilir
 *
 * Body (opsiyonel) — verildiyse DB'ye de yazılır:
 * {
 *   placementContext?: PlacementContext,  // yerleşim bağlamı (en güçlü)
 *   manualRoadType?: RoadType,            // OSM'e itiraz
 *   manualPoiCount?: number,              // POI override
 *   manualDailyTraffic?: number           // trafik override
 * }
 */
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const panel = await prisma.staticPanel.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            type: true,
            latitude: true,
            longitude: true,
            priceWeekly: true,
            ownerId: true,
            manualDailyTraffic: true,
            roadType: true,
            placementContext: true,
            manualRoadType: true,
            manualPoiCount: true,
        },
    });

    if (!panel) {
        return NextResponse.json({ error: "Pano bulunamadı" }, { status: 404 });
    }

    if (session.role === "SCREEN_OWNER") {
        const myOwner = await prisma.screenOwner.findUnique({
            where: { userId: session.userId },
            select: { id: true },
        });
        if (!myOwner || panel.ownerId !== myOwner.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
    }

    let body: any = {};
    try {
        body = await req.json();
    } catch {
        body = {};
    }

    // Body override'lar
    const manualDailyTrafficOverride =
        typeof body?.manualDailyTraffic === "number" && body.manualDailyTraffic > 0
            ? Math.round(body.manualDailyTraffic)
            : body?.manualDailyTraffic === null
              ? null // explicit clear
              : undefined;

    const manualRoadTypeOverride: RoadTypeKey | null | undefined =
        typeof body?.manualRoadType === "string" &&
        VALID_ROAD_TYPES.includes(body.manualRoadType as RoadTypeKey)
            ? (body.manualRoadType as RoadTypeKey)
            : body?.manualRoadType === null
              ? null
              : undefined;

    const placementContextOverride: PlacementContextKey | null | undefined =
        typeof body?.placementContext === "string" &&
        VALID_PLACEMENTS.includes(body.placementContext as PlacementContextKey)
            ? (body.placementContext as PlacementContextKey)
            : body?.placementContext === null
              ? null
              : undefined;

    const manualPoiCountOverride: number | null | undefined =
        typeof body?.manualPoiCount === "number" && body.manualPoiCount >= 0
            ? Math.round(body.manualPoiCount)
            : body?.manualPoiCount === null
              ? null
              : undefined;

    // Effective (body > DB)
    const effectivePlacement =
        placementContextOverride !== undefined
            ? placementContextOverride
            : ((panel.placementContext as PlacementContextKey | null) ?? null);
    const effectiveManualRoad =
        manualRoadTypeOverride !== undefined
            ? manualRoadTypeOverride
            : ((panel.manualRoadType as RoadTypeKey | null) ?? null);
    const effectiveManualPoi =
        manualPoiCountOverride !== undefined
            ? manualPoiCountOverride
            : (panel.manualPoiCount ?? null);
    const effectiveManualDaily =
        manualDailyTrafficOverride !== undefined
            ? manualDailyTrafficOverride
            : (panel.manualDailyTraffic ?? null);

    // OSM lookup
    const osm = await lookupOsmContext(panel.latitude, panel.longitude).catch(
        () => null,
    );

    const weeklyPrice = panel.priceWeekly ? Number(panel.priceWeekly) : null;

    const result = computeFromOsm(panel.type as PanelTypeKey, osm, {
        placementContext: effectivePlacement,
        manualRoadType: effectiveManualRoad,
        manualPoiCount: effectiveManualPoi,
        manualDailyTraffic: effectiveManualDaily,
        weeklyPrice,
    });

    const updated = await prisma.staticPanel.update({
        where: { id: panel.id },
        data: {
            trafficScore: result.trafficScore,
            roadType: result.roadType as RoadTypeKey,
            visibilityScore: result.visibilityScore,
            estimatedDailyImpressions: result.dailyImpressions,
            estimatedWeeklyImpressions: result.weeklyImpressions,
            estimatedCpm: result.cpm ?? null,
            nearbyPoiCount: result.poiCount,
            trafficDataUpdatedAt: new Date(),
            osmRoadType: osm ? (osm.roadType as RoadTypeKey) : null,
            osmRoadName: osm?.roadName ?? osm?.roadRef ?? null,
            // Body'de override geldiyse DB'ye de yaz
            ...(placementContextOverride !== undefined
                ? { placementContext: placementContextOverride }
                : {}),
            ...(manualRoadTypeOverride !== undefined
                ? { manualRoadType: manualRoadTypeOverride }
                : {}),
            ...(manualPoiCountOverride !== undefined
                ? { manualPoiCount: manualPoiCountOverride }
                : {}),
            ...(manualDailyTrafficOverride !== undefined
                ? { manualDailyTraffic: manualDailyTrafficOverride }
                : {}),
        },
        select: {
            id: true,
            trafficScore: true,
            roadType: true,
            visibilityScore: true,
            estimatedDailyImpressions: true,
            estimatedWeeklyImpressions: true,
            estimatedCpm: true,
            nearbyPoiCount: true,
            manualDailyTraffic: true,
            trafficDataUpdatedAt: true,
            placementContext: true,
            manualRoadType: true,
            manualPoiCount: true,
            osmRoadType: true,
            osmRoadName: true,
        },
    });

    return NextResponse.json({
        ok: true,
        panel: updated,
        osm: osm
            ? {
                  roadTag: osm.roadTag,
                  roadName: osm.roadName,
                  roadRef: osm.roadRef,
                  poiBreakdown: osm.poiBreakdown,
                  isSquareContext: osm.isSquareContext,
                  hasNearbyMall: osm.hasNearbyMall,
              }
            : null,
        compute: {
            dailyTraffic: result.dailyTraffic,
            dailyImpressions: result.dailyImpressions,
            weeklyImpressions: result.weeklyImpressions,
            monthlyImpressions: result.monthlyImpressions,
            cpm: result.cpm,
            notes: result.notes,
        },
    });
}
