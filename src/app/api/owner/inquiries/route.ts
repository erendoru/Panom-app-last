import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getOwnerId(): Promise<string | null> {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) return null;
    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session.userId },
        select: { id: true },
    });
    return owner?.id ?? null;
}

export async function GET(req: NextRequest) {
    const ownerId = await getOwnerId();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const status = url.searchParams.get("status"); // NEW | CONTACTED | CLOSED | all
    const where: Record<string, unknown> = { ownerId };
    if (status && status !== "all" && ["NEW", "CONTACTED", "CLOSED"].includes(status)) {
        where.status = status;
    }

    try {
        const rows = await prisma.storeInquiry.findMany({
            where,
            orderBy: [{ createdAt: "desc" }],
            take: 200,
        });
        return NextResponse.json({ inquiries: rows });
    } catch (err) {
        console.error("[owner/inquiries] list failed:", err);
        return NextResponse.json({ inquiries: [] });
    }
}
