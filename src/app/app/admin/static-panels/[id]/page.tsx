"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditStaticPanelPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        type: "Billboard",
        city: "İstanbul",
        district: "",
        address: "",
        latitude: "",
        longitude: "",
        width: "",
        height: "",
        priceWeekly: "",
        imageUrl: "",
        active: true,
        // New Fields
        locationType: "OPEN_AREA",
        socialGrade: "B",
        avmName: "",
        trafficLevel: "MEDIUM"
    });

    useEffect(() => {
        fetch(`/api/admin/static-panels/${params.id}`)
            .then(res => {
                if (!res.ok) throw new Error("Panel not found");
                return res.json();
            })
            .then(data => {
                setFormData({
                    name: data.name,
                    type: data.type,
                    city: data.city,
                    district: data.district,
                    address: data.address,
                    latitude: data.latitude.toString(),
                    longitude: data.longitude.toString(),
                    width: data.width.toString(),
                    height: data.height.toString(),
                    priceWeekly: data.priceWeekly.toString(),
                    imageUrl: data.imageUrl || "",
                    active: data.active,
                    locationType: data.locationType || "OPEN_AREA",
                    socialGrade: data.socialGrade || "B",
                    avmName: data.avmName || "",
                    trafficLevel: data.trafficLevel || "MEDIUM"
                });
            })
            .catch(err => {
                console.error(err);
                alert("Pano bulunamadı");
                router.push("/app/admin/static-panels");
            })
            .finally(() => setLoading(false));
    }, [params.id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Prepare payload - handle isAVM logic based on locationType
        const payload = {
            ...formData,
            isAVM: formData.locationType === 'AVM',
            avmName: formData.locationType === 'AVM' ? formData.avmName : null
        };

        try {
            const res = await fetch(`/api/admin/static-panels/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/app/admin/static-panels");
                router.refresh();
            } else {
                alert("Güncelleme başarısız");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Bu panoyu silmek istediğinize emin misiniz?")) return;
        setDeleting(true);

        try {
            const res = await fetch(`/api/admin/static-panels/${params.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/app/admin/static-panels");
                router.refresh();
            } else {
                alert("Silme başarısız");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="mx-auto w-8 h-8 animate-spin text-slate-400" /></div>;

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <Link href="/app/admin/static-panels" className="text-slate-500 hover:text-slate-900 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Listeye Dön
                </Link>
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Panoyu Sil
                </Button>
            </div>

            <div className="bg-white p-8 rounded-xl border shadow-sm">
                <h1 className="text-2xl font-bold mb-6">Pano Düzenle</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Pano Adı</Label>
                            <Input name="name" required value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Pano Türü</Label>
                            <select
                                name="type"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                                onChange={handleChange}
                                value={formData.type}
                            >
                                <option value="BILLBOARD">Billboard</option>
                                <option value="BILLBOARD_PLUS">Billboard Plus</option>
                                <option value="GIANTBOARD">Giantboard</option>
                                <option value="MEGALIGHT">Megalight</option>
                                <option value="CLP">Raket (CLP)</option>
                                <option value="MEGABOARD">Megaboard</option>
                                <option value="KULEBOARD">Kuleboard</option>
                                <option value="ALINLIK">Alınlık</option>
                                <option value="LIGHTBOX">Lightbox</option>
                                <option value="MAXIBOARD">Maxiboard</option>
                                <option value="YOL_PANOSU">Yol Panosu</option>
                            </select>
                        </div>
                    </div>

                    {/* New Location & Grade Config */}
                    <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="space-y-2">
                            <Label>Konum Tipi</Label>
                            <select
                                name="locationType"
                                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                                onChange={handleChange}
                                value={formData.locationType}
                            >
                                <option value="OPEN_AREA">Açık Alan</option>
                                <option value="AVM">AVM</option>
                                <option value="HIGHWAY">Otoban</option>
                                <option value="MAIN_ROAD">Ana Yol (E-5 vb.)</option>
                                <option value="CITY_CENTER">Şehir Merkezi</option>
                                <option value="SQUARE">Meydan</option>
                                <option value="STREET">Cadde/Sokak</option>
                                <option value="OTHER">Diğer</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Sosyal Sınıf (Skor)</Label>
                            <select
                                name="socialGrade"
                                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                                onChange={handleChange}
                                value={formData.socialGrade}
                            >
                                <option value="A_PLUS">A+ (Premium)</option>
                                <option value="A">A (Çok Yüksek)</option>
                                <option value="B">B (Yüksek)</option>
                                <option value="C">C (Orta)</option>
                                <option value="D">D (Standart)</option>
                            </select>
                        </div>
                    </div>

                    {formData.locationType === 'AVM' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label>AVM Adı</Label>
                            <Input name="avmName" required value={formData.avmName} onChange={handleChange} />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Şehir</Label>
                            <Input name="city" required value={formData.city} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>İlçe</Label>
                            <Input name="district" required value={formData.district} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Açık Adres</Label>
                        <Input name="address" required value={formData.address} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Enlem</Label>
                            <Input name="latitude" type="number" step="any" required value={formData.latitude} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Boylam</Label>
                            <Input name="longitude" type="number" step="any" required value={formData.longitude} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Genişlik (m)</Label>
                            <Input name="width" type="number" step="0.1" required value={formData.width} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Yükseklik (m)</Label>
                            <Input name="height" type="number" step="0.1" required value={formData.height} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Trafik Yoğunluğu</Label>
                            <select
                                name="trafficLevel"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                                onChange={handleChange}
                                value={formData.trafficLevel}
                            >
                                <option value="MEDIUM">Orta</option>
                                <option value="HIGH">Yüksek</option>
                                <option value="VERY_HIGH">Çok Yüksek</option>
                                <option value="LOW">Düşük</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Haftalık Fiyat (TL)</Label>
                        <Input name="priceWeekly" type="number" required value={formData.priceWeekly} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label>Görsel URL</Label>
                        <Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                    </div>

                    <div className="flex items-center space-x-2 pt-2 pb-2">
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            className="w-4 h-4"
                            checked={formData.active}
                            // @ts-ignore
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        />
                        <Label htmlFor="active">Panoyu aktif olarak yayınla</Label>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full" disabled={saving}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Değişiklikleri Kaydet
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
