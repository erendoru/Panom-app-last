import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// PUT: Update pricing rule
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
        const {
            name,
            panelType,
            ownerName,
            city,
            minQuantity,
            discountPercent,
            fixedUnitPrice,
            priority,
            active
        } = body;

        const rule = await prisma.pricingRule.update({
            where: { id: params.id },
            data: {
                name,
                panelType: panelType || null,
                ownerName: ownerName || null,
                city: city || null,
                minQuantity: parseInt(minQuantity),
                discountPercent: discountPercent ? parseFloat(discountPercent) : null,
                fixedUnitPrice: fixedUnitPrice ? parseFloat(fixedUnitPrice) : null,
                priority: priority ? parseInt(priority) : 0,
                active: active !== undefined ? Boolean(active) : true
            }
        });

        return NextResponse.json(rule);
    } catch (error) {
        console.error('Error updating pricing rule:', error);
        return NextResponse.json(
            { error: 'Failed to update pricing rule' },
            { status: 500 }
        );
    }
}

// DELETE: Delete pricing rule
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.pricingRule.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting pricing rule:', error);
        return NextResponse.json(
            { error: 'Failed to delete pricing rule' },
            { status: 500 }
        );
    }
}
