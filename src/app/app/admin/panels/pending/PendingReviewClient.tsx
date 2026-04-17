"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, MapPin, Phone, Mail, ExternalLink, Building2, Ruler, Zap } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Item = {
    id: string;
    name: string;
    type: string;
    typeLabel: string;
    city: string;
    district: string;
    address: string;
    width: number;
    height: number;
    faceCount: number;
    lighting: string | null;
    priceWeekly: number;
    priceDaily: number | null;
    priceMonthly: number | null;
    description: string | null;
    latitude: number;
    longitude: number;
    imageUrls: string[];
    nearbyTags: string[];
    estimatedDailyImpressions: number;
    estimatedCpm: number | null;
    submittedAt: string | null;
    owner: {
        id: string;
        companyName: string;
        slug: string | null;
        phone: string | null;
        contactEmail: string | null;
        email?: string | null;
        name?: string | null;
    } | null;
};

function lightingLabel(l: string | null) {
    if (!l) return null;
    if (l === "LIGHTED") return "Işıklı";
    if (l === "UNLIGHTED") return "Işıksız";
    if (l === "DIGITAL") return "Dijital";
    return l;
}

export default function PendingReviewClient({ items }: { items: Item[] }) {
    const router = useRouter();
    const [busyId, setBusyId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectNote, setRejectNote] = useState("");

    async function approve(id: string) {
        if (!confirm("Bu panoyu onaylayıp panobu.com'da yayına almak istediğinize emin misiniz?")) return;
        setBusyId(id);
        try {
            const res = await fetch(`/api/admin/panels/${id}/review`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "approve" }),
            });
            if (!res.ok) throw new Error((await res.json()).error || "Onay başarısız");
            router.refresh();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setBusyId(null);
        }
    }

    async function reject(id: string) {
        if (!rejectNote.trim()) {
            alert("Red sebebini yazın");
            return;
        }
        setBusyId(id);
        try {
            const res = await fetch(`/api/admin/panels/${id}/review`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "reject", note: rejectNote.trim() }),
            });
            if (!res.ok) throw new Error((await res.json()).error || "Red başarısız");
            setRejectingId(null);
            setRejectNote("");
            router.refresh();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setBusyId(null);
        }
    }

    return (
        <div className="space-y-4">
            {items.map((it) => (
                <div
                    key={it.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-0">
                        <div className="relative bg-slate-100 h-56 lg:h-full min-h-[200px]">
                            {it.imageUrls[0] ? (
                                <Image
                                    src={it.imageUrls[0]}
                                    alt={it.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 280px"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-300 text-sm">
                                    Görsel yok
                                </div>
                            )}
                            {it.imageUrls.length > 1 && (
                                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                                    {it.imageUrls.length} fotoğraf
                                </span>
                            )}
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div>
                                    <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                        Onay Bekliyor
                                    </span>
                                    <h2 className="text-lg font-semibold text-slate-900 mt-2">{it.name}</h2>
                                    <p className="text-sm text-slate-600 mt-1">
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {it.district}, {it.city}
                                        </span>
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">{it.address}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs text-slate-500">Haftalık</p>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {formatCurrency(it.priceWeekly)}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <Info label="Tip" value={it.typeLabel} />
                                <Info
                                    label="Boyut"
                                    value={`${it.width}m × ${it.height}m`}
                                    icon={<Ruler className="w-3 h-3" />}
                                />
                                <Info label="Yüz" value={it.faceCount === 2 ? "Çift Yüz" : "Tek Yüz"} />
                                <Info
                                    label="Aydınlatma"
                                    value={lightingLabel(it.lighting) || "—"}
                                    icon={<Zap className="w-3 h-3" />}
                                />
                            </div>

                            {it.owner && (
                                <div className="border-t border-slate-100 pt-3">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-700 mb-2">
                                        <Building2 className="w-3.5 h-3.5" />
                                        Medya Sahibi
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                        <div>
                                            <p className="font-medium text-slate-900">{it.owner.companyName}</p>
                                            {it.owner.name && (
                                                <p className="text-xs text-slate-500">Yetkili: {it.owner.name}</p>
                                            )}
                                        </div>
                                        {it.owner.phone && (
                                            <p className="text-xs text-slate-600 flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                {it.owner.phone}
                                            </p>
                                        )}
                                        <p className="text-xs text-slate-600 flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {it.owner.contactEmail || it.owner.email}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {(it.estimatedDailyImpressions > 0 || it.estimatedCpm != null) && (
                                <div className="grid grid-cols-2 gap-3 text-sm border-t border-slate-100 pt-3">
                                    {it.estimatedDailyImpressions > 0 && (
                                        <Info
                                            label="Tahmini Günlük Görüntülenme"
                                            value={it.estimatedDailyImpressions.toLocaleString("tr-TR")}
                                        />
                                    )}
                                    {it.estimatedCpm != null && (
                                        <Info label="Tahmini CPM" value={`₺ ${it.estimatedCpm}`} />
                                    )}
                                </div>
                            )}

                            {it.nearbyTags.length > 0 && (
                                <div className="border-t border-slate-100 pt-3">
                                    <p className="text-xs font-medium text-slate-500 mb-2">
                                        Çevredeki Dükkanlar / Noktalar
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {it.nearbyTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {it.description && (
                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm text-slate-700">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Açıklama</p>
                                    {it.description}
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2">
                                <a
                                    href={`https://www.google.com/maps?q=${it.latitude},${it.longitude}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                                >
                                    <ExternalLink className="w-3 h-3" /> Haritada gör
                                </a>
                                {it.submittedAt && (
                                    <span className="text-xs text-slate-400">
                                        Gönderim: {new Date(it.submittedAt).toLocaleString("tr-TR")}
                                    </span>
                                )}
                            </div>

                            {rejectingId === it.id ? (
                                <div className="border border-rose-200 bg-rose-50 rounded-lg p-3 space-y-2">
                                    <p className="text-sm font-medium text-rose-900">Red sebebi</p>
                                    <textarea
                                        value={rejectNote}
                                        onChange={(e) => setRejectNote(e.target.value)}
                                        rows={2}
                                        className="w-full border border-rose-200 rounded p-2 text-sm"
                                        placeholder="Medya sahibine iletilecek not..."
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => reject(it.id)}
                                            disabled={busyId === it.id}
                                            className="bg-rose-600 hover:bg-rose-700 text-white"
                                            size="sm"
                                        >
                                            Reddet
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setRejectingId(null);
                                                setRejectNote("");
                                            }}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Vazgeç
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2 pt-1">
                                    <Button
                                        onClick={() => approve(it.id)}
                                        disabled={busyId === it.id}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                        Onayla & Yayına Al
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setRejectingId(it.id);
                                            setRejectNote("");
                                        }}
                                        variant="outline"
                                        className="border-rose-300 text-rose-700 hover:bg-rose-50"
                                    >
                                        <XCircle className="w-4 h-4 mr-1.5" />
                                        Reddet
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
                {icon}
                {label}
            </p>
            <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
        </div>
    );
}
