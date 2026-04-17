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

async function assertOwnership(panelId: string, pricingId: string, ownerId: string) {
    const pricing = await prisma.panelPricing.findUnique({
        where: { id: pricingId },
        select: { id: true, panelId: true, panel: { select: { ownerId: true } } },
    });
    if (!pricing || pricing.panelId !== panelId) return null;
    if (pricing.panel.ownerId !== ownerId) return null;
    return pricing.id;
}

function num(v: unknown): number | null {
    if (v === null || v === undefined || v === "") return null;
    const n = parseFloat(String(v));
    return Number.isFinite(n) ? n : null;
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string; pricingId: string } }
) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const pricingId = await assertOwnership(params.id, params.pricingId, ownerId);
    if (!pricingId) return NextResponse.json({ error: "Fiyat bulunamadı" }, { status: 404 });

    const body = await req.json().catch(() => ({}));
    const data: Record<string, unknown> = {};

    if (body.name !== undefined) data.name = String(body.name).slice(0, 120);
    if (body.priceType !== undefined) {
        data.priceType =
            body.priceType === "PROMOTIONAL" || body.priceType === "STANDARD"
                ? body.priceType
                : "SEASONAL";
    }
    if (body.priceWeekly !== undefined) {
        const w = num(body.priceWeekly);
        if (w === null || w <= 0)
            return NextResponse.json({ error: "Geçersiz priceWeekly" }, { status: 400 });
        data.priceWeekly = w;
    }
    if (body.priceDaily !== undefined) {
        data.priceDaily = num(body.priceDaily);
    }
    if (body.startDate !== undefined) {
        const s = new Date(body.startDate);
        if (!Number.isFinite(s.getTime()))
            return NextResponse.json({ error: "Geçersiz startDate" }, { status: 400 });
        data.startDate = s;
    }
    if (body.endDate !== undefined) {
        const e = new Date(body.endDate);
        if (!Number.isFinite(e.getTime()))
            return NextResponse.json({ error: "Geçersiz endDate" }, { status: 400 });
        data.endDate = e;
    }
    if (body.priority !== undefined) {
        const p = parseInt(String(body.priority), 10);
        if (Number.isFinite(p)) data.priority = p;
    }
    if (body.active !== undefined) {
        data.active = Boolean(body.active);
    }

    const updated = await prisma.panelPricing.update({
        where: { id: pricingId },
        data,
    });

    return NextResponse.json(updated);
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string; pricingId: string } }
) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const pricingId = await assertOwnership(params.id, params.pricingId, ownerId);
    if (!pricingId) return NextResponse.json({ error: "Fiyat bulunamadı" }, { status: 404 });

    await prisma.panelPricing.delete({ where: { id: pricingId } });
    return NextResponse.json({ ok: true });
}
