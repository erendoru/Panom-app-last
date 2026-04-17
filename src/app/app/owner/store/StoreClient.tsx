"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Store,
    Copy,
    Link2,
    Save,
    Loader2,
    ExternalLink,
    CheckCircle2,
    Globe,
    Phone,
    Mail,
    Building2,
    Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CityMultiSelect from "@/components/form/CityMultiSelect";
import ImageUploader from "@/components/ImageUploader";

type StoreData = {
    id: string;
    companyName: string;
    slug: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    description: string | null;
    website: string | null;
    cities: string[];
    phone: string | null;
    contactEmail: string | null;
};

export default function StoreClient() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<StoreData | null>(null);
    const [slugInput, setSlugInput] = useState("");
    const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/owner/store");
                if (res.ok) {
                    const j = (await res.json()) as StoreData;
                    setData(j);
                    setSlugInput(j.slug ?? "");
                } else {
                    setMessage({ type: "err", text: "Mağaza bilgileri yüklenemedi." });
                }
            } catch {
                setMessage({ type: "err", text: "Bağlantı hatası." });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const publicPath = useMemo(() => (data?.slug ? `/medya/${data.slug}` : null), [data?.slug]);
    const absoluteUrl = useMemo(() => {
        if (!publicPath) return null;
        if (typeof window === "undefined") return `panobu.com${publicPath}`;
        return `${window.location.origin}${publicPath}`;
    }, [publicPath]);

    async function save(patch: Partial<StoreData & { slug: string }>) {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/owner/store", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            if (res.ok) {
                const j = (await res.json()) as StoreData;
                setData(j);
                setSlugInput(j.slug ?? "");
                setMessage({ type: "ok", text: "Mağaza bilgileri güncellendi." });
            } else {
                const j = await res.json().catch(() => ({}));
                setMessage({ type: "err", text: j?.error || "Kaydetme başarısız." });
            }
        } catch {
            setMessage({ type: "err", text: "Bağlantı hatası." });
        } finally {
            setSaving(false);
        }
    }

    async function copyLink() {
        if (!absoluteUrl) return;
        try {
            await navigator.clipboard.writeText(absoluteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // ignore
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                Mağaza bilgileri yüklenemedi.
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
                    <Store className="w-6 h-6 text-blue-600" />
                    Mağaza Görüntüle
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Müşterilerinize paylaşabileceğiniz public profil sayfanızı yönetin.
                </p>
            </div>

            {/* Public link card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <Link2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500">Mağaza bağlantınız</p>
                        {publicPath ? (
                            <p className="text-sm font-medium text-slate-900 break-all">
                                {absoluteUrl}
                            </p>
                        ) : (
                            <p className="text-sm text-amber-600">
                                Henüz bir mağaza URL&apos;niz yok. Aşağıdan özel bir link belirleyin veya otomatik oluşturun.
                            </p>
                        )}
                    </div>
                </div>

                {publicPath ? (
                    <div className="flex flex-wrap gap-2">
                        <Link href={publicPath} target="_blank" rel="noreferrer">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Mağazayı Görüntüle
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={copyLink} className="text-slate-700">
                            {copied ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                                    Kopyalandı
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Linki Kopyala
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={() => save({ slug: data.companyName })}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Link2 className="w-4 h-4 mr-2" />}
                        Mağaza URL&apos;si Oluştur
                    </Button>
                )}

                {/* Slug editor */}
                <div className="pt-3 border-t border-slate-100">
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Özel URL</label>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-slate-400">panobu.com/medya/</span>
                        <Input
                            value={slugInput}
                            onChange={(e) => setSlugInput(e.target.value)}
                            placeholder="firma-adi"
                            className="w-56"
                        />
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={saving || slugInput.trim() === (data.slug ?? "")}
                            onClick={() => save({ slug: slugInput.trim() })}
                        >
                            URL&apos;yi Güncelle
                        </Button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        Sadece harf, rakam ve tire kullanın. Çakışma olursa sonuna numara eklenir.
                    </p>
                </div>
            </div>

            {/* Branding */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
                <div>
                    <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-slate-500" />
                        Markalama
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Logo ve kapak görseli, public mağaza sayfanızın başında görünür.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Logo</label>
                        <ImageUploader
                            imageUrl={data.logoUrl ?? ""}
                            onImageChange={(url) => save({ logoUrl: url })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Kapak Görseli</label>
                        <ImageUploader
                            imageUrl={data.coverUrl ?? ""}
                            onImageChange={(url) => save({ coverUrl: url })}
                        />
                    </div>
                </div>
            </div>

            {/* About & contact */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    Firma Profili
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Firma Adı</label>
                        <Input
                            value={data.companyName}
                            onChange={(e) => setData((d) => (d ? { ...d, companyName: e.target.value } : d))}
                            onBlur={() => {
                                if (data.companyName.trim()) save({ companyName: data.companyName });
                            }}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Hakkında</label>
                        <textarea
                            value={data.description ?? ""}
                            onChange={(e) => setData((d) => (d ? { ...d, description: e.target.value } : d))}
                            onBlur={() => save({ description: data.description ?? "" })}
                            rows={4}
                            maxLength={2000}
                            placeholder="Firmanız ve sunduğunuz ünite hizmetleri hakkında kısa bir tanıtım..."
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                            {(data.description ?? "").length}/2000 karakter
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                                <Globe className="w-4 h-4" /> Website
                            </label>
                            <Input
                                value={data.website ?? ""}
                                onChange={(e) => setData((d) => (d ? { ...d, website: e.target.value } : d))}
                                onBlur={() => save({ website: data.website ?? "" })}
                                placeholder="ornek.com"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                                <Mail className="w-4 h-4" /> İletişim E-postası
                            </label>
                            <Input
                                type="email"
                                value={data.contactEmail ?? ""}
                                onChange={(e) => setData((d) => (d ? { ...d, contactEmail: e.target.value } : d))}
                                onBlur={() => save({ contactEmail: data.contactEmail ?? "" })}
                                placeholder="iletisim@ornek.com"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                                <Phone className="w-4 h-4" /> Telefon
                            </label>
                            <Input
                                value={data.phone ?? ""}
                                onChange={(e) => setData((d) => (d ? { ...d, phone: e.target.value } : d))}
                                onBlur={() => save({ phone: data.phone ?? "" })}
                                placeholder="0(5xx) xxx xx xx"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Cities */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <div>
                    <h2 className="font-semibold text-slate-900">Hizmet Bölgeleri</h2>
                    <p className="text-xs text-slate-500 mt-1">Mağaza sayfanızda görünecek illerin listesi.</p>
                </div>
                <CityMultiSelect
                    value={data.cities ?? []}
                    onChange={(next) => {
                        setData((d) => (d ? { ...d, cities: next } : d));
                        save({ cities: next });
                    }}
                />
            </div>

            {message && (
                <div
                    className={`p-3 rounded-lg text-sm font-medium ${
                        message.type === "ok"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                    {message.text}
                </div>
            )}

            <div className="flex justify-end">
                <Button
                    onClick={() =>
                        save({
                            companyName: data.companyName,
                            description: data.description ?? "",
                            website: data.website ?? "",
                            contactEmail: data.contactEmail ?? "",
                            phone: data.phone ?? "",
                            cities: data.cities ?? [],
                        })
                    }
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    Tümünü Kaydet
                </Button>
            </div>
        </div>
    );
}
