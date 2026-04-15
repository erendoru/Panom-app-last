import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function hasAdminAccess(session: { role?: string } | null) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

const BUCKET = process.env.STORAGE_BUCKET_NAME || "panom-uploads";

/** Bu hostlardaki URL'ler tarayıcıda sık sık kırılır; kendi depomuza taşınır. */
function isMirrorCandidate(url: string | null | undefined, supabaseHost: string): url is string {
    if (!url || !url.startsWith("http")) return false;
    if (url.includes(supabaseHost)) return false;
    const u = url.toLowerCase();
    return (
        u.includes("mymaps.usercontent.google.com") ||
        u.includes("googleusercontent.com") ||
        u.includes("ggpht.com")
    );
}

function extFromContentType(ct: string | null): string {
    const c = (ct || "").toLowerCase();
    if (c.includes("png")) return "png";
    if (c.includes("webp")) return "webp";
    if (c.includes("gif")) return "gif";
    return "jpg";
}

/**
 * GET: Taşınmayı bekleyen pano sayısı (özet).
 * POST: Harici görselleri indirip Supabase Storage'a yükler, imageUrl güncellenir.
 * Body: { limit?: number (default 80, max 150), panelIds?: string[] }
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
        /* ignore */
    }

    const cityFilter = session.assignedCity ? [{ city: session.assignedCity }] : [];

    const externalWhere = {
        AND: [
            ...cityFilter,
            { imageUrl: { not: null } },
            {
                OR: [
                    { imageUrl: { contains: "mymaps.usercontent", mode: "insensitive" as const } },
                    { imageUrl: { contains: "googleusercontent", mode: "insensitive" as const } },
                    { imageUrl: { contains: "ggpht.com", mode: "insensitive" as const } },
                ],
            },
        ],
    };

    const candidates = await prisma.staticPanel.findMany({
        where: externalWhere,
        select: { id: true, imageUrl: true },
    });

    const pending = candidates.filter((p) => isMirrorCandidate(p.imageUrl, supabaseHost)).length;
    const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    return NextResponse.json({ pending, hasServiceKey });
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
                    "SUPABASE_SERVICE_ROLE_KEY tanımlı değil. Supabase Dashboard → Settings → API → service_role anahtarını .env dosyasına ekleyin.",
            },
            { status: 503 }
        );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    let supabaseHost = "";
    try {
        supabaseHost = new URL(supabaseUrl).hostname;
    } catch {
        /* ignore */
    }

    let body: { limit?: number; panelIds?: string[] } = {};
    try {
        body = await req.json();
    } catch {
        body = {};
    }

    const max = Math.min(Math.max(Number(body.limit) || 80, 1), 150);
    const panelIds = Array.isArray(body.panelIds) ? body.panelIds.filter((id) => typeof id === "string") : null;

    const cityFilter = session.assignedCity ? [{ city: session.assignedCity }] : [];

    let panels;
    if (panelIds?.length) {
        panels = await prisma.staticPanel.findMany({
            where: { AND: [...cityFilter, { id: { in: panelIds.slice(0, max) } }] },
            select: { id: true, name: true, imageUrl: true },
        });
    } else {
        panels = await prisma.staticPanel.findMany({
            where: {
                AND: [
                    ...cityFilter,
                    { imageUrl: { not: null } },
                    {
                        OR: [
                            { imageUrl: { contains: "mymaps.usercontent", mode: "insensitive" as const } },
                            { imageUrl: { contains: "googleusercontent", mode: "insensitive" as const } },
                            { imageUrl: { contains: "ggpht.com", mode: "insensitive" as const } },
                        ],
                    },
                ],
            },
            select: { id: true, name: true, imageUrl: true },
            take: max,
            orderBy: { createdAt: "desc" },
        });
    }

    const targets = panels.filter((p) => isMirrorCandidate(p.imageUrl, supabaseHost));

    const results: { id: string; name: string; ok: boolean; error?: string; newUrl?: string }[] = [];

    const browserUA =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

    for (const panel of targets) {
        const src = panel.imageUrl!;
        try {
            const res = await fetch(src, {
                headers: {
                    "User-Agent": browserUA,
                    Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
                    "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
                    Referer: "https://www.google.com/",
                },
                redirect: "follow",
                signal: AbortSignal.timeout(60000),
            });

            if (!res.ok) {
                results.push({
                    id: panel.id,
                    name: panel.name,
                    ok: false,
                    error: `İndirme HTTP ${res.status} (Google bağlantısı oturum veya süre ile kısıtlı olabilir)`,
                });
                continue;
            }

            const contentType = res.headers.get("content-type") || "image/jpeg";
            if (!contentType.startsWith("image/")) {
                results.push({
                    id: panel.id,
                    name: panel.name,
                    ok: false,
                    error: `Beklenmeyen içerik: ${contentType.slice(0, 40)}`,
                });
                continue;
            }

            const arrayBuf = await res.arrayBuffer();
            const buf = Buffer.from(arrayBuf);
            if (buf.length < 500) {
                results.push({
                    id: panel.id,
                    name: panel.name,
                    ok: false,
                    error: "Dosya çok küçük veya boş (erişim reddedilmiş olabilir)",
                });
                continue;
            }

            const ext = extFromContentType(contentType);
            const filePath = `imports/panel-covers/${panel.id}/${crypto.randomUUID()}.${ext}`;

            const { error: upErr } = await admin.storage.from(BUCKET).upload(filePath, buf, {
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

            results.push({ id: panel.id, name: panel.name, ok: true, newUrl: publicUrl });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            results.push({ id: panel.id, name: panel.name, ok: false, error: msg });
        }
    }

    const okCount = results.filter((r) => r.ok).length;
    const failCount = results.filter((r) => !r.ok).length;

    return NextResponse.json({
        message: `${okCount} görsel kopyalandı, ${failCount} başarısız (denenen: ${targets.length})`,
        okCount,
        failCount,
        attempted: targets.length,
        results,
    });
}
