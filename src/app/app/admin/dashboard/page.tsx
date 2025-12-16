import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Check, X } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminDashboard() {
    // Fetch pending items
    const pendingScreens = await prisma.screen.findMany({
        where: { active: false },
        include: { owner: true },
        orderBy: { createdAt: "desc" },
    });

    const pendingCampaigns = await prisma.campaign.findMany({
        where: { status: "PENDING_APPROVAL" },
        include: { advertiser: true },
        orderBy: { createdAt: "desc" },
    });

    async function approveScreen(id: string) {
        "use server";
        await prisma.screen.update({ where: { id }, data: { active: true } });
        revalidatePath("/app/admin/dashboard");
    }

    async function approveCampaign(id: string) {
        "use server";
        await prisma.campaign.update({ where: { id }, data: { status: "ACTIVE" } });
        revalidatePath("/app/admin/dashboard");
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Onay Bekleyen İşlemler</h1>

            <div className="grid gap-8">
                {/* Pending Campaigns */}
                <Card>
                    <CardHeader>
                        <CardTitle>Kampanya Onayları ({pendingCampaigns.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pendingCampaigns.length === 0 ? (
                            <p className="text-slate-500">Bekleyen kampanya yok.</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingCampaigns.map(campaign => (
                                    <div key={campaign.id} className="flex items-center justify-between border p-4 rounded-lg">
                                        <div>
                                            <h4 className="font-bold">{campaign.name}</h4>
                                            <p className="text-sm text-slate-500">{campaign.brandName} - {Number(campaign.totalBudget)} ₺</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <form action={approveCampaign.bind(null, campaign.id)}>
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                    <Check className="w-4 h-4 mr-1" /> Onayla
                                                </Button>
                                            </form>
                                            <Button size="sm" variant="destructive">
                                                <X className="w-4 h-4 mr-1" /> Reddet
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pending Screens */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ekran Onayları ({pendingScreens.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pendingScreens.length === 0 ? (
                            <p className="text-slate-500">Bekleyen ekran yok.</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingScreens.map(screen => (
                                    <div key={screen.id} className="flex items-center justify-between border p-4 rounded-lg">
                                        <div>
                                            <h4 className="font-bold">{screen.name}</h4>
                                            <p className="text-sm text-slate-500">{screen.city}, {screen.district} - {screen.owner.companyName}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <form action={approveScreen.bind(null, screen.id)}>
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                    <Check className="w-4 h-4 mr-1" /> Onayla
                                                </Button>
                                            </form>
                                            <Button size="sm" variant="destructive">
                                                <X className="w-4 h-4 mr-1" /> Reddet
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
