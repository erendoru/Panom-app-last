import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, email, role, name, companyName } = body;

        if (!id || !email || !role || !name) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Create user in Prisma
        // Note: We don't need password hash here because Supabase handles auth
        const user = await prisma.user.create({
            data: {
                id, // Use Supabase ID
                email,
                passwordHash: "SUPABASE_AUTH", // Placeholder
                role,
                name,
                // Create profile based on role
                ...(role === "SCREEN_OWNER" && {
                    screenOwnerProfile: {
                        create: {
                            companyName: companyName || name,
                        },
                    },
                }),
                ...(role === "ADVERTISER" && {
                    advertiserProfile: {
                        create: {
                            companyName: companyName,
                        },
                    },
                }),
            },
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Register sync error:", error);
        return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
    }
}
