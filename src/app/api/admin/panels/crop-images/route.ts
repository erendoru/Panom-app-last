import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
    cropImageRemoveEdgeFraction,
    cropImageWithEdgeFractions,
    PRESET_HEAVY_RIGHT,
    type EdgeFractions,
} from "@/lib/crop-image-edges";

function hasAdminAccess(session: { role?: string } | null) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

const BUCKET = process.env.STORAGE_BUCKET_NAME || "panom-uploads";

/** Depomuzdaki görsel; çift kırpmayı URL ile engelleriz */
function isEligibleForCrop(url: string | null | undefined, supabaseHost: string): url is string {
    if (!url || !url.startsWith("http")) return false;
    if (!url.toLowerCase().includes(supabaseHost.toLowerCase())) return false;
    if (url.includes("/imports/panel-covers-cropped/")) return false;
    return true;
}

/**
 * GET: Kenar kırpmaya uygun (Supabase’te, henüz cropped olmayan) pano sayısı.
 * POST: Görselleri indirir, her kenardan edgeFraction (varsayılan 0.3) kırpar, yeni dosya yükler, imageUrl güncellenir.
 */
export async function GET() {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    let supabaseHost = "";
    try {
        supabaseHost = new URL(supabaseUrl).hostname;
    } catch {
        return NextResponse.json({ error: "NEXT_PUBLIC_SUPABASE_URL geçersiz" }, { status: 500 });
    }

    const cityFilter = session.assignedCity ? [{ city: session.assignedCity }] : [];

    const pending = await prisma.staticPanel.count({
        where: {
            AND: [
                ...cityFilter,
                { imageUrl: { not: null } },
                { imageUrl: { contains: supabaseHost, mode: "insensitive" } },
                { NOT: { imageUrl: { contains: "/imports/panel-covers-cropped/", mode: "insensitive" } } },
            ],
        },
    });
    const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    return NextResponse.json({
        pending,
        hasServiceKey,
        edgeDefault: 0.3,
        presets: { heavyRight: PRESET_HEAVY_RIGHT },
    });
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
        return NextResponse.json(
            {
                error:
                    "SUPABASE_SERVICE_ROLE_KEY tanımlı değil. Depoya yazmak için service_role anahtarı gerekir.",
            },
            { status: 503 }
        );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    let supabaseHost = "";
    try {
        supabaseHost = new URL(supabaseUrl).hostname;
    } catch {
        return NextResponse.json({ error: "NEXT_PUBLIC_SUPABASE_URL geçersiz" }, { status: 500 });
    }

    let body: {
        edgeFraction?: number;
        limit?: number;
        panelIds?: string[];
        preset?: "heavyRight";
        edges?: Partial<EdgeFractions>;
    } = {};
    try {
        body = await req.json();
    } catch {
        body = {};
    }

    const baseFrac =
        typeof body.edgeFraction === "number" && !Number.isNaN(body.edgeFraction) ? body.edgeFraction : 0.3;

    let edgesPlan: EdgeFractions;
    if (body.preset === "heavyRight") {
        edgesPlan = { ...PRESET_HEAVY_RIGHT };
    } else if (body.edges && typeof body.edges === "object") {
        const b = body.edges;
        edgesPlan = {
            left: typeof b.left === "number" ? b.left : baseFrac,
            top: typeof b.top === "number" ? b.top : baseFrac,
            right: typeof b.right === "number" ? b.right : baseFrac,
            bottom: typeof b.bottom === "number" ? b.bottom : baseFrac,
        };
    } else {
        const u = baseFrac;
        edgesPlan = { left: u, top: u, right: u, bottom: u };
    }
    const max = Math.min(Math.max(Number(body.limit) || 60, 1), 120);
    const panelIds = Array.isArray(body.panelIds) ? body.panelIds.filter((id) => typeof id === "string") : null;

    const cityFilter = session.assignedCity ? [{ city: session.assignedCity }] : [];

    const baseWhere = {
        AND: [
            ...cityFilter,
            { imageUrl: { not: null } },
            { imageUrl: { contains: supabaseHost, mode: "insensitive" as const } },
            { NOT: { imageUrl: { contains: "/imports/panel-covers-cropped/", mode: "insensitive" as const } } },
        ],
    };

    let panels;
    if (panelIds?.length) {
        panels = await prisma.staticPanel.findMany({
            where: { AND: [...cityFilter, { id: { in: panelIds.slice(0, max) } }] },
            select: { id: true, name: true, imageUrl: true },
        });
    } else {
        panels = await prisma.staticPanel.findMany({
            where: baseWhere,
            select: { id: true, name: true, imageUrl: true },
            take: max,
            orderBy: { updatedAt: "desc" },
        });
    }

    const targets = panelIds?.length
        ? panels.filter((p) => isEligibleForCrop(p.imageUrl, supabaseHost)).slice(0, max)
        : panels;

    const results: { id: string; name: string; ok: boolean; error?: string }[] = [];
    const ua =
        "Mozilla/5.0 (compatible; PanobuAdmin/1.0; +https://panobu.com) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

    for (const panel of targets) {
        const src = panel.imageUrl!;
        try {
            const res = await fetch(src, {
                headers: { "User-Agent": ua, Accept: "image/*,*/*;q=0.8" },
                redirect: "follow",
                signal: AbortSignal.timeout(60000),
            });
            if (!res.ok) {
                results.push({
                    id: panel.id,
                    name: panel.name,
                    ok: false,
                    error: `İndirme HTTP ${res.status}`,
                });
                continue;
            }
            const buf = Buffer.from(await res.arrayBuffer());
            if (buf.length < 500) {
                results.push({ id: panel.id, name: panel.name, ok: false, error: "Dosya çok küçük" });
                continue;
            }

            const uniform =
                edgesPlan.left === edgesPlan.right &&
                edgesPlan.left === edgesPlan.top &&
                edgesPlan.left === edgesPlan.bottom;
            const { buffer: cropped, contentType } = uniform
                ? await cropImageRemoveEdgeFraction(buf, edgesPlan.left)
                : await cropImageWithEdgeFractions(buf, edgesPlan);

            const filePath = `imports/panel-covers-cropped/${panel.id}/${crypto.randomUUID()}.jpg`;
            const { error: upErr } = await admin.storage.from(BUCKET).upload(filePath, cropped, {
                contentType,
                cacheControl: "86400",
                upsert: false,
            });
            if (upErr) {
                results.push({
                    id: panel.id,
                    name: panel.name,
                    ok: false,
                    error: `Storage: ${upErr.message}`,
                });
                continue;
            }

            const {
                data: { publicUrl },
            } = admin.storage.from(BUCKET).getPublicUrl(filePath);

            await prisma.staticPanel.update({
                where: { id: panel.id },
                data: { imageUrl: publicUrl },
            });

            results.push({ id: panel.id, name: panel.name, ok: true });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            results.push({ id: panel.id, name: panel.name, ok: false, error: msg });
        }
    }

    const okCount = results.filter((r) => r.ok).length;
    return NextResponse.json({
        message: `${okCount} görsel kırpıldı (denenen: ${targets.length}; L/T/R/B: ${edgesPlan.left.toFixed(2)}/${edgesPlan.top.toFixed(2)}/${edgesPlan.right.toFixed(2)}/${edgesPlan.bottom.toFixed(2)})`,
        okCount,
        failCount: results.length - okCount,
        attempted: targets.length,
        edges: edgesPlan,
        preset: body.preset ?? null,
        results,
    });
}
