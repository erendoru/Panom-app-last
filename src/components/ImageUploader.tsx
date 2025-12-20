"use client";

import { useState, useRef } from "react";
import { Upload, Camera, X, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
    imageUrl: string;
    onImageChange: (url: string) => void;
    disabled?: boolean;
}

export default function ImageUploader({ imageUrl, onImageChange, disabled }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        setUploading(true);

        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: data
            });

            if (!res.ok) throw new Error("Upload failed");

            const json = await res.json();
            onImageChange(json.url);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Görsel yüklenirken bir hata oluştu.");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        handleUpload(e.target.files[0]);
    };

    const handleRemove = () => {
        onImageChange("");
    };

    if (imageUrl) {
        return (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                <Image src={imageUrl} alt="Panel" fill className="object-cover" />
                <button
                    type="button"
                    onClick={handleRemove}
                    disabled={disabled}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Hidden inputs */}
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                disabled={uploading || disabled}
                className="hidden"
            />
            <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading || disabled}
                className="hidden"
            />

            {uploading ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p>Yükleniyor...</p>
                </div>
            ) : (
                <>
                    {/* Mobile: Two buttons - Camera and Gallery */}
                    <div className="md:hidden grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            disabled={disabled}
                            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                            <Camera className="w-8 h-8" />
                            <span className="text-sm font-medium">Fotoğraf Çek</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            disabled={disabled}
                            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <ImageIcon className="w-8 h-8" />
                            <span className="text-sm font-medium">Galeriden Seç</span>
                        </button>
                    </div>

                    {/* Desktop: Single upload area */}
                    <div
                        className="hidden md:block border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => galleryInputRef.current?.click()}
                    >
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                            <Upload className="w-8 h-8" />
                            <p>Görsel yüklemek için tıklayın veya sürükleyin</p>
                            <p className="text-xs text-slate-400">PNG, JPG (Max 10MB)</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
