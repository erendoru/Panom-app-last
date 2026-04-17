import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { triggerTrafficComputeInBackground } from "@/lib/traffic/computeForPanel";

export const dynamic = "force-dynamic";

function parseDimension(value: string | number): number {
    if (typeof value === "number") return value;
    const str = String(value).toLowerCase().trim();
    if (str.endsWith("cm")) return parseFloat(str.replace("cm", "").trim()) / 100;
    if (str.endsWith("m")) return parseFloat(str.replace("m", "").trim());
    return parseFloat(str) || 0;
}

function num(value: unknown): number | null {
    if (value === null || value === undefined || value === "") return null;
    const n = parseFloat(String(value));
    return Number.isFinite(n) ? n : null;
}

async function getOwnerFromSession() {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) return null;
    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session.userId },
        select: {
            id: true,
            companyName: true,
            phone: true,
            user: { select: { name: true } },
        },
    });
    return owner;
}

export async function GET() {
    const owner = await getOwnerFromSession();
    if (!owner) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const panels = await prisma.staticPanel.findMany({
        where: { ownerId: owner.id },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ panels });
}

export async function POST(req: NextRequest) {
    const owner = await getOwnerFromSession();
    if (!owner) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const {
            name,
            type,
            subType,
            city,
            district,
            address,
            latitude,
            longitude,
            width,
            height,
            faceCount,
            lighting,
            priceWeekly,
            priceDaily,
            priceMonthly,
            estimatedDailyImpressions,
            estimatedCpm,
            nearbyTags,
            imageUrls,
            description,
            isStartingPrice,
        } = body;

        if (!name || !type || !city || !district || !address) {
            return NextResponse.json(
                { error: "Zorunlu alanlar: ad, tip, il, ilçe, adres" },
                { status: 400 }
            );
        }
        if (!latitude || !longitude) {
            return NextResponse.json(
                { error: "Haritadan konum seçmelisiniz" },
                { status: 400 }
            );
        }
        if (!width || !height) {
            return NextResponse.json(
                { error: "Genişlik ve yükseklik zorunlu" },
                { status: 400 }
            );
        }
        if (!Array.isArray(imageUrls) || imageUrls.length < 1) {
            return NextResponse.json(
                { error: "En az 1 fotoğraf yüklemelisiniz" },
                { status: 400 }
            );
        }
        if (imageUrls.length > 5) {
            return NextResponse.json(
                { error: "En fazla 5 fotoğraf yükleyebilirsiniz" },
                { status: 400 }
            );
        }
        if (!priceWeekly) {
            return NextResponse.json(
                { error: "Haftalık fiyat zorunlu" },
                { status: 400 }
            );
        }

        const ownerDisplayName = owner.companyName || owner.user?.name || "";

        const created = await prisma.staticPanel.create({
            data: {
                name: String(name).trim(),
                type,
                subType: subType || "",
                city,
                district,
                address,
                latitude: parseFloat(String(latitude)),
                longitude: parseFloat(String(longitude)),
                width: parseDimension(width),
                height: parseDimension(height),
                faceCount: faceCount ? parseInt(String(faceCount)) : 1,
                lighting: lighting || null,
                priceWeekly: num(priceWeekly) ?? 0,
                priceDaily: num(priceDaily) ?? 0,
                priceMonthly: num(priceMonthly),
                estimatedDailyImpressions: estimatedDailyImpressions
                    ? parseInt(String(estimatedDailyImpressions)) || 0
                    : 0,
                estimatedCpm: num(estimatedCpm),
                nearbyTags: Array.isArray(nearbyTags)
                    ? nearbyTags
                          .map((t: unknown) => String(t || "").trim())
                          .filter((t) => t.length > 0)
                          .slice(0, 30)
                    : [],
                imageUrl: imageUrls[0] || "",
                imageUrls,
                description: description || null,
                trafficLevel: "MEDIUM",
                blockedDates: [],
                isStartingPrice: Boolean(isStartingPrice),

                ownerId: owner.id,
                ownerName: ownerDisplayName,
                ownerPhone: owner.phone || null,
                active: false,
                reviewStatus: "PENDING",
                ownerStatus: "ACTIVE",
                submittedAt: new Date(),
            },
        });

        // T2: Yeni pano için arka planda trafik skoru hesapla
        if (created.latitude && created.longitude) {
            triggerTrafficComputeInBackground(created.id);
        }

        return NextResponse.json({ panel: created }, { status: 201 });
    } catch (error: any) {
        console.error("owner create panel error:", error);
        return NextResponse.json(
            { error: "Pano kaydedilemedi", details: error?.message },
            { status: 500 }
        );
    }
}
