import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { lookupOsmContext } from "@/lib/traffic/osm";
import {
    computeFromOsm,
    type PanelTypeKey,
    type RoadTypeKey,
} from "@/lib/traffic/score";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
 * Body (opsiyonel):
 * { manualDailyTraffic?: number, roadType?: RoadType }
 * Bunlar verilirse OSM lookup override edilir.
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
        },
    });

    if (!panel) {
        return NextResponse.json({ error: "Pano bulunamadı" }, { status: 404 });
    }

    // Owner ise sadece kendi panosuna erişsin
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

    const manualOverride =
        typeof body?.manualDailyTraffic === "number" && body.manualDailyTraffic > 0
            ? Math.round(body.manualDailyTraffic)
            : null;

    const roadTypeOverride: RoadTypeKey | null =
        typeof body?.roadType === "string" &&
        ["HIGHWAY", "MAIN_ROAD", "SECONDARY_ROAD", "RESIDENTIAL", "PEDESTRIAN"].includes(
            body.roadType,
        )
            ? (body.roadType as RoadTypeKey)
            : null;

    // OSM lookup (roadType override yoksa)
    const osm = roadTypeOverride
        ? null
        : await lookupOsmContext(panel.latitude, panel.longitude).catch(() => null);

    // effective road type
    const effectiveRoadType: RoadTypeKey =
        roadTypeOverride ?? osm?.roadType ?? panel.roadType ?? "SECONDARY_ROAD";

    // Manuel trafik: body > DB (manualDailyTraffic) > null
    const effectiveManual =
        manualOverride ?? panel.manualDailyTraffic ?? null;

    const weeklyPrice = panel.priceWeekly ? Number(panel.priceWeekly) : null;

    const result = computeFromOsm(
        panel.type as PanelTypeKey,
        osm
            ? { ...osm, roadType: effectiveRoadType }
            : {
                  roadType: effectiveRoadType,
                  roadTag: null,
                  roadName: null,
                  poiCount: 0,
                  poiBreakdown: {},
              },
        {
            manualDailyTraffic: effectiveManual,
            weeklyPrice,
        },
    );

    const updated = await prisma.staticPanel.update({
        where: { id: panel.id },
        data: {
            trafficScore: result.trafficScore,
            roadType: result.roadType as RoadTypeKey,
            visibilityScore: result.visibilityScore,
            estimatedDailyImpressions: result.dailyImpressions,
            estimatedWeeklyImpressions: result.weeklyImpressions,
            estimatedCpm: result.cpm ?? null,
            nearbyPoiCount: osm?.poiCount ?? 0,
            trafficDataUpdatedAt: new Date(),
            // Manuel override verildiyse kaydet
            ...(manualOverride !== null ? { manualDailyTraffic: manualOverride } : {}),
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
        },
    });

    return NextResponse.json({
        ok: true,
        panel: updated,
        osm: osm
            ? {
                  roadTag: osm.roadTag,
                  roadName: osm.roadName,
                  poiBreakdown: osm.poiBreakdown,
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
