"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import { Calendar, ArrowLeft } from "lucide-react";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    imageUrl: string | null;
    createdAt: string;
}

export default function BlogPostPage() {
    const params = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(`/api/blog/${params.slug}`)
            .then((res) => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then((data) => {
                setPost(data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [params.slug]);

    if (loading) {
        return (
            <PublicLayout activeLink="blog">
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    Yükleniyor...
                </div>
            </PublicLayout>
        );
    }

    if (error || !post) {
        return (
            <PublicLayout activeLink="blog">
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="text-6xl mb-4">😔</div>
                    <h1 className="text-2xl font-bold mb-4">Yazı bulunamadı</h1>
                    <Link href="/blog" className="text-blue-400 hover:underline">
                        ← Blog'a dön
                    </Link>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout activeLink="blog">
            <article className="container mx-auto px-4 py-16 max-w-4xl">
                {/* Back Link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Blog'a dön
                </Link>

                {/* Hero Image */}
                {post.imageUrl && (
                    <div className="aspect-video rounded-2xl overflow-hidden mb-8">
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold">{post.title}</h1>
                </header>

                {/* Content */}
                <div
                    className="prose prose-invert prose-lg max-w-none 
                        prose-headings:text-white prose-headings:font-bold prose-headings:mt-10 prose-headings:mb-4
                        prose-h2:text-2xl prose-h3:text-xl
                        prose-p:text-slate-300 prose-p:leading-8 prose-p:mb-6
                        prose-strong:text-white prose-strong:font-semibold
                        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                        prose-li:text-slate-300 prose-li:leading-7
                        prose-ul:my-6 prose-ol:my-6
                        prose-blockquote:border-l-blue-500 prose-blockquote:bg-slate-800/50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
        </PublicLayout>
    );
}
