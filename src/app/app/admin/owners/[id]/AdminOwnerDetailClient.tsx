"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Clock3,
    ExternalLink,
    Globe,
    Landmark,
    Loader2,
    Mail,
    MapPin,
    Phone,
    ShieldAlert,
    Trash2,
    Undo2,
    User,
    AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type OwnerDetail = {
    id: string;
    companyName: string;
    approved: boolean;
    slug: string | null;
    phone: string | null;
    contactEmail: string | null;
    website: string | null;
    description: string | null;
    cities: string[];
    logoUrl: string | null;
    coverUrl: string | null;
    taxId: string | null;
    address: string | null;
    iban: string | null;
    bankName: string | null;
    bankAccountHolder: string | null;
    createdAt: string;
    deletionRequestedAt: string | null;
    deletionReason: string | null;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        createdAt: string;
    };
    counts: {
        screens: number;
        panels: number;
        inquiries: number;
        customers: number;
        activeRentals: number;
        lifetimeRentals: number;
        pendingRequests: number;
    };
};

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function AdminOwnerDetailClient({ id }: { id: string }) {
    const router = useRouter();
    const [data, setData] = useState<OwnerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [msg, setMsg] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch(`/api/admin/owners/${id}`, { cache: "no-store" });
            if (!res.ok) throw new Error("Yüklenemedi");
            setData(await res.json());
        } catch (e) {
            setErr(e instanceof Error ? e.message : "Hata");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function toggleApprove(next: boolean) {
        setBusy("approve");
        setErr(null);
        setMsg(null);
        try {
            const res = await fetch(`/api/admin/owners/${id}/approve`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ approved: next }),
            });
            if (!res.ok) throw new Error((await res.json())?.error || "İşlem başarısız");
            setMsg(next ? "Firma onaylandı." : "Onay geri alındı.");
            await load();
        } catch (e) {
            setErr(e instanceof Error ? e.message : "Hata");
        } finally {
            setBusy(null);
        }
    }

    async function handleDeletion(action: "cancel" | "approve") {
        if (
            action === "approve" &&
            !confirm(
                "Firmanın silme talebi onaylanacak. Tüm panoları pasif hale gelecek ve firma onayı kaldırılacak. Devam etmek istiyor musunuz?",
            )
        ) {
            return;
        }
        setBusy(action);
        setErr(null);
        setMsg(null);
        try {
            const res = await fetch(`/api/admin/owners/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deletionAction: action }),
            });
            if (!res.ok) throw new Error((await res.json())?.error || "İşlem başarısız");
            setMsg(
                action === "cancel"
                    ? "Silme talebi iptal edildi."
                    : "Silme talebi onaylandı. Panolar pasifleştirildi.",
            );
            await load();
        } catch (e) {
            setErr(e instanceof Error ? e.message : "Hata");
        } finally {
            setBusy(null);
        }
    }

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-3xl mx-auto py-16 text-center">
                <p className="text-slate-600">Medya sahibi bulunamadı.</p>
                <Button onClick={() => router.back()} className="mt-4">
                    Geri dön
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <Link
                href="/app/admin/owners"
                className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 mb-4"
            >
                <ArrowLeft className="w-4 h-4" /> Medya Sahipleri
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex items-start gap-3">
                    {data.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={data.logoUrl}
                            alt={data.companyName}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-white"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-slate-400" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            {data.companyName}
                            {data.approved ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-emerald-50 border-emerald-200 text-emerald-800">
                                    <CheckCircle2 className="w-3 h-3" /> Onaylı
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-amber-50 border-amber-200 text-amber-800">
                                    <Clock3 className="w-3 h-3" /> Beklemede
                                </span>
                            )}
                            {data.deletionRequestedAt && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-rose-50 border-rose-200 text-rose-800">
                                    <Trash2 className="w-3 h-3" /> Silme talebi
                                </span>
                            )}
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Yetkili: {data.user.name} · Kayıt: {fmtDate(data.user.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {data.slug && (
                        <a
                            href={`/medya/${data.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Mağazayı aç
                        </a>
                    )}
                    {data.approved ? (
                        <Button
                            variant="outline"
                            onClick={() => toggleApprove(false)}
                            disabled={busy !== null}
                        >
                            {busy === "approve" ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                                <Undo2 className="w-4 h-4 mr-1" />
                            )}
                            Onayı Geri Al
                        </Button>
                    ) : (
                        <Button
                            onClick={() => toggleApprove(true)}
                            disabled={busy !== null}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {busy === "approve" ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                            )}
                            Onayla
                        </Button>
                    )}
                </div>
            </div>

            {err && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-lg p-3 text-sm mb-4">
                    {err}
                </div>
            )}
            {msg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg p-3 text-sm mb-4">
                    {msg}
                </div>
            )}

            {/* Deletion request banner */}
            {data.deletionRequestedAt && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 md:p-5 mb-5">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-rose-900">
                                Hesap silme talebi alındı
                            </h3>
                            <p className="text-xs text-rose-800 mt-0.5">
                                Talep tarihi: {fmtDate(data.deletionRequestedAt)}
                            </p>
                            {data.deletionReason && (
                                <p className="text-sm text-rose-900 mt-2 whitespace-pre-wrap">
                                    <strong>Sebep:</strong> {data.deletionReason}
                                </p>
                            )}
                            {data.counts.activeRentals > 0 && (
                                <p className="text-xs text-rose-700 mt-2">
                                    ⚠ Firmanın {data.counts.activeRentals} aktif kampanyası var —
                                    silme öncesi bunların tamamlanmasını bekleyin.
                                </p>
                            )}
                            <div className="flex items-center gap-2 mt-3">
                                <Button
                                    onClick={() => handleDeletion("approve")}
                                    disabled={busy !== null}
                                    className="bg-rose-600 hover:bg-rose-700 text-white"
                                >
                                    {busy === "approve" ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                    ) : (
                                        <Trash2 className="w-4 h-4 mr-1" />
                                    )}
                                    Silme talebini onayla
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleDeletion("cancel")}
                                    disabled={busy !== null}
                                >
                                    {busy === "cancel" ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                    ) : (
                                        <Undo2 className="w-4 h-4 mr-1" />
                                    )}
                                    Talebi iptal et
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <Kpi label="Panolar" value={data.counts.panels} />
                <Kpi label="Ekranlar" value={data.counts.screens} />
                <Kpi label="Aktif Kampanya" value={data.counts.activeRentals} tone="emerald" />
                <Kpi
                    label="Onay Bekleyen"
                    value={data.counts.pendingRequests}
                    tone={data.counts.pendingRequests > 0 ? "amber" : "slate"}
                />
                <Kpi label="Toplam Kiralama" value={data.counts.lifetimeRentals} />
                <Kpi label="Mağaza Talepleri" value={data.counts.inquiries} />
                <Kpi label="Müşteri (CRM)" value={data.counts.customers} />
            </div>

            {/* Info cards */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card icon={<User className="w-4 h-4" />} title="Yetkili / Kullanıcı">
                    <Row label="Ad Soyad" value={data.user.name} />
                    <Row
                        label="E-posta"
                        value={data.user.email}
                        extra={
                            <a
                                href={`mailto:${data.user.email}`}
                                className="text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                                <Mail className="w-3 h-3" />
                                Mail at
                            </a>
                        }
                    />
                    <Row label="Telefon" value={data.user.phone || data.phone || "—"} />
                </Card>

                <Card icon={<Building2 className="w-4 h-4" />} title="Firma Bilgileri">
                    <Row label="Vergi No" value={data.taxId || "—"} />
                    <Row label="Adres" value={data.address || "—"} />
                    <Row
                        label="Web sitesi"
                        value={data.website || "—"}
                        extra={
                            data.website ? (
                                <a
                                    href={data.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                                >
                                    <Globe className="w-3 h-3" />
                                    Aç
                                </a>
                            ) : null
                        }
                    />
                    <Row label="İletişim e-posta" value={data.contactEmail || "—"} />
                    {data.slug && (
                        <Row label="Mağaza URL" value={`/medya/${data.slug}`} />
                    )}
                </Card>

                <Card icon={<MapPin className="w-4 h-4" />} title="Hizmet Verilen İller">
                    {data.cities.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {data.cities.map((c) => (
                                <span
                                    key={c}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs"
                                >
                                    {c}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-slate-400">Henüz il eklenmemiş.</div>
                    )}
                </Card>

                <Card icon={<Landmark className="w-4 h-4" />} title="Banka Bilgileri (Payout)">
                    <Row label="IBAN" value={data.iban || "—"} mono />
                    <Row label="Banka" value={data.bankName || "—"} />
                    <Row label="Hesap Sahibi" value={data.bankAccountHolder || "—"} />
                </Card>

                {data.description && (
                    <Card
                        icon={<ShieldAlert className="w-4 h-4" />}
                        title="Firma Açıklaması"
                        full
                    >
                        <div className="text-sm text-slate-700 whitespace-pre-wrap">
                            {data.description}
                        </div>
                    </Card>
                )}
            </div>

            <div className="mt-6 text-xs text-slate-400">
                {data.phone && (
                    <span className="inline-flex items-center gap-1 mr-3">
                        <Phone className="w-3 h-3" />
                        {data.phone}
                    </span>
                )}
                ID: {data.id}
            </div>
        </div>
    );
}

function Kpi({
    label,
    value,
    tone = "slate",
}: {
    label: string;
    value: number;
    tone?: "slate" | "emerald" | "amber";
}) {
    const tones = {
        slate: "bg-white border-slate-200 text-slate-900",
        emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
        amber: "bg-amber-50 border-amber-200 text-amber-900",
    } as const;
    return (
        <div className={`rounded-xl border p-3 ${tones[tone]}`}>
            <div className="text-[11px] uppercase tracking-wider opacity-70 font-medium">
                {label}
            </div>
            <div className="text-xl font-bold mt-1">{value}</div>
        </div>
    );
}

function Card({
    icon,
    title,
    full,
    children,
}: {
    icon?: React.ReactNode;
    title: string;
    full?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`bg-white border border-slate-200 rounded-2xl p-4 ${
                full ? "md:col-span-2" : ""
            }`}
        >
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 mb-3">
                {icon}
                {title}
            </div>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

function Row({
    label,
    value,
    mono,
    extra,
}: {
    label: string;
    value: string;
    mono?: boolean;
    extra?: React.ReactNode;
}) {
    return (
        <div className="text-sm">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                {label}
            </div>
            <div
                className={`mt-0.5 text-slate-800 flex items-center justify-between gap-2 ${
                    mono ? "font-mono" : ""
                }`}
            >
                <span className="break-words">{value}</span>
                {extra && <span className="text-xs shrink-0">{extra}</span>}
            </div>
        </div>
    );
}
