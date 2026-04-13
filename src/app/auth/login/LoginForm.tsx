"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { translateAuthError } from "@/lib/auth-translations";

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect');
    const resumeRental = searchParams.get('resumeRental');

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showRentalMessage, setShowRentalMessage] = useState(false);
    const supabase = createClientComponentClient();

    useEffect(() => {
        if (resumeRental) {
            setShowRentalMessage(true);
        }
    }, [resumeRental]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Supabase login error:", error);
                if (error.message?.includes("rate limit") || error.status === 429) {
                    setError("Çok fazla giriş denemesi yapıldı. Lütfen birkaç dakika bekleyip tekrar deneyin.");
                } else if (error.message?.includes("Invalid login")) {
                    setError("E-posta veya şifre hatalı.");
                } else {
                    setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
                }
            } else if (data.user) {
                const res = await fetch(`/api/auth/user?email=${data.user.email}`);

                if (!res.ok) {
                    if (res.status === 404) {
                        setError("Hesabınız veritabanında bulunamadı. Lütfen destek@panobu.com ile iletişime geçin.");
                        await supabase.auth.signOut();
                    } else {
                        throw new Error("Kullanıcı bilgileri alınamadı.");
                    }
                    return;
                }

                const userData = await res.json();
                const pendingRental = localStorage.getItem('pendingRental');

                let finalRedirect = redirectTo || (
                    (userData.role === 'ADMIN' || userData.role === 'REGIONAL_ADMIN') ? '/app/admin/panels' :
                        userData.role === 'SCREEN_OWNER' ? '/app/owner/dashboard' :
                            '/app/advertiser/dashboard'
                );

                if (redirectTo && resumeRental && pendingRental) {
                    finalRedirect = redirectTo + '?resumeRental=true';
                }

                window.location.href = finalRedirect;
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {showRentalMessage && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-emerald-800">
                        ✨ Giriş yaptıktan sonra pano kiralama işleminize devam edebilirsiniz!
                    </p>
                </div>
            )}
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-neutral-900">Giriş Yap</h1>
                <p className="text-neutral-600">Hesabınıza erişmek için bilgilerinizi girin</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-neutral-700">E-posta</Label>
                    <Input
                        id="email"
                        placeholder="ornek@sirket.com"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-neutral-400"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-neutral-700">Şifre</Label>
                    <Input
                        id="password"
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-neutral-400"
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white" type="submit" disabled={loading}>
                    {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>
            </form>
            <div className="text-center text-sm">
                <Link className="text-blue-700 hover:underline" href="/auth/forgot-password">
                    Şifremi Unuttum
                </Link>
            </div>
            <div className="text-center text-sm text-neutral-600">
                Hesabınız yok mu?{" "}
                <Link className="underline text-blue-700" href="/auth/register">
                    Kayıt Ol
                </Link>
            </div>
        </div>
    );
}
