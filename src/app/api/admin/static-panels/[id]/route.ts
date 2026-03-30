import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Helper to check if user has admin access
function hasAdminAccess(session: any) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

// Helper to check if regional admin can access this panel
async function canAccessPanel(session: any, panelId: string): Promise<boolean> {
    if (!session.assignedCity) return true; // Full admin has access to all

    const panel = await prisma.staticPanel.findUnique({
        where: { id: panelId },
        select: { city: true }
    });

    return panel?.city === session.assignedCity;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        if (!session || !hasAdminAccess(session)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const panel = await prisma.staticPanel.findUnique({
            where: { id: params.id }
        });

        if (!panel) return NextResponse.json({ error: "Not found" }, { status: 404 });

        // Check if regional admin can access this panel
        if (session.assignedCity && panel.city !== session.assignedCity) {
            return NextResponse.json({ error: "Bu panoya erişim yetkiniz yok" }, { status: 403 });
        }

        return NextResponse.json(panel);
    } catch (error) {
        console.error("Fetch panel error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        if (!session || !hasAdminAccess(session)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if regional admin can access this panel
        if (session.assignedCity) {
            const canAccess = await canAccessPanel(session, params.id);
            if (!canAccess) {
                return NextResponse.json({ error: "Bu panoya erişim yetkiniz yok" }, { status: 403 });
            }
        }

        const body = await request.json();
        const {
            name, type, city, district, address, latitude, longitude,
            width, height, priceWeekly, imageUrl, active,
            locationType, socialGrade, avmName, isAVM, trafficLevel,
            priceDaily, minRentalDays
        } = body;

        // Regional admin cannot change city to a different city
        if (session.assignedCity && city !== session.assignedCity) {
            return NextResponse.json({ error: `Sadece ${session.assignedCity} iline ait panolar düzenleyebilirsiniz` }, { status: 403 });
        }

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
                priceDaily: priceDaily ? Number(priceDaily) : null,
                minRentalDays: minRentalDays ? Number(minRentalDays) : 7,
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
        if (!session || !hasAdminAccess(session)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.assignedCity) {
            const canAccess = await canAccessPanel(session, params.id);
            if (!canAccess) {
                return NextResponse.json({ error: "Bu panoya erişim yetkiniz yok" }, { status: 403 });
            }
        }

        const panel = await prisma.staticPanel.findUnique({
            where: { id: params.id },
            include: { rentals: { where: { status: "ACTIVE" } } }
        });

        if (!panel) {
            return NextResponse.json({ error: "Panel not found" }, { status: 404 });
        }

        if (panel.rentals.length > 0) {
            return NextResponse.json({ error: "Aktif kiralaması olan pano silinemez" }, { status: 400 });
        }

        await prisma.cartItem.deleteMany({ where: { panelId: params.id } });
        await prisma.orderItem.deleteMany({ where: { panelId: params.id } });
        await prisma.staticRental.deleteMany({ where: { panelId: params.id } });
        await prisma.staticPanel.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete panel error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
