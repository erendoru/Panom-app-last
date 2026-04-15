import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { parseGoogleMapsUrl, normalizePanelType, normalizeLocationType } from '@/lib/geo-utils';

function hasAdminAccess(session: any) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

function parseDimension(value: string | number): number {
    if (typeof value === 'number') return value;
    const str = String(value).toLowerCase().trim();
    if (str.endsWith('cm')) return parseFloat(str.replace('cm', '').trim()) / 100;
    if (str.endsWith('m')) return parseFloat(str.replace('m', '').trim());
    const num = parseFloat(str);
    return num > 50 ? num / 100 : num;
}

interface ImportRow {
    name: string;
    type: string;
    city: string;
    district: string;
    address: string;
    googleMapsUrl?: string;
    latitude?: number | string;
    longitude?: number | string;
    width_cm?: number | string;
    height_cm?: number | string;
    width?: number | string;
    height?: number | string;
    priceDaily?: number | string;
    priceWeekly?: number | string;
    priceMonthly?: number | string;
    price3Month?: number | string;
    price6Month?: number | string;
    priceYearly?: number | string;
    locationType?: string;
    ownerName?: string;
    ownerPhone?: string;
    isAVM?: boolean | string;
    avmName?: string;
    estimatedDailyImpressions?: number | string;
    trafficLevel?: string;
    subType?: string;
    imageUrl?: string;
}

interface ImportResult {
    success: boolean;
    row: number;
    name: string;
    error?: string;
    id?: string;
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { panels } = body as { panels: ImportRow[] };

        if (!panels || !Array.isArray(panels) || panels.length === 0) {
            return NextResponse.json({ error: 'Pano verisi bulunamadı' }, { status: 400 });
        }

        if (panels.length > 500) {
            return NextResponse.json({ error: 'Tek seferde en fazla 500 pano import edilebilir' }, { status: 400 });
        }

        const results: ImportResult[] = [];

        for (let i = 0; i < panels.length; i++) {
            const row = panels[i];
            const rowNum = i + 1;

            try {
                // Zorunlu alan kontrolleri
                if (!row.name?.trim()) {
                    results.push({ success: false, row: rowNum, name: row.name || '', error: 'Pano adı zorunlu' });
                    continue;
                }
                if (!row.city?.trim()) {
                    results.push({ success: false, row: rowNum, name: row.name, error: 'İl zorunlu' });
                    continue;
                }
                if (!row.district?.trim()) {
                    results.push({ success: false, row: rowNum, name: row.name, error: 'İlçe zorunlu' });
                    continue;
                }
                if (!row.address?.trim()) {
                    results.push({ success: false, row: rowNum, name: row.name, error: 'Adres zorunlu' });
                    continue;
                }

                // Panel tipi
                const panelType = normalizePanelType(row.type);
                if (!panelType) {
                    results.push({ success: false, row: rowNum, name: row.name, error: `Geçersiz pano türü: "${row.type}"` });
                    continue;
                }

                // Koordinatlar
                let lat = row.latitude ? parseFloat(String(row.latitude)) : 0;
                let lng = row.longitude ? parseFloat(String(row.longitude)) : 0;

                if ((!lat || !lng) && row.googleMapsUrl) {
                    const coords = parseGoogleMapsUrl(row.googleMapsUrl);
                    if (coords) {
                        lat = coords.latitude;
                        lng = coords.longitude;
                    }
                }

                // Boyutlar
                const widthRaw = row.width_cm || row.width;
                const heightRaw = row.height_cm || row.height;
                const width = widthRaw ? parseDimension(widthRaw) : 0;
                const height = heightRaw ? parseDimension(heightRaw) : 0;

                // Fiyatlar
                const parsePrice = (val: number | string | undefined): number | null => {
                    if (val === undefined || val === null || val === '') return null;
                    const num = parseFloat(String(val));
                    return isNaN(num) ? null : num;
                };

                const priceWeekly = parsePrice(row.priceWeekly) ?? 0;
                const priceDaily = parsePrice(row.priceDaily);
                const priceMonthly = parsePrice(row.priceMonthly);
                const price3Month = parsePrice(row.price3Month);
                const price6Month = parsePrice(row.price6Month);
                const priceYearly = parsePrice(row.priceYearly);

                // Regional admin kontrolü
                if (session.assignedCity && row.city !== session.assignedCity) {
                    results.push({ success: false, row: rowNum, name: row.name, error: `Sadece ${session.assignedCity} iline pano ekleyebilirsiniz` });
                    continue;
                }

                const isAVM = row.isAVM === true || row.isAVM === 'true' || row.isAVM === 'evet' || row.isAVM === '1';

                const panel = await prisma.staticPanel.create({
                    data: {
                        name: row.name.trim(),
                        type: panelType as any,
                        subType: row.subType?.trim() || null,
                        city: row.city.trim(),
                        district: row.district.trim(),
                        address: row.address.trim(),
                        latitude: lat,
                        longitude: lng,
                        width,
                        height,
                        priceWeekly,
                        priceDaily: priceDaily ?? 0,
                        priceMonthly,
                        price3Month,
                        price6Month,
                        priceYearly,
                        locationType: normalizeLocationType(row.locationType || '') as any,
                        socialGrade: 'B' as any,
                        isAVM,
                        avmName: isAVM ? (row.avmName?.trim() || '') : null,
                        estimatedDailyImpressions: row.estimatedDailyImpressions ? parseInt(String(row.estimatedDailyImpressions)) : 0,
                        trafficLevel: (['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'].includes(String(row.trafficLevel || '').toUpperCase()) ? String(row.trafficLevel).toUpperCase() : 'MEDIUM') as any,
                        ownerName: row.ownerName?.trim() || null,
                        ownerPhone: row.ownerPhone?.trim() || null,
                        imageUrl: row.imageUrl?.trim() || null,
                        active: true,
                        blockedDates: [],
                    }
                });

                results.push({ success: true, row: rowNum, name: row.name, id: panel.id });
            } catch (err: any) {
                results.push({ success: false, row: rowNum, name: row.name || `Satır ${rowNum}`, error: err.message || 'Bilinmeyen hata' });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const errorCount = results.filter(r => !r.success).length;

        return NextResponse.json({
            message: `${successCount} pano başarıyla eklendi, ${errorCount} hata oluştu.`,
            successCount,
            errorCount,
            total: panels.length,
            results
        });
    } catch (error: any) {
        console.error('Import error:', error);
        return NextResponse.json(
            { error: 'Import işlemi başarısız oldu', details: error.message },
            { status: 500 }
        );
    }
}
