import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Fix for Vercel build error

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { triggerTrafficComputeInBackground } from '@/lib/traffic/computeForPanel';

// Helper to check if user has admin access
function hasAdminAccess(session: any) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

// Helper function to parse dimension string to meters
function parseDimension(value: string | number): number {
    if (typeof value === 'number') return value;

    const str = String(value).toLowerCase().trim();

    // Check for cm suffix
    if (str.endsWith('cm')) {
        const num = parseFloat(str.replace('cm', '').trim());
        return num / 100; // Convert cm to m
    }

    // Check for m suffix
    if (str.endsWith('m')) {
        return parseFloat(str.replace('m', '').trim());
    }

    // No suffix, assume meters
    return parseFloat(str);
}

// GET: Fetch all panels with optional filtering (Admin only)
export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(req.url);
        const city = searchParams.get('city');
        const district = searchParams.get('district');
        const type = searchParams.get('type');
        const isAVM = searchParams.get('isAVM');
        const reviewStatus = searchParams.get('reviewStatus');

        const where: any = {};

        if (city) where.city = city;
        if (district) where.district = district;
        if (type) where.type = type;
        if (isAVM === 'true') where.isAVM = true;
        if (reviewStatus) where.reviewStatus = reviewStatus;

        // Regional admin can only see panels from their assigned city
        if (session.assignedCity) {
            where.city = session.assignedCity;
        }

        const panels = await prisma.staticPanel.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                rentals: {
                    select: {
                        id: true,
                        startDate: true,
                        endDate: true,
                        status: true
                    }
                },
                owner: {
                    select: {
                        id: true,
                        companyName: true,
                        slug: true,
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        });

        return NextResponse.json(panels);
    } catch (error) {
        console.error('Error fetching panels:', error);
        return NextResponse.json(
            { error: 'Failed to fetch panels' },
            { status: 500 }
        );
    }
}

// POST: Create a new panel (Admin only)
export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await req.json();
        const {
            name,
            type,
            subType,
            city,
            district,
            address,
            latitude,
            longitude,
            width,
            height,
            priceWeekly,
            priceDaily,
            priceMonthly,
            price3Month,
            price6Month,
            priceYearly,
            isAVM,
            avmName,
            estimatedDailyImpressions,
            trafficLevel,
            imageUrl,
            active,
            nearbyTags,
            estimatedCpm,
            placementContext,
            manualRoadType,
            manualPoiCount,
            manualDailyTraffic,
            isDraft // For quick add feature
        } = body;

        // Regional admin can only add panels to their assigned city
        if (session.assignedCity && city && city !== session.assignedCity) {
            return NextResponse.json(
                { error: `Sadece ${session.assignedCity} iline pano ekleyebilirsiniz` },
                { status: 403 }
            );
        }

        // Skip validation for draft panels (quick add)
        if (!isDraft) {
            // Validation
            if (!name || !type || !city || !district || !address || !latitude || !longitude || !width || !height || !priceWeekly) {
                return NextResponse.json(
                    { error: 'Missing required fields' },
                    { status: 400 }
                );
            }

            if (isAVM && !avmName) {
                return NextResponse.json(
                    { error: 'AVM name is required when isAVM is true' },
                    { status: 400 }
                );
            }
        }

        // Use assigned city for regional admin if city not provided
        const finalCity = city || session.assignedCity || '';

        const panel = await prisma.staticPanel.create({
            data: {
                name: name || '',
                type: type || 'BILLBOARD',
                subType: subType || '',
                city: finalCity,
                district: district || '',
                address: address || '',
                latitude: latitude ? parseFloat(String(latitude)) : 0,
                longitude: longitude ? parseFloat(String(longitude)) : 0,
                width: width ? parseDimension(width) : 0,
                height: height ? parseDimension(height) : 0,
                priceWeekly: priceWeekly ? parseFloat(String(priceWeekly)) : 0,
                priceDaily: priceDaily ? parseFloat(String(priceDaily)) : 0,
                priceMonthly: priceMonthly ? parseFloat(String(priceMonthly)) : null,
                price3Month: price3Month ? parseFloat(String(price3Month)) : null,
                price6Month: price6Month ? parseFloat(String(price6Month)) : null,
                priceYearly: priceYearly ? parseFloat(String(priceYearly)) : null,
                isAVM: Boolean(isAVM),
                avmName: avmName || '',
                estimatedDailyImpressions: estimatedDailyImpressions ? parseInt(String(estimatedDailyImpressions)) : 0,
                trafficLevel: trafficLevel || 'MEDIUM',
                imageUrl: imageUrl || '',
                active: isDraft ? true : (active !== undefined ? Boolean(active) : true), // Quick add is also active
                blockedDates: [], // Initialize empty blocked dates array
                nearbyTags: Array.isArray(nearbyTags)
                    ? nearbyTags
                          .map((t: unknown) => String(t || '').trim())
                          .filter((t: string) => t.length > 0)
                          .slice(0, 30)
                    : [],
                estimatedCpm:
                    estimatedCpm === undefined || estimatedCpm === null || estimatedCpm === ''
                        ? null
                        : parseFloat(String(estimatedCpm)),
                placementContext: placementContext || null,
                manualRoadType: manualRoadType || null,
                manualPoiCount:
                    manualPoiCount === undefined || manualPoiCount === null || manualPoiCount === ''
                        ? null
                        : parseInt(String(manualPoiCount)),
                manualDailyTraffic:
                    manualDailyTraffic === undefined || manualDailyTraffic === null || manualDailyTraffic === ''
                        ? null
                        : parseInt(String(manualDailyTraffic)),
            }
        });

        // T2: Yeni pano için trafik skorunu arka planda hesapla (fire-and-forget)
        if (panel.latitude && panel.longitude) {
            triggerTrafficComputeInBackground(panel.id);
        }

        return NextResponse.json(panel, { status: 201 });
    } catch (error: any) {
        console.error('Error creating panel:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error code:', error.code);
        return NextResponse.json(
            { error: 'Failed to create panel', details: error.message },
            { status: 500 }
        );
    }
}
