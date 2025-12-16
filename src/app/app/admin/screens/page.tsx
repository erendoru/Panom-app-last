import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Monitor, MapPin } from "lucide-react";

export const metadata = {
    title: "Ekranlar | Panobu Admin",
};

export default async function AdminScreensPage() {
    const screens = await prisma.screen.findMany({
        include: {
            owner: {
                include: {
                    user: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dijital Ekranlar</h1>
                    <p className="text-slate-500 text-sm mt-1">Sistemdeki tüm dijital ekranların listesi</p>
                </div>
                <Link href="/app/admin/screens/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Ekran Ekle
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Ekran Adı</th>
                                <th className="px-6 py-4">Konum</th>
                                <th className="px-6 py-4">Çözünürlük</th>
                                <th className="px-6 py-4">Sahibi</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4">Oluşturulma</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {screens.map((screen) => (
                                <tr key={screen.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                                                <Monitor className="w-5 h-5" />
                                            </div>
                                            {screen.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-slate-400" />
                                            {screen.city}, {screen.district}
                                        </div>
                                        <div className="text-xs text-slate-400 pl-4">{screen.address}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {screen.resolutionWidth}x{screen.resolutionHeight} px
                                        <span className="block text-xs text-slate-400">{screen.orientation}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {screen.owner?.companyName || screen.owner?.user?.name || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${screen.active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {screen.active ? "Aktif" : "Pasif"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {format(new Date(screen.createdAt), "d MMM yyyy", {
                                            locale: tr,
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {/* Actions dropdown could go here */}
                                    </td>
                                </tr>
                            ))}
                            {screens.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <Monitor className="w-6 h-6" />
                                            </div>
                                            <p>Henüz kayıtlı dijital ekran bulunmuyor.</p>
                                            <Link href="/app/admin/screens/new">
                                                <Button variant="outline" size="sm">İlk Ekranı Ekle</Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
