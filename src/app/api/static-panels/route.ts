import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const panels = await prisma.staticPanel.findMany({
            where: { active: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ panels });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
