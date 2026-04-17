"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Mail,
    Phone,
    Building2,
    Save,
    Send,
    Calendar,
    Loader2,
    CheckCircle2,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import type { OwnerCustomerDetail } from "@/lib/owner/customers";

const SECTORS = [
    "Sağlık",
    "Gayrimenkul",
    "Yeme-İçme",
    "Perakende",
    "Hizmet",
    "Eğitim",
    "Otomotiv",
    "Finans",
    "Teknoloji",
    "Turizm",
    "Diğer",
];

function fmtDate(d: string | Date | null): string {
    if (!d) return "—";
    try {
        return new Date(d).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    } catch {
        return "—";
    }
}

function statusBadge(status: string): { label: string; className: string } {
    const map: Record<string, { label: string; className: string }> = {
        PENDING_PAYMENT: {
            label: "Ödeme bekleniyor",
            className: "bg-amber-50 text-amber-700 border-amber-200",
        },
        ACTIVE: {
            label: "Aktif",
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
        COMPLETED: {
            label: "Tamamlandı",
            className: "bg-slate-100 text-slate-700 border-slate-200",
        },
        CANCELLED: {
            label: "İptal",
            className: "bg-rose-50 text-rose-700 border-rose-200",
        },
    };
    return (
        map[status] ?? {
            label: status,
            className: "bg-slate-100 text-slate-700 border-slate-200",
        }
    );
}

function reviewBadge(status: string): { label: string; className: string } {
    const map: Record<string, { label: string; className: string }> = {
        PENDING: {
            label: "Onay bekliyor",
            className: "bg-amber-50 text-amber-700 border-amber-200",
        },
        APPROVED: {
            label: "Onaylandı",
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
        REJECTED: {
            label: "Reddedildi",
            className: "bg-rose-50 text-rose-700 border-rose-200",
        },
    };
    return (
        map[status] ?? {
            label: status,
            className: "bg-slate-100 text-slate-700 border-slate-200",
        }
    );
}

export default function CustomerDetailClient({ detail }: { detail: OwnerCustomerDetail }) {
    const [notes, setNotes] = useState(detail.notes ?? "");
    const [sector, setSector] = useState(detail.sector ?? "");
    const [customSector, setCustomSector] = useState("");
    const [saving, setSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<number | null>(null);

    const [remindOpen, setRemindOpen] = useState(false);
    const [message, setMessage] = useState(
        `Merhaba ${detail.name.split(" ")[0]},\n\nGeçen dönem kampanyanız için tercih ettiğiniz panolarımız bu dönem de müsait. Size özel bir teklif hazırlayabiliriz; uygun olduğunuzda dönüş yapabilir misiniz?\n\nSaygılar.`
    );
    const [sending, setSending] = useState(false);
    const [sendResult, setSendResult] = useState<"ok" | "err" | null>(null);

    async function save() {
        setSaving(true);
        try {
            const res = await fetch(`/api/owner/customers/${detail.advertiserId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    notes: notes.trim(),
                    sector: sector === "__custom__" ? customSector.trim() : sector,
                }),
            });
            if (res.ok) setSavedAt(Date.now());
        } finally {
            setSaving(false);
        }
    }

    async function sendReminder() {
        setSending(true);
        setSendResult(null);
        try {
            const res = await fetch(
                `/api/owner/customers/${detail.advertiserId}/remind`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message }),
                }
            );
            setSendResult(res.ok ? "ok" : "err");
            if (res.ok) setTimeout(() => setRemindOpen(false), 1200);
        } catch {
            setSendResult("err");
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="max-w-5xl">
            <div className="mb-4">
                <Link
                    href="/app/owner/customers"
                    className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" /> Tüm müşteriler
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
                                {detail.companyName || detail.name}
                            </h1>
                            {detail.companyName && detail.companyName !== detail.name && (
                                <p className="text-sm text-slate-500 mt-0.5">{detail.name}</p>
                            )}
                            {detail.sector && (
                                <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                    {detail.sector}
                                </span>
                            )}
                        </div>
                        <Button
                            onClick={() => setRemindOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Send className="w-4 h-4 mr-2" /> Tekrar Teklif Gönder
                        </Button>
                    </div>
                    <div className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
                        <a
                            href={`mailto:${detail.email}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100"
                        >
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-700">{detail.email}</span>
                        </a>
                        {detail.phone && (
                            <a
                                href={`tel:${detail.phone}`}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100"
                            >
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-700">{detail.phone}</span>
                            </a>
                        )}
                        {detail.companyName && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-700">{detail.companyName}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500 mb-3">
                        İstatistikler
                    </div>
                    <div className="space-y-3">
                        <Stat label="Toplam Kiralama" value={detail.rentalCount.toString()} />
                        <Stat label="Toplam Harcama" value={formatCurrency(detail.totalSpend)} accent />
                        <Stat
                            label="İlk Kiralama"
                            value={fmtDate(detail.firstRentalAt as unknown as string)}
                        />
                        <Stat
                            label="Son Kiralama"
                            value={fmtDate(detail.lastRentalAt as unknown as string)}
                        />
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="font-semibold text-slate-900">Müşteri Notu & Sektör</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Bu müşteriye özel hatırlatmalar ve tercih notları. Sadece siz görürsünüz.
                        </p>
                    </div>
                    <Button onClick={save} disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white">
                        {saving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Kaydet
                    </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">Sektör</label>
                        <select
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                        >
                            <option value="">— seçilmedi —</option>
                            {SECTORS.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                            <option value="__custom__">+ Özel sektör...</option>
                        </select>
                    </div>
                    {sector === "__custom__" && (
                        <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">Özel sektör</label>
                            <Input
                                value={customSector}
                                onChange={(e) => setCustomSector(e.target.value)}
                                placeholder="Örn: E-ticaret"
                                maxLength={64}
                            />
                        </div>
                    )}
                </div>

                <textarea
                    rows={4}
                    maxLength={4000}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Örn: her yıl bayramda kiralıyor · fiyata hassas · teslim sürecini önemser..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
                {savedAt && (
                    <div className="mt-2 text-xs text-emerald-700 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Kaydedildi
                    </div>
                )}
            </div>

            {/* Rentals */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        Geçmiş Kiralamalar ({detail.rentals.length})
                    </h2>
                </div>
                {detail.rentals.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">Kayıt bulunamadı.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-left border-b border-slate-200">
                                    <th className="px-4 py-3 font-semibold text-slate-600">Ünite</th>
                                    <th className="px-4 py-3 font-semibold text-slate-600">Dönem</th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 text-right">Tutar</th>
                                    <th className="px-4 py-3 font-semibold text-slate-600">Durum</th>
                                    <th className="px-4 py-3 font-semibold text-slate-600">Onay</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {detail.rentals.map((r) => {
                                    const st = statusBadge(r.status);
                                    const rv = reviewBadge(r.ownerReviewStatus);
                                    return (
                                        <tr key={r.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-900">{r.panelName}</div>
                                                <div className="text-xs text-slate-500">
                                                    {r.panelType} · {r.panelDistrict}, {r.panelCity}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700">
                                                {fmtDate(r.startDate as unknown as string)} →{" "}
                                                {fmtDate(r.endDate as unknown as string)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                                {formatCurrency(r.totalPrice)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${st.className}`}
                                                >
                                                    {st.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${rv.className}`}
                                                >
                                                    {rv.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reminder Modal */}
            {remindOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => !sending && setRemindOpen(false)}
                    />
                    <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl flex flex-col overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900">
                                {detail.companyName || detail.name} — Teklif Gönder
                            </h3>
                            <button
                                onClick={() => !sending && setRemindOpen(false)}
                                className="p-1 text-slate-400 hover:text-slate-700"
                                aria-label="Kapat"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="text-xs text-slate-500">
                                Alıcı: <span className="font-medium text-slate-700">{detail.email}</span>
                            </div>
                            <textarea
                                rows={8}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                maxLength={2000}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                            />
                            {sendResult === "ok" && (
                                <div className="text-xs text-emerald-700 inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> E-posta gönderildi
                                </div>
                            )}
                            {sendResult === "err" && (
                                <div className="text-xs text-rose-700">
                                    E-posta gönderilemedi. Lütfen tekrar deneyin.
                                </div>
                            )}
                        </div>
                        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
                            <button
                                onClick={() => !sending && setRemindOpen(false)}
                                disabled={sending}
                                className="px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-50"
                            >
                                Vazgeç
                            </button>
                            <Button
                                onClick={sendReminder}
                                disabled={sending || message.trim().length < 10}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {sending ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4 mr-2" />
                                )}
                                Gönder
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Stat({
    label,
    value,
    accent,
}: {
    label: string;
    value: string;
    accent?: boolean;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{label}</span>
            <span
                className={`text-sm font-semibold ${
                    accent ? "text-blue-700" : "text-slate-900"
                }`}
            >
                {value}
            </span>
        </div>
    );
}
