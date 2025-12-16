"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const supabase = createClientComponentClient();

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
                setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
            } else if (data.user) {
                // Fetch user role from Prisma database
                const res = await fetch(`/api/auth/user?email=${data.user.email}`);

                if (!res.ok) {
                    throw new Error("Kullanıcı bilgileri alınamadı.");
                }

                const userData = await res.json();

                // Build redirect path
                let redirectTo = '/app/advertiser/dashboard';
                if (userData.role === 'ADMIN') {
                    redirectTo = '/app/admin/panels';
                } else if (userData.role === 'SCREEN_OWNER') {
                    redirectTo = '/app/owner/dashboard';
                }

                // Use hard navigation to ensure cookies/middleware sync
                window.location.href = redirectTo;
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
                Hesabınız yok mu?{" "}
                <Link className="underline" href="/auth/register">
                    Kayıt Ol
                </Link>
            </div>
        </div>
    );
}
