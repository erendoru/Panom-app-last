"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: string;
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            const res = await fetch("/api/blog?all=true");
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;

        try {
            await fetch(`/api/blog/${id}`, { method: "DELETE" });
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    }

    async function togglePublish(id: string, currentState: boolean) {
        try {
            await fetch(`/api/blog/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ published: !currentState }),
            });
            setPosts((prev) =>
                prev.map((p) => (p.id === id ? { ...p, published: !currentState } : p))
            );
        } catch (error) {
            console.error("Error updating post:", error);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Blog Yazıları</h1>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/app/admin/blog/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Yazı
                    </Link>
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Henüz blog yazısı yok
                    </h3>
                    <p className="text-slate-500 mb-4">İlk blog yazınızı oluşturun</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/app/admin/blog/new">
                            <Plus className="w-4 h-4 mr-2" />
                            Yeni Yazı
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
                                    Slug
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
                            {posts.map((post) => (
                                <tr key={post.id} className="border-b last:border-0 hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {post.title}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        /{post.slug}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${post.published
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {post.published ? (
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
                                        {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => togglePublish(post.id, post.published)}
                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title={post.published ? "Yayından Kaldır" : "Yayınla"}
                                            >
                                                {post.published ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                            <Link
                                                href={`/app/admin/blog/${post.id}/edit`}
                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
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
