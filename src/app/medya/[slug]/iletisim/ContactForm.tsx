"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useStore } from "../StoreContext";

export default function ContactForm() {
    const { owner } = useStore();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        website: "", // honeypot
    });
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        if (!form.name.trim()) return setErr("Ad Soyad gerekli.");
        if (!form.email.trim()) return setErr("E-posta gerekli.");
        if (!form.message.trim()) return setErr("Mesajınızı yazın.");

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
                    message: form.message.trim(),
                    website: form.website,
                    panels: [],
                }),
            });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                setErr(j?.error || "Gönderilemedi.");
            } else {
                setDone(true);
            }
        } catch {
            setErr("Bağlantı hatası.");
        } finally {
            setSending(false);
        }
    }

    if (done) {
        return (
            <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Mesajınız gönderildi</h3>
                <p className="text-sm text-slate-600">
                    {owner.companyName} ekibi en kısa sürede size dönüş yapacak.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Ad Soyad *</label>
                    <Input
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">E-posta *</label>
                    <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Telefon</label>
                    <Input
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Firma</label>
                    <Input
                        value={form.company}
                        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Mesajınız *</label>
                <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={6}
                    maxLength={2000}
                    required
                    placeholder="Nasıl yardımcı olabiliriz?"
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

            <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-xs text-slate-500">
                    Mesajınız {owner.companyName} ekibine iletilir.
                </p>
                <Button type="submit" disabled={sending} className="bg-slate-900 hover:bg-slate-800 text-white">
                    {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Send className="w-4 h-4 mr-2" />
                    )}
                    Gönder
                </Button>
            </div>
        </form>
    );
}
