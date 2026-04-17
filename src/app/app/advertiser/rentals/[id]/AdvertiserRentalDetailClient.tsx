"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Camera,
    MapPin,
    CalendarRange,
    Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ProofStatus = "PENDING" | "UPLOADED" | "CONFIRMED";

type ProofItem = {
    id: string;
    photoUrls: string[];
    notes?: string | null;
    uploadedAt: string;
    confirmedAt?: string | null;
};

type Payload = {
    rental: {
        id: string;
        panel: {
            id: string;
            name: string;
            city: string;
            district: string;
            imageUrl?: string | null;
            imageUrls?: string[];
        };
        startDate: string;
        endDate: string;
        proofStatus: ProofStatus;
    };
    items: ProofItem[];
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

export default function AdvertiserRentalDetailClient({ id }: { id: string }) {
    const [data, setData] = useState<Payload | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch(`/api/advertiser/rentals/${id}/proof`);
            if (!res.ok) {
                const e = await res.json().catch(() => ({}));
                throw new Error(e?.error || "Yüklenemedi");
            }
            setData(await res.json());
        } catch (e: any) {
            setErr(e?.message || "Hata");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    async function confirmProofs() {
        setBusy(true);
        setErr(null);
        try {
            const res = await fetch(`/api/advertiser/rentals/${id}/proof`, {
                method: "PATCH",
            });
            const d = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(d?.error || "Onay başarısız");
            await load();
        } catch (e: any) {
            setErr(e?.message || "Hata");
        } finally {
            setBusy(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Yükleniyor...
            </div>
        );
    }

    if (err || !data) {
        return (
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-6">
                <div className="text-rose-700 mb-3">{err || "Kayıt bulunamadı"}</div>
                <Button asChild variant="outline">
                    <Link href="/app/advertiser/billing">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Geri
                    </Link>
                </Button>
            </div>
        );
    }

    const { rental, items } = data;
    const panelImage = rental.panel.imageUrl || rental.panel.imageUrls?.[0] || null;
    const isConfirmed = rental.proofStatus === "CONFIRMED";
    const isUploaded = rental.proofStatus === "UPLOADED";

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                href="/app/advertiser/billing"
                className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-1" /> Ödemeler
            </Link>

            {/* Panel */}
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-5">
                <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-56 h-44 sm:h-auto relative bg-slate-100 shrink-0">
                        {panelImage ? (
                            <Image
                                src={panelImage}
                                alt={rental.panel.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 224px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <MapPin className="w-10 h-10" />
                            </div>
                        )}
                    </div>
                    <div className="p-5 flex-1">
                        <div className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                            Pano Kiralaması
                        </div>
                        <h1 className="text-xl font-semibold text-slate-900 mt-1">
                            {rental.panel.name}
                        </h1>
                        <div className="text-sm text-slate-500 mt-1">
                            <MapPin className="w-3.5 h-3.5 inline mr-1" />
                            {rental.panel.city} · {rental.panel.district}
                        </div>
                        <div className="text-sm text-slate-700 mt-3 inline-flex items-center gap-1.5">
                            <CalendarRange className="w-4 h-4" />
                            {fmtDate(rental.startDate)} → {fmtDate(rental.endDate)}
                        </div>
                    </div>
                </div>
            </section>

            {/* Yayın Kanıtı */}
            <section className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-1.5">
                        <Camera className="w-5 h-5 text-blue-600" /> Yayın Kanıtı
                    </h2>
                    <span
                        className={`text-xs px-2.5 py-1 rounded-full border ${
                            isConfirmed
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                : isUploaded
                                ? "bg-blue-50 border-blue-200 text-blue-800"
                                : "bg-amber-50 border-amber-200 text-amber-800"
                        }`}
                    >
                        {isConfirmed
                            ? "Onayladınız"
                            : isUploaded
                            ? "Onayınızı bekliyor"
                            : "Henüz yüklenmedi"}
                    </span>
                </div>

                {items.length === 0 ? (
                    <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-600">
                        <Info className="w-4 h-4 mt-0.5 text-slate-400" />
                        <div>
                            Kampanyanız yayına girdiğinde medya sahibi panonun fotoğrafını buraya
                            yükleyecek. Yükleme tamamlanınca size e-posta ile bildirim gönderilecek.
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((p) => (
                            <div
                                key={p.id}
                                className="border border-slate-200 rounded-lg p-3 bg-slate-50/40"
                            >
                                <div className="flex items-start justify-between gap-3 mb-2 text-xs text-slate-500">
                                    <span>Yüklenme: {fmtDateTime(p.uploadedAt)}</span>
                                    {p.confirmedAt && (
                                        <span className="text-emerald-700">
                                            Onaylandı: {fmtDateTime(p.confirmedAt)}
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {p.photoUrls.map((u, i) => (
                                        <a
                                            key={u + i}
                                            href={u}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="relative aspect-video bg-slate-100 rounded overflow-hidden block"
                                        >
                                            <Image
                                                src={u}
                                                alt={`Kanıt ${i + 1}`}
                                                fill
                                                sizes="(max-width: 640px) 50vw, 33vw"
                                                className="object-cover"
                                            />
                                        </a>
                                    ))}
                                </div>
                                {p.notes && (
                                    <div className="mt-2 text-sm text-slate-700 bg-white border border-slate-200 rounded px-3 py-1.5">
                                        {p.notes}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {isUploaded && !isConfirmed && (
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-sm text-blue-900">
                            Yayın kanıtı fotoğraflarını gözden geçirdiyseniz onaylayabilirsiniz.
                        </div>
                        <Button
                            onClick={confirmProofs}
                            disabled={busy}
                            className="bg-emerald-600 hover:bg-emerald-700 shrink-0"
                        >
                            {busy ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Onaylanıyor
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Kanıtı Onayla
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {isConfirmed && (
                    <div className="mt-4 flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 mt-0.5" />
                        Yayın kanıtını onayladınız. Teşekkürler!
                    </div>
                )}
            </section>
        </div>
    );
}
