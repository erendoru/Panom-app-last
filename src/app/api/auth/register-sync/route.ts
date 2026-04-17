import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import {
    sendOwnerWelcomeEmail,
    sendAdvertiserWelcomeEmail,
    sendNewOwnerRegistrationToAdmin,
} from "@/lib/email";

export const dynamic = "force-dynamic";

type Body = {
    id?: string;
    email?: string;
    role?: string;
    name?: string;
    companyName?: string;
    phone?: string;
    taxId?: string;
    cities?: string[];
    website?: string;
    description?: string;
};

async function uniqueSlug(base: string): Promise<string> {
    const root = base || "uye";
    let candidate = root;
    let i = 2;
    for (let attempt = 0; attempt < 25; attempt++) {
        try {
            const existing = await prisma.screenOwner.findUnique({
                where: { slug: candidate },
                select: { id: true },
            });
            if (!existing) return candidate;
        } catch (e) {
            // Tolerate stale Prisma client that doesn't know `slug`; fall back to timestamped value.
            console.warn("[register-sync] slug lookup failed, using timestamp suffix", e);
            return `${root}-${Date.now()}`;
        }
        candidate = `${root}-${i++}`;
    }
    return `${root}-${Date.now()}`;
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as Body;
        const { id, email, role, name, companyName, phone, taxId, cities, website, description } = body;

        if (!id || !email || !role || !name) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { id }, select: { id: true } });
        if (existing) {
            return NextResponse.json({ success: true, user: existing, already: true });
        }

        const isOwner = role === "SCREEN_OWNER";

        const ownerData = isOwner
            ? {
                companyName: (companyName?.trim() || name),
                taxId: taxId?.trim() || null,
                contactEmail: email,
                phone: phone?.trim() || null,
                cities: Array.isArray(cities) ? cities.filter(Boolean) : [],
                website: website?.trim() || null,
                description: description?.trim() || null,
                slug: await uniqueSlug(slugify(companyName?.trim() || name)),
            }
            : null;

        const user = await prisma.user.create({
            data: {
                id,
                email,
                passwordHash: "SUPABASE_AUTH",
                role,
                name,
                phone: phone?.trim() || null,
                ...(isOwner && ownerData
                    ? { screenOwnerProfile: { create: ownerData } }
                    : {}),
                ...(role === "ADVERTISER"
                    ? {
                        advertiserProfile: {
                            create: { companyName: companyName?.trim() || null },
                        },
                    }
                    : {}),
            },
            select: { id: true, email: true, role: true },
        });

        // Welcome + admin notify (best-effort)
        try {
            if (isOwner) {
                await sendOwnerWelcomeEmail({
                    to: email,
                    name,
                    companyName: ownerData?.companyName || name,
                });

                // Adminleri bilgilendir
                const admins = await prisma.user.findMany({
                    where: { role: { in: ["ADMIN", "REGIONAL_ADMIN"] } },
                    select: { email: true },
                });
                const envAdmins = (process.env.ADMIN_NOTIFY_EMAILS || "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                const adminEmails = Array.from(
                    new Set([...admins.map((a) => a.email).filter(Boolean), ...envAdmins])
                );
                if (adminEmails.length) {
                    await sendNewOwnerRegistrationToAdmin({
                        adminEmails,
                        name,
                        email,
                        companyName: ownerData?.companyName || name,
                        phone: phone?.trim() || null,
                        website: website?.trim() || null,
                        cities: Array.isArray(cities) ? cities.filter(Boolean) : [],
                    });
                }
            } else if (role === "ADVERTISER") {
                await sendAdvertiserWelcomeEmail({ to: email, name });
            }
        } catch (mailErr) {
            console.error("[Email] welcome/admin notify failed:", mailErr);
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Register sync error:", error);
        const message = error instanceof Error ? error.message : "Failed to sync user";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
