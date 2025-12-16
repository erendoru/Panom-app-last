"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Upload, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { addDays, isWithinInterval, parseISO, startOfDay } from "date-fns";
import { tr } from "date-fns/locale";

interface RentalWizardProps {
    isOpen: boolean;
    onClose: () => void;
    panel: any; // Using any for speed, ideally proper type
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

    const blockedDates = panel.blockedDates || [];

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

            // Check if any date in the range is blocked
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
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
    };

    const calculateTotal = () => {
        const totalDays = calculateTotalDays();
        if (totalDays === 0) return 0;

        // Simple pricing logic: weekly price / 7 * days
        const dailyPrice = Number(panel.priceWeekly) / 7;
        let total = dailyPrice * totalDays;

        if (designRequested) {
            total += 2500; // Fixed design fee for MVP
        }

        return total;
    };

    const isValidRentalPeriod = () => {
        const totalDays = calculateTotalDays();
        const minDays = panel.minRentalDays || 7; // Default 7 days
        return totalDays >= minDays;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            // Local preview
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);

            // Auto upload
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

    const handleSubmit = async () => {
        const [start, end] = dateRange;
        if (!start || !end) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/static-rentals", {
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

            if (res.ok) {
                setStep(4); // Success step
            } else {
                alert("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        } catch (error) {
            console.error("Booking failed", error);
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
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={reset}>
            <DialogContent className="sm:max-w-[600px] z-[9999]">
                <DialogHeader>
                    <DialogTitle>Pano Kiralama: {panel.name}</DialogTitle>
                    <DialogDescription>
                        {step === 1 && "Kiralamak istediğiniz tarih aralığını seçin."}
                        {step === 2 && "Reklam görselinizi yükleyin veya tasarım desteği alın."}
                        {step === 3 && "Ödeme ve onay."}
                        {step === 4 && "İşlem Başarılı!"}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
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

                            {/* Minimum Rental Days Info */}
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg w-full">
                                <p className="text-sm text-amber-800">
                                    ℹ️ <strong>Minimum kiralama süresi:</strong> {panel.minRentalDays || 7} gün
                                </p>
                            </div>

                            {/* Selected Dates Display */}
                            {dateRange[0] && dateRange[1] && (
                                <>
                                    {/* Validation Warning */}
                                    {!isValidRentalPeriod() && (
                                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg w-full">
                                            <p className="text-sm text-red-800 font-medium">
                                                ⚠️ Bu pano minimum {panel.minRentalDays || 7} gün kiralanabilir.
                                                Lütfen en az {panel.minRentalDays || 7} günlük bir süre seçin.
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
                                <label htmlFor="designSupport" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1">
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

                            <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-800 border border-yellow-200">
                                Not: Bu bir demo işlemidir. Kartınızdan çekim yapılmayacaktır.
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
                                    {designRequested
                                        ? "Tasarım ekibimiz en kısa sürede sizinle iletişime geçecektir."
                                        : "Reklamınız yönetici onayından sonra yayına alınacaktır."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

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
                            <Button onClick={() => setStep(3)} disabled={(!uploadedFileUrl && !designRequested) || isUploading}>Devam Et</Button>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="flex gap-2 w-full justify-end">
                            <Button variant="outline" onClick={() => setStep(2)}>Geri</Button>
                            <Button onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Ödeme Yap ve Kirala
                            </Button>
                        </div>
                    )}
                    {step === 4 && (
                        <Button onClick={reset} className="w-full">Tamam</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
