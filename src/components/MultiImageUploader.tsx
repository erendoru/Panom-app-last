"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Camera, X, Loader2, ImageIcon, Plus } from "lucide-react";

interface Props {
    images: string[];
    onChange: (urls: string[]) => void;
    max?: number;
    disabled?: boolean;
}

export default function MultiImageUploader({ images, onChange, max = 5, disabled }: Props) {
    const [uploading, setUploading] = useState(false);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const atLimit = images.length >= max;

    async function handleFiles(list: FileList | null) {
        if (!list || list.length === 0) return;
        const remaining = max - images.length;
        const files = Array.from(list).slice(0, remaining);
        if (files.length === 0) return;

        setUploading(true);
        try {
            const uploaded: string[] = [];
            for (const file of files) {
                const form = new FormData();
                form.append("file", file);
                const res = await fetch("/api/upload", { method: "POST", body: form });
                if (!res.ok) throw new Error("Upload failed");
                const json = await res.json();
                if (json?.url) uploaded.push(json.url);
            }
            onChange([...images, ...uploaded]);
        } catch (err) {
            console.error("Upload error:", err);
            alert("Görsel yüklenirken bir hata oluştu.");
        } finally {
            setUploading(false);
            if (cameraInputRef.current) cameraInputRef.current.value = "";
            if (galleryInputRef.current) galleryInputRef.current.value = "";
        }
    }

    function remove(index: number) {
        const next = images.slice();
        next.splice(index, 1);
        onChange(next);
    }

    function moveToFirst(index: number) {
        if (index === 0) return;
        const next = images.slice();
        const [item] = next.splice(index, 1);
        next.unshift(item);
        onChange(next);
    }

    return (
        <div className="space-y-3">
            <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
                disabled={uploading || disabled}
            />
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
                disabled={uploading || disabled}
            />

            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {images.map((url, idx) => (
                        <div
                            key={url + idx}
                            className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50"
                        >
                            <Image src={url} alt={`Görsel ${idx + 1}`} fill className="object-cover" />
                            {idx === 0 && (
                                <span className="absolute top-1.5 left-1.5 text-[10px] font-medium bg-blue-600 text-white px-1.5 py-0.5 rounded">
                                    Kapak
                                </span>
                            )}
                            <div className="absolute inset-0 flex items-end justify-between p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 to-transparent">
                                {idx !== 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => moveToFirst(idx)}
                                        className="text-[10px] bg-white/90 text-slate-800 px-1.5 py-0.5 rounded"
                                        disabled={disabled}
                                    >
                                        Kapak Yap
                                    </button>
                                ) : (
                                    <span />
                                )}
                                <button
                                    type="button"
                                    onClick={() => remove(idx)}
                                    className="bg-red-500 text-white p-1 rounded-full"
                                    disabled={disabled}
                                    aria-label="Görseli kaldır"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!atLimit && (
                <>
                    {uploading ? (
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-slate-500">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <p className="text-sm">Yükleniyor...</p>
                        </div>
                    ) : (
                        <>
                            <div className="sm:hidden grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => cameraInputRef.current?.click()}
                                    disabled={disabled}
                                    className="flex flex-col items-center justify-center gap-1.5 p-5 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                                >
                                    <Camera className="w-6 h-6" />
                                    <span className="text-xs font-medium">Fotoğraf Çek</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => galleryInputRef.current?.click()}
                                    disabled={disabled}
                                    className="flex flex-col items-center justify-center gap-1.5 p-5 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100"
                                >
                                    <ImageIcon className="w-6 h-6" />
                                    <span className="text-xs font-medium">Galeriden Seç</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => galleryInputRef.current?.click()}
                                disabled={disabled}
                                className="hidden sm:flex w-full border-2 border-dashed border-slate-300 rounded-lg p-6 flex-col items-center gap-2 text-slate-500 hover:bg-slate-50 transition-colors"
                            >
                                {images.length === 0 ? (
                                    <>
                                        <Upload className="w-6 h-6" />
                                        <span className="text-sm">Görselleri yüklemek için tıklayın (en fazla {max} adet)</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        <span className="text-sm">Fotoğraf ekle ({images.length}/{max})</span>
                                    </>
                                )}
                                <span className="text-xs text-slate-400">PNG, JPG — her biri max 10MB</span>
                            </button>
                        </>
                    )}
                </>
            )}

            {atLimit && (
                <p className="text-xs text-slate-500">
                    Maksimum {max} görsel yükleyebilirsiniz. Yeni eklemek için önce mevcut birini kaldırın.
                </p>
            )}
        </div>
    );
}
