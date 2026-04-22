import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get("city");

        // V2: Çevre (POI) filtreleri — reklamverenin hedef kitle yakınında pano bulması için
        // nearCategory: virgülle ayrılmış kategori listesi ("SUPERMARKET,CAFE")
        // withinM: mesafe eşiği (metre) — default 300
        // includeBrand: virgülle ayrılmış marka kodları ("MIGROS,BIM")
        // excludeBrand: virgülle ayrılmış hariç tutulacak markalar
        // nearMode: "any" (herhangi biri) | "all" (hepsi) — default "any"
        const nearCategoryRaw = searchParams.get("nearCategory");
        const withinMRaw = searchParams.get("withinM");
        const includeBrandRaw = searchParams.get("includeBrand");
        const excludeBrandRaw = searchParams.get("excludeBrand");
        const nearMode = (searchParams.get("nearMode") || "any").toLowerCase();

        const nearCategories = nearCategoryRaw
            ? nearCategoryRaw.split(",").map((s) => s.trim()).filter(Boolean)
            : [];
        const includeBrands = includeBrandRaw
            ? includeBrandRaw.split(",").map((s) => s.trim()).filter(Boolean)
            : [];
        const excludeBrands = excludeBrandRaw
            ? excludeBrandRaw.split(",").map((s) => s.trim()).filter(Boolean)
            : [];
        const withinM = Math.max(
            50,
            Math.min(2000, Number(withinMRaw) > 0 ? Number(withinMRaw) : 300),
        );

        const where: any = {
            active: true,
            reviewStatus: "APPROVED",
            ownerStatus: "ACTIVE",
        };

        if (city && city !== "Tümü") {
            where.city = city;
        }

        // Çevre filtreleri — PanelPoi üzerinden where koşulları
        const envClauses: any[] = [];

        if (nearCategories.length > 0) {
            if (nearMode === "all") {
                // Hepsi şart: her kategori için ayrı AND some(...)
                for (const cat of nearCategories) {
                    envClauses.push({
                        panelPois: {
                            some: {
                                distance: { lte: withinM },
                                poi: { category: cat },
                            },
                        },
                    });
                }
            } else {
                // Herhangi biri: tek some(... category IN [...])
                envClauses.push({
                    panelPois: {
                        some: {
                            distance: { lte: withinM },
                            poi: { category: { in: nearCategories } },
                        },
                    },
                });
            }
        }

        if (includeBrands.length > 0) {
            envClauses.push({
                panelPois: {
                    some: {
                        distance: { lte: withinM },
                        poi: { brand: { in: includeBrands } },
                    },
                },
            });
        }

        if (excludeBrands.length > 0) {
            envClauses.push({
                panelPois: {
                    none: {
                        distance: { lte: withinM },
                        poi: { brand: { in: excludeBrands } },
                    },
                },
            });
        }

        if (envClauses.length > 0) {
            where.AND = envClauses;
        }

        const panels = await prisma.staticPanel.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                type: true,
                city: true,
                district: true,
                latitude: true,
                longitude: true,
                width: true,
                height: true,
                priceDaily: true,
                priceWeekly: true,
                imageUrl: true,
                isAVM: true,
                trafficLevel: true,
                socialGrade: true,
                locationType: true,
                // T2: Trafik verileri
                trafficScore: true,
                roadType: true,
                estimatedDailyImpressions: true,
                estimatedWeeklyImpressions: true,
                estimatedCpm: true,
                // V1: POI özeti
                nearbyPoiCount: true,
                poiEnrichedAt: true,
            }
        });

        return NextResponse.json({
            panels,
            count: panels.length,
            appliedFilters: {
                nearCategories,
                withinM,
                includeBrands,
                excludeBrands,
                nearMode,
            },
        });
    } catch (error) {
        console.error("Error fetching panels:", error);
        return NextResponse.json(
            { error: "Failed to fetch panels" },
            { status: 500 }
        );
    }
}
