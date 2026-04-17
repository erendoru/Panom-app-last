"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import { Calendar, ArrowRight } from "lucide-react";
import { useAppLocale } from "@/contexts/LocaleContext";
import { blogListingCopy } from "@/messages/blogListing";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    imageUrl: string | null;
    createdAt: string;
}

export default function BlogPage() {
    const { locale } = useAppLocale();
    const t = blogListingCopy(locale);
    const dateLocale = locale === "en" ? "en-US" : "tr-TR";
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/blog")
            .then((res) => res.json())
            .then((data) => {
                // Ensure data is an array, otherwise use empty array
                setPosts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setPosts([]);
                setLoading(false);
            });
    }, []);

    return (
        <PublicLayout activeLink="blog">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.title}</h1>
                    <p className="text-xl text-slate-400">{t.subtitle}</p>
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="text-center text-slate-400 py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        {t.loading}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-bold mb-2">{t.emptyTitle}</h3>
                        <p className="text-slate-400">{t.emptyLead}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all"
                            >
                                {post.imageUrl && (
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(post.createdAt).toLocaleDateString(dateLocale, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                    <h2 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                                        {post.title}
                                    </h2>
                                    {post.excerpt && (
                                        <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                                        {t.readMore}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
