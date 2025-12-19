import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get("city");

        // Build where clause
        const where: any = { active: true };

        // Filter by city if provided and not "Tümü"
        if (city && city !== "Tümü") {
            where.city = city;
        }

        const panels = await prisma.staticPanel.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                type: true,
                city: true,
                district: true,
                latitude: true,
                longitude: true,
                width: true,
                height: true,
                priceDaily: true,
                priceWeekly: true,
                imageUrl: true,
                isAVM: true,
                trafficLevel: true,
                socialGrade: true,
                locationType: true,
            }
        });

        return NextResponse.json({ panels, count: panels.length });
    } catch (error) {
        console.error("Error fetching panels:", error);
        return NextResponse.json(
            { error: "Failed to fetch panels" },
            { status: 500 }
        );
    }
}
