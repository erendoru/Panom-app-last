import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// DELETE: Remove specific item from cart
export async function DELETE(
    req: NextRequest,
    { params }: { params: { itemId: string } }
) {
    try {
        const session = await getSession();
        const sessionId = req.headers.get('x-session-id') || '';

        // Verify ownership
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: params.itemId }
        });

        if (!cartItem) {
            return NextResponse.json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        // Check if user owns this cart item
        const isOwner = session?.userId
            ? cartItem.userId === session.userId
            : cartItem.sessionId === sessionId;

        if (!isOwner) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await prisma.cartItem.delete({
            where: { id: params.itemId }
        });

        // Get updated cart count
        const count = await prisma.cartItem.count({
            where: session?.userId
                ? { userId: session.userId }
                : { sessionId }
        });

        return NextResponse.json({ success: true, count });
    } catch (error) {
        console.error('Error removing from cart:', error);
        return NextResponse.json(
            { error: 'Failed to remove from cart' },
            { status: 500 }
        );
    }
}

// PUT: Update cart item (dates)
export async function PUT(
    req: NextRequest,
    { params }: { params: { itemId: string } }
) {
    try {
        const session = await getSession();
        const sessionId = req.headers.get('x-session-id') || '';
        const body = await req.json();
        const { startDate, endDate } = body;

        // Verify ownership
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: params.itemId }
        });

        if (!cartItem) {
            return NextResponse.json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        const isOwner = session?.userId
            ? cartItem.userId === session.userId
            : cartItem.sessionId === sessionId;

        if (!isOwner) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const updated = await prisma.cartItem.update({
            where: { id: params.itemId },
            data: {
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null
            },
            include: {
                panel: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        priceWeekly: true
                    }
                }
            }
        });

        return NextResponse.json({ item: updated });
    } catch (error) {
        console.error('Error updating cart item:', error);
        return NextResponse.json(
            { error: 'Failed to update cart item' },
            { status: 500 }
        );
    }
}
