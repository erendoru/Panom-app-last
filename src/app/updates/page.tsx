"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/PublicLayout";
import { Sparkles, Zap, BarChart3, Users, Settings } from "lucide-react";

interface Update {
    id: string;
    title: string;
    content: string;
    category: string;
    imageUrl?: string;
    createdAt: string;
}

const categories = [
    { label: "Hepsi", value: "Hepsi", icon: null },
    { label: "Kampanya Başlatma", value: "Kampanya Başlatma", icon: Zap },
    { label: "Erişilebilirlik", value: "Erişilebilirlik", icon: Users },
    { label: "Raporlama ve Analiz", value: "Raporlama ve Analiz", icon: BarChart3 },
    { label: "Genel", value: "Genel", icon: Settings },
];

export default function UpdatesPage() {
    const [updates, setUpdates] = useState<Update[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("Hepsi");

    useEffect(() => {
        const url = activeCategory === "Hepsi"
            ? "/api/updates"
            : `/api/updates?category=${encodeURIComponent(activeCategory)}`;

        setLoading(true);
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                // Ensure data is an array, otherwise use empty array
                setUpdates(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setUpdates([]);
                setLoading(false);
            });
    }, [activeCategory]);

    return (
        <PublicLayout activeLink="yenilikler">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Yenilikler</h1>
                    <p className="text-xl text-slate-400">
                        Yeni özellikler sizleri bekliyor 🎉 Güncellemelerimizi keşfedin ve deneyin.
                    </p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setActiveCategory(cat.value)}
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${activeCategory === cat.value
                                    ? "bg-blue-600 text-white"
                                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                                    }`}
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Updates List */}
                {loading ? (
                    <div className="text-center text-slate-400 py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Yükleniyor...
                    </div>
                ) : updates.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">✨</div>
                        <h3 className="text-xl font-bold mb-2">Henüz güncelleme yok</h3>
                        <p className="text-slate-400">Bu kategoride henüz güncelleme bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {updates.map((update) => (
                            <div
                                key={update.id}
                                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all"
                            >
                                {update.imageUrl && (
                                    <div className="aspect-video max-h-64 overflow-hidden">
                                        <img
                                            src={update.imageUrl}
                                            alt={update.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs font-medium px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                                                    {update.category}
                                                </span>
                                                <span className="text-slate-500 text-sm">
                                                    {new Date(update.createdAt).toLocaleDateString("tr-TR", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{update.title}</h3>
                                            <div
                                                className="text-slate-400 prose prose-invert prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: update.content }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
