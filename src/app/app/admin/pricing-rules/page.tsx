"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Check, X, Zap } from "lucide-react";
import { PANEL_TYPE_LABELS, TURKEY_CITIES } from "@/lib/turkey-data";

interface PricingRule {
    id: string;
    name: string;
    panelType: string | null;
    ownerName: string | null;
    city: string | null;
    minQuantity: number;
    discountPercent: number | null;
    fixedUnitPrice: number | null;
    priority: number;
    active: boolean;
    createdAt: string;
}

export default function PricingRulesPage() {
    const [rules, setRules] = useState<PricingRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        panelType: "",
        ownerName: "",
        city: "",
        minQuantity: "20",
        discountPercent: "",
        fixedUnitPrice: "",
        priority: "0",
        active: true
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const res = await fetch("/api/admin/pricing-rules");
            if (res.ok) {
                const data = await res.json();
                setRules(data);
            }
        } catch (error) {
            console.error("Error fetching rules:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingId
            ? `/api/admin/pricing-rules/${editingId}`
            : "/api/admin/pricing-rules";
        const method = editingId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchRules();
                resetForm();
            }
        } catch (error) {
            console.error("Error saving rule:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu kuralı silmek istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/admin/pricing-rules/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchRules();
            }
        } catch (error) {
            console.error("Error deleting rule:", error);
        }
    };

    const handleEdit = (rule: PricingRule) => {
        setEditingId(rule.id);
        setFormData({
            name: rule.name,
            panelType: rule.panelType || "",
            ownerName: rule.ownerName || "",
            city: rule.city || "",
            minQuantity: String(rule.minQuantity),
            discountPercent: rule.discountPercent ? String(rule.discountPercent) : "",
            fixedUnitPrice: rule.fixedUnitPrice ? String(rule.fixedUnitPrice) : "",
            priority: String(rule.priority),
            active: rule.active
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            panelType: "",
            ownerName: "",
            city: "",
            minQuantity: "20",
            discountPercent: "",
            fixedUnitPrice: "",
            priority: "0",
            active: true
        });
        setEditingId(null);
        setShowForm(false);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(value);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Fiyatlandırma Kuralları</h1>
                    <p className="text-slate-600">Toplu alımlarda uygulanacak indirim kurallarını yönetin</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Kural Ekle
                </Button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">{editingId ? "Kuralı Düzenle" : "Yeni Kural"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kural Adı *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Örn: Kentvizyon CLP 20+ İndirimi"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Adet *</label>
                                <input
                                    type="number"
                                    value={formData.minQuantity}
                                    onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                                    placeholder="20"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pano Türü (Opsiyonel)</label>
                                <select
                                    value={formData.panelType}
                                    onChange={(e) => setFormData({ ...formData, panelType: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                >
                                    <option value="">Tüm Türler</option>
                                    {Object.entries(PANEL_TYPE_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pano Sahibi (Opsiyonel)</label>
                                <input
                                    type="text"
                                    value={formData.ownerName}
                                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                    placeholder="Örn: Kentvizyon"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Şehir (Opsiyonel)</label>
                                <select
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                >
                                    <option value="">Tüm Şehirler</option>
                                    {TURKEY_CITIES.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">İndirim Yüzdesi (%)</label>
                                <input
                                    type="number"
                                    value={formData.discountPercent}
                                    onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value, fixedUnitPrice: "" })}
                                    placeholder="Örn: 25"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                                <p className="text-xs text-slate-500 mt-1">Ya yüzde ya da sabit fiyat girin</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sabit Birim Fiyat (TL)</label>
                                <input
                                    type="number"
                                    value={formData.fixedUnitPrice}
                                    onChange={(e) => setFormData({ ...formData, fixedUnitPrice: e.target.value, discountPercent: "" })}
                                    placeholder="Örn: 1500"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Öncelik</label>
                                <input
                                    type="number"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                                <p className="text-xs text-slate-500 mt-1">Yüksek değer = yüksek öncelik</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="active"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <label htmlFor="active" className="text-sm text-slate-700">Aktif</label>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={resetForm}>
                                İptal
                            </Button>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                {editingId ? "Güncelle" : "Oluştur"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Rules List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-500">Yükleniyor...</div>
                ) : rules.length === 0 ? (
                    <div className="p-12 text-center">
                        <Zap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">Henüz kural eklenmemiş</h3>
                        <p className="text-slate-500 mb-4">Toplu indirimler için ilk kuralınızı ekleyin</p>
                        <Button onClick={() => setShowForm(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Kural Ekle
                        </Button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Kural</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Filtreler</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Min Adet</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">İndirim</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Durum</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-slate-500">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-4">
                                        <div className="font-medium text-slate-900">{rule.name}</div>
                                        <div className="text-xs text-slate-500">Öncelik: {rule.priority}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {rule.panelType && (
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                                                    {PANEL_TYPE_LABELS[rule.panelType as keyof typeof PANEL_TYPE_LABELS] || rule.panelType}
                                                </span>
                                            )}
                                            {rule.ownerName && (
                                                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">
                                                    {rule.ownerName}
                                                </span>
                                            )}
                                            {rule.city && (
                                                <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded">
                                                    {rule.city}
                                                </span>
                                            )}
                                            {!rule.panelType && !rule.ownerName && !rule.city && (
                                                <span className="text-slate-400 text-xs">Tüm panolar</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="font-medium">{rule.minQuantity}+</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        {rule.discountPercent ? (
                                            <span className="text-green-600 font-medium">%{rule.discountPercent}</span>
                                        ) : rule.fixedUnitPrice ? (
                                            <span className="text-green-600 font-medium">{formatCurrency(rule.fixedUnitPrice)}/adet</span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        {rule.active ? (
                                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                <Check className="w-3 h-3 mr-1" /> Aktif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                                <X className="w-3 h-3 mr-1" /> Pasif
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(rule)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(rule.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
