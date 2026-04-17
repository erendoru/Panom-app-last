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
};

export default async function StaticBillboardsPage() {
    let panels: any[] = [];
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

    return (
        <StaticBillboardsShell>
            <Suspense fallback={<StaticBillboardsSuspenseFallback />}>
                <StaticBillboardsClient panels={panels} />
            </Suspense>
        </StaticBillboardsShell>
    );
}
