"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import HeaderCartIcon from "@/components/HeaderCartIcon";
import { useAppLocale } from "@/contexts/LocaleContext";
import { staticBillboardsCopy } from "@/messages/staticBillboards";

export function StaticBillboardsSuspenseFallback() {
    const { locale } = useAppLocale();
    const s = staticBillboardsCopy(locale);
    return (
        <div className="flex-1 flex items-center justify-center bg-slate-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-slate-600">{s.loading}</p>
            </div>
        </div>
    );
}

export default function StaticBillboardsShell({ children }: { children: ReactNode }) {
    const { locale } = useAppLocale();
    const s = staticBillboardsCopy(locale);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b shadow-sm z-10">
                <div className="container mx-auto px-4 flex justify-between items-center min-h-0 h-14">
                    <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {s.backHome}
                    </Link>
                    <h1 className="text-lg font-bold text-slate-900">{s.pageTitle}</h1>
                    <HeaderCartIcon />
                </div>
            </header>

            {children}
        </div>
    );
}
