import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { enrichPanelPois, sleep } from "@/lib/traffic/enrichment";

export const dynamic = "force-dynamic";
// Vercel Pro: 5 dk; aşılırsa batch limit düşürülmeli
export const maxDuration = 300;

function hasAdminAccess(session: any) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

/**
 * Batch: seçili panolar (veya tümü) için OSM POI zenginleştirme.
 *
 * Body:
 *  - panelIds?: string[]          — verilmezse henüz zenginleştirilmemişler
 *  - forceAll?: boolean           — true ise daha önce zenginleştirilenleri de yap
 *  - limit?: number               — tek seferde max kaç pano (default 30, max 80)
 *  - radiusM?: number             — OSM arama yarıçapı (default 500, max 2000)
 *
 * Rate limit: Overpass'a saniyede ~1.5 istek. 30 pano ≈ 25-40sn.
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
    const limit = Math.max(1, Math.min(80, Number(body?.limit) || 30));
    const radius =
        typeof body?.radiusM === "number" && body.radiusM > 0
            ? Math.min(2000, Math.max(100, body.radiusM))
            : 500;

    const where: any = requestedIds?.length
        ? { id: { in: requestedIds } }
        : forceAll
          ? {}
          : { poiEnrichedAt: null };

    if (session.role === "REGIONAL_ADMIN" && session.assignedCity) {
        where.city = session.assignedCity;
    }

    const panels = await prisma.staticPanel.findMany({
        where,
        orderBy: [{ poiEnrichedAt: "asc" }, { createdAt: "desc" }],
        take: limit,
        select: { id: true, name: true },
    });

    if (panels.length === 0) {
        return NextResponse.json({
            ok: true,
            processed: 0,
            results: [],
            message: "İşlenecek pano yok (hepsi zaten zenginleştirilmiş).",
        });
    }

    const results: Array<{
        id: string;
        name: string;
        found: number;
        linked: number;
        durationMs: number;
        error?: string;
    }> = [];

    for (const panel of panels) {
        try {
            const r = await enrichPanelPois(panel.id, { radiusM: radius });
            results.push({
                id: panel.id,
                name: panel.name,
                found: r.found,
                linked: r.linked,
                durationMs: r.durationMs,
            });
        } catch (err: any) {
            results.push({
                id: panel.id,
                name: panel.name,
                found: 0,
                linked: 0,
                durationMs: 0,
                error: err?.message || "unknown",
            });
        }
        // Overpass'ı hırpalamamak için
        await sleep(700);
    }

    const totalFound = results.reduce((a, r) => a + r.found, 0);
    const totalLinked = results.reduce((a, r) => a + r.linked, 0);

    return NextResponse.json({
        ok: true,
        processed: results.length,
        totalFound,
        totalLinked,
        results,
    });
}

/**
 * Zenginleştirme durumu özeti (kaç pano enriched, kaç bekliyor).
 */
export async function GET() {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseWhere: any = {};
    if (session.role === "REGIONAL_ADMIN" && session.assignedCity) {
        baseWhere.city = session.assignedCity;
    }

    const [total, enriched, totalPois, totalLinks] = await Promise.all([
        prisma.staticPanel.count({ where: baseWhere }),
        prisma.staticPanel.count({
            where: { ...baseWhere, poiEnrichedAt: { not: null } },
        }),
        prisma.poi.count(),
        prisma.panelPoi.count(),
    ]);

    return NextResponse.json({
        totalPanels: total,
        enrichedPanels: enriched,
        pendingPanels: total - enriched,
        uniquePois: totalPois,
        panelPoiLinks: totalLinks,
    });
}
