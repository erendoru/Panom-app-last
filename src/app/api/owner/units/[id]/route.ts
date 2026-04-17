import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function parseDimension(value: string | number): number {
    if (typeof value === "number") return value;
    const str = String(value).toLowerCase().trim();
    if (str.endsWith("cm")) return parseFloat(str.replace("cm", "").trim()) / 100;
    if (str.endsWith("m")) return parseFloat(str.replace("m", "").trim());
    return parseFloat(str) || 0;
}

function num(value: unknown): number | null {
    if (value === null || value === undefined || value === "") return null;
    const n = parseFloat(String(value));
    return Number.isFinite(n) ? n : null;
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

async function assertOwnsPanel(panelId: string, ownerId: string) {
    const panel = await prisma.staticPanel.findUnique({
        where: { id: panelId },
        select: { id: true, ownerId: true },
    });
    if (!panel) return { error: "Pano bulunamadı", status: 404 as const };
    if (panel.ownerId !== ownerId) return { error: "Yetkisiz erişim", status: 403 as const };
    return { panel };
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const check = await assertOwnsPanel(params.id, ownerId);
    if ("error" in check) {
        return NextResponse.json({ error: check.error }, { status: check.status });
    }

    const panel = await prisma.staticPanel.findUnique({ where: { id: params.id } });
    return NextResponse.json({ panel });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const check = await assertOwnsPanel(params.id, ownerId);
    if ("error" in check) {
        return NextResponse.json({ error: check.error }, { status: check.status });
    }

    try {
        const body = await req.json();
        const data: Record<string, any> = {};
        const allowedStrings = [
            "name",
            "type",
            "subType",
            "city",
            "district",
            "address",
            "lighting",
            "description",
        ] as const;
        for (const field of allowedStrings) {
            if (body[field] !== undefined) data[field] = body[field] ?? null;
        }
        if (body.faceCount !== undefined) data.faceCount = parseInt(String(body.faceCount)) || 1;
        if (body.latitude !== undefined) data.latitude = parseFloat(String(body.latitude));
        if (body.longitude !== undefined) data.longitude = parseFloat(String(body.longitude));
        if (body.width !== undefined) data.width = parseDimension(body.width);
        if (body.height !== undefined) data.height = parseDimension(body.height);
        if (body.priceWeekly !== undefined) data.priceWeekly = num(body.priceWeekly) ?? 0;
        if (body.priceDaily !== undefined) data.priceDaily = num(body.priceDaily) ?? 0;
        if (body.priceMonthly !== undefined) data.priceMonthly = num(body.priceMonthly);
        if (body.estimatedDailyImpressions !== undefined) {
            data.estimatedDailyImpressions = body.estimatedDailyImpressions
                ? parseInt(String(body.estimatedDailyImpressions)) || 0
                : 0;
        }
        if (body.estimatedCpm !== undefined) data.estimatedCpm = num(body.estimatedCpm);
        if (Array.isArray(body.nearbyTags)) {
            data.nearbyTags = body.nearbyTags
                .map((t: unknown) => String(t || "").trim())
                .filter((t: string) => t.length > 0)
                .slice(0, 30);
        }
        if (Array.isArray(body.imageUrls)) {
            if (body.imageUrls.length < 1 || body.imageUrls.length > 5) {
                return NextResponse.json(
                    { error: "En az 1, en fazla 5 fotoğraf olmalı" },
                    { status: 400 }
                );
            }
            data.imageUrls = body.imageUrls;
            data.imageUrl = body.imageUrls[0] || "";
        }

        // İçerik değiştiğinde yeniden onay sürecine gir
        const contentChanged = Object.keys(data).some((k) =>
            ["name", "type", "city", "district", "address", "latitude", "longitude", "width", "height", "imageUrls", "description", "lighting", "faceCount"].includes(k)
        );
        if (contentChanged) {
            data.reviewStatus = "PENDING";
            data.active = false;
            data.submittedAt = new Date();
            data.reviewNote = null;
        }

        const updated = await prisma.staticPanel.update({
            where: { id: params.id },
            data,
        });
        return NextResponse.json({ panel: updated });
    } catch (error: any) {
        console.error("owner update panel error:", error);
        return NextResponse.json(
            { error: "Pano güncellenemedi", details: error?.message },
            { status: 500 }
        );
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const ownerId = await getOwnerIdFromSession();
    if (!ownerId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const check = await assertOwnsPanel(params.id, ownerId);
    if ("error" in check) {
        return NextResponse.json({ error: check.error }, { status: check.status });
    }

    try {
        await prisma.staticPanel.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("owner delete panel error:", error);
        return NextResponse.json(
            { error: "Pano silinemedi", details: error?.message },
            { status: 500 }
        );
    }
}
