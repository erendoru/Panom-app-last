"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Plus, MapPin } from "lucide-react";

export default function AdminStaticPanelsPage() {
    const [panels, setPanels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/static-panels")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setPanels(data);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8">Yükleniyor...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Klasik Panolar</h1>
                    <p className="text-slate-500">Platformdaki tüm statik billboardları yönetin.</p>
                </div>
                <Button asChild>
                    <Link href="/app/admin/static-panels/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Pano Ekle
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-slate-500">Görsel</th>
                            <th className="p-4 font-medium text-slate-500">Pano Adı</th>
                            <th className="p-4 font-medium text-slate-500">Tür</th>
                            <th className="p-4 font-medium text-slate-500">Konum</th>
                            <th className="p-4 font-medium text-slate-500">Boyut</th>
                            <th className="p-4 font-medium text-slate-500">Fiyat (Haftalık)</th>
                            <th className="p-4 font-medium text-slate-500">Durum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {panels.map((panel) => (
                            <tr key={panel.id} className="hover:bg-slate-50 group">
                                <td className="p-4">
                                    <div className="w-16 h-10 rounded bg-slate-200 overflow-hidden">
                                        {panel.imageUrl && (
                                            <img src={panel.imageUrl} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-medium">
                                    <Link href={`/app/admin/static-panels/${panel.id}`} className="hover:text-blue-600 hover:underline">
                                        {panel.name}
                                    </Link>
                                </td>
                                <td className="p-4">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold border border-blue-100">
                                        {panel.type}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {panel.district}, {panel.city}
                                    </div>
                                </td>
                                <td className="p-4 text-slate-500">{Number(panel.width)}m x {Number(panel.height)}m</td>
                                <td className="p-4 font-medium">{formatCurrency(Number(panel.priceWeekly))}</td>
                                <td className="p-4">
                                    {panel.active ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                            Pasif
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <Link href={`/app/admin/static-panels/${panel.id}`}>
                                        <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            Düzenle
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {panels.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-slate-500">
                                    Henüz hiç pano eklenmemiş.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
