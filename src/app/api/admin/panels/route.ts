import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Fix for Vercel build error

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

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
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(req.url);
        const city = searchParams.get('city');
        const district = searchParams.get('district');
        const type = searchParams.get('type');
        const isAVM = searchParams.get('isAVM');

        const where: any = {};

        if (city) where.city = city;
        if (district) where.district = district;
        if (type) where.type = type;
        if (isAVM === 'true') where.isAVM = true;

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
    if (!session || session.role !== 'ADMIN') {
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
            isAVM,
            avmName,
            estimatedDailyImpressions,
            trafficLevel,
            imageUrl,
            active,
            isDraft // For quick add feature
        } = body;

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

        const panel = await prisma.staticPanel.create({
            data: {
                name: name || 'Taslak Pano',
                type: type || 'BILLBOARD',
                subType: subType || null,
                city: city || '',
                district: district || '',
                address: address || '',
                latitude: latitude ? parseFloat(String(latitude)) : 0,
                longitude: longitude ? parseFloat(String(longitude)) : 0,
                width: width ? parseDimension(width) : 0,
                height: height ? parseDimension(height) : 0,
                priceWeekly: priceWeekly ? parseFloat(String(priceWeekly)) : 0,
                priceDaily: priceDaily ? parseFloat(String(priceDaily)) : null,
                isAVM: Boolean(isAVM),
                avmName: avmName || null,
                estimatedDailyImpressions: estimatedDailyImpressions ? parseInt(String(estimatedDailyImpressions)) : 0,
                trafficLevel: trafficLevel || 'MEDIUM',
                imageUrl: imageUrl || null,
                active: isDraft ? false : (active !== undefined ? Boolean(active) : true),
                blockedDates: [] // Initialize empty blocked dates array
            }
        });

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
