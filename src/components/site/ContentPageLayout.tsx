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
                <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{title}</h1>
                    {subtitle && <p className="text-xl text-neutral-600 mb-8">{subtitle}</p>}

                    <div className="prose prose-neutral max-w-none prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-strong:text-neutral-900 prose-li:text-neutral-600">
                        {children}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
