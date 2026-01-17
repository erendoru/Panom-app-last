import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Helper to check if user has admin access
function hasAdminAccess(session: any) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

// Helper to check if regional admin can access this order
async function canAccessOrder(session: any, orderId: string): Promise<boolean> {
    if (!session.assignedCity) return true; // Full admin has access to all

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    panel: { select: { city: true } }
                }
            }
        }
    });

    if (!order) return false;

    // Check if any panel in order belongs to admin's city
    return order.items.some(item => item.panel.city === session.assignedCity);
}

// PUT: Update order status (admin only)
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSession();

    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if regional admin can access this order
    if (session.assignedCity) {
        const canAccess = await canAccessOrder(session, params.id);
        if (!canAccess) {
            return NextResponse.json({ error: 'Bu siparişe erişim yetkiniz yok' }, { status: 403 });
        }
    }

    try {
        const body = await req.json();
        const { status, notes } = body;

        const order = await prisma.order.update({
            where: { id: params.id },
            data: {
                status: status || undefined,
                notes: notes !== undefined ? notes : undefined
            }
        });

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}

// GET: Get single order details (admin only)
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSession();

    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                items: {
                    include: {
                        panel: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check if regional admin can access this order
        if (session.assignedCity) {
            const hasAccess = order.items.some(item => item.panel.city === session.assignedCity);
            if (!hasAccess) {
                return NextResponse.json({ error: 'Bu siparişe erişim yetkiniz yok' }, { status: 403 });
            }
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}
