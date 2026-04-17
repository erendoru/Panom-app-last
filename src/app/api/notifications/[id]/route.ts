import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
    _req: NextRequest,
    { params }: { params: { id: string } },
) {
    const session = await getSession();
    if (!session?.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const client = prisma as unknown as {
            notification: {
                findUnique: (args: unknown) => Promise<{ userId: string } | null>;
                update: (args: unknown) => Promise<unknown>;
            };
        };
        const existing = await client.notification.findUnique({
            where: { id: params.id },
        });
        if (!existing || existing.userId !== session.userId) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        const updated = await client.notification.update({
            where: { id: params.id },
            data: { readAt: new Date() },
        });
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } },
) {
    const session = await getSession();
    if (!session?.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const client = prisma as unknown as {
            notification: {
                findUnique: (args: unknown) => Promise<{ userId: string } | null>;
                delete: (args: unknown) => Promise<unknown>;
            };
        };
        const existing = await client.notification.findUnique({
            where: { id: params.id },
        });
        if (!existing || existing.userId !== session.userId) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        await client.notification.delete({ where: { id: params.id } });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
