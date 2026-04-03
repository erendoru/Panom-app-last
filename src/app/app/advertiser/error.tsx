"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AdvertiserError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Advertiser error:", error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-md w-full text-center">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Bir Hata Oluştu</h2>
                <p className="text-slate-500 mb-6">
                    Bu sayfa yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button onClick={reset} className="bg-blue-600 hover:bg-blue-700">
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Tekrar Dene
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/app/advertiser/dashboard">
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
