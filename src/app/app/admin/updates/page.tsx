"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Update {
    id: string;
    title: string;
    category: string;
    published: boolean;
    createdAt: string;
}

export default function AdminUpdatesPage() {
    const [updates, setUpdates] = useState<Update[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUpdates();
    }, []);

    async function fetchUpdates() {
        try {
            const res = await fetch("/api/updates?all=true");
            const data = await res.json();
            setUpdates(data);
        } catch (error) {
            console.error("Error fetching updates:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Bu güncellemeyi silmek istediğinize emin misiniz?")) return;

        try {
            await fetch(`/api/updates/${id}`, { method: "DELETE" });
            setUpdates((prev) => prev.filter((u) => u.id !== id));
        } catch (error) {
            console.error("Error deleting update:", error);
        }
    }

    async function togglePublish(id: string, currentState: boolean) {
        try {
            await fetch(`/api/updates/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ published: !currentState }),
            });
            setUpdates((prev) =>
                prev.map((u) => (u.id === id ? { ...u, published: !currentState } : u))
            );
        } catch (error) {
            console.error("Error updating:", error);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Yenilikler</h1>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/app/admin/updates/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Güncelleme
                    </Link>
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                </div>
            ) : updates.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border">
                    <div className="text-4xl mb-4">✨</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Henüz güncelleme yok
                    </h3>
                    <p className="text-slate-500 mb-4">İlk site güncellemesini ekleyin</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/app/admin/updates/new">
                            <Plus className="w-4 h-4 mr-2" />
                            Yeni Güncelleme
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                    Başlık
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                    Kategori
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                    Durum
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                    Tarih
                                </th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {updates.map((update) => (
                                <tr key={update.id} className="border-b last:border-0 hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {update.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                            {update.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${update.published
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {update.published ? (
                                                <>
                                                    <Eye className="w-3 h-3" />
                                                    Yayında
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="w-3 h-3" />
                                                    Taslak
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {new Date(update.createdAt).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => togglePublish(update.id, update.published)}
                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title={update.published ? "Yayından Kaldır" : "Yayınla"}
                                            >
                                                {update.published ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                            <Link
                                                href={`/app/admin/updates/${update.id}/edit`}
                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(update.id)}
                                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
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
