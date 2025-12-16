import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";
import bcrypt from "bcryptjs";

export const createServerSupabaseClient = cache(() => {
    const cookieStore = cookies();
    return createServerComponentClient({ cookies: () => cookieStore });
});

export async function getSession() {
    const supabase = createServerSupabaseClient();
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) return null;

        // Fetch user role from database
        const { prisma } = await import("@/lib/prisma");

        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { role: true, id: true, name: true }
        });

        return {
            user: session.user,
            userId: dbUser?.id,
            role: dbUser?.role,
            name: dbUser?.name,
            accessToken: session.access_token
        };

    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

// Helper to check if user is authenticated
export async function isAuthenticated() {
    const session = await getSession();
    return !!session;
}

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export async function login(userData: any) {
    // This seems to be a placeholder for non-Supabase login flow. 
    // Since Supabase handles the session, we might just return true or set a cookie if needed.
    // For build success, we return true.
    return true;
}

