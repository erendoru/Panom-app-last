import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { comparePassword, login } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input" },
                { status: 400 }
            );
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isValid = await comparePassword(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        await login({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        });

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
