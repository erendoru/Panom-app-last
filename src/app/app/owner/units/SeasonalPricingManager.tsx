"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Loader2, TagIcon, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type Pricing = {
    id: string;
    name: string;
    priceType: "STANDARD" | "SEASONAL" | "PROMOTIONAL";
    priceWeekly: number;
    priceDaily: number | null;
    startDate: string;
    endDate: string;
    priority: number;
    active: boolean;
};

const TYPE_LABEL: Record<Pricing["priceType"], string> = {
    STANDARD: "Standart",
    SEASONAL: "Dönemsel",
    PROMOTIONAL: "Kampanya",
};

const TYPE_COLOR: Record<Pricing["priceType"], string> = {
    STANDARD: "bg-slate-100 text-slate-700",
    SEASONAL: "bg-blue-50 text-blue-700",
    PROMOTIONAL: "bg-purple-50 text-purple-700",
};

function fmtDate(iso: string) {
    try {
        return new Date(iso).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    } catch {
        return iso;
    }
}

function today() {
    return new Date().toISOString().slice(0, 10);
}

export default function SeasonalPricingManager({ panelId }: { panelId: string }) {
    const [pricings, setPricings] = useState<Pricing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        priceType: "SEASONAL" as Pricing["priceType"],
        priceWeekly: "",
        priceDaily: "",
        startDate: today(),
        endDate: today(),
        priority: 0,
    });

    const reload = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/owner/units/${panelId}/pricing`);
            if (!res.ok) throw new Error("Fiyatlar yüklenemedi");
            const data = await res.json();
            setPricings(Array.isArray(data) ? data : []);
        } catch (e: any) {
            setError(e?.message || "Hata");
        } finally {
            setLoading(false);
        }
    }, [panelId]);

    useEffect(() => {
        reload();
    }, [reload]);

    async function save(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`/api/owner/units/${panelId}/pricing`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    priceType: form.priceType,
                    priceWeekly: form.priceWeekly,
                    priceDaily: form.priceDaily || null,
                    startDate: new Date(form.startDate).toISOString(),
                    endDate: new Date(form.endDate).toISOString(),
                    priority: Number(form.priority) || 0,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error || "Eklenemedi");
            setShowForm(false);
            setForm({
                name: "",
                priceType: "SEASONAL",
                priceWeekly: "",
                priceDaily: "",
                startDate: today(),
                endDate: today(),
                priority: 0,
            });
            await reload();
        } catch (e: any) {
            setError(e?.message || "Hata");
        } finally {
            setSaving(false);
        }
    }

    async function toggle(p: Pricing) {
        try {
            const res = await fetch(
                `/api/owner/units/${panelId}/pricing/${p.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ active: !p.active }),
                }
            );
            if (!res.ok) throw new Error("Güncellenemedi");
            await reload();
        } catch (e: any) {
            alert(e?.message || "Hata");
        }
    }

    async function remove(p: Pricing) {
        if (!confirm(`"${p.name}" adlı fiyatı silmek istiyor musunuz?`)) return;
        try {
            const res = await fetch(
                `/api/owner/units/${panelId}/pricing/${p.id}`,
                { method: "DELETE" }
            );
            if (!res.ok) throw new Error("Silinemedi");
            await reload();
        } catch (e: any) {
            alert(e?.message || "Hata");
        }
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-lg p-3 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-sm text-slate-500 text-center py-4">
                    <Loader2 className="w-4 h-4 inline animate-spin mr-1" /> Yükleniyor...
                </div>
            ) : pricings.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
                    <TagIcon className="w-6 h-6 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">
                        Henüz dönemsel fiyat tanımlamadınız.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {pricings.map((p) => (
                        <div
                            key={p.id}
                            className={`flex items-center justify-between gap-4 rounded-lg border p-3 ${p.active
                                ? "bg-white border-slate-200"
                                : "bg-slate-50 border-slate-200 opacity-70"
                                }`}
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-slate-900 truncate">
                                        {p.name}
                                    </span>
                                    <span
                                        className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${TYPE_COLOR[p.priceType]}`}
                                    >
                                        {TYPE_LABEL[p.priceType]}
                                    </span>
                                    {!p.active && (
                                        <span className="text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                                            Pasif
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5">
                                    {fmtDate(p.startDate)} → {fmtDate(p.endDate)} ·{" "}
                                    <span className="text-slate-700 font-medium">
                                        {Number(p.priceWeekly).toLocaleString("tr-TR")} ₺/hafta
                                    </span>
                                    {p.priceDaily ? (
                                        <span>
                                            {" "}· {Number(p.priceDaily).toLocaleString("tr-TR")} ₺/gün
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => toggle(p)}
                                    className="p-2 text-slate-500 hover:text-slate-900 rounded"
                                    title={p.active ? "Pasifleştir" : "Aktifleştir"}
                                    type="button"
                                >
                                    {p.active ? (
                                        <Power className="w-4 h-4" />
                                    ) : (
                                        <PowerOff className="w-4 h-4" />
                                    )}
                                </button>
                                <button
                                    onClick={() => remove(p)}
                                    className="p-2 text-slate-400 hover:text-red-600 rounded"
                                    title="Sil"
                                    type="button"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!showForm ? (
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(true)}
                    className="w-full"
                >
                    <Plus className="w-4 h-4 mr-1" /> Yeni Dönemsel Fiyat Ekle
                </Button>
            ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">
                                Ad
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                placeholder="Örn: Bayram Dönemi"
                                required
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">
                                Fiyat Tipi
                            </label>
                            <select
                                value={form.priceType}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        priceType: e.target.value as Pricing["priceType"],
                                    }))
                                }
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                            >
                                <option value="SEASONAL">Dönemsel</option>
                                <option value="PROMOTIONAL">Kampanya</option>
                                <option value="STANDARD">Standart</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">
                                Başlangıç
                            </label>
                            <input
                                type="date"
                                value={form.startDate}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, startDate: e.target.value }))
                                }
                                required
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">
                                Bitiş
                            </label>
                            <input
                                type="date"
                                value={form.endDate}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, endDate: e.target.value }))
                                }
                                required
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">
                                Haftalık Fiyat (₺)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.priceWeekly}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, priceWeekly: e.target.value }))
                                }
                                required
                                placeholder="18000"
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">
                                Günlük Fiyat (₺) — opsiyonel
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.priceDaily}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, priceDaily: e.target.value }))
                                }
                                placeholder="3000"
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600 block mb-1">
                                Öncelik
                            </label>
                            <input
                                type="number"
                                value={form.priority}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, priority: Number(e.target.value) }))
                                }
                                placeholder="0"
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                            />
                            <p className="text-[11px] text-slate-500 mt-1">
                                Çakışan fiyatlarda yüksek öncelikli kazanır (varsayılan: 0).
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowForm(false)}
                            disabled={saving}
                        >
                            Vazgeç
                        </Button>
                        <Button type="button" onClick={save} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Kaydediliyor
                                </>
                            ) : (
                                "Kaydet"
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
