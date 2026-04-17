import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getOwnerIdFromSession() {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) return null;
    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session.userId },
        select: { id: true },
    });
    return owner?.id ?? null;
}

async function assertOwnsPanel(panelId: string, ownerId: string) {
    const panel = await prisma.staticPanel.findFirst({
        where: { id: panelId, ownerId },
        select: { id: true },
    });
    return panel?.id ?? null;
}

function num(v: unknown): number | null {
    if (v === null || v === undefined || v === "") return null;
    const n = parseFloat(String(v));
    return Number.isFinite(n) ? n : null;
}

// GET — bu panelin tüm dönemsel fiyatları
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const panelId = await assertOwnsPanel(params.id, ownerId);
    if (!panelId) return NextResponse.json({ error: "Pano bulunamadı" }, { status: 404 });

    const pricings = await prisma.panelPricing.findMany({
        where: { panelId },
        orderBy: [{ priority: "desc" }, { startDate: "asc" }],
    });

    return NextResponse.json(pricings);
}

// POST — yeni dönemsel fiyat ekle
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const panelId = await assertOwnsPanel(params.id, ownerId);
    if (!panelId) return NextResponse.json({ error: "Pano bulunamadı" }, { status: 404 });

    const body = await req.json().catch(() => ({}));
    const { name, priceWeekly, priceDaily, startDate, endDate, priceType, priority } = body || {};

    const weekly = num(priceWeekly);
    if (!name || weekly === null || weekly <= 0) {
        return NextResponse.json(
            { error: "name ve geçerli priceWeekly zorunludur" },
            { status: 400 }
        );
    }

    if (!startDate || !endDate) {
        return NextResponse.json({ error: "startDate ve endDate zorunlu" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < start) {
        return NextResponse.json({ error: "Geçersiz tarih aralığı" }, { status: 400 });
    }

    const created = await prisma.panelPricing.create({
        data: {
            panelId,
            name: String(name).slice(0, 120),
            priceType:
                priceType === "PROMOTIONAL" || priceType === "STANDARD"
                    ? priceType
                    : "SEASONAL",
            priceWeekly: weekly,
            priceDaily: num(priceDaily) ?? undefined,
            startDate: start,
            endDate: end,
            priority: Number.isFinite(parseInt(priority, 10)) ? parseInt(priority, 10) : 0,
        },
    });

    return NextResponse.json(created, { status: 201 });
}
