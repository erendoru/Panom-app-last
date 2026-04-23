"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import MultiImageUploader from "@/components/MultiImageUploader";
import TagsInput from "@/components/form/TagsInput";
import SeasonalPricingManager from "./SeasonalPricingManager";
import {
    TURKEY_CITIES,
    TURKEY_DISTRICTS,
    PANEL_TYPE_LABELS,
} from "@/lib/turkey-data";

const MapPicker = dynamicImport(() => import("@/components/MapPicker"), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] bg-slate-100 rounded-lg flex items-center justify-center text-sm text-slate-500">
            Harita yükleniyor...
        </div>
    ),
});

type Mode = "create" | "edit";

type FormState = {
    name: string;
    type: string;
    subType: string;
    city: string;
    district: string;
    address: string;
    latitude: string;
    longitude: string;
    width: string;
    height: string;
    faceCount: number;
    lighting: string;
    priceWeekly: string;
    priceDaily: string;
    priceMonthly: string;
    price3Month: string;
    price6Month: string;
    priceYearly: string;
    printingFee: string;
    estimatedDailyImpressions: string;
    estimatedCpm: string;
    description: string;
    isStartingPrice: boolean;
    placementContext: string;
    manualRoadType: string;
    manualDailyTraffic: string;
    manualPoiCount: string;
};

const INITIAL: FormState = {
    name: "",
    type: "BILLBOARD",
    subType: "",
    city: "",
    district: "",
    address: "",
    latitude: "",
    longitude: "",
    width: "",
    height: "",
    faceCount: 1,
    lighting: "LIGHTED",
    priceWeekly: "",
    priceDaily: "",
    priceMonthly: "",
    price3Month: "",
    price6Month: "",
    priceYearly: "",
    printingFee: "",
    estimatedDailyImpressions: "",
    estimatedCpm: "",
    description: "",
    isStartingPrice: false,
    placementContext: "",
    manualRoadType: "",
    manualDailyTraffic: "",
    manualPoiCount: "",
};

export default function OwnerUnitForm({
    mode,
    panelId,
    initial,
    initialImages,
    initialNearbyTags,
}: {
    mode: Mode;
    panelId?: string;
    initial?: Partial<FormState>;
    initialImages?: string[];
    initialNearbyTags?: string[];
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<FormState>({ ...INITIAL, ...initial });
    const [images, setImages] = useState<string[]>(initialImages || []);
    const [nearbyTags, setNearbyTags] = useState<string[]>(initialNearbyTags || []);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initial) setForm({ ...INITIAL, ...initial });
        if (initialImages) setImages(initialImages);
        if (initialNearbyTags) setNearbyTags(initialNearbyTags);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [panelId]);

    const districts = form.city ? TURKEY_DISTRICTS[form.city] || [] : [];

    function change<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => {
            const next = { ...prev, [key]: value };
            if (key === "city") next.district = "";
            return next;
        });
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (images.length < 1) {
            setError("En az 1 fotoğraf yüklemelisiniz.");
            return;
        }
        if (!form.latitude || !form.longitude) {
            setError("Haritadan konum seçmelisiniz.");
            return;
        }

        // En az bir fiyat (günlük, haftalık, aylık, 3/6/12 aylık) girilmeli
        const priceFields = [
            form.priceDaily,
            form.priceWeekly,
            form.priceMonthly,
            form.price3Month,
            form.price6Month,
            form.priceYearly,
        ];
        const hasAnyPrice = priceFields.some((v) => {
            const n = parseFloat(String(v || ""));
            return Number.isFinite(n) && n > 0;
        });
        if (!hasAnyPrice) {
            setError(
                "En az bir fiyat (günlük, haftalık, aylık, 3 aylık, 6 aylık veya yıllık) girmelisiniz.",
            );
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...form,
                faceCount: Number(form.faceCount) || 1,
                imageUrls: images,
                nearbyTags,
                isStartingPrice: Boolean(form.isStartingPrice),
            };

            const url =
                mode === "create"
                    ? "/api/owner/units"
                    : `/api/owner/units/${panelId}`;
            const method = mode === "create" ? "POST" : "PATCH";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data?.error || "İşlem başarısız");
            }
            router.push("/app/owner/units");
            router.refresh();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/app/owner/units"
                    className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Ünitelerim
                </Link>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-2">
                    {mode === "create" ? "Yeni Ünite Ekle" : "Üniteyi Düzenle"}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Billboard, CLP, raket, megalight veya diğer outdoor panolarınızı ekleyin.
                </p>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-lg p-3 text-sm">
                    {error}
                </div>
            )}

            <form
                onSubmit={submit}
                className="bg-white rounded-xl border border-slate-200 p-4 md:p-8 space-y-8"
            >
                <Section title="Temel Bilgiler">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Ünite Adı" required>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => change("name", e.target.value)}
                                required
                                placeholder="Örn: Bağdat Caddesi Suadiye Park Girişi"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Pano Tipi" required>
                            <select
                                value={form.type}
                                onChange={(e) => change("type", e.target.value)}
                                className={inputClass}
                                required
                            >
                                {Object.entries(PANEL_TYPE_LABELS).map(([k, v]) => (
                                    <option key={k} value={k}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Alt Tür (opsiyonel)">
                            <input
                                type="text"
                                value={form.subType}
                                onChange={(e) => change("subType", e.target.value)}
                                placeholder="Örn: İçmekan, Dışmekan"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Yüz Sayısı">
                            <select
                                value={form.faceCount}
                                onChange={(e) => change("faceCount", Number(e.target.value))}
                                className={inputClass}
                            >
                                <option value={1}>Tek Yüz</option>
                                <option value={2}>Çift Yüz</option>
                            </select>
                        </Field>
                        <Field label="Aydınlatma">
                            <select
                                value={form.lighting}
                                onChange={(e) => change("lighting", e.target.value)}
                                className={inputClass}
                            >
                                <option value="LIGHTED">Işıklı</option>
                                <option value="UNLIGHTED">Işıksız</option>
                                <option value="DIGITAL">Dijital</option>
                            </select>
                        </Field>
                    </div>
                </Section>

                <Section title="Lokasyon">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="İl" required>
                            <select
                                value={form.city}
                                onChange={(e) => change("city", e.target.value)}
                                required
                                className={inputClass}
                            >
                                <option value="">Seçiniz</option>
                                {TURKEY_CITIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="İlçe" required>
                            <select
                                value={form.district}
                                onChange={(e) => change("district", e.target.value)}
                                required
                                disabled={!form.city || districts.length === 0}
                                className={`${inputClass} disabled:bg-slate-100`}
                            >
                                <option value="">Seçiniz</option>
                                {districts.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <div className="md:col-span-2">
                            <Field label="Adres" required>
                                <textarea
                                    value={form.address}
                                    onChange={(e) => change("address", e.target.value)}
                                    required
                                    rows={2}
                                    placeholder="Tam adresi giriniz"
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                        <Field label="Enlem (Latitude)" required>
                            <input
                                type="number"
                                step="any"
                                value={form.latitude}
                                onChange={(e) => change("latitude", e.target.value)}
                                required
                                placeholder="41.01..."
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Boylam (Longitude)" required>
                            <input
                                type="number"
                                step="any"
                                value={form.longitude}
                                onChange={(e) => change("longitude", e.target.value)}
                                required
                                placeholder="29.02..."
                                className={inputClass}
                            />
                        </Field>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                                Haritadan Konum Seç
                            </label>
                            <MapPicker
                                latitude={parseFloat(form.latitude) || 41.0082}
                                longitude={parseFloat(form.longitude) || 28.9784}
                                onLocationSelect={(lat, lng) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        latitude: lat.toFixed(6),
                                        longitude: lng.toFixed(6),
                                    }));
                                }}
                                height="400px"
                                panelType={form.type}
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Konumu işaretlemek için haritaya tıklayın veya mevcut pini sürükleyin.
                            </p>
                        </div>
                    </div>
                </Section>

                <Section title="Ölçüler ve Fiyatlandırma">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Genişlik" required hint="m veya cm (örn: 4m veya 400cm)">
                            <input
                                type="text"
                                value={form.width}
                                onChange={(e) => change("width", e.target.value)}
                                required
                                placeholder="4m"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Yükseklik" required hint="m veya cm">
                            <input
                                type="text"
                                value={form.height}
                                onChange={(e) => change("height", e.target.value)}
                                required
                                placeholder="3m"
                                className={inputClass}
                            />
                        </Field>
                        <div className="md:col-span-2">
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                                <strong>En az bir fiyat girmeniz yeterli.</strong>{" "}
                                Haftalık fiyat zorunlu değildir — 3, 6 veya 12 aylık fiyat vererek
                                de satışa açabilirsiniz.
                            </div>
                        </div>
                        <Field label="Haftalık Fiyat (₺) — opsiyonel">
                            <input
                                type="number"
                                step="0.01"
                                value={form.priceWeekly}
                                onChange={(e) => change("priceWeekly", e.target.value)}
                                placeholder="15000"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Günlük Fiyat (₺) — opsiyonel">
                            <input
                                type="number"
                                step="0.01"
                                value={form.priceDaily}
                                onChange={(e) => change("priceDaily", e.target.value)}
                                placeholder="2500"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Aylık Fiyat (₺) — opsiyonel">
                            <input
                                type="number"
                                step="0.01"
                                value={form.priceMonthly}
                                onChange={(e) => change("priceMonthly", e.target.value)}
                                placeholder="50000"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="3 Aylık Fiyat (₺) — opsiyonel">
                            <input
                                type="number"
                                step="0.01"
                                value={form.price3Month}
                                onChange={(e) => change("price3Month", e.target.value)}
                                placeholder="140000"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="6 Aylık Fiyat (₺) — opsiyonel">
                            <input
                                type="number"
                                step="0.01"
                                value={form.price6Month}
                                onChange={(e) => change("price6Month", e.target.value)}
                                placeholder="260000"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Yıllık Fiyat (₺) — opsiyonel">
                            <input
                                type="number"
                                step="0.01"
                                value={form.priceYearly}
                                onChange={(e) => change("priceYearly", e.target.value)}
                                placeholder="480000"
                                className={inputClass}
                            />
                        </Field>
                        <Field
                            label="Baskı & Montaj Ücreti (₺) — opsiyonel"
                            hint="Reklamverenin ödeyeceği tek seferlik baskı + montaj bedeli"
                        >
                            <input
                                type="number"
                                step="0.01"
                                value={form.printingFee}
                                onChange={(e) => change("printingFee", e.target.value)}
                                placeholder="35000"
                                className={inputClass}
                            />
                        </Field>
                        <div className="md:col-span-2">
                            <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isStartingPrice}
                                    onChange={(e) => change("isStartingPrice", e.target.checked)}
                                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                />
                                <span className="text-sm">
                                    <span className="font-medium text-slate-900">
                                        "…&apos;den başlayan" olarak göster
                                    </span>
                                    <span className="block text-xs text-slate-500 mt-0.5">
                                        İşaretlenirse Panobu&apos;da pano fiyatı "15.000 ₺&apos;den başlayan" şeklinde gösterilir. Dönemsel fiyatlarınız varsa bu seçenek önerilir.
                                    </span>
                                </span>
                            </label>
                        </div>
                    </div>
                </Section>

                {mode === "edit" && panelId && (
                    <Section title="Dönemsel Fiyatlar">
                        <p className="text-xs text-slate-500 mb-3">
                            Belirli tarih aralıkları için özel fiyat tanımlayın (bayram, seçim dönemi,
                            yaz sezonu vb.). Bu aralıklardaki fiyatlar standart fiyatınızı geçersiz kılar.
                        </p>
                        <SeasonalPricingManager panelId={panelId} />
                    </Section>
                )}

                <Section title="Tahmini Performans">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field
                            label="Tahmini Günlük Görüntülenme"
                            hint="Günde kaç kişi bu panoyu görüyor? (impression)"
                        >
                            <input
                                type="number"
                                min="0"
                                value={form.estimatedDailyImpressions}
                                onChange={(e) => change("estimatedDailyImpressions", e.target.value)}
                                placeholder="Örn: 50000"
                                className={inputClass}
                            />
                        </Field>
                        <Field
                            label="Tahmini CPM (₺) — opsiyonel"
                            hint="Bin görüntülenme başına maliyet. Boş bırakırsanız fiyat / görüntülenme üzerinden otomatik hesaplanır."
                        >
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.estimatedCpm}
                                onChange={(e) => change("estimatedCpm", e.target.value)}
                                placeholder="Örn: 45.00"
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </Section>

                <Section title="Yerleşim Bağlamı (opsiyonel)">
                    <p className="text-xs text-slate-500 mb-3">
                        Panonun fiziksel konumunu en iyi tanımlayan tipi seçerseniz trafik skoru çok daha doğru hesaplanır.
                        Boş bırakırsanız sistem harita verisinden otomatik bulur.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Yerleşim Bağlamı">
                            <select
                                value={form.placementContext}
                                onChange={(e) => change("placementContext", e.target.value)}
                                className={inputClass}
                            >
                                <option value="">— Otomatik (harita verisi) —</option>
                                <option value="HIGHWAY_SIDE">Otoyol / çevre yolu kenarı</option>
                                <option value="MAIN_JUNCTION">Ana cadde kavşağı</option>
                                <option value="URBAN_MAIN">Ana cadde / bulvar üstü</option>
                                <option value="SQUARE">Meydan / plaza</option>
                                <option value="BUILDING_WRAP">Bina giydirme / cephe</option>
                                <option value="MALL_OUTDOOR">AVM önü / otopark</option>
                                <option value="PEDESTRIAN">Yaya bölgesi / çarşı</option>
                                <option value="RESIDENTIAL_EDGE">Mahalle kenarı / servis yolu</option>
                            </select>
                        </Field>
                        <Field
                            label="Manuel Günlük Trafik (opsiyonel)"
                            hint="Bölgeyi tanıyorsanız günlük trafik tahmininizi yazabilirsiniz."
                        >
                            <input
                                type="number"
                                min="0"
                                value={form.manualDailyTraffic}
                                onChange={(e) => change("manualDailyTraffic", e.target.value)}
                                placeholder="Örn: 35000"
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </Section>

                <Section title="Fotoğraflar">
                    <p className="text-xs text-slate-500 mb-3">
                        En az 1, en fazla 5 fotoğraf yükleyin. İlk fotoğraf kapak olarak kullanılır.
                    </p>
                    <MultiImageUploader
                        images={images}
                        onChange={setImages}
                        disabled={loading}
                        max={5}
                    />
                </Section>

                <Section title="Çevredeki Dükkanlar / Noktalar">
                    <p className="text-xs text-slate-500 mb-3">
                        Bu panonun çevresinde (~300m) hangi tür işletmeler / noktalar bulunuyor?
                        Etiketleri seçerek ekleyin. Bu bilgiler yalnızca ekip içi görünürdür;
                        reklamverenlere pano önerirken kullanılacaktır.
                    </p>
                    <TagsInput
                        value={nearbyTags}
                        onChange={setNearbyTags}
                        disabled={loading}
                    />
                </Section>

                <Section title="Açıklama">
                    <Field label="Notlar (opsiyonel)">
                        <textarea
                            value={form.description}
                            onChange={(e) => change("description", e.target.value)}
                            rows={3}
                            placeholder="Pano hakkında ek bilgi, görünürlük, hedef kitle..."
                            className={inputClass}
                        />
                    </Field>
                </Section>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? (
                            "Kaydediliyor..."
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {mode === "create" ? "Kaydet ve Onaya Gönder" : "Güncelle"}
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/app/owner/units")}
                    >
                        İptal
                    </Button>
                </div>
            </form>
        </div>
    );
}

const inputClass =
    "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-base font-semibold text-slate-900 mb-4">{title}</h2>
            {children}
        </div>
    );
}

function Field({
    label,
    required,
    hint,
    children,
}: {
    label: string;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
            {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
        </div>
    );
}
