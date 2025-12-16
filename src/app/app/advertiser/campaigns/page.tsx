import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";

export default async function CampaignsPage() {
    const session = await getSession();

    const advertiser = await prisma.advertiser.findUnique({
        where: { userId: session?.user.id },
    });

    const campaigns = await prisma.campaign.findMany({
        where: { advertiserId: advertiser?.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { campaignScreens: true }
            }
        }
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Kampanyalarım</h1>
                    <p className="text-slate-500 mt-1">Tüm reklam kampanyalarınızı buradan yönetin.</p>
                </div>
                <Link href="/app/advertiser/campaigns/new">
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Yeni Kampanya
                    </Button>
                </Link>
            </div>

            {campaigns.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">Henüz kampanya yok</h3>
                    <p className="text-slate-500 mb-6">İlk kampanyanızı oluşturarak hedef kitlenize ulaşın.</p>
                    <Link href="/app/advertiser/campaigns/new">
                        <Button>Kampanya Oluştur</Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium text-slate-700">Kampanya Adı</th>
                                <th className="px-6 py-4 font-medium text-slate-700">Marka</th>
                                <th className="px-6 py-4 font-medium text-slate-700">Durum</th>
                                <th className="px-6 py-4 font-medium text-slate-700">Ekran Sayısı</th>
                                <th className="px-6 py-4 font-medium text-slate-700">Bütçe</th>
                                <th className="px-6 py-4 font-medium text-slate-700">Tarih</th>
                                <th className="px-6 py-4 font-medium text-slate-700"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {campaigns.map((campaign) => (
                                <tr key={campaign.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{campaign.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{campaign.brandName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                            campaign.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-slate-100 text-slate-700'
                                            }`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{campaign._count.campaignScreens}</td>
                                    <td className="px-6 py-4 text-slate-600">{formatCurrency(Number(campaign.totalBudget))}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(campaign.startDate).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/app/advertiser/campaigns/${campaign.id}`} className="text-blue-600 hover:underline">
                                            Detay
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
