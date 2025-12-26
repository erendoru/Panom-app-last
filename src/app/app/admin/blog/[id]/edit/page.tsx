"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function EditBlogPostPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        imageUrl: "",
        published: false,
    });

    useEffect(() => {
        fetch(`/api/blog/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData({
                    title: data.title || "",
                    slug: data.slug || "",
                    excerpt: data.excerpt || "",
                    content: data.content || "",
                    imageUrl: data.imageUrl || "",
                    published: data.published || false,
                });
                setFetching(false);
            })
            .catch(() => setFetching(false));
    }, [params.id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/blog/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/app/admin/blog");
            } else {
                const data = await res.json();
                alert(data.error || "Bir hata oluştu");
            }
        } catch (error) {
            alert("Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/app/admin/blog"
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Blog Yazısını Düzenle</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl">
                <div className="bg-white rounded-xl border p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Başlık *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Blog yazısının başlığı"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug *</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">/blog/</span>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="yazinin-url-adresi"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Özet</Label>
                        <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="Kısa bir özet"
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Kapak Görseli URL</Label>
                        <Input
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">İçerik * (HTML destekler)</Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Blog yazısının içeriği..."
                            rows={12}
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="published"
                            checked={formData.published}
                            onChange={(e) =>
                                setFormData({ ...formData, published: e.target.checked })
                            }
                            className="w-4 h-4 rounded border-slate-300"
                        />
                        <Label htmlFor="published" className="font-normal cursor-pointer">
                            Yayınla
                        </Label>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? "Kaydediliyor..." : "Güncelle"}
                        </Button>
                        <Link href="/app/admin/blog">
                            <Button type="button" variant="outline">
                                İptal
                            </Button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
