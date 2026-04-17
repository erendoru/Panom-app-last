import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

async function uniqueSlug(base: string): Promise<string> {
    const root = base || "uye";
    let candidate = root;
    let i = 2;
    for (let attempt = 0; attempt < 25; attempt++) {
        const existing = await prisma.screenOwner.findUnique({
            where: { slug: candidate },
            select: { id: true },
        });
        if (!existing) return candidate;
        candidate = `${root}-${i++}`;
    }
    return `${root}-${Date.now()}`;
}

/**
 * Resolves the authenticated user's DB profile.
 * If the Supabase user exists but the Prisma `User` row is missing
 * (e.g. register-sync failed), we self-heal by creating it from the
 * Supabase session metadata.
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, role: true, name: true },
        });
        if (user) {
            return NextResponse.json(user);
        }

        // Self-heal path: use the authenticated Supabase session to fill the DB.
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        const { data: authData } = await supabase.auth.getUser();
        const authUser = authData?.user;

        if (!authUser || authUser.email?.toLowerCase() !== email.toLowerCase()) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const rawRole =
            (authUser.user_metadata?.role as string | undefined) ||
            (authUser.app_metadata?.role as string | undefined) ||
            "ADVERTISER";
        const role = ["ADMIN", "REGIONAL_ADMIN", "ADVERTISER", "SCREEN_OWNER"].includes(rawRole)
            ? rawRole
            : "ADVERTISER";
        const name =
            (authUser.user_metadata?.name as string | undefined) ||
            authUser.email?.split("@")[0] ||
            "Panobu Üyesi";
        const companyName =
            (authUser.user_metadata?.companyName as string | undefined) || name;

        const created = await prisma.user.create({
            data: {
                id: authUser.id,
                email: authUser.email!,
                passwordHash: "SUPABASE_AUTH",
                role,
                name,
                ...(role === "SCREEN_OWNER"
                    ? {
                        screenOwnerProfile: {
                            create: {
                                companyName,
                                contactEmail: authUser.email!,
                                slug: await uniqueSlug(slugify(companyName)),
                                cities: [],
                            },
                        },
                    }
                    : {}),
                ...(role === "ADVERTISER"
                    ? {
                        advertiserProfile: {
                            create: { companyName },
                        },
                    }
                    : {}),
            },
            select: { id: true, email: true, role: true, name: true },
        });

        console.warn(`[auth/user] Self-healed Prisma profile for ${authUser.email} (role=${role}).`);
        return NextResponse.json(created);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}
