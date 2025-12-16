"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const amount = searchParams.get("amount") || "0";
    const campaignName = searchParams.get("campaignName") || "Kampanya";

    const [loading, setLoading] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState("");

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Init Payment via API
            const res = await fetch("/api/payment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    // In a real app, passing campaignId would be better
                    campaignId: searchParams.get("campaignId")
                })
            });

            if (!res.ok) throw new Error("Payment init failed");

            const data = await res.json();

            // 2. Simulate Processing (since it's mock)
            await new Promise(r => setTimeout(r, 1500));

            // 3. Redirect to success
            router.push(`/app/advertiser/checkout/success?transactionId=${data.transactionId}`);

        } catch (error) {
            console.error(error);
            alert("Ödeme sırasında bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    // Format helpers
    const formatCard = (val: string) => {
        return val.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Güvenli Ödeme</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left: Form */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-green-600 bg-green-50 p-3 rounded-lg">
                        <Lock className="w-5 h-5" />
                        <span className="text-sm font-medium">Ödemeniz 256-bit SSL şifreleme ile korunmaktadır.</span>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <CreditCard className="w-5 h-5" /> Kart Bilgileri
                            </h3>

                            <div className="space-y-2">
                                <Label>Kart Üzerindeki İsim</Label>
                                <Input
                                    placeholder="Ad Soyad"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Kart Numarası</Label>
                                <Input
                                    placeholder="0000 0000 0000 0000"
                                    required
                                    maxLength={19}
                                    value={cardNumber}
                                    onChange={e => setCardNumber(formatCard(e.target.value))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Son Kullanma Tarihi</Label>
                                    <Input
                                        placeholder="AA/YY"
                                        required
                                        maxLength={5}
                                        value={expiry}
                                        onChange={e => {
                                            let v = e.target.value.replace(/\D/g, '');
                                            if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
                                            setExpiry(v);
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>CVC / CVV</Label>
                                    <Input
                                        placeholder="123"
                                        required
                                        maxLength={3}
                                        type="password"
                                        value={cvc}
                                        onChange={e => setCvc(e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "İşleniyor..." : `${amount} ₺ Öde`}
                        </Button>
                    </form>
                </div>

                {/* Right: Summary */}
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
                                <span className="font-medium">{amount} ₺</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">KDV (%20)</span>
                                <span className="font-medium">{(parseFloat(amount) * 0.2).toFixed(2)} ₺</span>
                            </div>
                            <div className="pt-3 border-t flex justify-between text-lg font-bold">
                                <span>Toplam</span>
                                <span>{(parseFloat(amount) * 1.2).toFixed(2)} ₺</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-500 p-4 border rounded-xl">
                        <ShieldCheck className="w-8 h-8 text-blue-500" />
                        <p>Panobu Güvencesi altındasınız. Memnun kalmazsanız 7 gün içinde iade talebi oluşturabilirsiniz.</p>
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
