import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { enrichPanelPois } from "@/lib/traffic/enrichment";

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
 * Tek bir panoyu OSM POI verisiyle zenginleştir.
 *
 * Body (opsiyonel):
 *  { radiusM?: number }  — default 500
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
        select: { id: true, ownerId: true, city: true },
    });
    if (!panel) {
        return NextResponse.json({ error: "Pano bulunamadı" }, { status: 404 });
    }

    if (session.role === "REGIONAL_ADMIN" && session.assignedCity) {
        if (panel.city !== session.assignedCity) {
            return NextResponse.json(
                { error: "Bu panoya erişim yetkiniz yok" },
                { status: 403 },
            );
        }
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
    const radius =
        typeof body?.radiusM === "number" && body.radiusM > 0
            ? Math.min(2000, Math.max(100, body.radiusM))
            : 500;

    const result = await enrichPanelPois(params.id, { radiusM: radius });

    // Önizleme: ilk 10 POI'yi dön
    const pois = await prisma.panelPoi.findMany({
        where: { panelId: params.id },
        orderBy: { distance: "asc" },
        take: 10,
        include: {
            poi: { select: { name: true, brand: true, category: true } },
        },
    });

    return NextResponse.json({
        ok: true,
        result,
        preview: pois.map((pp) => ({
            name: pp.poi.name,
            brand: pp.poi.brand,
            category: pp.poi.category,
            distance: Math.round(pp.distance),
            direction: pp.direction,
        })),
    });
}

/**
 * Panoya ait tüm POI listesini getir (admin / owner / panel sahibi).
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } },
) {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pois = await prisma.panelPoi.findMany({
        where: { panelId: params.id },
        orderBy: { distance: "asc" },
        include: {
            poi: {
                select: {
                    id: true,
                    name: true,
                    brand: true,
                    category: true,
                    latitude: true,
                    longitude: true,
                    source: true,
                },
            },
        },
    });

    return NextResponse.json({
        total: pois.length,
        pois: pois.map((pp) => ({
            id: pp.id,
            poiId: pp.poi.id,
            name: pp.poi.name,
            brand: pp.poi.brand,
            category: pp.poi.category,
            latitude: pp.poi.latitude,
            longitude: pp.poi.longitude,
            distance: pp.distance,
            bearing: pp.bearing,
            direction: pp.direction,
            isLandmark: pp.isLandmark,
            manuallyAdded: pp.manuallyAdded,
            source: pp.poi.source,
        })),
    });
}
