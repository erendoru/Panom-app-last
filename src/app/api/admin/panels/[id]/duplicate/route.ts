import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { triggerTrafficComputeInBackground } from "@/lib/traffic/computeForPanel";

export const dynamic = "force-dynamic";

function hasAdminAccess(session: any) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

/**
 * POST /api/admin/panels/[id]/duplicate
 * - Mevcut panoyu birebir kopyalar (fiyat, boyut, POI bağları, nearbyTags, sahip vb.).
 * - Konumu varsayılan olarak ~25 m kuzeye kaydırır ki harita üstünde üst üste
 *   düşmesin (admin istediği gibi sürükleyip düzeltir).
 * - Adın sonuna " (Kopya)" ekler.
 * - Trafik skoru arka planda yeniden hesaplanır.
 */
export async function POST(
    _req: NextRequest,
    { params }: { params: { id: string } },
) {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const source = await prisma.staticPanel.findUnique({
            where: { id: params.id },
            include: { panelPois: true },
        });

        if (!source) {
            return NextResponse.json({ error: "Panel not found" }, { status: 404 });
        }

        // Bölge adminleri sadece atandıkları şehirdeki panoları kopyalayabilir
        if (session.assignedCity && source.city !== session.assignedCity) {
            return NextResponse.json(
                { error: "Bu panoya erişim yetkiniz yok" },
                { status: 403 },
            );
        }

        // Konumu ~25 m kuzeye kaydır
        // 1 derece enlem ≈ 111_320 m → 25 m ≈ 0.000225°
        const latOffset = 0.000225;

        const {
            id: _id,
            createdAt: _c,
            updatedAt: _u,
            trafficScore: _ts,
            trafficDataUpdatedAt: _td,
            estimatedWeeklyImpressions: _ew,
            osmRoadType: _or,
            osmRoadName: _on,
            poiEnrichedAt: _pe,
            nearbyPoiCount: _np,
            panelPois: sourcePois,
            reviewStatus: _rs,
            reviewedAt: _ra,
            submittedAt: _sa,
            ...rest
        } = source as any;

        const created = await prisma.staticPanel.create({
            data: {
                ...rest,
                name: `${source.name} (Kopya)`,
                latitude: source.latitude + latOffset,
                longitude: source.longitude,
                // Moderasyon: admin zaten oluşturduğu için onaylı saysın
                reviewStatus: "APPROVED",
                reviewedAt: new Date(),
                // POI enrich kayıtları kaynağa bağlı, yenisi için reset
                poiEnrichedAt: null,
                nearbyPoiCount: null,
                trafficScore: null,
                trafficDataUpdatedAt: null,
                estimatedWeeklyImpressions: null,
            },
        });

        // POI ilişkilerini klonla (aynı Poi kayıtlarına yeni PanelPoi linkleri)
        if (sourcePois && sourcePois.length > 0) {
            try {
                await prisma.panelPoi.createMany({
                    data: sourcePois.map((pp: any) => ({
                        panelId: created.id,
                        poiId: pp.poiId,
                        distance: pp.distance,
                        bearing: pp.bearing,
                        direction: pp.direction,
                        isLandmark: pp.isLandmark,
                        manuallyAdded: pp.manuallyAdded,
                    })),
                    skipDuplicates: true,
                });

                await prisma.staticPanel.update({
                    where: { id: created.id },
                    data: {
                        nearbyPoiCount: sourcePois.length,
                        poiEnrichedAt: new Date(),
                    },
                });
            } catch (poiErr) {
                console.warn("[duplicate] POI clone failed:", poiErr);
            }
        }

        // Trafik skorunu arka planda yeni konuma göre hesapla
        triggerTrafficComputeInBackground(created.id);

        return NextResponse.json({ success: true, panel: created });
    } catch (error: any) {
        console.error("Error duplicating panel:", error);
        return NextResponse.json(
            { error: "Failed to duplicate panel", details: error.message },
            { status: 500 },
        );
    }
}
