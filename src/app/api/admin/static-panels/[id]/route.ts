import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const panel = await prisma.staticPanel.findUnique({
            where: { id: params.id }
        });

        if (!panel) return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json(panel);
    } catch (error) {
        console.error("Fetch panel error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            name, type, city, district, address, latitude, longitude,
            width, height, priceWeekly, imageUrl, active,
            locationType, socialGrade, avmName, isAVM, trafficLevel
        } = body;

        const panel = await prisma.staticPanel.update({
            where: { id: params.id },
            data: {
                name,
                type,
                city,
                district,
                address,
                latitude: Number(latitude),
                longitude: Number(longitude),
                width: Number(width),
                height: Number(height),
                priceWeekly: Number(priceWeekly),
                imageUrl,
                active,
                locationType,
                socialGrade,
                avmName,
                isAVM,
                trafficLevel
            }
        });

        return NextResponse.json(panel);
    } catch (error) {
        console.error("Update panel error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.staticPanel.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete panel error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
