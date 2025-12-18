"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
                setError(authError.message);
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

            // Check if there's a pending rental in localStorage
            const pendingRental = localStorage.getItem('pendingRental');

            // Redirect to original page or dashboard
            if (redirectTo && resumeRental && pendingRental) {
                // If coming from rental flow, redirect to static-billboards with resumeRental param
                window.location.href = redirectTo + '?resumeRental=true';
            } else if (redirectTo) {
                window.location.href = redirectTo;
            } else if (role === "ADVERTISER") {
                router.push("/app/advertiser/dashboard");
            } else {
                router.push("/app/owner/dashboard");
            }
            router.refresh();

        } catch (err) {
            setError("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {showRentalMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-green-800">
                        ✨ Kayıt olduktan sonra pano kiralama işleminize devam edebilirsiniz!
                    </p>
                </div>
            )}
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Kayıt Ol</h1>
                <p className="text-gray-500">Panobu platformuna katılın</p>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                    type="button"
                    onClick={() => setRole("ADVERTISER")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === "ADVERTISER" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-900"
                        }`}
                >
                    Reklam Veren
                </button>
                <button
                    type="button"
                    onClick={() => setRole("SCREEN_OWNER")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === "SCREEN_OWNER" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-900"
                        }`}
                >
                    Ekran Sahibi
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input id="name" name="name" required onChange={handleChange} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="companyName">
                        {role === "ADVERTISER" ? "Şirket Adı (Opsiyonel)" : "Şirket / İşletme Adı"}
                    </Label>
                    <Input
                        id="companyName"
                        name="companyName"
                        required={role === "SCREEN_OWNER"}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input id="email" name="email" type="email" required onChange={handleChange} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Şifre</Label>
                    <Input id="password" name="password" type="password" required onChange={handleChange} />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
                </Button>
            </form>

            <div className="text-center text-sm">
                Zaten hesabınız var mı?{" "}
                <Link className="underline" href="/auth/login">
                    Giriş Yap
                </Link>
            </div>
        </div>
    );
}
