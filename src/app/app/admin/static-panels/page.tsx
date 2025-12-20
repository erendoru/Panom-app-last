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

    if (loading) return <div className="p-4 md:p-8">Yükleniyor...</div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Klasik Panolar</h1>
                    <p className="text-slate-500 text-sm md:text-base">Platformdaki tüm statik billboardları yönetin.</p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                    <Link href="/app/admin/static-panels/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Pano Ekle
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                {/* Desktop Table */}
                <table className="hidden md:table w-full text-left text-sm">
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

                {/* Mobile Cards */}
                <div className="md:hidden divide-y">
                    {panels.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            Henüz hiç pano eklenmemiş.
                        </div>
                    ) : (
                        panels.map((panel) => (
                            <Link
                                key={panel.id}
                                href={`/app/admin/static-panels/${panel.id}`}
                                className="block p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex gap-4">
                                    <div className="w-20 h-14 rounded bg-slate-200 overflow-hidden flex-shrink-0">
                                        {panel.imageUrl && (
                                            <img src={panel.imageUrl} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-slate-900 truncate">{panel.name}</h3>
                                        <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                                            <MapPin className="w-3 h-3" />
                                            {panel.district}, {panel.city}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold border border-blue-100">
                                                {panel.type}
                                            </span>
                                            {panel.active ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                                    Pasif
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-semibold text-slate-900">{formatCurrency(Number(panel.priceWeekly))}</p>
                                        <p className="text-xs text-slate-500">/ hafta</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
