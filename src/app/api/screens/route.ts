import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const district = searchParams.get("district");

    const where: any = {
        active: true, // Only show active screens
    };

    if (city) where.city = { contains: city, mode: "insensitive" };
    if (district) where.district = { contains: district, mode: "insensitive" };

    try {
        const screens = await prisma.screen.findMany({
            where,
            select: {
                id: true,
                name: true,
                city: true,
                district: true,
                latitude: true,
                longitude: true,
                resolutionWidth: true,
                resolutionHeight: true,
                basePricePerPlay: true,
                maxPlaysPerHour: true,
                previewImageUrl: true,
                orientation: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ screens });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
