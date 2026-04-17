"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Loader2,
    CheckCircle2,
    XCircle,
    Clock3,
    MapPin,
    CalendarRange,
    Mail,
    Phone,
    Building2,
    User2,
    Sparkles,
    AlertCircle,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";
type CreativeStatus = "NONE" | "PENDING" | "APPROVED" | "REVISION_REQUESTED";

type Detail = {
    id: string;
    panel: {
        id: string;
        name: string;
        city: string;
        district: string;
        type: string;
        imageUrl?: string | null;
        imageUrls?: string[];
        width?: number;
        height?: number;
        address?: string;
    };
    advertiser: {
        id?: string;
        companyName?: string | null;
        name?: string | null;
        email?: string | null;
        phone?: string | null;
    };
    startDate: string;
    endDate: string;
    totalPrice: string | number;
    currency: string;
    status: string;
    ownerReviewStatus: ReviewStatus;
    ownerReviewNote?: string | null;
    ownerReviewedAt?: string | null;
    creativeUrl?: string | null;
    creativeStatus: CreativeStatus;
    creativeNote?: string | null;
    creativeReviewedAt?: string | null;
    designRequested?: boolean;
    createdAt: string;
};

const STATUS_META: Record<
    ReviewStatus,
    { label: string; class: string; icon: any; subtitle: string }
> = {
    PENDING: {
        label: "Onay Bekliyor",
        class: "bg-amber-50 border-amber-200 text-amber-900",
        icon: Clock3,
        subtitle: "Bu talebi onaylayın veya reddedin.",
    },
    APPROVED: {
        label: "Onaylandı",
        class: "bg-emerald-50 border-emerald-200 text-emerald-900",
        icon: CheckCircle2,
        subtitle: "Talebi onayladınız. Takvimde dolu olarak işaretlendi.",
    },
    REJECTED: {
        label: "Reddedildi",
        class: "bg-rose-50 border-rose-200 text-rose-900",
        icon: XCircle,
        subtitle: "Bu talebi reddettiniz.",
    },
};

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function fmtDateTime(iso: string) {
    return new Date(iso).toLocaleString("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function fmtPrice(n: string | number, currency = "TRY") {
    const num = Number(n);
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: currency || "TRY",
        maximumFractionDigits: 0,
    }).format(num);
}

export default function OwnerRequestDetailClient({ id }: { id: string }) {
    const [data, setData] = useState<Detail | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [busy, setBusy] = useState<string | null>(null);

    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectNote, setRejectNote] = useState("");

    const [revisionOpen, setRevisionOpen] = useState(false);
    const [revisionNote, setRevisionNote] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch(`/api/owner/requests/${id}`);
            if (!res.ok) {
                const e = await res.json().catch(() => ({}));
                throw new Error(e?.error || "Talep yüklenemedi");
            }
            const d = await res.json();
            setData(d);
        } catch (e: any) {
            setErr(e?.message || "Hata");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    async function review(action: "approve" | "reject", note?: string) {
        setBusy(action);
        setErr(null);
        try {
            const res = await fetch(`/api/owner/requests/${id}/review`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, note }),
            });
            const d = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(d?.error || "İşlem başarısız");
            await load();
            setRejectOpen(false);
            setRejectNote("");
        } catch (e: any) {
            setErr(e?.message || "Hata");
        } finally {
            setBusy(null);
        }
    }

    async function creative(action: "approve" | "revision", note?: string) {
        setBusy(`creative-${action}`);
        setErr(null);
        try {
            const res = await fetch(`/api/owner/requests/${id}/creative`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, note }),
            });
            const d = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(d?.error || "İşlem başarısız");
            await load();
            setRevisionOpen(false);
            setRevisionNote("");
        } catch (e: any) {
            setErr(e?.message || "Hata");
        } finally {
            setBusy(null);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Yükleniyor...
            </div>
        );
    }

    if (err || !data) {
        return (
            <div className="min-h-screen bg-slate-50 p-8">
                <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-6">
                    <div className="text-rose-700 mb-3">{err || "Talep bulunamadı"}</div>
                    <Button asChild variant="outline">
                        <Link href="/app/owner/requests">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Geri
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const meta = STATUS_META[data.ownerReviewStatus];
    const StatusIcon = meta.icon;
    const panelImage = data.panel.imageUrl || data.panel.imageUrls?.[0] || null;
    const customer = data.advertiser.companyName || data.advertiser.name || "Müşteri";

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <Link
                    href="/app/owner/requests"
                    className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Gelen Talepler
                </Link>

                {/* Status banner */}
                <div className={`rounded-xl border p-4 md:p-5 mb-5 ${meta.class}`}>
                    <div className="flex items-start gap-3">
                        <StatusIcon className="w-6 h-6 mt-0.5" />
                        <div>
                            <div className="font-semibold">{meta.label}</div>
                            <div className="text-sm opacity-90 mt-0.5">{meta.subtitle}</div>
                            {data.ownerReviewedAt && (
                                <div className="text-xs opacity-75 mt-1">
                                    {fmtDateTime(data.ownerReviewedAt)}
                                </div>
                            )}
                            {data.ownerReviewNote && (
                                <div className="text-sm mt-2 bg-white/50 rounded px-3 py-2">
                                    <span className="font-medium">Not:</span> {data.ownerReviewNote}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_360px] gap-5">
                    {/* Left column — details */}
                    <div className="space-y-5">
                        {/* Panel */}
                        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                                <div className="sm:w-48 h-40 sm:h-auto relative bg-slate-100 shrink-0">
                                    {panelImage ? (
                                        <Image
                                            src={panelImage}
                                            alt={data.panel.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, 192px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <MapPin className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex-1">
                                    <div className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                                        Pano
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-900 mt-0.5">
                                        {data.panel.name}
                                    </h2>
                                    <div className="text-sm text-slate-500 mt-0.5">
                                        <MapPin className="w-3.5 h-3.5 inline mr-1" />
                                        {data.panel.city} · {data.panel.district}
                                    </div>
                                    {data.panel.address && (
                                        <div className="text-xs text-slate-400 mt-0.5">
                                            {data.panel.address}
                                        </div>
                                    )}
                                    <div className="text-xs text-slate-500 mt-2">
                                        {data.panel.width && data.panel.height
                                            ? `${data.panel.width} × ${data.panel.height} m · `
                                            : ""}
                                        {data.panel.type}
                                    </div>
                                    <Link
                                        href={`/app/owner/units/${data.panel.id}/edit`}
                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-2"
                                    >
                                        Üniteyi düzenle <ExternalLink className="w-3.5 h-3.5 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Rezervasyon */}
                        <section className="bg-white border border-slate-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-3">
                                Rezervasyon
                            </h3>
                            <dl className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                <div>
                                    <dt className="text-slate-500">Başlangıç</dt>
                                    <dd className="text-slate-900 font-medium mt-0.5">
                                        {fmtDate(data.startDate)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">Bitiş</dt>
                                    <dd className="text-slate-900 font-medium mt-0.5">
                                        {fmtDate(data.endDate)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">Ödeme Durumu</dt>
                                    <dd className="text-slate-900 font-medium mt-0.5">
                                        {data.status}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">Talep Zamanı</dt>
                                    <dd className="text-slate-900 font-medium mt-0.5">
                                        {fmtDateTime(data.createdAt)}
                                    </dd>
                                </div>
                                <div className="col-span-2">
                                    <dt className="text-slate-500">Teklif</dt>
                                    <dd className="text-slate-900 text-xl font-bold mt-0.5 tabular-nums">
                                        {fmtPrice(data.totalPrice, data.currency)}
                                    </dd>
                                </div>
                            </dl>
                        </section>

                        {/* Creative */}
                        {data.creativeUrl ? (
                            <section className="bg-white border border-slate-200 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                                        <Sparkles className="w-4 h-4 text-violet-600" /> Kampanya Görseli
                                    </h3>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full border ${data.creativeStatus === "APPROVED"
                                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                            : data.creativeStatus === "REVISION_REQUESTED"
                                                ? "bg-orange-50 border-orange-200 text-orange-800"
                                                : "bg-blue-50 border-blue-200 text-blue-800"
                                            }`}
                                    >
                                        {data.creativeStatus === "APPROVED"
                                            ? "Onaylı"
                                            : data.creativeStatus === "REVISION_REQUESTED"
                                                ? "Revizyon istendi"
                                                : "İnceleme bekliyor"}
                                    </span>
                                </div>

                                <div className="relative w-full aspect-video bg-slate-100 rounded-lg overflow-hidden">
                                    <Image
                                        src={data.creativeUrl}
                                        alt="Kampanya görseli"
                                        fill
                                        sizes="100vw"
                                        className="object-contain"
                                    />
                                </div>

                                {data.creativeNote && (
                                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                                        <div className="text-xs text-slate-500 mb-0.5">Revizyon notu</div>
                                        <div className="text-slate-800">{data.creativeNote}</div>
                                        {data.creativeReviewedAt && (
                                            <div className="text-xs text-slate-400 mt-1">
                                                {fmtDateTime(data.creativeReviewedAt)}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {data.creativeStatus !== "APPROVED" && (
                                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                        <Button
                                            onClick={() => creative("approve")}
                                            disabled={busy === "creative-approve"}
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            {busy === "creative-approve" ? (
                                                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                            )}
                                            Görseli Onayla
                                        </Button>
                                        <Button
                                            onClick={() => setRevisionOpen(true)}
                                            variant="outline"
                                            disabled={!!busy}
                                            className="border-orange-300 text-orange-700 hover:bg-orange-50"
                                        >
                                            <AlertCircle className="w-4 h-4 mr-1" /> Revizyon İste
                                        </Button>
                                    </div>
                                )}
                            </section>
                        ) : (
                            <section className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-500">
                                {data.designRequested
                                    ? "Reklam veren tasarım desteği talep etti — henüz görsel yüklenmedi."
                                    : "Henüz kampanya görseli yüklenmedi."}
                            </section>
                        )}
                    </div>

                    {/* Right column — actions */}
                    <aside className="space-y-5">
                        {/* Customer */}
                        <section className="bg-white border border-slate-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-3">
                                Reklam Veren
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    {data.advertiser.companyName ? (
                                        <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                                    ) : (
                                        <User2 className="w-4 h-4 text-slate-400 mt-0.5" />
                                    )}
                                    <div>
                                        <div className="font-medium text-slate-900">{customer}</div>
                                        {data.advertiser.name && data.advertiser.companyName && (
                                            <div className="text-xs text-slate-500">
                                                {data.advertiser.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {data.advertiser.email && (
                                    <a
                                        href={`mailto:${data.advertiser.email}`}
                                        className="flex items-center gap-2 text-slate-700 hover:text-blue-600"
                                    >
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        {data.advertiser.email}
                                    </a>
                                )}
                                {data.advertiser.phone && (
                                    <a
                                        href={`tel:${data.advertiser.phone}`}
                                        className="flex items-center gap-2 text-slate-700 hover:text-blue-600"
                                    >
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        {data.advertiser.phone}
                                    </a>
                                )}
                            </div>
                        </section>

                        {/* Review actions */}
                        {data.ownerReviewStatus === "PENDING" && (
                            <section className="bg-white border border-slate-200 rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                                    Karar Verin
                                </h3>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={() => review("approve")}
                                        disabled={busy === "approve"}
                                        className="bg-emerald-600 hover:bg-emerald-700 w-full"
                                    >
                                        {busy === "approve" ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                        ) : (
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                        )}
                                        Onayla
                                    </Button>
                                    <Button
                                        onClick={() => setRejectOpen(true)}
                                        disabled={!!busy}
                                        variant="outline"
                                        className="w-full border-rose-300 text-rose-700 hover:bg-rose-50"
                                    >
                                        <XCircle className="w-4 h-4 mr-1" /> Reddet
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500 mt-3">
                                    Onayladığınızda takvimde ilgili tarihler "dolu" olarak işaretlenir,
                                    reklam verene bildirim gider (yakında).
                                </p>
                            </section>
                        )}

                        {data.ownerReviewStatus === "APPROVED" && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900">
                                <CheckCircle2 className="w-5 h-5 mb-1" />
                                Bu talep onaylandı. Takvimde görünür.
                            </div>
                        )}
                        {data.ownerReviewStatus === "REJECTED" && (
                            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-900">
                                <XCircle className="w-5 h-5 mb-1" />
                                Bu talep reddedildi.
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            {/* Reject modal */}
            {rejectOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Talebi Reddet</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Reklam verene görünecek bir not ekleyebilirsiniz (opsiyonel).
                        </p>
                        <textarea
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            rows={3}
                            placeholder="Örn: Bu tarih aralığında başka rezervasyon var."
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setRejectOpen(false)}
                                disabled={busy === "reject"}
                            >
                                Vazgeç
                            </Button>
                            <Button
                                onClick={() => review("reject", rejectNote || undefined)}
                                disabled={busy === "reject"}
                                className="bg-rose-600 hover:bg-rose-700"
                            >
                                {busy === "reject" ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                        Reddediliyor
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4 mr-1" /> Reddet
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Revision modal */}
            {revisionOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            Görselde Revizyon İste
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Reklam verene iletilecek notu yazın. Bu alan zorunludur.
                        </p>
                        <textarea
                            value={revisionNote}
                            onChange={(e) => setRevisionNote(e.target.value)}
                            rows={4}
                            required
                            placeholder="Örn: Logo boyutunu büyütün, sağ alt köşedeki yazıyı kaldırın."
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setRevisionOpen(false)}
                                disabled={busy === "creative-revision"}
                            >
                                Vazgeç
                            </Button>
                            <Button
                                onClick={() => creative("revision", revisionNote)}
                                disabled={busy === "creative-revision" || !revisionNote.trim()}
                                className="bg-orange-600 hover:bg-orange-700"
                            >
                                {busy === "creative-revision" ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                        Gönderiliyor
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-4 h-4 mr-1" /> Revizyon İste
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
