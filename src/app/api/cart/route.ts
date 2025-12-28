import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Fetch cart items for current user/session
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        const sessionId = req.headers.get('x-session-id') || '';

        if (!sessionId && !session) {
            return NextResponse.json({ items: [], count: 0 });
        }

        const where: any = {};
        if (session) {
            where.userId = session.userId;
        } else {
            where.sessionId = sessionId;
        }

        const cartItems = await prisma.cartItem.findMany({
            where,
            include: {
                panel: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        city: true,
                        district: true,
                        imageUrl: true,
                        priceWeekly: true,
                        priceDaily: true,
                        ownerName: true,
                        width: true,
                        height: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            items: cartItems,
            count: cartItems.length
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cart' },
            { status: 500 }
        );
    }
}

// POST: Add item to cart
export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        const body = await req.json();
        const { panelId, sessionId, startDate, endDate } = body;

        if (!panelId) {
            return NextResponse.json(
                { error: 'Panel ID is required' },
                { status: 400 }
            );
        }

        if (!sessionId && !session) {
            return NextResponse.json(
                { error: 'Session ID or login required' },
                { status: 400 }
            );
        }

        // Check if panel exists
        const panel = await prisma.staticPanel.findUnique({
            where: { id: panelId }
        });

        if (!panel) {
            return NextResponse.json(
                { error: 'Panel not found' },
                { status: 404 }
            );
        }

        // Check if already in cart
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                panelId,
                OR: [
                    { userId: session?.userId },
                    { sessionId: sessionId }
                ]
            }
        });

        if (existingItem) {
            return NextResponse.json(
                { error: 'Bu pano zaten sepetinizde', alreadyExists: true },
                { status: 400 }
            );
        }

        const cartItem = await prisma.cartItem.create({
            data: {
                panelId,
                userId: session?.userId || null,
                sessionId: sessionId || '',
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null
            },
            include: {
                panel: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        city: true,
                        district: true,
                        imageUrl: true,
                        priceWeekly: true,
                        priceDaily: true,
                        ownerName: true
                    }
                }
            }
        });

        // Get updated cart count
        const count = await prisma.cartItem.count({
            where: session?.userId
                ? { userId: session.userId }
                : { sessionId }
        });

        return NextResponse.json({ item: cartItem, count }, { status: 201 });
    } catch (error: any) {
        console.error('Error adding to cart:', error);
        return NextResponse.json(
            { error: 'Failed to add to cart', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}

// DELETE: Clear entire cart
export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession();
        const sessionId = req.headers.get('x-session-id') || '';

        if (!sessionId && !session) {
            return NextResponse.json({ success: true });
        }

        await prisma.cartItem.deleteMany({
            where: session?.userId
                ? { userId: session.userId }
                : { sessionId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error clearing cart:', error);
        return NextResponse.json(
            { error: 'Failed to clear cart' },
            { status: 500 }
        );
    }
}
