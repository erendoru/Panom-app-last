"use client";

import Link from "next/link";
import { ArrowLeft, ChevronDown, Mail } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { useAppLocale } from "@/contexts/LocaleContext";
import { faqPageCopy } from "@/messages/faqContent";

export default function FAQPage() {
    const { locale } = useAppLocale();
    const s = faqPageCopy(locale);

    return (
        <PublicLayout>
            <div className="min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-white mb-4">{s.title}</h1>
                        <p className="text-xl text-slate-300">{s.subtitle}</p>
                    </div>

                    <div className="space-y-4">
                        {s.items.map((item, index) => (
                            <details
                                key={index}
                                className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                            >
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <h3 className="text-lg font-medium text-white pr-4">{item.question}</h3>
                                    <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="px-6 pb-6">
                                    <p className="text-slate-300 leading-relaxed">{item.answer}</p>
                                </div>
                            </details>
                        ))}
                    </div>

                    <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">{s.contactTitle}</h2>
                        <p className="text-slate-300 mb-6">{s.contactLead}</p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <a
                                href="mailto:destek@panobu.com"
                                className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                                <span>destek@panobu.com</span>
                            </a>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            href="/static-billboards"
                            className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {s.exploreFaces}
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
