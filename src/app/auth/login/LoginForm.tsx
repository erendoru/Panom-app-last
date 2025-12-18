"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
                // Fetch user role from Prisma database
                const res = await fetch(`/api/auth/user?email=${data.user.email}`);

                if (!res.ok) {
                    // User exists in Supabase but not in Prisma - sync issue
                    if (res.status === 404) {
                        setError("Hesabınız veritabanında bulunamadı. Lütfen destek@panobu.com ile iletişime geçin.");
                        // Sign out from Supabase to clear invalid session
                        await supabase.auth.signOut();
                    } else {
                        throw new Error("Kullanıcı bilgileri alınamadı.");
                    }
                    return;
                }

                const userData = await res.json();

                // Check if there's a pending rental in localStorage
                const pendingRental = localStorage.getItem('pendingRental');

                // Use redirect param if available, otherwise role-based redirect
                let finalRedirect = redirectTo || (
                    userData.role === 'ADMIN' ? '/app/admin/panels' :
                        userData.role === 'SCREEN_OWNER' ? '/app/owner/dashboard' :
                            '/app/advertiser/dashboard'
                );

                // If coming from rental flow, add resumeRental param
                if (redirectTo && resumeRental && pendingRental) {
                    finalRedirect = redirectTo + '?resumeRental=true';
                }

                // Use hard navigation to ensure cookies/middleware sync
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
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-green-800">
                        ✨ Giriş yaptıktan sonra pano kiralama işleminize devam edebilirsiniz!
                    </p>
                </div>
            )}
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Giriş Yap</h1>
                <p className="text-gray-500">Hesabınıza erişmek için bilgilerinizi girin</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                        id="email"
                        placeholder="ornek@sirket.com"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Şifre</Label>
                    <Input
                        id="password"
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>
            </form>
            <div className="text-center text-sm">
                <Link className="text-blue-600 hover:underline" href="/auth/forgot-password">
                    Şifremi Unuttum
                </Link>
            </div>
            <div className="text-center text-sm">
                Hesabınız yok mu?{" "}
                <Link className="underline" href="/auth/register">
                    Kayıt Ol
                </Link>
            </div>
        </div>
    );
}
