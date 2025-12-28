import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Fetch all pricing rules
export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const rules = await prisma.pricingRule.findMany({
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json(rules);
    } catch (error) {
        console.error('Error fetching pricing rules:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pricing rules' },
            { status: 500 }
        );
    }
}

// POST: Create new pricing rule
export async function POST(req: NextRequest) {
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

        if (!name || !minQuantity) {
            return NextResponse.json(
                { error: 'Name and minQuantity are required' },
                { status: 400 }
            );
        }

        const rule = await prisma.pricingRule.create({
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

        return NextResponse.json(rule, { status: 201 });
    } catch (error) {
        console.error('Error creating pricing rule:', error);
        return NextResponse.json(
            { error: 'Failed to create pricing rule' },
            { status: 500 }
        );
    }
}
