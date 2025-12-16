"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createScreen } from "./actions"; // We will create this
import { TURKEY_CITIES } from "@/lib/turkey-data";

export default function NewScreenPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        try {
            const result = await createScreen(formData);
            if (result.error) {
                setError(result.error);
            } else {
                router.push("/app/admin/screens");
                router.refresh();
            }
        } catch (e) {
            setError("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto max-w-2xl py-8">
            <div className="mb-6">
                <Link
                    href="/app/admin/screens"
                    className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Listeye Dön
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Yeni Ekran Ekle</h1>
                <p className="text-slate-500">Dijital ekran bilgilerini giriniz.</p>
            </div>

            <form action={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Ekran Adı</Label>
                        <Input id="name" name="name" placeholder="Örn: Kadıköy Meydan LED" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="city">Şehir</Label>
                            <select
                                id="city"
                                name="city"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="">Şehir Seçin</option>
                                {Object.keys(TURKEY_CITIES).map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="district">İlçe</Label>
                            <Input id="district" name="district" placeholder="Örn: Kadıköy" required />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Açık Adres</Label>
                        <Input id="address" name="address" placeholder="Söğütlüçeşme Cd. No:1" required />
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="resolutionWidth">Genişlik (px)</Label>
                            <Input id="resolutionWidth" name="resolutionWidth" type="number" placeholder="1920" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="resolutionHeight">Yükseklik (px)</Label>
                            <Input id="resolutionHeight" name="resolutionHeight" type="number" placeholder="1080" required />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="basePricePerPlay">Oynatma Başına Taban Fiyat (TL)</Label>
                        <Input id="basePricePerPlay" name="basePricePerPlay" type="number" min="0" step="0.01" placeholder="0.50" required />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link href="/app/admin/screens">
                        <Button variant="outline" type="button">İptal</Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
