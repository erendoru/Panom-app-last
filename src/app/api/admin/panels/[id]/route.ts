import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

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
            isAVM,
            avmName,
            estimatedDailyImpressions,
            trafficLevel,
            imageUrl,
            active
        } = body;

        const panel = await prisma.staticPanel.update({
            where: { id: params.id },
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
