import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Monitor } from "lucide-react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";

export default async function ScreensPage() {
    const session = await getSession();

    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session?.user.id },
    });

    const screens = await prisma.screen.findMany({
        where: { ownerId: owner?.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Ekranlarım</h1>
                    <p className="text-slate-500 mt-1">Sisteme kayıtlı ekranlarınızı yönetin.</p>
                </div>
                <Link href="/app/owner/screens/new">
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Yeni Ekran Ekle
                    </Button>
                </Link>
            </div>

            {screens.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <Monitor className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">Henüz ekran eklemediniz</h3>
                    <p className="text-slate-500 mb-6">İlk ekranınızı ekleyerek kazanmaya başlayın.</p>
                    <Link href="/app/owner/screens/new">
                        <Button variant="outline">Ekran Ekle</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {screens.map((screen) => (
                        <div
                            key={screen.id}
                            className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                                {screen.previewImageUrl ? (
                                    <img src={screen.previewImageUrl} alt={screen.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Monitor className="w-12 h-12 text-slate-300" />
                                )}
                                <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${screen.active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {screen.active ? "Yayında" : "Onay Bekliyor"}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg mb-1">{screen.name}</h3>
                                <div className="flex items-center text-slate-500 text-sm mb-4">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {screen.district}, {screen.city}
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                    <div>
                                        <span className="text-slate-400 block text-xs">Çözünürlük</span>
                                        {screen.resolutionWidth}x{screen.resolutionHeight}
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-xs">Fiyat</span>
                                        {formatCurrency(Number(screen.basePricePerPlay))} / play
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" className="w-full text-xs h-8">Düzenle</Button>
                                    <Button variant="outline" className="w-full text-xs h-8">Takvim</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
