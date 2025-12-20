"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TURKEY_DISTRICTS } from "@/lib/turkey-data";
import ImageUploader from "@/components/ImageUploader";

export default function NewStaticPanelPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: "",
        type: "BILLBOARD", // Default adjusted to match value
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
        // New Fields
        locationType: "OPEN_AREA",
        socialGrade: "B",
        avmName: "",
        trafficLevel: "MEDIUM"
    });

    const [availableDistricts, setAvailableDistricts] = useState<string[]>(TURKEY_DISTRICTS["İstanbul"] || []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

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
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Prepare payload
        const payload = {
            ...formData,
            // Convert types correctly
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
            const res = await fetch("/api/admin/static-panels", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/app/admin/static-panels");
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.error || "Hata oluştu");
            }
        } catch (error) {
            console.error(error);
            alert("Bir bağlantı hatası oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
            <Link href="/app/admin/static-panels" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Listeye Dön
            </Link>

            <div className="bg-white p-4 md:p-8 rounded-xl border shadow-sm">
                <h1 className="text-2xl font-bold mb-6">Yeni Pano Ekle</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                            <Label>Pano Adı</Label>
                            <Input name="name" required placeholder="Örn: Kadıköy Meydan Dev Billboard" onChange={handleChange} value={formData.name} />
                        </div>
                        <div className="space-y-2">
                            <Label>Pano Türü</Label>
                            <select
                                name="type"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="space-y-2">
                            <Label>Konum Tipi</Label>
                            <select
                                name="locationType"
                                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                            <Input name="avmName" required placeholder="Örn: Akasya AVM" onChange={handleChange} value={formData.avmName} />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                        <Input name="address" required placeholder="Tam adres..." onChange={handleChange} value={formData.address} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative">
                        <div className="space-y-2">
                            <Label>Enlem (Latitude)</Label>
                            <Input
                                name="latitude"
                                type="number"
                                step="any"
                                required
                                placeholder="41.xxxx"
                                value={formData.latitude}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Boylam (Longitude)</Label>
                            <Input
                                name="longitude"
                                type="number"
                                step="any"
                                required
                                placeholder="29.xxxx"
                                value={formData.longitude}
                                onChange={handleChange}
                            />
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute -top-1 right-0 text-xs h-6"
                            onClick={() => {
                                if (navigator.geolocation) {
                                    navigator.geolocation.getCurrentPosition((position) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            latitude: position.coords.latitude.toString(),
                                            longitude: position.coords.longitude.toString()
                                        }));
                                    });
                                } else {
                                    alert("Tarayıcınız konum servisini desteklemiyor.");
                                }
                            }}
                        >
                            📍 Konumumu Kullan
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        <div className="space-y-2">
                            <Label>Genişlik (m)</Label>
                            <Input name="width" type="number" step="0.1" required placeholder="10" onChange={handleChange} value={formData.width} />
                        </div>
                        <div className="space-y-2">
                            <Label>Yükseklik (m)</Label>
                            <Input name="height" type="number" step="0.1" required placeholder="5" onChange={handleChange} value={formData.height} />
                        </div>
                        <div className="space-y-2">
                            <Label>Trafik Yoğunluğu</Label>
                            <select
                                name="trafficLevel"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                        <ImageUploader
                            imageUrl={formData.imageUrl}
                            onImageChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                            disabled={loading}
                        />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Panoyu Oluştur
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
