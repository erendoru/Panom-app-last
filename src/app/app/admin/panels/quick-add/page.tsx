"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

type LocationStatus = 'idle' | 'loading' | 'success' | 'error';

export default function QuickAddPanelPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
    const [locationError, setLocationError] = useState<string>('');
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [step, setStep] = useState<'location' | 'photo' | 'confirm'>('location');

    // Request location on mount
    useEffect(() => {
        requestLocation();
    }, []);

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('error');
            setLocationError('Tarayıcınız konum özelliğini desteklemiyor');
            return;
        }

        setLocationStatus('loading');
        setLocationError('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoordinates({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setAccuracy(Math.round(position.coords.accuracy));
                setLocationStatus('success');
                setStep('photo');
            },
            (error) => {
                setLocationStatus('error');
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('Konum izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('Konum bilgisi alınamadı. GPS sinyali yok olabilir.');
                        break;
                    case error.TIMEOUT:
                        setLocationError('Konum alımı zaman aşımına uğradı. Tekrar deneyin.');
                        break;
                    default:
                        setLocationError('Konum alınırken bir hata oluştu.');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    };

    const handleImageChange = (url: string) => {
        setImageUrl(url);
        if (url) {
            setStep('confirm');
        }
    };

    const handleSubmit = async () => {
        if (!coordinates) {
            alert('Konum bilgisi alınamadı');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/admin/panels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                    imageUrl: imageUrl,
                    isDraft: true,
                    // Varsayılan değerler - haritada görünmesi için gerekli
                    city: 'Kocaeli',
                    district: 'Körfez',
                    name: '',
                    type: 'BILLBOARD',
                    width: 0,
                    height: 0,
                    priceWeekly: 0,
                    active: true
                })
            });

            if (res.ok) {
                alert('Pano başarıyla eklendi! Haritada görüntülenecek.');
                router.push('/app/admin/panels');
            } else {
                const data = await res.json();
                alert(data.error || 'Bir hata oluştu');
            }
        } catch (error) {
            console.error('Error creating panel:', error);
            alert('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button asChild variant="outline" className="mb-4">
                        <Link href="/app/admin/panels">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Geri Dön
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-900">⚡ Hızlı Pano Ekle</h1>
                    <p className="text-slate-600 mt-1">GPS konum + fotoğraf ile hızlıca taslak pano oluşturun</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'location' ? 'bg-blue-600 text-white' : locationStatus === 'success' ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        1
                    </div>
                    <div className={`w-16 h-1 ${locationStatus === 'success' ? 'bg-green-600' : 'bg-slate-200'}`} />
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'photo' ? 'bg-blue-600 text-white' : imageUrl ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        2
                    </div>
                    <div className={`w-16 h-1 ${imageUrl ? 'bg-green-600' : 'bg-slate-200'}`} />
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'confirm' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        3
                    </div>
                </div>

                {/* Step 1: Location */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <MapPin className={`w-6 h-6 ${locationStatus === 'success' ? 'text-green-600' : 'text-blue-600'}`} />
                        <h2 className="text-lg font-semibold">1. Konum Alınıyor</h2>
                        {locationStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>

                    {locationStatus === 'loading' && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                            <span className="text-blue-700">GPS konumu alınıyor... Lütfen bekleyin.</span>
                        </div>
                    )}

                    {locationStatus === 'success' && coordinates && (
                        <div className="p-4 bg-green-50 rounded-lg space-y-2">
                            <p className="text-green-700 font-medium">✓ Konum başarıyla alındı!</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500">Enlem:</span>
                                    <span className="ml-2 font-mono">{coordinates.lat.toFixed(6)}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Boylam:</span>
                                    <span className="ml-2 font-mono">{coordinates.lng.toFixed(6)}</span>
                                </div>
                            </div>
                            {accuracy && (
                                <p className="text-sm text-slate-600">
                                    Doğruluk: <span className="font-medium">~{accuracy} metre</span>
                                </p>
                            )}
                        </div>
                    )}

                    {locationStatus === 'error' && (
                        <div className="p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700 mb-2">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-medium">Konum alınamadı</span>
                            </div>
                            <p className="text-red-600 text-sm mb-3">{locationError}</p>
                            <Button onClick={requestLocation} variant="outline" size="sm">
                                Tekrar Dene
                            </Button>
                        </div>
                    )}

                    {locationStatus === 'idle' && (
                        <Button onClick={requestLocation} className="w-full">
                            <MapPin className="w-4 h-4 mr-2" />
                            Konumumu Al
                        </Button>
                    )}
                </div>

                {/* Step 2: Photo */}
                <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4 ${locationStatus !== 'success' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <Camera className={`w-6 h-6 ${imageUrl ? 'text-green-600' : 'text-blue-600'}`} />
                        <h2 className="text-lg font-semibold">2. Fotoğraf Çek/Yükle</h2>
                        {imageUrl && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>

                    <ImageUploader
                        imageUrl={imageUrl}
                        onImageChange={handleImageChange}
                        disabled={locationStatus !== 'success' || loading}
                    />
                </div>

                {/* Step 3: Confirm */}
                <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${!imageUrl ? 'opacity-50 pointer-events-none' : ''}`}>
                    <h2 className="text-lg font-semibold mb-4">3. Panoyu Ekle</h2>

                    {coordinates && imageUrl && (
                        <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                            <p className="text-sm text-slate-600 mb-2">Eklenecek pano:</p>
                            <ul className="text-sm space-y-1">
                                <li>📍 Konum: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</li>
                                <li>📸 Fotoğraf: Yüklendi</li>
                                <li>✅ Durum: Aktif (haritada görünecek)</li>
                            </ul>
                            <p className="text-xs text-slate-500 mt-3">
                                * Diğer bilgileri daha sonra düzenleme sayfasından doldurabilirsiniz
                            </p>
                        </div>
                    )}

                    <Button
                        onClick={handleSubmit}
                        disabled={!coordinates || !imageUrl || loading}
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Ekleniyor...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Pano Ekle
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
