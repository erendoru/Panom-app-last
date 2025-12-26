"use client";

import PublicLayout from "@/components/PublicLayout";

interface ContentPageProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export default function ContentPageLayout({ title, subtitle, children }: ContentPageProps) {
    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h1>
                    {subtitle && <p className="text-xl text-slate-400 mb-8">{subtitle}</p>}

                    <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-li:text-slate-300">
                        {children}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
