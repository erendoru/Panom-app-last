"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Bir Hata Oluştu</h2>
                    <p className="text-slate-400">
                        Beklenmeyen bir hata meydana geldi. Lütfen tekrar deneyin veya ana sayfaya dönün.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} className="bg-blue-600 hover:bg-blue-700">
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Tekrar Dene
                    </Button>
                    <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Link href="/">
                            <Home className="w-4 h-4 mr-2" />
                            Ana Sayfa
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
