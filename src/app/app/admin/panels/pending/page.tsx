import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Hourglass } from "lucide-react";
import { PANEL_TYPE_LABELS } from "@/lib/turkey-data";
import PendingReviewClient from "./PendingReviewClient";

export const dynamic = "force-dynamic";

export default async function AdminPendingPanelsPage() {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "REGIONAL_ADMIN")) {
        redirect("/");
    }

    const where: any = { reviewStatus: "PENDING" };
    if (session.assignedCity) where.city = session.assignedCity;

    const panels = await prisma.staticPanel.findMany({
        where,
        orderBy: { submittedAt: "desc" },
        include: {
            owner: {
                select: {
                    id: true,
                    companyName: true,
                    slug: true,
                    phone: true,
                    contactEmail: true,
                    user: { select: { email: true, name: true } },
                },
            },
        },
    });

    const items = panels.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        typeLabel: PANEL_TYPE_LABELS[p.type] || p.type,
        city: p.city,
        district: p.district,
        address: p.address,
        width: Number(p.width),
        height: Number(p.height),
        faceCount: p.faceCount,
        lighting: p.lighting || null,
        priceWeekly: Number(p.priceWeekly),
        priceDaily: p.priceDaily ? Number(p.priceDaily) : null,
        priceMonthly: p.priceMonthly ? Number(p.priceMonthly) : null,
        description: p.description,
        latitude: Number(p.latitude),
        longitude: Number(p.longitude),
        imageUrls: p.imageUrls?.length ? p.imageUrls : p.imageUrl ? [p.imageUrl] : [],
        nearbyTags: p.nearbyTags || [],
        estimatedDailyImpressions: p.estimatedDailyImpressions ?? 0,
        estimatedCpm: p.estimatedCpm ? Number(p.estimatedCpm) : null,
        submittedAt: p.submittedAt ? p.submittedAt.toISOString() : null,
        owner: p.owner
            ? {
                id: p.owner.id,
                companyName: p.owner.companyName,
                slug: p.owner.slug,
                phone: p.owner.phone,
                contactEmail: p.owner.contactEmail,
                email: p.owner.user?.email,
                name: p.owner.user?.name,
            }
            : null,
    }));

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <Link
                        href="/app/admin/panels"
                        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Pano Yönetimi
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2 flex items-center gap-2">
                        <Hourglass className="w-6 h-6 text-amber-500" />
                        Onay Bekleyen Panolar
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Medya sahipleri tarafından gönderilen ve admin onayı bekleyen panolar. Onayladığınızda
                        panobu.com&apos;un genel arama ve harita sayfalarında yayına alınır.
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                        Şu anda onay bekleyen pano yok.
                    </div>
                ) : (
                    <PendingReviewClient items={items} />
                )}
            </div>
        </div>
    );
}
