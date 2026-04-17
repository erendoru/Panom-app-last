import prisma from "@/lib/prisma";
import StaticBillboardsClient from "./client-page";
import { Suspense } from "react";
import StaticBillboardsShell, {
    StaticBillboardsSuspenseFallback,
} from "@/components/static-billboards/StaticBillboardsShell";

import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Klasik Panolar | Panobu",
    description:
        "İstanbul, Ankara, İzmir ve tüm Türkiye'deki kiralık billboard ve raketleri inceleyin. Harita üzerinden konum seçin ve hemen kiralayın.",
    alternates: { canonical: "https://panobu.com/static-billboards" },
    openGraph: {
        title: "Klasik Panolar | Panobu",
        description:
            "Türkiye genelinde binlerce billboard, CLP, raket ve megalight panonun envanteri. Harita üzerinden konum seçin, online kiralayın.",
        url: "https://panobu.com/static-billboards",
        type: "website",
    },
};

export default async function StaticBillboardsPage() {
    let panels: Array<Record<string, unknown>> = [];
    try {
        panels = await prisma.staticPanel.findMany({
            where: {
                active: true,
                reviewStatus: "APPROVED",
                ownerStatus: "ACTIVE",
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching panels:", error);
    }

    // JSON-LD ItemList (ilk 20 pano)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Türkiye Genelinde Kiralık Billboard ve Açık Hava Reklam Panoları",
        numberOfItems: panels.length,
        itemListElement: panels.slice(0, 20).map((p, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: (p.name as string) || "Panel",
            image: (p.imageUrl as string) || undefined,
        })),
    };

    return (
        <StaticBillboardsShell>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Suspense fallback={<StaticBillboardsSuspenseFallback />}>
                <StaticBillboardsClient panels={panels} />
            </Suspense>
        </StaticBillboardsShell>
    );
}
