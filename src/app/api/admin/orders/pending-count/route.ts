import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Helper to check if user has admin access
function hasAdminAccess(session: any) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

// GET: Get count of pending orders
export async function GET() {
    const session = await getSession();

    // Only admins can access this
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ count: 0 });
    }

    try {
        // Build where clause based on user's assigned city
        const where: any = {
            status: {
                in: ['PENDING', 'REVIEWING']
            }
        };

        // Regional admin: filter by their assigned city
        if (session.assignedCity) {
            where.items = {
                some: {
                    panel: {
                        city: session.assignedCity
                    }
                }
            };
        }

        const count = await prisma.order.count({ where });

        console.log('[PendingCount] Found', count, 'pending orders', session.assignedCity ? `for ${session.assignedCity}` : '');

        return NextResponse.json({ count });
    } catch (error) {
        console.error('[PendingCount] Error:', error);
        return NextResponse.json({ count: 0 });
    }
}
