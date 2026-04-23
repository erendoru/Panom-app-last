"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    CheckCircle2,
    MapPin,
    X,
    Loader2,
    ShoppingBag,
    ArrowRight,
} from "lucide-react";
import { useStore } from "../StoreContext";
import { formatCurrency, weeklyEquivalent } from "@/lib/utils";
import { PANEL_TYPE_LABELS } from "@/lib/turkey-data";

export default function InquiryForm() {
    const { owner, selected, remove, clear, totalWeekly } = useStore();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        startDate: "",
        endDate: "",
        message: "",
        website: "", // honeypot
    });
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        if (!form.name.trim()) {
            setErr("Ad Soyad gerekli.");
            return;
        }
        if (!form.email.trim()) {
            setErr("E-posta gerekli.");
            return;
        }

        setSending(true);
        try {
            const res = await fetch(`/api/medya/${owner.slug}/inquiry`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || null,
                    company: form.company.trim() || null,
                    message: form.message.trim() || null,
                    startDate: form.startDate || null,
                    endDate: form.endDate || null,
                    website: form.website,
                    panels: selected.map((s) => ({ id: s.id })),
                }),
            });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                setErr(j?.error || "Gönderilemedi. Lütfen tekrar deneyin.");
            } else {
                setDone(true);
                clear();
            }
        } catch {
            setErr("Bağlantı hatası. Lütfen tekrar deneyin.");
        } finally {
            setSending(false);
        }
    }

    if (done) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Teklifiniz alındı</h2>
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                    {owner.companyName} ekibine bildirim gönderildi. En kısa sürede belirttiğiniz
                    e-posta veya telefon üzerinden sizinle iletişime geçecekler.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <Link
                        href={`/medya/${owner.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                    >
                        Anasayfa
                    </Link>
                    <Link
                        href={`/medya/${owner.slug}/panolar`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Panoları Gör
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="grid md:grid-cols-[1fr_360px] gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-5">
                <div>
                    <h2 className="font-semibold text-slate-900">İletişim Bilgileriniz</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Bilgileriniz yalnızca {owner.companyName} ile paylaşılır.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                            Ad Soyad *
                        </label>
                        <Input
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            required
                            placeholder="Adınız Soyadınız"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                            E-posta *
                        </label>
                        <Input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            required
                            placeholder="siz@ornek.com"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">Telefon</label>
                        <Input
                            value={form.phone}
                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                            placeholder="0(5xx) xxx xx xx"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                            Firma (opsiyonel)
                        </label>
                        <Input
                            value={form.company}
                            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                            placeholder="Firma adı"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                            Başlangıç Tarihi
                        </label>
                        <Input
                            type="date"
                            value={form.startDate}
                            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                            Bitiş Tarihi
                        </label>
                        <Input
                            type="date"
                            value={form.endDate}
                            onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Not</label>
                    <textarea
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        rows={5}
                        maxLength={2000}
                        placeholder="Kampanyanız, hedef kitle, ek talepler..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                </div>

                {/* Honeypot */}
                <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    style={{ position: "absolute", left: "-10000px" }}
                    aria-hidden
                />

                {err && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                        {err}
                    </div>
                )}

                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-xs text-slate-500">
                        Form göndererek {owner.companyName} ile bilgilerinizin paylaşılmasını kabul edersiniz.
                    </p>
                    <Button
                        type="submit"
                        disabled={sending}
                        className="bg-slate-900 hover:bg-slate-800 text-white"
                    >
                        {sending ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <ArrowRight className="w-4 h-4 mr-2" />
                        )}
                        Teklif İste
                    </Button>
                </div>
            </div>

            {/* Selection summary */}
            <aside className="bg-white border border-slate-200 rounded-2xl p-5 h-fit md:sticky md:top-20">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-semibold text-slate-900 text-sm">Seçili Üniteler</div>
                        <div className="text-xs text-slate-500">{selected.length} ünite</div>
                    </div>
                </div>

                {selected.length === 0 ? (
                    <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3 border border-dashed border-slate-200">
                        <p className="mb-2">Henüz ünite seçmediniz.</p>
                        <Link
                            href={`/medya/${owner.slug}/panolar`}
                            className="inline-flex items-center gap-1 text-slate-900 font-medium"
                        >
                            Panolara Git <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                ) : (
                    <ul className="space-y-2 max-h-[360px] overflow-auto pr-1">
                        {selected.map((s) => (
                            <li
                                key={s.id}
                                className="flex items-start gap-2 p-2 rounded-lg border border-slate-200"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-slate-900 line-clamp-1">
                                        {s.name}
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {s.district}, {s.city}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        {PANEL_TYPE_LABELS[s.type] ?? s.type}
                                        {(() => {
                                            const w = weeklyEquivalent(s);
                                            return w ? (
                                                <>
                                                    {" "}·{" "}
                                                    <span className="text-slate-900 font-semibold">
                                                        {formatCurrency(w)}/hf
                                                    </span>
                                                </>
                                            ) : null;
                                        })()}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => remove(s.id)}
                                    className="p-1 text-slate-400 hover:text-red-600"
                                    aria-label="Kaldır"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Toplam (haftalık)</span>
                    <span className="text-lg font-bold text-slate-900">
                        {formatCurrency(totalWeekly)}
                    </span>
                </div>
            </aside>
        </form>
    );
}
