"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight, ChevronLeft, Upload, Monitor, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock template for creative
const TEMPLATES = [
    { id: 1, name: "İndirim Kampanyası", url: "https://placehold.co/1920x1080/2563eb/white?text=Indirim+Kampanyasi" },
    { id: 2, name: "Açılış Duyurusu", url: "https://placehold.co/1920x1080/dc2626/white?text=Acilis+Duyurusu" },
    { id: 3, name: "Etkinlik", url: "https://placehold.co/1920x1080/16a34a/white?text=Etkinlik" },
];

export default function NewCampaignWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [screens, setScreens] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        brandName: "",
        startDate: "",
        endDate: "",
        screenIds: [] as string[],
        totalBudget: 1000,
        creativeUrl: "",
        creativeType: "IMAGE" as "IMAGE" | "VIDEO",
    });

    // Fetch screens on mount
    useEffect(() => {
        fetch("/api/screens")
            .then(res => res.json())
            .then(data => setScreens(data.screens || []));
    }, []);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/campaigns", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Kampanya oluşturulamadı");

            const data = await res.json();
            // Redirect to Checkout with Campaign ID and Amount
            router.push(`/app/advertiser/checkout?amount=${formData.totalBudget}&campaignId=${data.campaign.id}&campaignName=${encodeURIComponent(formData.name)}`);

        } catch (error) {
            alert("Hata oluştu");
            setLoading(false); // Only stop loading on error, otherwise we want to keep it while redirecting
        }
    };

    const toggleScreen = (id: string) => {
        setFormData(prev => ({
            ...prev,
            screenIds: prev.screenIds.includes(id)
                ? prev.screenIds.filter(s => s !== id)
                : [...prev.screenIds, id]
        }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className={`text - sm font - medium ${step >= 1 ? "text-blue-600" : "text-slate-400"}`}>1. Bilgiler</span>
                    <span className={`text - sm font - medium ${step >= 2 ? "text-blue-600" : "text-slate-400"} `}>2. Ekranlar</span>
                    <span className={`text - sm font - medium ${step >= 3 ? "text-blue-600" : "text-slate-400"} `}>3. Bütçe</span>
                    <span className={`text - sm font - medium ${step >= 4 ? "text-blue-600" : "text-slate-400"} `}>4. Kreatif</span>
                    <span className={`text - sm font - medium ${step >= 5 ? "text-blue-600" : "text-slate-400"} `}>5. Onay</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${(step / 5) * 100}% ` }}
                    />
                </div>
            </div>

            <Card>
                <CardContent className="p-8">
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Kampanya Bilgileri</h2>
                            <div className="grid gap-4">
                                <div>
                                    <Label>Kampanya Adı</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Örn: Yaz İndirimi 2024"
                                    />
                                </div>
                                <div>
                                    <Label>Marka Adı</Label>
                                    <Input
                                        value={formData.brandName}
                                        onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                                        placeholder="Örn: Şirketim A.Ş."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Başlangıç Tarihi</Label>
                                        <Input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label>Bitiş Tarihi</Label>
                                        <Input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handleNext} disabled={!formData.name || !formData.startDate}>
                                    İleri <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Screen Selection */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Ekran Seçimi</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                                {screens.map(screen => (
                                    <div
                                        key={screen.id}
                                        onClick={() => toggleScreen(screen.id)}
                                        className={`p - 4 border rounded - lg cursor - pointer transition - all ${formData.screenIds.includes(screen.id)
                                                ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                                                : "hover:border-slate-300"
                                            } `}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <Monitor className="w-8 h-8 text-slate-400" />
                                                <div>
                                                    <h4 className="font-medium">{screen.name}</h4>
                                                    <p className="text-sm text-slate-500">{screen.district}, {screen.city}</p>
                                                </div>
                                            </div>
                                            {formData.screenIds.includes(screen.id) && (
                                                <Check className="w-5 h-5 text-blue-600" />
                                            )}
                                        </div>
                                        <div className="mt-3 flex justify-between text-sm">
                                            <span className="text-slate-600">{screen.resolutionWidth}x{screen.resolutionHeight}</span>
                                            <span className="font-medium">{formatCurrency(screen.basePricePerPlay)} / play</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between">
                                <Button variant="outline" onClick={handleBack}>Geri</Button>
                                <Button onClick={handleNext} disabled={formData.screenIds.length === 0}>
                                    İleri ({formData.screenIds.length} Seçili)
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Budget */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Bütçe Belirleme</h2>
                            <div className="p-6 bg-slate-50 rounded-lg text-center">
                                <Label className="text-lg mb-2 block">Toplam Bütçe (₺)</Label>
                                <Input
                                    type="number"
                                    className="text-3xl text-center h-16 font-bold max-w-[200px] mx-auto"
                                    value={formData.totalBudget}
                                    onChange={e => setFormData({ ...formData, totalBudget: Number(e.target.value) })}
                                />
                                <p className="text-slate-500 mt-4">
                                    Tahmini Gösterim: <span className="font-bold text-slate-900">
                                        {Math.floor(formData.totalBudget / 0.5)} kez
                                    </span>
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <Button variant="outline" onClick={handleBack}>Geri</Button>
                                <Button onClick={handleNext}>İleri</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Creative */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Görsel Yükle veya Seç</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {TEMPLATES.map(template => (
                                    <div
                                        key={template.id}
                                        onClick={() => setFormData({ ...formData, creativeUrl: template.url })}
                                        className={`border rounded - lg overflow - hidden cursor - pointer ${formData.creativeUrl === template.url ? "ring-2 ring-blue-600" : ""
                                            } `}
                                    >
                                        <img src={template.url} alt={template.name} className="w-full h-32 object-cover" />
                                        <div className="p-2 text-sm font-medium text-center">{template.name}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        // Mock upload
                                        if (e.target.files?.[0]) {
                                            setFormData({ ...formData, creativeUrl: "https://placehold.co/1920x1080/purple/white?text=Uploaded+Image" });
                                        }
                                    }}
                                />
                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm font-medium">Bilgisayardan Yükle</p>
                                <p className="text-xs text-slate-400">PNG, JPG veya MP4</p>
                            </div>

                            {formData.creativeUrl && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium mb-2">Seçilen Görsel:</p>
                                    <img src={formData.creativeUrl} alt="Selected" className="h-40 rounded border" />
                                </div>
                            )}

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={handleBack}>Geri</Button>
                                <Button onClick={handleNext} disabled={!formData.creativeUrl}>İleri</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Review */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CreditCard className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold">Ödeme ve Onay</h2>
                                <p className="text-slate-500">Lütfen kampanya detaylarını kontrol edin.</p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-lg space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Kampanya Adı</span>
                                    <span className="font-medium">{formData.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Seçilen Ekranlar</span>
                                    <span className="font-medium">{formData.screenIds.length} Adet</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Tarih Aralığı</span>
                                    <span className="font-medium">{formData.startDate} - {formData.endDate}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                    <span>Toplam Tutar</span>
                                    <span>{formatCurrency(formData.totalBudget)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button variant="outline" onClick={handleBack}>Geri</Button>
                                <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700">
                                    {loading ? "İşleniyor..." : "Ödeme Yap ve Başlat"}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
