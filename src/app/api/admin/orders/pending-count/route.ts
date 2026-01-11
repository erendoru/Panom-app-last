import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Get count of pending orders
export async function GET() {
    const session = await getSession();

    // Only admin can access this (ADMIN is uppercase in database)
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ count: 0 });
    }

    try {
        // Count orders with PENDING or REVIEWING status
        const count = await prisma.order.count({
            where: {
                status: {
                    in: ['PENDING', 'REVIEWING']
                }
            }
        });

        console.log('[PendingCount] Found', count, 'pending orders');

        return NextResponse.json({ count });
    } catch (error) {
        console.error('[PendingCount] Error:', error);
        return NextResponse.json({ count: 0 });
    }
}
