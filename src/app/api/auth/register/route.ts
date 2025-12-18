import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { hashPassword, login } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["SCREEN_OWNER", "ADVERTISER"]),
    name: z.string().min(2),
    companyName: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { email, password, role, name, companyName } = result.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        // Transaction to create User and Profile
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email,
                    passwordHash: hashedPassword,
                    role,
                    name,
                },
            });

            if (role === "SCREEN_OWNER") {
                await tx.screenOwner.create({
                    data: {
                        userId: newUser.id,
                        companyName: companyName || name, // Default to name if no company provided
                    },
                });
            } else if (role === "ADVERTISER") {
                await tx.advertiser.create({
                    data: {
                        userId: newUser.id,
                        companyName: companyName,
                    },
                });
            }

            return newUser;
        });

        // Auto login after register
        await login({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        });

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
