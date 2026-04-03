"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Building2, Save, Loader2, LogOut } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    companyName: string;
    billingInfo: string;
}

export default function AccountPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        email: "",
        phone: "",
        companyName: "",
        billingInfo: "",
    });
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/auth/login");
                    return;
                }

                const res = await fetch("/api/auth/profile");
                if (res.ok) {
                    const data = await res.json();
                    setProfile({
                        name: data.name || user.user_metadata?.name || "",
                        email: user.email || "",
                        phone: data.phone || "",
                        companyName: data.advertiserProfile?.companyName || "",
                        billingInfo: data.advertiserProfile?.billingInfo || "",
                    });
                } else {
                    setProfile((prev) => ({
                        ...prev,
                        email: user.email || "",
                        name: user.user_metadata?.name || "",
                    }));
                }
            } catch (error) {
                console.error("Profile load error:", error);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, [supabase, router]);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                    companyName: profile.companyName,
                    billingInfo: profile.billingInfo,
                }),
            });

            if (res.ok) {
                setMessage({ type: "success", text: "Profil başarıyla güncellendi." });
            } else {
                setMessage({ type: "error", text: "Profil güncellenirken bir hata oluştu." });
            }
        } catch {
            setMessage({ type: "error", text: "Bağlantı hatası." });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/auth/login");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Hesap Ayarları</h1>
                <p className="text-slate-500 mt-1">Profil bilgilerinizi ve hesap ayarlarınızı yönetin.</p>
            </div>

            <div className="max-w-2xl space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
                    <h2 className="font-semibold text-lg text-slate-900">Kişisel Bilgiler</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                                <User className="w-4 h-4" /> Ad Soyad
                            </label>
                            <Input
                                value={profile.name}
                                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                                placeholder="Adınız Soyadınız"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                                <Mail className="w-4 h-4" /> E-posta
                            </label>
                            <Input value={profile.email} disabled className="bg-slate-50" />
                            <p className="text-xs text-slate-400 mt-1">E-posta adresi değiştirilemez.</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                                <Phone className="w-4 h-4" /> Telefon
                            </label>
                            <Input
                                value={profile.phone}
                                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                                placeholder="0532 123 4567"
                            />
                        </div>
                    </div>
                </div>

                {/* Company Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
                    <h2 className="font-semibold text-lg text-slate-900">Şirket Bilgileri</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                                <Building2 className="w-4 h-4" /> Şirket Adı
                            </label>
                            <Input
                                value={profile.companyName}
                                onChange={(e) => setProfile((p) => ({ ...p, companyName: e.target.value }))}
                                placeholder="Şirket Adı (Opsiyonel)"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Fatura Bilgileri</label>
                            <textarea
                                value={profile.billingInfo}
                                onChange={(e) => setProfile((p) => ({ ...p, billingInfo: e.target.value }))}
                                placeholder="Vergi no, adres, vb."
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {message && (
                    <div
                        className={`p-3 rounded-lg text-sm font-medium ${
                            message.type === "success"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Kaydet
                    </Button>

                    <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4 mr-2" />
                        Çıkış Yap
                    </Button>
                </div>
            </div>
        </div>
    );
}
