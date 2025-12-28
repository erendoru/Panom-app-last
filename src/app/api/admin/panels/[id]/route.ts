import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
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

// GET: Fetch single panel (Admin only)
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const panel = await prisma.staticPanel.findUnique({
            where: { id: params.id },
            include: {
                rentals: {
                    include: {
                        advertiser: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!panel) {
            return NextResponse.json(
                { error: 'Panel not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(panel);
    } catch (error) {
        console.error('Error fetching panel:', error);
        return NextResponse.json(
            { error: 'Failed to fetch panel' },
            { status: 500 }
        );
    }
}

// PUT: Update panel (Admin only)
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await req.json();
        console.log('PUT Body:', JSON.stringify(body, null, 2));
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
            minRentalDays,
            isAVM,
            avmName,
            estimatedDailyImpressions,
            trafficLevel,
            imageUrl,
            active,
            ownerName,
            ownerPhone
        } = body;

        // Safe parse functions
        const safeParseFloat = (val: any): number => {
            if (val === null || val === undefined || val === '') return 0;
            const parsed = parseFloat(String(val));
            return isNaN(parsed) ? 0 : parsed;
        };

        const safeParseInt = (val: any, defaultVal: number = 0): number => {
            if (val === null || val === undefined || val === '') return defaultVal;
            const parsed = parseInt(String(val));
            return isNaN(parsed) ? defaultVal : parsed;
        };

        const panel = await prisma.staticPanel.update({
            where: { id: params.id },
            data: {
                name: name || 'Taslak Pano',
                type: type || 'BILLBOARD',
                subType: subType || null,
                city: city || '',
                district: district || '',
                address: address || '',
                latitude: safeParseFloat(latitude),
                longitude: safeParseFloat(longitude),
                width: width ? parseDimension(width) : 0,
                height: height ? parseDimension(height) : 0,
                priceWeekly: safeParseFloat(priceWeekly),
                priceDaily: priceDaily ? safeParseFloat(priceDaily) : null,
                minRentalDays: safeParseInt(minRentalDays, 7),
                isAVM: Boolean(isAVM),
                avmName: avmName || null,
                estimatedDailyImpressions: safeParseInt(estimatedDailyImpressions),
                trafficLevel: trafficLevel || 'MEDIUM',
                imageUrl: imageUrl || null,
                active: active !== undefined ? Boolean(active) : true,
                ownerName: ownerName || null,
                ownerPhone: ownerPhone || null,
                blockedDates: body.blockedDates || undefined
            }
        });

        return NextResponse.json(panel);
    } catch (error: any) {
        console.error('Error updating panel:', error);
        console.error('Error message:', error.message);
        return NextResponse.json(
            { error: 'Failed to update panel', details: error.message },
            { status: 500 }
        );
    }
}

// DELETE: Delete panel (Admin only)
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        // Check if panel has active rentals
        const panel = await prisma.staticPanel.findUnique({
            where: { id: params.id },
            include: {
                rentals: {
                    where: {
                        status: 'ACTIVE'
                    }
                }
            }
        });

        if (panel && panel.rentals.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete panel with active rentals' },
                { status: 400 }
            );
        }

        await prisma.staticPanel.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting panel:', error);
        return NextResponse.json(
            { error: 'Failed to delete panel' },
            { status: 500 }
        );
    }
}
