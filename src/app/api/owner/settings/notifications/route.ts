import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session.userId },
        select: {
            notifyNewRequest: true,
            notifyCampaignStart: true,
            notifyProofReminder: true,
            notifyWeeklyDigest: true,
        },
    });
    if (!owner) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(owner);
}

export async function PATCH(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const data: Record<string, boolean> = {};
    const keys = [
        "notifyNewRequest",
        "notifyCampaignStart",
        "notifyProofReminder",
        "notifyWeeklyDigest",
    ] as const;
    for (const k of keys) {
        if (typeof body[k] === "boolean") data[k] = body[k] as boolean;
    }

    if (Object.keys(data).length === 0) {
        return NextResponse.json({ error: "Değişiklik yok." }, { status: 400 });
    }

    try {
        const updated = await prisma.screenOwner.update({
            where: { userId: session.userId },
            data,
            select: {
                notifyNewRequest: true,
                notifyCampaignStart: true,
                notifyProofReminder: true,
                notifyWeeklyDigest: true,
            },
        });
        return NextResponse.json(updated);
    } catch (err) {
        console.error("[owner/settings/notifications] update failed:", err);
        return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });
    }
}
