import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Monitor, DollarSign, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface CampaignDetailProps {
    params: { id: string };
}

export default async function CampaignDetailPage({ params }: CampaignDetailProps) {
    const session = await getSession();

    if (!session || !session.userId) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-slate-500">Giriş yapmanız gerekiyor.</p>
            </div>
        );
    }

    const advertiser = await prisma.advertiser.findUnique({
        where: { userId: session.userId },
    });

    if (!advertiser) {
        return notFound();
    }

    const campaign = await prisma.campaign.findFirst({
        where: {
            id: params.id,
            advertiserId: advertiser.id,
        },
        include: {
            creatives: true,
            campaignScreens: {
                include: { screen: true },
            },
            transactions: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!campaign) {
        return notFound();
    }

    const statusLabels: Record<string, { label: string; color: string }> = {
        DRAFT: { label: "Taslak", color: "bg-slate-100 text-slate-700" },
        PENDING_APPROVAL: { label: "Onay Bekliyor", color: "bg-yellow-100 text-yellow-700" },
        ACTIVE: { label: "Aktif", color: "bg-green-100 text-green-700" },
        PAUSED: { label: "Duraklatıldı", color: "bg-orange-100 text-orange-700" },
        COMPLETED: { label: "Tamamlandı", color: "bg-blue-100 text-blue-700" },
        REJECTED: { label: "Reddedildi", color: "bg-red-100 text-red-700" },
    };

    const status = statusLabels[campaign.status] || statusLabels.DRAFT;

    return (
        <div>
            <div className="mb-6">
                <Link href="/app/advertiser/campaigns">
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kampanyalara Dön
                    </Button>
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{campaign.name}</h1>
                        <p className="text-slate-500 mt-1">{campaign.brandName}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                        {status.label}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl border p-5">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                        <DollarSign className="w-4 h-4" /> Bütçe
                    </div>
                    <p className="text-xl font-bold">{formatCurrency(Number(campaign.totalBudget))}</p>
                </div>

                <div className="bg-white rounded-xl border p-5">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                        <Monitor className="w-4 h-4" /> Ekranlar
                    </div>
                    <p className="text-xl font-bold">{campaign.campaignScreens.length}</p>
                </div>

                <div className="bg-white rounded-xl border p-5">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                        <Calendar className="w-4 h-4" /> Başlangıç
                    </div>
                    <p className="text-xl font-bold">
                        {new Date(campaign.startDate).toLocaleDateString("tr-TR")}
                    </p>
                </div>

                <div className="bg-white rounded-xl border p-5">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                        <Calendar className="w-4 h-4" /> Bitiş
                    </div>
                    <p className="text-xl font-bold">
                        {new Date(campaign.endDate).toLocaleDateString("tr-TR")}
                    </p>
                </div>
            </div>

            {/* Screens */}
            {campaign.campaignScreens.length > 0 && (
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b bg-slate-50">
                        <h2 className="font-semibold text-slate-900">Ekranlar</h2>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-slate-700">Ekran</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Konum</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Oynatma Sayısı</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Birim Fiyat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {campaign.campaignScreens.map((cs) => (
                                <tr key={cs.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{cs.screen.name}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {cs.screen.city}, {cs.screen.district}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{cs.allocatedPlays}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {formatCurrency(Number(cs.pricePerPlay))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Creatives */}
            {campaign.creatives.length > 0 && (
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b bg-slate-50">
                        <h2 className="font-semibold text-slate-900">Kreatifler</h2>
                    </div>
                    <div className="p-6 space-y-3">
                        {campaign.creatives.map((creative) => (
                            <div
                                key={creative.id}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                            >
                                <div>
                                    <p className="font-medium text-slate-900">
                                        {creative.type} - {creative.width}x{creative.height}
                                    </p>
                                    <a
                                        href={creative.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Dosyayı Görüntüle
                                    </a>
                                </div>
                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                        creative.status === "APPROVED"
                                            ? "bg-green-100 text-green-700"
                                            : creative.status === "REJECTED"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {creative.status === "APPROVED"
                                        ? "Onaylandı"
                                        : creative.status === "REJECTED"
                                        ? "Reddedildi"
                                        : "Onay Bekliyor"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Transactions */}
            {campaign.transactions.length > 0 && (
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b bg-slate-50">
                        <h2 className="font-semibold text-slate-900">Ödeme İşlemleri</h2>
                    </div>
                    <div className="p-6 space-y-3">
                        {campaign.transactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    {tx.status === "COMPLETED" || tx.status === "SUCCESS" ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    ) : tx.status === "PENDING" ? (
                                        <Clock className="w-5 h-5 text-yellow-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {formatCurrency(Number(tx.amount))}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(tx.createdAt).toLocaleDateString("tr-TR")} - {tx.provider}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                        tx.status === "COMPLETED" || tx.status === "SUCCESS"
                                            ? "bg-green-100 text-green-700"
                                            : tx.status === "PENDING"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {tx.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
