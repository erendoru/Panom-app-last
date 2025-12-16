"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createScreen(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        return { error: "Yetkisiz işlem." };
    }

    // Get Admin's ScreenOwner Profile
    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session.userId },
    });

    if (!owner) {
        return { error: "ScreenOwner profili bulunamadı." };
    }

    try {
        const name = formData.get("name") as string;
        const city = formData.get("city") as string;
        const district = formData.get("district") as string;
        const address = formData.get("address") as string;

        const lat = parseFloat(formData.get("latitude") as string);
        const lng = parseFloat(formData.get("longitude") as string);
        const width = parseInt(formData.get("resolutionWidth") as string);
        const height = parseInt(formData.get("resolutionHeight") as string);
        const basePrice = parseFloat(formData.get("basePricePerPlay") as string);

        await prisma.screen.create({
            data: {
                ownerId: owner.id,
                name,
                city,
                district,
                address,
                latitude: lat,
                longitude: lng,
                resolutionWidth: width,
                resolutionHeight: height,
                basePricePerPlay: basePrice,
                orientation: width > height ? "Landscape" : "Portrait",
                active: true, // Auto-activate admin added screens
                maxPlaysPerHour: 360, // Default assume 10s slots = 360 per hour
            },
        });

        revalidatePath("/app/admin/screens");
        return { success: true };
    } catch (e) {
        console.error("Screen create error:", e);
        return { error: "Veritabanı hatası." };
    }
}
