"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { translateAuthError } from "@/lib/auth-translations";
import CityMultiSelect from "@/components/form/CityMultiSelect";

type Role = "ADVERTISER" | "SCREEN_OWNER";

export default function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect");
    const resumeRental = searchParams.get("resumeRental");
    const initialRole = (searchParams.get("role") as Role | null) === "SCREEN_OWNER" ? "SCREEN_OWNER" : "ADVERTISER";

    const [role, setRole] = useState<Role>(initialRole);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        companyName: "",
        phone: "",
        taxId: "",
    });
    const [cities, setCities] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const supabase = createClientComponentClient();

    const [showRentalMessage, setShowRentalMessage] = useState(false);
    useEffect(() => {
        if (resumeRental) {
            setShowRentalMessage(true);
        }
    }, [resumeRental]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (role === "SCREEN_OWNER") {
            if (!formData.phone.trim()) {
                setError("Telefon numarası zorunludur.");
                setLoading(false);
                return;
            }
            if (cities.length === 0) {
                setError("En az bir hizmet verdiğiniz il seçmelisiniz.");
                setLoading(false);
                return;
            }
        }

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        role,
                    },
                },
            });

            if (authError) {
                setError(translateAuthError(authError.message));
                setLoading(false);
                return;
            }

            const res = await fetch("/api/auth/register-sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: authData.user?.id,
                    email: formData.email,
                    role,
                    name: formData.name,
                    companyName: formData.companyName,
                    phone: formData.phone || undefined,
                    taxId: formData.taxId || undefined,
                    cities,
                }),
            });

            if (!res.ok) {
                const detail = await res.json().catch(() => ({}));
                console.error("Profile sync failed", detail);
                setError(
                    "Hesap oluşturuldu fakat profiliniz kaydedilemedi. Lütfen giriş yapmayı deneyin; sorun devam ederse destek@panobu.com ile iletişime geçin."
                );
                setLoading(false);
                return;
            }

            setRegistrationSuccess(true);
            const pendingRental = localStorage.getItem("pendingRental");

            setTimeout(() => {
                if (redirectTo && resumeRental && pendingRental) {
                    window.location.href = redirectTo + "?resumeRental=true";
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
            console.error(err);
            setError("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-neutral-400";

    if (registrationSuccess) {
        return (
            <div className="space-y-6 text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">Tebrikler! 🎉</h2>
                    <p className="text-neutral-600 mt-2">Hesabınız başarıyla oluşturuldu.</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                        <strong>{formData.email}</strong> adresine bir onay maili gönderdik.
                        <br />
                        Lütfen mail kutunuzu kontrol edin ve hesabınızı doğrulayın.
                    </p>
                </div>
                <p className="text-sm text-neutral-500">Birkaç saniye içinde yönlendirileceksiniz...</p>
            </div>
        );
    }

    const isOwner = role === "SCREEN_OWNER";

    return (
        <div className="space-y-6">
            {showRentalMessage && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-emerald-800">
                        ✨ Kayıt olduktan sonra pano kiralama işleminize devam edebilirsiniz!
                    </p>
                </div>
            )}
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-neutral-900">Kayıt Ol</h1>
                <p className="text-neutral-600">Panobu platformuna katılın</p>
            </div>

            <div className="flex p-1 bg-neutral-100 rounded-lg border border-neutral-200">
                <button
                    type="button"
                    onClick={() => setRole("ADVERTISER")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        role === "ADVERTISER"
                            ? "bg-neutral-900 text-white shadow-sm"
                            : "text-neutral-600 hover:text-neutral-900"
                    }`}
                >
                    Reklam Veren
                </button>
                <button
                    type="button"
                    onClick={() => setRole("SCREEN_OWNER")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        role === "SCREEN_OWNER"
                            ? "bg-neutral-900 text-white shadow-sm"
                            : "text-neutral-600 hover:text-neutral-900"
                    }`}
                >
                    Ünite Sahibi
                </button>
            </div>

            {isOwner && (
                <p className="text-xs text-neutral-500 text-center">
                    Billboard, CLP, raket, megalight veya dijital ekran sahibiyseniz bu seçenekle kaydolun.
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-neutral-700">
                        {isOwner ? "Yetkili Adı Soyadı" : "Ad Soyad"}
                    </Label>
                    <Input id="name" name="name" required onChange={handleChange} className={inputClass} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-neutral-700">
                        {isOwner ? "Firma / İşletme Adı" : "Şirket Adı (Opsiyonel)"}
                    </Label>
                    <Input
                        id="companyName"
                        name="companyName"
                        required={isOwner}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-neutral-700">E-posta</Label>
                    <Input id="email" name="email" type="email" required onChange={handleChange} className={inputClass} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-neutral-700">Şifre</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {isOwner && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-neutral-700">Telefon</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                placeholder="05XX XXX XX XX"
                                value={formData.phone}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="taxId" className="text-neutral-700">Vergi Numarası (Opsiyonel)</Label>
                            <Input
                                id="taxId"
                                name="taxId"
                                value={formData.taxId}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-neutral-700">Hizmet Verdiğiniz İller</Label>
                            <CityMultiSelect value={cities} onChange={setCities} />
                        </div>
                    </>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white" type="submit" disabled={loading}>
                    {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
                </Button>
            </form>

            <div className="text-center text-sm text-neutral-600">
                Zaten hesabınız var mı?{" "}
                <Link className="underline text-blue-700" href="/auth/login">
                    Giriş Yap
                </Link>
            </div>
        </div>
    );
}
