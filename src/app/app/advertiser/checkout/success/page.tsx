"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Confetti from "@/components/site/Confetti";
import { Suspense } from "react";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get("transactionId");

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <Confetti />
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold mb-4 text-slate-900">Ödemeniz Başarılı!</h1>
            <p className="text-xl text-slate-600 mb-8 max-w-lg">
                Siparişiniz alınmıştır. İşlem numaranız: <span className="font-mono text-slate-900">{transactionId}</span>
            </p>

            <div className="bg-slate-50 p-6 rounded-xl max-w-lg w-full mb-8 border border-slate-200">
                <h3 className="font-bold mb-2">Bundan Sonra Ne Olacak?</h3>
                <ul className="text-left space-y-3 text-slate-600 text-sm">
                    <li className="flex gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                        Ekibimiz reklam görsellerinizi ve kampanya detaylarınızı inceleyecek.
                    </li>
                    <li className="flex gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                        Onaylandığında size e-posta ile bilgi verilecek.
                    </li>
                    <li className="flex gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</span>
                        Seçtiğiniz tarihte reklamınız yayınlanmaya başlayacak!
                    </li>
                </ul>
            </div>

            <div className="flex gap-4">
                <Button asChild size="lg" variant="outline">
                    <Link href="/app/advertiser/dashboard">Panele Dön</Link>
                </Button>
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/app/advertiser/campaigns">Kampanyalarım</Link>
                </Button>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Yükleniyor...</div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}
