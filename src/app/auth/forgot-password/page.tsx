"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const supabase = createClientComponentClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) {
                setError("Şifre sıfırlama e-postası gönderilemedi. Lütfen e-posta adresinizi kontrol edin.");
            } else {
                setSent(true);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="space-y-6">
                <div className="space-y-4 text-center">
                    <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-black">E-posta Gönderildi!</h1>
                    <p className="text-slate-400">
                        <strong className="text-white">{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik.
                        Lütfen e-postanızı kontrol edin.
                    </p>
                    <p className="text-sm text-slate-500">
                        E-posta gelmedi mi? Spam klasörünüzü kontrol edin.
                    </p>
                </div>
                <div className="text-center">
                    <Link href="/auth/login" className="text-blue-400 hover:underline inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Giriş sayfasına dön
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-white">Şifremi Unuttum</h1>
                <p className="text-slate-400">
                    E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">E-posta Adresi</Label>
                    <Input
                        id="email"
                        placeholder="ornek@sirket.com"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                    />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="submit" disabled={loading}>
                    {loading ? "Gönderiliyor..." : "Şifre Sıfırlama Bağlantısı Gönder"}
                </Button>
            </form>
            <div className="text-center text-sm">
                <Link href="/auth/login" className="text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-3 h-3" />
                    Giriş sayfasına dön
                </Link>
            </div>
        </div>
    );
}
