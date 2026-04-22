import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
    POI_CATEGORY_LABELS,
    bearingToDirection,
    haversineMeters,
    normalizeBrand,
    type CompassDirection,
    type PoiCategory,
} from "@/lib/traffic/poiTaxonomy";

export const dynamic = "force-dynamic";

const DIRECTION_BEARING: Record<CompassDirection, number> = {
    N: 0,
    NE: 45,
    E: 90,
    SE: 135,
    S: 180,
    SW: 225,
    W: 270,
    NW: 315,
};

function hasAdminAccess(session: any) {
    return (
        session?.role === "ADMIN" ||
        session?.role === "REGIONAL_ADMIN" ||
        session?.role === "SCREEN_OWNER"
    );
}

async function assertPanelAccess(panelId: string) {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return { ok: false as const, status: 401, error: "Unauthorized" };
    }
    const panel = await prisma.staticPanel.findUnique({
        where: { id: panelId },
        select: { id: true, ownerId: true, city: true, latitude: true, longitude: true },
    });
    if (!panel) {
        return { ok: false as const, status: 404, error: "Pano bulunamadı" };
    }
    if (session.role === "REGIONAL_ADMIN" && session.assignedCity) {
        if (panel.city !== session.assignedCity) {
            return { ok: false as const, status: 403, error: "Yetkiniz yok" };
        }
    }
    if (session.role === "SCREEN_OWNER") {
        const myOwner = await prisma.screenOwner.findUnique({
            where: { userId: session.userId },
            select: { id: true },
        });
        if (!myOwner || panel.ownerId !== myOwner.id) {
            return { ok: false as const, status: 403, error: "Yetkiniz yok" };
        }
    }
    return { ok: true as const, panel };
}

/**
 * Konum verisinden destination noktasını hesaplar — reverse haversine.
 * Küçük mesafeler (<2km) için yaklaşık düzlem çözümü yeterli; ama
 * tutarlı olması için küresel formüle bağlı kalıyoruz.
 */
function computeDestination(
    originLat: number,
    originLng: number,
    distanceM: number,
    bearingDeg: number,
): { lat: number; lng: number } {
    const R = 6371000;
    const bearingRad = (bearingDeg * Math.PI) / 180;
    const latRad = (originLat * Math.PI) / 180;
    const lngRad = (originLng * Math.PI) / 180;
    const dR = distanceM / R;

    const destLat = Math.asin(
        Math.sin(latRad) * Math.cos(dR) +
            Math.cos(latRad) * Math.sin(dR) * Math.cos(bearingRad),
    );
    const destLng =
        lngRad +
        Math.atan2(
            Math.sin(bearingRad) * Math.sin(dR) * Math.cos(latRad),
            Math.cos(dR) - Math.sin(latRad) * Math.sin(destLat),
        );

    return {
        lat: (destLat * 180) / Math.PI,
        lng: ((destLng * 180) / Math.PI + 540) % 360 - 180,
    };
}

/**
 * POST — Panoya manuel POI ekle.
 *
 * Body:
 *  - name: string (required)
 *  - category: PoiCategory (required)
 *  - brand?: string (ham — normalize edilir)
 *  - Konum:
 *      (a) latitude + longitude (mutlak), veya
 *      (b) distanceM + direction (panonun konumuna göre)
 */
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const check = await assertPanelAccess(params.id);
    if (!check.ok) {
        return NextResponse.json({ error: check.error }, { status: check.status });
    }
    const { panel } = check;

    let body: any;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
    }

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const category = typeof body?.category === "string" ? body.category : "";
    const brandRaw = typeof body?.brand === "string" ? body.brand.trim() : null;

    if (!name) {
        return NextResponse.json({ error: "İsim zorunludur" }, { status: 400 });
    }
    if (!(category in POI_CATEGORY_LABELS)) {
        return NextResponse.json({ error: "Geçersiz kategori" }, { status: 400 });
    }

    let resolvedLat: number;
    let resolvedLng: number;

    if (typeof body?.latitude === "number" && typeof body?.longitude === "number") {
        resolvedLat = body.latitude;
        resolvedLng = body.longitude;
    } else if (
        typeof body?.distanceM === "number" &&
        body.distanceM > 0 &&
        typeof body?.direction === "string" &&
        body.direction in DIRECTION_BEARING
    ) {
        const bearing = DIRECTION_BEARING[body.direction as CompassDirection];
        const dest = computeDestination(
            Number(panel.latitude),
            Number(panel.longitude),
            Math.min(5000, body.distanceM),
            bearing,
        );
        resolvedLat = dest.lat;
        resolvedLng = dest.lng;
    } else {
        return NextResponse.json(
            {
                error:
                    "Konum eksik. Ya (latitude, longitude) ya da (distanceM, direction) giriniz.",
            },
            { status: 400 },
        );
    }

    const panelLat = Number(panel.latitude);
    const panelLng = Number(panel.longitude);
    const distance = haversineMeters(panelLat, panelLng, resolvedLat, resolvedLng);

    // Bearing (panodan POI'ye)
    const y =
        Math.sin(((resolvedLng - panelLng) * Math.PI) / 180) *
        Math.cos((resolvedLat * Math.PI) / 180);
    const x =
        Math.cos((panelLat * Math.PI) / 180) *
            Math.sin((resolvedLat * Math.PI) / 180) -
        Math.sin((panelLat * Math.PI) / 180) *
            Math.cos((resolvedLat * Math.PI) / 180) *
            Math.cos(((resolvedLng - panelLng) * Math.PI) / 180);
    const bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
    const direction = bearingToDirection(bearing);

    const brand = normalizeBrand(brandRaw, name);

    // Yeni Poi oluştur (source=MANUAL).
    // schema: sourceId String (required) + @@unique(source, sourceId)
    // Manuel POI'lerde her kayıt kendi unique id'sini taşısın diye manuel:<rand> kullan.
    const manualSourceId = `manual:${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const poi = await prisma.poi.create({
        data: {
            name,
            brand,
            category: category as PoiCategory,
            latitude: resolvedLat,
            longitude: resolvedLng,
            source: "MANUAL",
            sourceId: manualSourceId,
            metadata: brandRaw ? { brandRaw } : undefined,
        },
    });

    const link = await prisma.panelPoi.create({
        data: {
            panelId: params.id,
            poiId: poi.id,
            distance,
            bearing,
            direction,
            isLandmark: false,
            manuallyAdded: true,
        },
    });

    // nearbyPoiCount güncelle
    const total = await prisma.panelPoi.count({ where: { panelId: params.id } });
    await prisma.staticPanel.update({
        where: { id: params.id },
        data: { nearbyPoiCount: total, poiEnrichedAt: new Date() },
    });

    return NextResponse.json({
        ok: true,
        link: {
            id: link.id,
            distance: Math.round(distance),
            direction,
            bearing: Math.round(bearing),
        },
        poi: {
            id: poi.id,
            name: poi.name,
            brand: poi.brand,
            category: poi.category,
            source: poi.source,
        },
        nearbyPoiCount: total,
    });
}

/**
 * DELETE — Belirli bir PanelPoi link'ini kaldır.
 *
 * Query:
 *  - linkId: string (required) — PanelPoi.id
 *
 * Not: Poi kaydı silinmez; başka panolarda kullanılabilir.
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const check = await assertPanelAccess(params.id);
    if (!check.ok) {
        return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const { searchParams } = new URL(req.url);
    const linkId = searchParams.get("linkId");
    if (!linkId) {
        return NextResponse.json({ error: "linkId zorunlu" }, { status: 400 });
    }

    const link = await prisma.panelPoi.findUnique({
        where: { id: linkId },
        select: { id: true, panelId: true },
    });
    if (!link || link.panelId !== params.id) {
        return NextResponse.json({ error: "Link bulunamadı" }, { status: 404 });
    }

    await prisma.panelPoi.delete({ where: { id: linkId } });

    const total = await prisma.panelPoi.count({ where: { panelId: params.id } });
    await prisma.staticPanel.update({
        where: { id: params.id },
        data: { nearbyPoiCount: total },
    });

    return NextResponse.json({ ok: true, nearbyPoiCount: total });
}
