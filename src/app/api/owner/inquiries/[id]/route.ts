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

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const ownerId = await getOwnerId();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const inquiry = await prisma.storeInquiry.findUnique({ where: { id: params.id } });
    if (!inquiry || inquiry.ownerId !== ownerId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(inquiry);
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const ownerId = await getOwnerId();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body: { status?: string; notes?: string } = {};
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const existing = await prisma.storeInquiry.findUnique({ where: { id: params.id } });
    if (!existing || existing.ownerId !== ownerId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.status && ["NEW", "CONTACTED", "CLOSED"].includes(body.status)) {
        data.status = body.status;
    }
    if (typeof body.notes === "string") {
        data.notes = body.notes.trim().slice(0, 2000) || null;
    }

    const updated = await prisma.storeInquiry.update({
        where: { id: params.id },
        data,
    });
    return NextResponse.json(updated);
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const ownerId = await getOwnerId();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.storeInquiry.findUnique({ where: { id: params.id } });
    if (!existing || existing.ownerId !== ownerId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.storeInquiry.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
}
