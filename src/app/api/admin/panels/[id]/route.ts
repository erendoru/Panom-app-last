import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Helper to check if user has admin access
function hasAdminAccess(session: any) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

// Helper to check if regional admin can access this panel
async function canAccessPanel(session: any, panelId: string): Promise<{ canAccess: boolean; panel: any }> {
    const panel = await prisma.staticPanel.findUnique({
        where: { id: panelId },
        select: { city: true }
    });

    if (!session.assignedCity) return { canAccess: true, panel }; // Full admin has access to all
    if (!panel) return { canAccess: false, panel: null };

    return { canAccess: panel.city === session.assignedCity, panel };
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

// GET: Fetch single panel (Admin only)
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
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

        // Check if regional admin can access this panel
        if (session.assignedCity && panel.city !== session.assignedCity) {
            return NextResponse.json({ error: 'Bu panoya erişim yetkiniz yok' }, { status: 403 });
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
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if regional admin can access this panel
    if (session.assignedCity) {
        const { canAccess } = await canAccessPanel(session, params.id);
        if (!canAccess) {
            return NextResponse.json({ error: 'Bu panoya erişim yetkiniz yok' }, { status: 403 });
        }
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
            ownerPhone,
            nearbyTags,
            estimatedCpm
        } = body;

        // Regional admin cannot change city to a different city
        if (session.assignedCity && city && city !== session.assignedCity) {
            return NextResponse.json({ error: `Sadece ${session.assignedCity} iline ait panolar düzenleyebilirsiniz` }, { status: 403 });
        }

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
                name: name || '',
                type: type || 'BILLBOARD',
                subType: subType || '',
                city: city || session.assignedCity || '',
                district: district || '',
                address: address || '',
                latitude: safeParseFloat(latitude),
                longitude: safeParseFloat(longitude),
                width: width ? parseDimension(width) : 0,
                height: height ? parseDimension(height) : 0,
                priceWeekly: safeParseFloat(priceWeekly),
                priceDaily: safeParseFloat(priceDaily),
                minRentalDays: safeParseInt(minRentalDays, 7),
                isAVM: Boolean(isAVM),
                avmName: avmName || '',
                estimatedDailyImpressions: safeParseInt(estimatedDailyImpressions),
                trafficLevel: trafficLevel || 'MEDIUM',
                imageUrl: imageUrl || '',
                active: active !== undefined ? Boolean(active) : true,
                ownerName: ownerName || '',
                ownerPhone: ownerPhone || '',
                blockedDates: body.blockedDates || [],
                ...(Array.isArray(nearbyTags)
                    ? {
                          nearbyTags: nearbyTags
                              .map((t: unknown) => String(t || '').trim())
                              .filter((t: string) => t.length > 0)
                              .slice(0, 30),
                      }
                    : {}),
                ...(estimatedCpm !== undefined
                    ? {
                          estimatedCpm:
                              estimatedCpm === '' || estimatedCpm === null
                                  ? null
                                  : safeParseFloat(estimatedCpm),
                      }
                    : {}),
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
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if regional admin can access this panel
    if (session.assignedCity) {
        const { canAccess } = await canAccessPanel(session, params.id);
        if (!canAccess) {
            return NextResponse.json({ error: 'Bu panoya erişim yetkiniz yok' }, { status: 403 });
        }
    }

    try {
        const panel = await prisma.staticPanel.findUnique({
            where: { id: params.id },
            include: {
                rentals: { where: { status: 'ACTIVE' } }
            }
        });

        if (!panel) {
            return NextResponse.json({ error: 'Panel not found' }, { status: 404 });
        }

        if (panel.rentals.length > 0) {
            return NextResponse.json(
                { error: 'Aktif kiralaması olan pano silinemez' },
                { status: 400 }
            );
        }

        await prisma.cartItem.deleteMany({ where: { panelId: params.id } });
        await prisma.orderItem.deleteMany({ where: { panelId: params.id } });
        await prisma.staticRental.deleteMany({ where: { panelId: params.id } });
        await prisma.staticPanel.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting panel:', error);
        return NextResponse.json(
            { error: 'Failed to delete panel', details: error.message },
            { status: 500 }
        );
    }
}

