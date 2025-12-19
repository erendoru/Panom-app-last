"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Trash2, Upload, X } from "lucide-react";
import Link from "next/link";
import { TURKEY_DISTRICTS } from "@/lib/turkey-data";
import Image from "next/image";

export default function EditStaticPanelPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        type: "BILLBOARD",
        city: "İstanbul",
        district: "",
        address: "",
        latitude: "",
        longitude: "",
        width: "",
        height: "",
        priceWeekly: "",
        priceDaily: "",
        isDailyRentable: false,
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
                    priceDaily: data.priceDaily ? data.priceDaily.toString() : "",
                    isDailyRentable: (data.minRentalDays === 1),
                    imageUrl: data.imageUrl || "",
                    active: data.active,
                    locationType: data.locationType || "OPEN_AREA",
                    socialGrade: data.socialGrade || "B",
                    avmName: data.avmName || "",
                    trafficLevel: data.trafficLevel || "MEDIUM"
                });
                setAvailableDistricts(TURKEY_DISTRICTS[data.city] || []);
            })
            .catch(err => {
                console.error(err);
                alert("Pano bulunamadı");
                router.push("/app/admin/static-panels");
            })
            .finally(() => setLoading(false));
    }, [params.id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (name === "city") {
            setFormData(prev => ({
                ...prev,
                city: value,
                district: "" // Reset district when city changes 
            }));
            setAvailableDistricts(TURKEY_DISTRICTS[value] || []);
        } else if (name === "isDailyRentable") {
            setFormData(prev => ({
                ...prev,
                isDailyRentable: (e.target as HTMLInputElement).checked
            }));
        } else if (name === "active") {
            setFormData(prev => ({ ...prev, active: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];
        setUploading(true);

        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: data
            });

            if (!res.ok) throw new Error("Upload failed");

            const json = await res.json();
            setFormData(prev => ({ ...prev, imageUrl: json.url }));
        } catch (error) {
            console.error("Upload error:", error);
            alert("Görsel yüklenirken bir hata oluştu.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            ...formData,
            width: parseFloat(formData.width),
            height: parseFloat(formData.height),
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            priceWeekly: parseFloat(formData.priceWeekly),
            priceDaily: formData.isDailyRentable && formData.priceDaily ? parseFloat(formData.priceDaily) : null,
            minRentalDays: formData.isDailyRentable ? 1 : 7,
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
                            <select
                                name="city"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                                onChange={handleChange}
                                value={formData.city}
                            >
                                {Object.keys(TURKEY_DISTRICTS).sort().map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>İlçe</Label>
                            <select
                                name="district"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                                onChange={handleChange}
                                value={formData.district}
                            >
                                <option value="">İlçe Seçin</option>
                                {availableDistricts.sort().map(dist => (
                                    <option key={dist} value={dist}>{dist}</option>
                                ))}
                            </select>
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

                    {/* Pricing Section - Updated for Daily Rental */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                        <h3 className="font-semibold text-sm text-slate-700">Fiyatlandırma & Kiralama Tipi</h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Haftalık Fiyat (TL)</Label>
                                <Input
                                    name="priceWeekly"
                                    type="number"
                                    required
                                    placeholder="15000"
                                    onChange={handleChange}
                                    value={formData.priceWeekly}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="isDailyRentable"
                                        checked={formData.isDailyRentable}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    Günlük Kiralanabilir
                                </Label>
                                {formData.isDailyRentable ? (
                                    <Input
                                        name="priceDaily"
                                        type="number"
                                        required
                                        placeholder="2500"
                                        onChange={handleChange}
                                        value={formData.priceDaily}
                                    />
                                ) : (
                                    <div className="text-xs text-slate-500 pt-2">
                                        Bu pano sadece haftalık kiralanabilir (Min 7 gün).
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Pano Görseli</Label>

                        {formData.imageUrl ? (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                <Image src={formData.imageUrl} alt="Panel" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors relative">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                            <p>Yükleniyor...</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8" />
                                            <p>Görsel yüklemek için tıklayın veya sürükleyin</p>
                                            <p className="text-xs text-slate-400">PNG, JPG (Max 10MB)</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        <input type="hidden" name="imageUrl" value={formData.imageUrl} required />
                    </div>

                    <div className="flex items-center space-x-2 pt-2 pb-2">
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            className="w-4 h-4"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        />
                        <Label htmlFor="active">Panoyu aktif olarak yayınla</Label>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full" disabled={saving || uploading}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Değişiklikleri Kaydet
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
