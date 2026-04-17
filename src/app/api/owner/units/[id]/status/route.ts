import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const VALID = new Set(["ACTIVE", "PAUSED", "MAINTENANCE"]);

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session.userId },
        select: { id: true },
    });
    if (!owner) {
        return NextResponse.json({ error: "Owner profili yok" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const status = String(body?.status || "").toUpperCase();
        if (!VALID.has(status)) {
            return NextResponse.json({ error: "Geçersiz durum" }, { status: 400 });
        }

        const panel = await prisma.staticPanel.findUnique({
            where: { id: params.id },
            select: { ownerId: true },
        });
        if (!panel) {
            return NextResponse.json({ error: "Pano bulunamadı" }, { status: 404 });
        }
        if (panel.ownerId !== owner.id) {
            return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
        }

        const updated = await prisma.staticPanel.update({
            where: { id: params.id },
            data: { ownerStatus: status as any },
        });
        return NextResponse.json({ panel: updated });
    } catch (error: any) {
        console.error("owner status change error:", error);
        return NextResponse.json(
            { error: "Durum güncellenemedi", details: error?.message },
            { status: 500 }
        );
    }
}
