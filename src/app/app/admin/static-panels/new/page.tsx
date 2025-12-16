"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewStaticPanelPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        type: "Billboard", // Default
        city: "İstanbul",
        district: "",
        address: "",
        latitude: "",
        longitude: "",
        width: "",
        height: "",
        priceWeekly: "",
        imageUrl: "",
        // New Fields
        locationType: "OPEN_AREA",
        socialGrade: "B", // Default
        avmName: "",
        trafficLevel: "MEDIUM"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Prepare payload - handle isAVM logic based on locationType
        const payload = {
            ...formData,
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
                alert("Hata oluştu");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <Link href="/app/admin/static-panels" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Listeye Dön
            </Link>

            <div className="bg-white p-8 rounded-xl border shadow-sm">
                <h1 className="text-2xl font-bold mb-6">Yeni Pano Ekle</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Pano Adı</Label>
                            <Input name="name" required placeholder="Örn: Kadıköy Meydan Dev Billboard" onChange={handleChange} />
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
                    <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
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
                            <Input name="avmName" required placeholder="Örn: Akasya AVM" onChange={handleChange} />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Şehir</Label>
                            <Input name="city" required defaultValue="İstanbul" onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>İlçe</Label>
                            <Input name="district" required placeholder="Örn: Kadıköy" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Açık Adres</Label>
                        <Input name="address" required placeholder="Tam adres..." onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-6 relative">
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

                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Genişlik (m)</Label>
                            <Input name="width" type="number" step="0.1" required placeholder="10" onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Yükseklik (m)</Label>
                            <Input name="height" type="number" step="0.1" required placeholder="5" onChange={handleChange} />
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

                    <div className="space-y-2">
                        <Label>Haftalık Fiyat (TL)</Label>
                        <Input name="priceWeekly" type="number" required placeholder="15000" onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label>Görsel URL</Label>
                        <Input name="imageUrl" placeholder="https://..." onChange={handleChange} />
                        <p className="text-xs text-slate-500">Şimdilik harici bir URL girin.</p>
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
