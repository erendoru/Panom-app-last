import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            type,
            city,
            district,
            address,
            latitude,
            longitude,
            width,
            height,
            priceWeekly,
            imageUrl,
            locationType,
            socialGrade,
            avmName,
            isAVM,
            trafficLevel
        } = body;

        if (!name || !city || !district || !priceWeekly) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const panel = await prisma.staticPanel.create({
            data: {
                name,
                type: type || "BILLBOARD",
                city,
                district,
                address,
                latitude: Number(latitude),
                longitude: Number(longitude),
                width: Number(width),
                height: Number(height),
                priceWeekly: Number(priceWeekly),
                imageUrl,
                active: true,
                locationType,
                socialGrade,
                avmName,
                isAVM,
                trafficLevel
            },
        });

        return NextResponse.json(panel);
    } catch (error) {
        console.error("Create panel error:", error);
        return NextResponse.json(
            { error: "Failed to create panel" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const panels = await prisma.staticPanel.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(panels);
    } catch (error) {
        console.error("Fetch panels error:", error);
        return NextResponse.json(
            { error: "Failed to fetch panels" },
            { status: 500 }
        );
    }
}
