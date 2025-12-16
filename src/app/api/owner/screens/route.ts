import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const createScreenSchema = z.object({
    name: z.string().min(3),
    city: z.string().min(2),
    district: z.string().min(2),
    address: z.string().min(5),
    latitude: z.number(),
    longitude: z.number(),
    resolutionWidth: z.number().int().positive(),
    resolutionHeight: z.number().int().positive(),
    orientation: z.enum(["LANDSCAPE", "PORTRAIT"]),
    basePricePerPlay: z.number().positive(),
    loopDurationSec: z.number().int().positive().default(60),
    slotDurationSec: z.number().int().positive().default(10),
});

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "SCREEN_OWNER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Convert string numbers to actual numbers if needed (though client should send numbers)
        // But safe parsing handles it if we use z.coerce
        const result = createScreenSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const data = result.data;

        // Get Owner Profile
        const owner = await prisma.screenOwner.findUnique({
            where: { userId: session.user.id },
        });

        if (!owner) {
            return NextResponse.json({ error: "Owner profile not found" }, { status: 404 });
        }

        // Calculate max plays per hour
        // e.g. 60s loop / 10s slot = 6 slots per loop. 60 mins / 1 min loop = 60 loops. 6 * 60 = 360 plays.
        // Or just: 3600 / slotDurationSec
        const maxPlaysPerHour = Math.floor(3600 / data.slotDurationSec);

        const screen = await prisma.screen.create({
            data: {
                ownerId: owner.id,
                name: data.name,
                city: data.city,
                district: data.district,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                resolutionWidth: data.resolutionWidth,
                resolutionHeight: data.resolutionHeight,
                orientation: data.orientation,
                basePricePerPlay: data.basePricePerPlay,
                loopDurationSec: data.loopDurationSec,
                slotDurationSec: data.slotDurationSec,
                maxPlaysPerHour,
                active: false, // Default to inactive until approved
            },
        });

        return NextResponse.json({ success: true, screen });
    } catch (error) {
        console.error("Create screen error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "SCREEN_OWNER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const owner = await prisma.screenOwner.findUnique({
            where: { userId: session.user.id },
        });

        if (!owner) {
            return NextResponse.json({ screens: [] });
        }

        const screens = await prisma.screen.findMany({
            where: { ownerId: owner.id },
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
