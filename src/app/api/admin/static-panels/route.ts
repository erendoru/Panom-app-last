import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Helper to check if user has admin access
function hasAdminAccess(session: any) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !hasAdminAccess(session)) {
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

        // Regional admin can only add panels to their assigned city
        if (session.assignedCity && city !== session.assignedCity) {
            return NextResponse.json(
                { error: `Sadece ${session.assignedCity} iline pano ekleyebilirsiniz` },
                { status: 403 }
            );
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
        if (!session || !hasAdminAccess(session)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Filter by assigned city for regional admins
        const whereClause = session.assignedCity
            ? { city: session.assignedCity }
            : {};

        const panels = await prisma.staticPanel.findMany({
            where: whereClause,
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
