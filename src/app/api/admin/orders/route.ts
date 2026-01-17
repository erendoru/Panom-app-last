import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Helper to check if user has admin access
function hasAdminAccess(session: any) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

// GET: Get all orders (admin only)
export async function GET(req: NextRequest) {
    const session = await getSession();

    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const where: any = {};
        if (status) {
            where.status = status;
        }

        // Regional admin: filter orders by their assigned city
        if (session.assignedCity) {
            where.items = {
                some: {
                    panel: {
                        city: session.assignedCity
                    }
                }
            };
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        panel: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                city: true,
                                district: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
