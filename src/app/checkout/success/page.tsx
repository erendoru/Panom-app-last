"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, HelpCircle } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("order") || "";

    return (
        <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center py-12">
            <div className="max-w-lg w-full mx-auto px-4 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">Ödeme Başarılı!</h1>

                {orderNumber && (
                    <p className="text-lg text-slate-400 mb-6">
                        Sipariş No: <span className="font-semibold text-blue-400">{orderNumber}</span>
                    </p>
                )}

                <div className="bg-white/[0.05] border border-white/10 rounded-xl p-6 mb-6 text-left">
                    <h3 className="font-semibold text-white mb-2">Sonraki Adımlar</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li>1. Ekibimiz siparişinizi inceleyecek</li>
                        <li>2. Detaylar için sizi arayacağız</li>
                        <li>3. Panolara yerleştirme yapılacak</li>
                        <li>4. Fotoğraflar e-posta ile iletilecek</li>
                    </ul>
                </div>

                <div className="bg-white/[0.05] border border-white/10 rounded-xl p-4 mb-8">
                    <p className="text-slate-400 text-sm">
                        Sorularınız için:{" "}
                        <a href="mailto:destek@panobu.com" className="text-blue-400 hover:underline">
                            destek@panobu.com
                        </a>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild variant="outline">
                        <Link href="/faq">
                            <HelpCircle className="w-4 h-4 mr-2" />
                            SSS
                        </Link>
                    </Button>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/static-billboards">
                            <MapPin className="w-4 h-4 mr-2" />
                            Panoları Keşfet
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0B1120] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
