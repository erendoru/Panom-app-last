import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            include: {
                advertiserProfile: true,
                screenOwnerProfile: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            advertiserProfile: user.advertiserProfile,
            screenOwnerProfile: user.screenOwnerProfile,
        });
    } catch (error) {
        console.error("Profile GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, phone, companyName, billingInfo, taxId, address } = body;

        await prisma.user.update({
            where: { id: session.userId },
            data: {
                ...(name && { name }),
                ...(phone !== undefined && { phone }),
            },
        });

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
        });

        if (user?.role === "ADVERTISER") {
            await prisma.advertiser.upsert({
                where: { userId: session.userId },
                update: {
                    ...(companyName !== undefined && { companyName }),
                    ...(billingInfo !== undefined && { billingInfo }),
                },
                create: {
                    userId: session.userId,
                    companyName: companyName || null,
                    billingInfo: billingInfo || null,
                },
            });
        }

        if (user?.role === "SCREEN_OWNER") {
            await prisma.screenOwner.upsert({
                where: { userId: session.userId },
                update: {
                    ...(companyName !== undefined && { companyName }),
                    ...(taxId !== undefined && { taxId }),
                    ...(address !== undefined && { address }),
                },
                create: {
                    userId: session.userId,
                    companyName: companyName || "Belirtilmemiş",
                    taxId: taxId || null,
                    address: address || null,
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Profile PUT error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
