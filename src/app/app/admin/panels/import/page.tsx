"use client";

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, Upload, FileSpreadsheet, Download, CheckCircle2,
    XCircle, AlertTriangle, Loader2, Trash2, Eye, Send
} from 'lucide-react';
import { PANEL_TYPE_LABELS } from '@/lib/turkey-data';
import { parseGoogleMapsUrl, normalizePanelType } from '@/lib/geo-utils';

interface PanelRow {
    name: string;
    type: string;
    city: string;
    district: string;
    address: string;
    googleMapsUrl?: string;
    latitude?: string;
    longitude?: string;
    width_cm?: string;
    height_cm?: string;
    priceDaily?: string;
    priceWeekly?: string;
    priceMonthly?: string;
    price3Month?: string;
    price6Month?: string;
    priceYearly?: string;
    locationType?: string;
    ownerName?: string;
    ownerPhone?: string;
    isAVM?: string;
    avmName?: string;
    estimatedDailyImpressions?: string;
    trafficLevel?: string;
    subType?: string;
    [key: string]: string | undefined;
}

interface ValidationError {
    row: number;
    field: string;
    message: string;
}

interface ImportResult {
    success: boolean;
    row: number;
    name: string;
    error?: string;
    id?: string;
}

type Step = 'upload' | 'preview' | 'importing' | 'done';

export default function ImportPanelsPage() {
    const [step, setStep] = useState<Step>('upload');
    const [fileName, setFileName] = useState('');
    const [rows, setRows] = useState<PanelRow[]>([]);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [importResults, setImportResults] = useState<ImportResult[]>([]);
    const [importing, setImporting] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const REQUIRED_FIELDS = ['name', 'type', 'city', 'district', 'address'];

    const parseFile = useCallback((file: File) => {
        setFileName(file.name);
        const ext = file.name.split('.').pop()?.toLowerCase();

        if (ext === 'csv') {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                encoding: 'UTF-8',
                complete: (result) => {
                    const data = result.data as PanelRow[];
                    processRows(data);
                },
                error: () => {
                    alert('CSV dosyası okunamadı');
                }
            });
        } else if (ext === 'xlsx' || ext === 'xls') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const workbook = XLSX.read(e.target?.result, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const data = XLSX.utils.sheet_to_json<PanelRow>(sheet, { defval: '' });
                    processRows(data);
                } catch {
                    alert('Excel dosyası okunamadı');
                }
            };
            reader.readAsBinaryString(file);
        } else {
            alert('Desteklenen formatlar: .csv, .xlsx, .xls');
        }
    }, []);

    function processRows(data: PanelRow[]) {
        const validationErrors: ValidationError[] = [];

        // Auto-resolve coordinates from Google Maps URLs
        const enriched = data.map((row, i) => {
            const newRow = { ...row };

            // Google Maps'ten koordinat çıkar
            if (row.googleMapsUrl && (!row.latitude || !row.longitude || row.latitude === '0' || row.longitude === '0')) {
                const coords = parseGoogleMapsUrl(row.googleMapsUrl);
                if (coords) {
                    newRow.latitude = String(coords.latitude);
                    newRow.longitude = String(coords.longitude);
                }
            }

            // Validate required fields
            REQUIRED_FIELDS.forEach(field => {
                if (!newRow[field]?.trim()) {
                    validationErrors.push({ row: i + 1, field, message: `"${field}" alanı boş olamaz` });
                }
            });

            // Validate panel type
            if (newRow.type && !normalizePanelType(newRow.type)) {
                validationErrors.push({ row: i + 1, field: 'type', message: `Geçersiz pano türü: "${newRow.type}"` });
            }

            return newRow;
        });

        setRows(enriched);
        setErrors(validationErrors);
        setStep('preview');
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) parseFile(file);
    }, [parseFile]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) parseFile(file);
    };

    const removeRow = (index: number) => {
        setRows(prev => prev.filter((_, i) => i !== index));
        setErrors(prev => prev.filter(e => e.row !== index + 1).map(e => ({
            ...e,
            row: e.row > index + 1 ? e.row - 1 : e.row
        })));
    };

    const handleImport = async () => {
        if (rows.length === 0) return;

        setImporting(true);
        setStep('importing');

        try {
            const res = await fetch('/api/admin/panels/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ panels: rows })
            });

            const data = await res.json();

            if (res.ok) {
                setImportResults(data.results || []);
                setStep('done');
            } else {
                alert(data.error || 'Import başarısız');
                setStep('preview');
            }
        } catch {
            alert('Bağlantı hatası');
            setStep('preview');
        } finally {
            setImporting(false);
        }
    };

    const resetAll = () => {
        setStep('upload');
        setFileName('');
        setRows([]);
        setErrors([]);
        setImportResults([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const successCount = importResults.filter(r => r.success).length;
    const errorResults = importResults.filter(r => !r.success);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button asChild variant="outline" className="mb-4">
                        <Link href="/app/admin/panels">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Panolar
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-900">Toplu Pano Import</h1>
                    <p className="text-slate-600 mt-1">CSV veya Excel dosyasından toplu pano ekleyin</p>
                </div>

                {/* Step: Upload */}
                {step === 'upload' && (
                    <div className="space-y-6">
                        {/* Template Download */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <FileSpreadsheet className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-blue-900 mb-1">Şablon Dosyasını İndirin</h3>
                                    <p className="text-blue-700 text-sm mb-3">
                                        Panolarınızı bu şablona göre doldurup yükleyebilirsiniz. Sütun başlıkları
                                        otomatik eşleştirilir.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <a
                                            href="/templates/pano-import-sablonu.csv"
                                            download
                                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            CSV Şablonu İndir
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Supported Panel Types */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                            <h3 className="font-semibold text-slate-900 mb-3">Desteklenen Pano Türleri</h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(PANEL_TYPE_LABELS).map(([key, label]) => (
                                    <span key={key} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                        {key} — {label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Drop Zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all ${
                                dragOver
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'
                            }`}
                        >
                            <Upload className={`w-12 h-12 mx-auto mb-4 ${dragOver ? 'text-blue-500' : 'text-slate-400'}`} />
                            <p className="text-lg font-medium text-slate-700 mb-2">
                                Dosyayı sürükleyip bırakın veya tıklayın
                            </p>
                            <p className="text-sm text-slate-500">
                                Desteklenen formatlar: .csv, .xlsx, .xls
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    </div>
                )}

                {/* Step: Preview */}
                {step === 'preview' && (
                    <div className="space-y-6">
                        {/* Summary Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <FileSpreadsheet className="w-5 h-5 text-slate-500" />
                                    <span className="text-sm font-medium text-slate-700">{fileName}</span>
                                </div>
                                <span className="text-sm text-slate-500">
                                    {rows.length} pano bulundu
                                </span>
                                {errors.length > 0 && (
                                    <span className="flex items-center gap-1 text-sm text-amber-600">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.length} uyarı
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={resetAll} size="sm">
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Sıfırla
                                </Button>
                                <Button
                                    onClick={handleImport}
                                    disabled={rows.length === 0}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Send className="w-4 h-4 mr-1" />
                                    {rows.length} Panoyu Import Et
                                </Button>
                            </div>
                        </div>

                        {/* Validation Errors */}
                        {errors.length > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    Doğrulama Uyarıları
                                </h3>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                    {errors.slice(0, 20).map((err, i) => (
                                        <p key={i} className="text-sm text-amber-800">
                                            Satır {err.row}: {err.message}
                                        </p>
                                    ))}
                                    {errors.length > 20 && (
                                        <p className="text-sm text-amber-600 font-medium">...ve {errors.length - 20} uyarı daha</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Data Table */}
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">#</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Ad</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tür</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">İl</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">İlçe</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Koordinat</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Boyut</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Fiyat</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Sahip</th>
                                            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-600 uppercase w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, i) => {
                                            const rowErrors = errors.filter(e => e.row === i + 1);
                                            const hasError = rowErrors.length > 0;
                                            const typeLabel = PANEL_TYPE_LABELS[normalizePanelType(row.type) || ''] || row.type;
                                            const hasCoords = row.latitude && row.longitude && row.latitude !== '0' && row.longitude !== '0';
                                            const priceInfo = [
                                                row.priceDaily && `G:${row.priceDaily}₺`,
                                                row.priceWeekly && `H:${row.priceWeekly}₺`,
                                                row.priceMonthly && `A:${row.priceMonthly}₺`,
                                                row.price3Month && `3A:${row.price3Month}₺`,
                                                row.price6Month && `6A:${row.price6Month}₺`,
                                                row.priceYearly && `Y:${row.priceYearly}₺`,
                                            ].filter(Boolean).join(', ') || '—';

                                            return (
                                                <tr
                                                    key={i}
                                                    className={`border-b border-slate-100 ${hasError ? 'bg-amber-50' : 'hover:bg-slate-50'}`}
                                                >
                                                    <td className="px-3 py-2 text-slate-500">{i + 1}</td>
                                                    <td className="px-3 py-2 font-medium text-slate-900 max-w-[200px] truncate">{row.name}</td>
                                                    <td className="px-3 py-2 text-slate-600">
                                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{typeLabel}</span>
                                                    </td>
                                                    <td className="px-3 py-2 text-slate-600">{row.city}</td>
                                                    <td className="px-3 py-2 text-slate-600">{row.district}</td>
                                                    <td className="px-3 py-2">
                                                        {hasCoords ? (
                                                            <span className="flex items-center gap-1 text-green-600 text-xs">
                                                                <CheckCircle2 className="w-3 h-3" />
                                                                {parseFloat(row.latitude!).toFixed(4)}, {parseFloat(row.longitude!).toFixed(4)}
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-amber-500 text-xs">
                                                                <AlertTriangle className="w-3 h-3" />
                                                                Eksik
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-slate-600 text-xs">
                                                        {row.width_cm && row.height_cm ? `${row.width_cm}×${row.height_cm}cm` : '—'}
                                                    </td>
                                                    <td className="px-3 py-2 text-slate-600 text-xs max-w-[150px] truncate">{priceInfo}</td>
                                                    <td className="px-3 py-2 text-slate-600 text-xs truncate max-w-[100px]">{row.ownerName || '—'}</td>
                                                    <td className="px-3 py-2 text-center">
                                                        <button
                                                            onClick={() => removeRow(i)}
                                                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                                                            title="Satırı kaldır"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {rows.length === 0 && (
                                <div className="p-8 text-center text-slate-500">
                                    Tüm satırlar kaldırıldı. Yeniden yükleyin.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step: Importing */}
                {step === 'importing' && (
                    <div className="bg-white border border-slate-200 rounded-xl p-16 text-center">
                        <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Import Ediliyor...</h2>
                        <p className="text-slate-500">{rows.length} pano sisteme ekleniyor, lütfen bekleyin.</p>
                    </div>
                )}

                {/* Step: Done */}
                {step === 'done' && (
                    <div className="space-y-6">
                        {/* Summary */}
                        <div className={`border rounded-xl p-8 text-center ${
                            errorResults.length === 0
                                ? 'bg-green-50 border-green-200'
                                : 'bg-amber-50 border-amber-200'
                        }`}>
                            {errorResults.length === 0 ? (
                                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            ) : (
                                <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                            )}
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Import Tamamlandı</h2>
                            <div className="flex justify-center gap-8 mt-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">{successCount}</div>
                                    <div className="text-sm text-slate-500">Başarılı</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-red-500">{errorResults.length}</div>
                                    <div className="text-sm text-slate-500">Hatalı</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-700">{importResults.length}</div>
                                    <div className="text-sm text-slate-500">Toplam</div>
                                </div>
                            </div>
                        </div>

                        {/* Error Details */}
                        {errorResults.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <h3 className="font-semibold text-red-900 mb-3">Hatalı Satırlar</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {errorResults.map((r, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm">
                                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-red-800">
                                                <strong>Satır {r.row}:</strong> {r.name} — {r.error}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button onClick={resetAll} variant="outline">
                                <Upload className="w-4 h-4 mr-2" />
                                Yeni Import
                            </Button>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                <Link href="/app/admin/panels">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Panoları Görüntüle
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
