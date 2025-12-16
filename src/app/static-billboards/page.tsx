import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import StaticBillboardsClient from "./client-page";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Klasik Panolar | Panobu",
    description: "İstanbul, Ankara, İzmir ve tüm Türkiye'deki kiralık billboard ve raketleri inceleyin. Harita üzerinden konum seçin ve hemen kiralayın.",
};

export default async function StaticBillboardsPage() {
    const panels = await prisma.staticPanel.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b py-4 shadow-sm z-10">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Ana Sayfa
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900">Klasik Panolar</h1>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
            </header>

            <StaticBillboardsClient panels={panels} />
        </div>
    );
}
