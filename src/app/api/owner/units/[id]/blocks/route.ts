import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface BlockedRange {
    startDate: string;
    endDate: string;
    reason?: string;
}

async function getOwnerIdFromSession() {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) return null;
    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session.userId },
        select: { id: true },
    });
    return owner?.id ?? null;
}

async function loadOwnedPanel(panelId: string, ownerId: string) {
    return prisma.staticPanel.findFirst({
        where: { id: panelId, ownerId },
        select: { id: true, blockedDates: true },
    });
}

// POST — yeni blok ekle
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const panel = await loadOwnedPanel(params.id, ownerId);
    if (!panel) return NextResponse.json({ error: "Pano bulunamadı" }, { status: 404 });

    const body = await req.json().catch(() => ({}));
    const { startDate, endDate, reason } = body || {};

    if (!startDate || !endDate) {
        return NextResponse.json({ error: "startDate ve endDate zorunlu" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < start) {
        return NextResponse.json({ error: "Geçersiz tarih aralığı" }, { status: 400 });
    }

    const existing: BlockedRange[] = Array.isArray(panel.blockedDates)
        ? (panel.blockedDates as unknown as BlockedRange[])
        : [];

    const block: BlockedRange = {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        reason: reason ? String(reason).slice(0, 200) : "Ünite sahibi tarafından bloklandı",
    };

    const next = [...existing, block];

    await prisma.staticPanel.update({
        where: { id: panel.id },
        data: { blockedDates: next as any },
    });

    return NextResponse.json({ ok: true, blocks: next });
}

// DELETE — bir blok kaldır (?index=N veya body { startDate, endDate })
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const panel = await loadOwnedPanel(params.id, ownerId);
    if (!panel) return NextResponse.json({ error: "Pano bulunamadı" }, { status: 404 });

    const existing: BlockedRange[] = Array.isArray(panel.blockedDates)
        ? (panel.blockedDates as unknown as BlockedRange[])
        : [];

    const { searchParams } = new URL(req.url);
    const idxParam = searchParams.get("index");

    let next: BlockedRange[] = existing;

    if (idxParam !== null) {
        const idx = parseInt(idxParam, 10);
        if (!Number.isFinite(idx) || idx < 0 || idx >= existing.length) {
            return NextResponse.json({ error: "Geçersiz index" }, { status: 400 });
        }
        next = existing.filter((_, i) => i !== idx);
    } else {
        const body = await req.json().catch(() => ({}));
        const { startDate, endDate } = body || {};
        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: "index veya startDate/endDate sağlayın" },
                { status: 400 }
            );
        }
        next = existing.filter(
            (b) => !(b.startDate === startDate && b.endDate === endDate)
        );
    }

    await prisma.staticPanel.update({
        where: { id: panel.id },
        data: { blockedDates: next as any },
    });

    return NextResponse.json({ ok: true, blocks: next });
}
