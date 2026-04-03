"use client";

import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const amount = searchParams.get("amount") || "0";
    const campaignName = searchParams.get("campaignName") || "Kampanya";
    const campaignId = searchParams.get("campaignId");
    const cancelled = searchParams.get("cancelled");
    const error = searchParams.get("error");

    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            const res = await fetch("/api/payment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    campaignId: campaignId,
                    description: campaignName,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Ödeme başlatılamadı");
            }

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Ödeme URL'i alınamadı");
            }
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Ödeme sırasında bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Güvenli Ödeme</h1>

            {cancelled && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800">Ödeme işlemi iptal edildi. Tekrar deneyebilirsiniz.</p>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-800">
                        Ödeme sırasında bir hata oluştu: {decodeURIComponent(error)}
                    </p>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-green-600 bg-green-50 p-3 rounded-lg">
                        <Lock className="w-5 h-5" />
                        <span className="text-sm font-medium">
                            Ödemeniz Stripe altyapısı ile güvenle korunmaktadır.
                        </span>
                    </div>

                    <div className="space-y-4 mb-6">
                        <p className="text-slate-600">
                            Ödeme butonuna tıkladığınızda Stripe güvenli ödeme sayfasına yönlendirileceksiniz.
                            Kart bilgileriniz sunucularımızda saklanmaz.
                        </p>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h3 className="font-medium text-slate-900 mb-2">Desteklenen Ödeme Yöntemleri</h3>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span>Visa</span>
                                <span>Mastercard</span>
                                <span>American Express</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handlePayment}
                        className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700"
                        disabled={loading || parseFloat(amount) <= 0}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Yönlendiriliyor...
                            </>
                        ) : (
                            `${parseFloat(amount).toLocaleString("tr-TR")} ₺ Öde`
                        )}
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-lg mb-4">Sipariş Özeti</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Hizmet</span>
                                <span className="font-medium">{campaignName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Ara Toplam</span>
                                <span className="font-medium">
                                    {parseFloat(amount).toLocaleString("tr-TR")} ₺
                                </span>
                            </div>
                            <div className="pt-3 border-t flex justify-between text-lg font-bold">
                                <span>Toplam</span>
                                <span>{parseFloat(amount).toLocaleString("tr-TR")} ₺</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-500 p-4 border rounded-xl">
                        <ShieldCheck className="w-8 h-8 text-blue-500" />
                        <p>
                            Panobu Güvencesi altındasınız. Memnun kalmazsanız 7 gün içinde iade talebi
                            oluşturabilirsiniz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Yükleniyor...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
