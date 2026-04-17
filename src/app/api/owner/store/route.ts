import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

async function getOwnerRecord() {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) return null;
    return prisma.screenOwner.findUnique({ where: { userId: session.userId } });
}

export async function GET() {
    const owner = await getOwnerRecord();
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({
        id: owner.id,
        companyName: owner.companyName,
        slug: owner.slug,
        logoUrl: owner.logoUrl,
        coverUrl: owner.coverUrl,
        description: owner.description,
        website: owner.website,
        cities: owner.cities ?? [],
        phone: owner.phone,
        contactEmail: owner.contactEmail,
    });
}

async function ensureUniqueSlug(baseSlug: string, ownerId: string): Promise<string> {
    const base = baseSlug || "medya";
    let candidate = base;
    let i = 2;
    while (true) {
        const existing = await prisma.screenOwner.findUnique({ where: { slug: candidate } });
        if (!existing || existing.id === ownerId) return candidate;
        candidate = `${base}-${i}`;
        i += 1;
        if (i > 50) return `${base}-${Date.now()}`;
    }
}

export async function PATCH(req: NextRequest) {
    const owner = await getOwnerRecord();
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body: Record<string, unknown> = {};
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const data: Record<string, unknown> = {};

    if (typeof body.companyName === "string" && body.companyName.trim().length > 0) {
        data.companyName = body.companyName.trim();
    }

    if (typeof body.description === "string") {
        data.description = body.description.trim().slice(0, 2000) || null;
    }

    if (typeof body.website === "string") {
        const w = body.website.trim();
        if (!w) {
            data.website = null;
        } else {
            const withProto = /^https?:\/\//i.test(w) ? w : `https://${w}`;
            data.website = withProto.slice(0, 200);
        }
    }

    if (typeof body.phone === "string") data.phone = body.phone.trim() || null;
    if (typeof body.contactEmail === "string") data.contactEmail = body.contactEmail.trim() || null;
    if (typeof body.logoUrl === "string") data.logoUrl = body.logoUrl.trim() || null;
    if (typeof body.coverUrl === "string") data.coverUrl = body.coverUrl.trim() || null;

    if (Array.isArray(body.cities)) {
        data.cities = (body.cities as unknown[])
            .filter((c): c is string => typeof c === "string")
            .map((c) => c.trim())
            .filter(Boolean)
            .slice(0, 30);
    }

    // Slug: explicit user input OR generate from companyName if current slug is empty
    if (typeof body.slug === "string" && body.slug.trim().length > 0) {
        const desired = slugify(body.slug);
        if (desired.length >= 3) {
            data.slug = await ensureUniqueSlug(desired, owner.id);
        }
    } else if (!owner.slug) {
        const base = slugify(
            typeof data.companyName === "string" ? (data.companyName as string) : owner.companyName
        );
        data.slug = await ensureUniqueSlug(base || "medya", owner.id);
    }

    const updated = await prisma.screenOwner.update({
        where: { id: owner.id },
        data,
    });

    return NextResponse.json({
        id: updated.id,
        companyName: updated.companyName,
        slug: updated.slug,
        logoUrl: updated.logoUrl,
        coverUrl: updated.coverUrl,
        description: updated.description,
        website: updated.website,
        cities: updated.cities ?? [],
        phone: updated.phone,
        contactEmail: updated.contactEmail,
    });
}
