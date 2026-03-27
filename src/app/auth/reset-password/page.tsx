"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { KeyRound, CheckCircle, Eye, EyeOff } from "lucide-react";
import { translateAuthError } from "@/lib/auth-translations";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const supabase = createClientComponentClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Şifre en az 6 karakter olmalıdır.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                setError("Şifre güncellenemedi: " + translateAuthError(error.message));
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/auth/login");
                }, 3000);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="space-y-6">
                <div className="space-y-4 text-center">
                    <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Şifre Güncellendi!</h1>
                    <p className="text-slate-400">
                        Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                    <KeyRound className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-white">Yeni Şifre Belirle</h1>
                <p className="text-slate-400">
                    Hesabınız için yeni bir şifre oluşturun.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-300">Yeni Şifre</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            required
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="En az 6 karakter"
                            className="bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-300">Şifre Tekrar</Label>
                    <Input
                        id="confirmPassword"
                        required
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Şifrenizi tekrar girin"
                        className="bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                    />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="submit" disabled={loading}>
                    {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                </Button>
            </form>
        </div>
    );
}
