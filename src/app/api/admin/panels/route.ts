import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Fix for Vercel build error

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

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
            active
        } = body;

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

        const panel = await prisma.staticPanel.create({
            data: {
                name,
                type,
                subType: subType || null,
                city,
                district,
                address,
                latitude: parseFloat(String(latitude)),
                longitude: parseFloat(String(longitude)),
                width: parseFloat(String(width)),
                height: parseFloat(String(height)),
                priceWeekly: parseFloat(String(priceWeekly)),
                priceDaily: priceDaily ? parseFloat(String(priceDaily)) : null,
                isAVM: Boolean(isAVM),
                avmName: avmName || null,
                estimatedDailyImpressions: estimatedDailyImpressions ? parseInt(String(estimatedDailyImpressions)) : 0,
                trafficLevel: trafficLevel || 'MEDIUM',
                imageUrl: imageUrl || null,
                active: active !== undefined ? Boolean(active) : true,
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
