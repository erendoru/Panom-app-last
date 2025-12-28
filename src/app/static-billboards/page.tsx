import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import StaticBillboardsClient from "./client-page";
import { Suspense } from "react";
import HeaderCartIcon from "@/components/HeaderCartIcon";

import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Klasik Panolar | Panobu",
    description: "İstanbul, Ankara, İzmir ve tüm Türkiye'deki kiralık billboard ve raketleri inceleyin. Harita üzerinden konum seçin ve hemen kiralayın.",
};

function LoadingFallback() {
    return (
        <div className="flex-1 flex items-center justify-center bg-slate-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Yükleniyor...</p>
            </div>
        </div>
    );
}

export default async function StaticBillboardsPage() {
    // Initial load: Kocaeli only for faster page load
    // Other cities loaded on-demand via API
    const panels = await prisma.staticPanel.findMany({
        where: {
            active: true,
            city: "Kocaeli"
        },
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
                    <HeaderCartIcon />
                </div>
            </header>

            <Suspense fallback={<LoadingFallback />}>
                <StaticBillboardsClient panels={panels} />
            </Suspense>
        </div>
    );
}

