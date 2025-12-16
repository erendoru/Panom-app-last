"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewScreenPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);

        // Convert FormData to object with correct types
        const data = {
            name: formData.get("name"),
            city: formData.get("city"),
            district: formData.get("district"),
            address: formData.get("address"),
            latitude: Number(formData.get("latitude")),
            longitude: Number(formData.get("longitude")),
            resolutionWidth: Number(formData.get("resolutionWidth")),
            resolutionHeight: Number(formData.get("resolutionHeight")),
            orientation: formData.get("orientation"),
            basePricePerPlay: Number(formData.get("basePricePerPlay")),
            loopDurationSec: Number(formData.get("loopDurationSec")),
            slotDurationSec: Number(formData.get("slotDurationSec")),
        };

        try {
            const res = await fetch("/api/owner/screens", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Ekran oluşturulamadı");
            }

            router.push("/app/owner/screens");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/app/owner/screens"
                    className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Ekranlara Dön
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Yeni Ekran Ekle</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ekran Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="name">Ekran Adı</Label>
                            <Input id="name" name="name" placeholder="Örn: Kadıköy Meydan Dev Ekran" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="city">Şehir</Label>
                                <Input id="city" name="city" placeholder="İstanbul" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="district">İlçe</Label>
                                <Input id="district" name="district" placeholder="Kadıköy" required />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Açık Adres</Label>
                            <Input id="address" name="address" placeholder="Caferağa Mah. ..." required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="latitude">Enlem (Latitude)</Label>
                                <Input id="latitude" name="latitude" type="number" step="any" placeholder="41.0082" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="longitude">Boylam (Longitude)</Label>
                                <Input id="longitude" name="longitude" type="number" step="any" placeholder="28.9784" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="resolutionWidth">Genişlik (px)</Label>
                                <Input id="resolutionWidth" name="resolutionWidth" type="number" placeholder="1920" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="resolutionHeight">Yükseklik (px)</Label>
                                <Input id="resolutionHeight" name="resolutionHeight" type="number" placeholder="1080" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="orientation">Yön</Label>
                                <select
                                    id="orientation"
                                    name="orientation"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="LANDSCAPE">Yatay (Landscape)</option>
                                    <option value="PORTRAIT">Dikey (Portrait)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="loopDurationSec">Döngü Süresi (sn)</Label>
                                <Input id="loopDurationSec" name="loopDurationSec" type="number" defaultValue={60} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slotDurationSec">Slot Süresi (sn)</Label>
                                <Input id="slotDurationSec" name="slotDurationSec" type="number" defaultValue={10} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="basePricePerPlay">Gösterim Başı Fiyat (₺)</Label>
                                <Input id="basePricePerPlay" name="basePricePerPlay" type="number" step="0.01" placeholder="0.50" required />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Kaydediliyor..." : "Ekranı Oluştur"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
