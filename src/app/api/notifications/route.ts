import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session?.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const onlyUnread = url.searchParams.get("unread") === "1";
    const limit = Math.min(Number(url.searchParams.get("limit") ?? "30"), 100);

    const where: Record<string, unknown> = { userId: session.userId };
    if (onlyUnread) where.readAt = null;

    try {
        const client = prisma as unknown as {
            notification: {
                findMany: (args: unknown) => Promise<unknown[]>;
                count: (args: unknown) => Promise<number>;
            };
        };
        const [items, unreadCount] = await Promise.all([
            client.notification.findMany({
                where,
                orderBy: [{ createdAt: "desc" }],
                take: limit,
            }),
            client.notification.count({
                where: { userId: session.userId, readAt: null },
            }),
        ]);
        return NextResponse.json({ items, unreadCount });
    } catch (err) {
        console.warn("[notifications/GET] failed:", err);
        return NextResponse.json({ items: [], unreadCount: 0 });
    }
}

export async function PATCH(req: NextRequest) {
    // mark-all-read
    const session = await getSession();
    if (!session?.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const client = prisma as unknown as {
            notification: {
                updateMany: (args: unknown) => Promise<{ count: number }>;
            };
        };
        const res = await client.notification.updateMany({
            where: { userId: session.userId, readAt: null },
            data: { readAt: new Date() },
        });
        return NextResponse.json({ ok: true, count: res.count });
    } catch {
        return NextResponse.json({ ok: true, count: 0 });
    }
}
