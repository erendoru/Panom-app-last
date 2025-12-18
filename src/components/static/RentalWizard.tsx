"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Upload, Calendar as CalendarIcon, CheckCircle2, LogIn, UserPlus } from "lucide-react";
import Image from "next/image";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { addDays, isWithinInterval, parseISO, startOfDay } from "date-fns";
import { tr } from "date-fns/locale";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface RentalWizardProps {
    isOpen: boolean;
    onClose: () => void;
    panel: any;
}

export default function RentalWizard({ isOpen, onClose, panel }: RentalWizardProps) {
    const [step, setStep] = useState(1);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
    const [designRequested, setDesignRequested] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [checkoutFormContent, setCheckoutFormContent] = useState<string | null>(null);

    const supabase = createClientComponentClient();
    const blockedDates = panel.blockedDates || [];

    // Check login status on mount & listen for changes
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);
        };
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsLoggedIn(!!session?.user);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    // Restore state from localStorage if exists
    useEffect(() => {
        if (!isOpen) return;

        const pendingRentalStr = localStorage.getItem('pendingRental');
        if (pendingRentalStr) {
            try {
                const data = JSON.parse(pendingRentalStr);
                // Check if this pending rental belongs to the current panel
                if (data.panelId === panel.id) {
                    console.log("Restoring rental data:", data);

                    if (data.dateRange && data.dateRange[0]) {
                        setDateRange([
                            data.dateRange[0] ? parseISO(data.dateRange[0]) : null,
                            data.dateRange[1] ? parseISO(data.dateRange[1]) : null
                        ]);
                    }
                    if (data.creativeUrl) setUploadedFileUrl(data.creativeUrl);
                    if (data.designRequested) setDesignRequested(data.designRequested);

                    // If we have data and user is logged in, jump to step 3
                    if (isLoggedIn === true) {
                        setStep(3);
                        setShowLoginPrompt(false);
                    }
                }
            } catch (e) {
                console.error("Parse error", e);
            }
        }
    }, [isOpen, isLoggedIn, panel.id]);

    // Cleanup script when modal closes
    useEffect(() => {
        if (!isOpen) {
            setCheckoutFormContent(null);
            const script = document.getElementById('iyzico-checkout-script');
            if (script) script.remove();
        }
    }, [isOpen]);

    const isDateBlocked = (date: Date) => {
        return blockedDates.some((blocked: any) => {
            const start = parseISO(blocked.startDate);
            const end = parseISO(blocked.endDate);
            return isWithinInterval(date, { start: startOfDay(start), end: startOfDay(end) });
        });
    };

    const handleDateChange = (value: any) => {
        if (Array.isArray(value)) {
            const [start, end] = value;
            if (start && end) {
                let current = start;
                while (current <= end) {
                    if (isDateBlocked(current)) {
                        alert("Seçilen tarih aralığında müsait olmayan günler var. Lütfen başka bir tarih seçin.");
                        return;
                    }
                    current = addDays(current, 1);
                }
            }
            setDateRange(value as [Date | null, Date | null]);
        }
    };

    const calculateTotalDays = () => {
        const [start, end] = dateRange;
        if (!start || !end) return 0;
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const calculateTotal = () => {
        const totalDays = calculateTotalDays();
        if (totalDays === 0) return 0;
        const dailyPrice = Number(panel.priceWeekly) / 7;
        let total = dailyPrice * totalDays;
        if (designRequested) {
            total += 2500;
        }
        return total;
    };

    const isValidRentalPeriod = () => {
        const totalDays = calculateTotalDays();
        const minDays = panel.minRentalDays || 7;
        return totalDays >= minDays;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", selectedFile);

            try {
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                if (data.url) {
                    setUploadedFileUrl(data.url);
                }
            } catch (error) {
                console.error("Upload failed", error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    // Save rental data to localStorage before redirecting to login
    const saveRentalDataAndRedirect = (redirectTo: string) => {
        const rentalData = {
            panelId: panel.id,
            panelName: panel.name,
            dateRange: [dateRange[0]?.toISOString(), dateRange[1]?.toISOString()],
            totalPrice: calculateTotal(),
            creativeUrl: uploadedFileUrl,
            designRequested,
            timestamp: Date.now()
        };
        localStorage.setItem('pendingRental', JSON.stringify(rentalData));
        window.location.href = redirectTo;
    };

    const handleProceedToPayment = () => {
        if (!isLoggedIn) {
            setShowLoginPrompt(true);
            return;
        }
        setStep(3);
    };

    const handlePayment = async () => {
        const [start, end] = dateRange;
        if (!start || !end) return;

        setIsSubmitting(true);
        try {
            // 1. Create Rental Record first
            const rentalRes = await fetch("/api/static-rentals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    panelId: panel.id,
                    startDate: start.toISOString(),
                    endDate: end.toISOString(),
                    totalPrice: calculateTotal(),
                    creativeUrl: uploadedFileUrl,
                    designRequested,
                }),
            });

            if (!rentalRes.ok) {
                if (rentalRes.status === 401) {
                    setShowLoginPrompt(true);
                    return;
                }
                const errorData = await rentalRes.json();
                throw new Error(errorData.error || "Kiralama kaydı oluşturulamadı.");
            }

            const rentalData = await rentalRes.json();

            // 2. Init Payment with the new Rental ID
            const res = await fetch("/api/payment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: calculateTotal(),
                    rentalId: rentalData.id,
                    description: `Pano Kiralama: ${panel.name} (${calculateTotalDays()} gün)`
                }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.checkoutFormContent) {
                    setCheckoutFormContent(data.checkoutFormContent);

                    // Parse and execute script from Iyzico content
                    setTimeout(() => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(data.checkoutFormContent, 'text/html');
                        const scripts = doc.querySelectorAll('script');

                        scripts.forEach(oldScript => {
                            const newScript = document.createElement('script');
                            Array.from(oldScript.attributes).forEach(attr => {
                                newScript.setAttribute(attr.name, attr.value);
                            });
                            newScript.id = 'iyzico-checkout-script'; // Tag for cleanup
                            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                            document.body.appendChild(newScript);
                        });
                    }, 100);

                    // We can clear localStorage now, or wait for success
                    localStorage.removeItem('pendingRental');
                } else {
                    alert("Ödeme formu alınamadı.");
                }
            } else {
                const errorData = await res.json().catch(() => ({}));
                alert(`${errorData.error || "Ödeme başlatılamadı"}\n\nHata Detayı: ${errorData.details || "Bilinmiyor"}`);
            }
        } catch (error: any) {
            console.error("Payment init failed", error);
            alert(error.message || "Bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const reset = () => {
        setStep(1);
        setDateRange([null, null]);
        setFile(null);
        setPreviewUrl(null);
        setUploadedFileUrl(null);
        setDesignRequested(false);
        setShowLoginPrompt(false);
        setCheckoutFormContent(null);
        onClose();
    };

    // Login Prompt Component
    const LoginPromptStep = () => (
        <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <LogIn className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-xl text-slate-900">Devam Etmek İçin Giriş Yapın</h3>
                    <p className="text-slate-500 mt-2">
                        Pano kiralama işlemini tamamlamak için hesabınıza giriş yapmanız veya yeni bir hesap oluşturmanız gerekiyor.
                    </p>
                </div>
            </div>

            {/* Rental Summary */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <h4 className="font-semibold text-sm text-slate-700">Kiralama Özeti</h4>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Pano</span>
                    <span className="font-medium">{panel.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tarih</span>
                    <span className="font-medium">
                        {dateRange[0]?.toLocaleDateString('tr-TR')} - {dateRange[1]?.toLocaleDateString('tr-TR')}
                    </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="font-bold">Toplam</span>
                    <span className="font-bold text-blue-600">{formatCurrency(calculateTotal())}</span>
                </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                    ✨ Bilgileriniz kaydedildi! Giriş yaptıktan sonra ödeme adımına otomatik olarak yönlendirileceksiniz.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    className="h-14 flex flex-col items-center justify-center gap-1"
                    onClick={() => saveRentalDataAndRedirect('/auth/login?redirect=/static-billboards&resumeRental=true')}
                >
                    <LogIn className="w-5 h-5" />
                    <span className="text-sm">Giriş Yap</span>
                </Button>
                <Button
                    className="h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => saveRentalDataAndRedirect('/auth/register?redirect=/static-billboards&resumeRental=true')}
                >
                    <UserPlus className="w-5 h-5" />
                    <span className="text-sm">Ücretsiz Kayıt Ol</span>
                </Button>
            </div>

            <button
                onClick={() => setShowLoginPrompt(false)}
                className="w-full text-center text-sm text-slate-400 hover:text-slate-600"
            >
                Geri Dön
            </button>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={reset}>
            <DialogContent className="sm:max-w-[800px] z-[9999] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Pano Kiralama: {panel.name}</DialogTitle>
                    <DialogDescription>
                        {showLoginPrompt && "Hesabınıza giriş yapın"}
                        {!showLoginPrompt && !checkoutFormContent && step === 1 && "Kiralamak istediğiniz tarih aralığını seçin."}
                        {!showLoginPrompt && !checkoutFormContent && step === 2 && "Reklam görselinizi yükleyin veya tasarım desteği alın."}
                        {!showLoginPrompt && !checkoutFormContent && step === 3 && "Ödeme ve onay."}
                        {checkoutFormContent && "Güvenli Ödeme Ekranı"}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {showLoginPrompt ? (
                        <LoginPromptStep />
                    ) : checkoutFormContent ? (
                        <div className="w-full min-h-[400px]">
                            {/* Iyzico Form Container */}
                            <div id="iyzipay-checkout-form" className="responsive"></div>
                        </div>
                    ) : (
                        <>
                            {step === 1 && (
                                <div className="space-y-4 flex flex-col items-center">
                                    <div className="w-full flex justify-center">
                                        <Calendar
                                            value={dateRange[0] && dateRange[1] ? [dateRange[0], dateRange[1]] : null}
                                            onChange={handleDateChange}
                                            selectRange
                                            locale="tr-TR"
                                            minDate={new Date()}
                                            tileDisabled={({ date }) => isDateBlocked(date)}
                                            className="w-full rounded-lg border"
                                        />
                                    </div>

                                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg w-full">
                                        <p className="text-sm text-amber-800">
                                            ℹ️ <strong>Minimum kiralama süresi:</strong> {panel.minRentalDays || 7} gün
                                        </p>
                                    </div>

                                    {dateRange[0] && dateRange[1] && (
                                        <>
                                            {!isValidRentalPeriod() && (
                                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg w-full">
                                                    <p className="text-sm text-red-800 font-medium">
                                                        ⚠️ Bu pano minimum {panel.minRentalDays || 7} gün kiralanabilir.
                                                    </p>
                                                    <p className="text-xs text-red-600 mt-1">
                                                        Şu an seçili: {calculateTotalDays()} gün
                                                    </p>
                                                </div>
                                            )}

                                            <div className="bg-blue-50 p-4 rounded-lg text-blue-900 w-full flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium">Seçilen Tarihler</p>
                                                    <p className="text-sm">
                                                        {dateRange[0].toLocaleDateString('tr-TR')} - {dateRange[1].toLocaleDateString('tr-TR')}
                                                    </p>
                                                    <p className="text-xs text-blue-700 mt-1">
                                                        {calculateTotalDays()} gün
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">Tahmini Tutar</p>
                                                    <p className="2xl font-bold">{formatCurrency(calculateTotal())}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <h4 className="font-bold text-sm text-slate-700 mb-2">Gerekli Görsel Özellikleri</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-slate-500 block">Boyutlar</span>
                                                <span className="font-mono font-bold">{Number(panel.width)}m x {Number(panel.height)}m</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block">Format</span>
                                                <span className="font-mono font-bold">JPG, PNG, PDF</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setDesignRequested(!designRequested)}>
                                        <input
                                            type="checkbox"
                                            id="designSupport"
                                            checked={designRequested}
                                            onChange={(e) => setDesignRequested(e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="designSupport" className="text-sm font-medium leading-none cursor-pointer flex-1">
                                            <span className="block font-bold text-slate-900">Tasarım Desteği İstiyorum (+2.500 ₺)</span>
                                            <span className="block text-slate-500 font-normal mt-1">Profesyonel ekibimiz sizin için tasarlasın.</span>
                                        </label>
                                    </div>

                                    {!designRequested && (
                                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleFileChange}
                                            />
                                            {previewUrl ? (
                                                <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                                                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                                    {isUploading && (
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                                                            <Loader2 className="w-8 h-8 animate-spin" />
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                                    <Upload className="w-10 h-10" />
                                                    <p>Görseli buraya sürükleyin veya tıklayın</p>
                                                    <p className="text-xs">PNG, JPG (Max 10MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Pano</span>
                                            <span className="font-medium">{panel.name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Tarih</span>
                                            <span className="font-medium">
                                                {dateRange[0]?.toLocaleDateString('tr-TR')} - {dateRange[1]?.toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Görsel / Tasarım</span>
                                            <span className="font-medium text-green-600">
                                                {designRequested ? "Tasarım Desteği İstendi" : file?.name}
                                            </span>
                                        </div>
                                        <div className="pt-4 border-t flex justify-between items-center">
                                            <span className="font-bold text-lg">Toplam Tutar</span>
                                            <span className="font-bold text-2xl text-blue-600">{formatCurrency(calculateTotal())}</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600">
                                        <p>
                                            "Ödeme Yapılabilecek Kartlar" ibaresi ve Iyzico güvencesiyle ödeme işleminiz gerçekleşecektir.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl">Rezervasyon Başarılı!</h3>
                                        <p className="text-slate-500">
                                            {(designRequested || checkoutFormContent)
                                                ? "Tasarım ekibimiz en kısa sürede sizinle iletişime geçecektir."
                                                : "Reklamınız yönetici onayından sonra yayına alınacaktır."}
                                            {/* Note: checkoutFormContent logic here is tricky, basically success means payment done */}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {!showLoginPrompt && !checkoutFormContent && (
                    <DialogFooter>
                        {step === 1 && (
                            <Button
                                onClick={() => setStep(2)}
                                disabled={!dateRange[0] || !dateRange[1] || !isValidRentalPeriod()}
                            >
                                Devam Et
                            </Button>
                        )}
                        {step === 2 && (
                            <div className="flex gap-2 w-full justify-end">
                                <Button variant="outline" onClick={() => setStep(1)}>Geri</Button>
                                <Button onClick={handleProceedToPayment} disabled={(!uploadedFileUrl && !designRequested) || isUploading}>
                                    Devam Et
                                </Button>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="flex gap-2 w-full justify-end">
                                <Button variant="outline" onClick={() => setStep(2)}>Geri</Button>
                                <Button onClick={handlePayment} disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white hover:from-blue-700 hover:to-indigo-700">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Ödeme Formuna Git
                                </Button>
                            </div>
                        )}
                        {step === 4 && (
                            <Button onClick={reset} className="w-full">Tamam</Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
