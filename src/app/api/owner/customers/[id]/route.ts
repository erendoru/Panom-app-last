import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getOwnerCustomerDetail } from "@/lib/owner/customers";

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

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const ownerId = await getOwnerId();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const detail = await getOwnerCustomerDetail(ownerId, params.id);
        if (!detail) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(detail);
    } catch (err) {
        console.error("[owner/customers/id] GET failed:", err);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const ownerId = await getOwnerId();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body: { notes?: string; sector?: string | null } = {};
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Sadece kendi müşterisine not yazabilir — ilişki doğrulaması
    try {
        const hasRental = await prisma.staticRental.findFirst({
            where: { advertiserId: params.id, panel: { ownerId } },
            select: { id: true },
        });
        if (!hasRental) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
    } catch (err) {
        console.error("[owner/customers/id] PATCH ownership check failed:", err);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

    const notes =
        typeof body.notes === "string" ? body.notes.trim().slice(0, 4000) || null : undefined;
    const sector =
        body.sector === null
            ? null
            : typeof body.sector === "string"
                ? body.sector.trim().slice(0, 64) || null
                : undefined;

    try {
        const saved = await prisma.ownerCustomerNote.upsert({
            where: {
                ownerId_advertiserId: { ownerId, advertiserId: params.id },
            },
            create: {
                ownerId,
                advertiserId: params.id,
                notes: notes ?? null,
                sector: sector ?? null,
            },
            update: {
                ...(notes !== undefined ? { notes } : {}),
                ...(sector !== undefined ? { sector } : {}),
            },
        });
        return NextResponse.json(saved);
    } catch (err) {
        console.error("[owner/customers/id] PATCH upsert failed:", err);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}
