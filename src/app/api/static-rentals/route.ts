import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADVERTISER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { panelId, startDate, endDate, creativeUrl, totalPrice, designRequested } = body;

        if (!panelId || !startDate || !endDate || !totalPrice) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Get advertiser profile
        const advertiser = await prisma.advertiser.findUnique({
            where: { userId: session.userId },
        });

        if (!advertiser) {
            return NextResponse.json({ error: "Advertiser profile not found" }, { status: 404 });
        }

        // Create rental
        const rental = await prisma.staticRental.create({
            data: {
                advertiserId: advertiser.id,
                panelId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalPrice,
                creativeUrl,
                designRequested: designRequested || false,
                status: "ACTIVE", // Auto-approve for MVP demo
            },
        });

        return NextResponse.json(rental);
    } catch (error) {
        console.error("Rental creation error:", error);
        return NextResponse.json(
            { error: "Failed to create rental" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADVERTISER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const advertiser = await prisma.advertiser.findUnique({
            where: { userId: session.userId },
        });

        if (!advertiser) {
            return NextResponse.json({ error: "Advertiser profile not found" }, { status: 404 });
        }

        const rentals = await prisma.staticRental.findMany({
            where: { advertiserId: advertiser.id },
            include: { panel: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(rentals);
    } catch (error) {
        console.error("Fetch rentals error:", error);
        return NextResponse.json(
            { error: "Failed to fetch rentals" },
            { status: 500 }
        );
    }
}
