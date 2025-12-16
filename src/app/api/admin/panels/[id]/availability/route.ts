import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT: Update panel availability (blocked dates)
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const { blockedDates } = body;

        // Validate blockedDates format
        if (blockedDates && !Array.isArray(blockedDates)) {
            return NextResponse.json(
                { error: 'blockedDates must be an array' },
                { status: 400 }
            );
        }

        const panel = await prisma.staticPanel.update({
            where: { id: params.id },
            data: {
                blockedDates: blockedDates || []
            }
        });

        return NextResponse.json(panel);
    } catch (error: any) {
        console.error('Error updating availability:', error);
        return NextResponse.json(
            { error: 'Failed to update availability', details: error.message },
            { status: 500 }
        );
    }
}
