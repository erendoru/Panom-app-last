import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { listOwnerCustomers } from "@/lib/owner/customers";

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

export async function GET() {
    const ownerId = await getOwnerId();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const customers = await listOwnerCustomers(ownerId);
        return NextResponse.json({ customers });
    } catch (err) {
        console.error("[owner/customers] GET failed:", err);
        return NextResponse.json({ customers: [] });
    }
}
