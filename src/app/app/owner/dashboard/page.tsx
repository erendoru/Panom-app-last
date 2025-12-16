import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, TrendingUp, Users, Activity } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function OwnerDashboard() {
    const session = await getSession();

    // Fetch real data
    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session?.user.id },
        include: {
            screens: true,
            _count: {
                select: { screens: true }
            }
        }
    });

    const activeScreens = owner?.screens.filter(s => s.active).length || 0;
    const totalScreens = owner?._count.screens || 0;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Hoşgeldiniz, {session?.name}</h1>
                <p className="text-slate-500 mt-2">Ekranlarınızın durumunu buradan takip edebilirsiniz.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Ekran</CardTitle>
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalScreens}</div>
                        <p className="text-xs text-muted-foreground">
                            {activeScreens} aktif ekran
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aktif Kampanyalar</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            Şu an yayında
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bu Ayki Kazanç</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₺0.00</div>
                        <p className="text-xs text-muted-foreground">
                            Geçen aya göre +%0
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Gösterim</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            Son 30 gün
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle>Son Hareketler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-slate-500 text-center py-8">
                        Henüz bir hareket yok.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
