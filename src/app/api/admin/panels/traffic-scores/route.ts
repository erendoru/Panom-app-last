import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { lookupOsmContext, sleep } from "@/lib/traffic/osm";
import {
    computeFromOsm,
    type PanelTypeKey,
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
 *  - panelIds?: string[]  // verilmezse tüm aktif panolar
 *  - forceAll?: boolean   // true ise trafficScore'u zaten dolu olanları da tekrar hesapla
 *  - limit?: number       // tek seferde maksimum kaç pano (default 40, max 100)
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
    const limit = Math.max(1, Math.min(100, Number(body?.limit) || 40));

    // Query oluştur
    const where: any = requestedIds?.length
        ? { id: { in: requestedIds } }
        : forceAll
          ? {}
          : { trafficScore: null };

    // Regional admin sadece kendi şehrindeki panoları tetikleyebilir
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
        },
    });

    if (panels.length === 0) {
        return NextResponse.json({
            ok: true,
            processed: 0,
            updated: 0,
            failed: 0,
            message: "Güncellenmesi gereken pano yok.",
        });
    }

    let processed = 0;
    let updated = 0;
    let failed = 0;
    const errors: Array<{ id: string; error: string }> = [];

    // Sıralı (rate-limited): 500ms bekleme = saniyede ~2 istek
    for (const panel of panels) {
        processed++;
        try {
            const osm = await lookupOsmContext(panel.latitude, panel.longitude).catch(
                () => null,
            );

            const weeklyPrice = panel.priceWeekly ? Number(panel.priceWeekly) : null;

            const result = computeFromOsm(
                panel.type as PanelTypeKey,
                osm,
                {
                    manualDailyTraffic: panel.manualDailyTraffic ?? null,
                    weeklyPrice,
                },
            );

            await prisma.staticPanel.update({
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
                },
            });

            updated++;
        } catch (err) {
            failed++;
            errors.push({
                id: panel.id,
                error: err instanceof Error ? err.message : String(err),
            });
            console.warn(`[traffic-scores] panel ${panel.id} failed:`, err);
        }

        // Rate limit (son pano hariç)
        if (processed < panels.length) {
            await sleep(500);
        }
    }

    return NextResponse.json({
        ok: true,
        processed,
        updated,
        failed,
        errors: errors.slice(0, 10), // ilk 10 hata örnek
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
