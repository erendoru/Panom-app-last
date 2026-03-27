"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { translateAuthError } from "@/lib/auth-translations";

export default function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect');
    const resumeRental = searchParams.get('resumeRental');

    const [role, setRole] = useState<"ADVERTISER" | "SCREEN_OWNER">("ADVERTISER");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        companyName: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const supabase = createClientComponentClient();

    // If coming from rental flow, show a message
    const [showRentalMessage, setShowRentalMessage] = useState(false);
    useEffect(() => {
        if (resumeRental) {
            setShowRentalMessage(true);
        }
    }, [resumeRental]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. Sign up with Supabase
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        role: role,
                    },
                },
            });

            if (authError) {
                setError(translateAuthError(authError.message));
                setLoading(false);
                return;
            }

            // 2. Create user profile in our DB via API
            const res = await fetch("/api/auth/register-sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: authData.user?.id,
                    email: formData.email,
                    role,
                    name: formData.name,
                    companyName: formData.companyName
                }),
            });

            if (!res.ok) {
                console.error("Profile sync failed");
            }

            // Show success message
            setRegistrationSuccess(true);

            // Check if there's a pending rental in localStorage
            const pendingRental = localStorage.getItem('pendingRental');

            // Wait 3 seconds then redirect
            setTimeout(() => {
                if (redirectTo && resumeRental && pendingRental) {
                    window.location.href = redirectTo + '?resumeRental=true';
                } else if (redirectTo) {
                    window.location.href = redirectTo;
                } else if (role === "ADVERTISER") {
                    router.push("/app/advertiser/dashboard");
                } else {
                    router.push("/app/owner/dashboard");
                }
                router.refresh();
            }, 3000);

        } catch (err) {
            setError("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    // Success message screen
    if (registrationSuccess) {
        return (
            <div className="space-y-6 text-center py-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Tebrikler! 🎉</h2>
                    <p className="text-slate-400 mt-2">Hesabınız başarıyla oluşturuldu.</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-300">
                        <strong>{formData.email}</strong> adresine bir onay maili gönderdik.
                        <br />
                        Lütfen mail kutunuzu kontrol edin ve hesabınızı doğrulayın.
                    </p>
                </div>
                <p className="text-sm text-slate-500">
                    Birkaç saniye içinde yönlendirileceksiniz...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {showRentalMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
                    <p className="text-sm text-emerald-300">
                        ✨ Kayıt olduktan sonra pano kiralama işleminize devam edebilirsiniz!
                    </p>
                </div>
            )}
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-white">Kayıt Ol</h1>
                <p className="text-slate-400">Panobu platformuna katılın</p>
            </div>

            <div className="flex p-1 bg-white/[0.06] rounded-lg">
                <button
                    type="button"
                    onClick={() => setRole("ADVERTISER")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === "ADVERTISER" ? "bg-blue-600 shadow text-white" : "text-slate-400 hover:text-white"
                        }`}
                >
                    Reklam Veren
                </button>
                <button
                    type="button"
                    onClick={() => setRole("SCREEN_OWNER")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === "SCREEN_OWNER" ? "bg-blue-600 shadow text-white" : "text-slate-400 hover:text-white"
                        }`}
                >
                    Ekran Sahibi
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Ad Soyad</Label>
                    <Input id="name" name="name" required onChange={handleChange} className="bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-slate-300">
                        {role === "ADVERTISER" ? "Şirket Adı (Opsiyonel)" : "Şirket / İşletme Adı"}
                    </Label>
                    <Input
                        id="companyName"
                        name="companyName"
                        required={role === "SCREEN_OWNER"}
                        onChange={handleChange}
                        className="bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">E-posta</Label>
                    <Input id="email" name="email" type="email" required onChange={handleChange} className="bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-300">Şifre</Label>
                    <Input id="password" name="password" type="password" required onChange={handleChange} className="bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500" />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="submit" disabled={loading}>
                    {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
                </Button>
            </form>

            <div className="text-center text-sm text-slate-400">
                Zaten hesabınız var mı?{" "}
                <Link className="underline text-blue-400" href="/auth/login">
                    Giriş Yap
                </Link>
            </div>
        </div>
    );
}
