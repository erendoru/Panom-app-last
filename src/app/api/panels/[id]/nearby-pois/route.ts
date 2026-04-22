import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * V3 — Public panel nearby-pois endpoint
 *
 * Sadece APPROVED + ACTIVE panolar için çalışır.
 *
 * Query:
 *  - limit?: number  (default 12, max 50) — top POI sayısı
 *  - withinM?: number (default 500, max 2000) — mesafe eşiği
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(50, Number(searchParams.get("limit")) || 12));
    const withinM = Math.max(
        100,
        Math.min(2000, Number(searchParams.get("withinM")) || 500),
    );

    const panel = await prisma.staticPanel.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            reviewStatus: true,
            ownerStatus: true,
            active: true,
            latitude: true,
            longitude: true,
            poiEnrichedAt: true,
            nearbyPoiCount: true,
        },
    });

    if (!panel) {
        return NextResponse.json({ error: "Pano bulunamadı" }, { status: 404 });
    }

    const isPublic =
        panel.active &&
        panel.reviewStatus === "APPROVED" &&
        panel.ownerStatus === "ACTIVE";

    if (!isPublic) {
        return NextResponse.json({ error: "Pano erişilebilir değil" }, { status: 404 });
    }

    // Top N (en yakın, kategori çeşitliliği için biraz daha geniş alıp client'ta top 12)
    const links = await prisma.panelPoi.findMany({
        where: {
            panelId: params.id,
            distance: { lte: withinM },
        },
        orderBy: { distance: "asc" },
        take: 200,
        include: {
            poi: {
                select: {
                    id: true,
                    name: true,
                    brand: true,
                    category: true,
                },
            },
        },
    });

    // Kategori özeti (kaç market, kaç okul vs.)
    const categoryCounts: Record<string, number> = {};
    const brandCounts: Record<string, number> = {};
    for (const l of links) {
        categoryCounts[l.poi.category] = (categoryCounts[l.poi.category] || 0) + 1;
        if (l.poi.brand) {
            brandCounts[l.poi.brand] = (brandCounts[l.poi.brand] || 0) + 1;
        }
    }

    // Top POI: önce en yakın "markalı" olanlar, ardından en yakın genel sıralı
    const branded = links.filter((l) => l.poi.brand);
    const unbranded = links.filter((l) => !l.poi.brand);
    const topBranded = branded.slice(0, Math.min(6, branded.length));
    const topBrandedIds = new Set(topBranded.map((l) => l.id));
    const rest = links.filter((l) => !topBrandedIds.has(l.id));
    const topMixed = [...topBranded, ...rest].slice(0, limit);

    const topPois = topMixed.map((l) => ({
        id: l.id,
        name: l.poi.name,
        brand: l.poi.brand,
        category: l.poi.category,
        distance: Math.round(l.distance),
        bearing: l.bearing,
        direction: l.direction,
        isLandmark: l.isLandmark,
    }));

    return NextResponse.json({
        panel: {
            id: panel.id,
            poiEnrichedAt: panel.poiEnrichedAt,
            nearbyPoiCount: panel.nearbyPoiCount,
        },
        withinM,
        total: links.length,
        topPois,
        categoryCounts,
        brandCounts,
    });
}
