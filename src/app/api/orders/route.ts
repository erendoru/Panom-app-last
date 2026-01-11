import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { sendOrderNotificationEmail, sendOrderConfirmationToCustomer } from '@/lib/email';

export const dynamic = 'force-dynamic';

// Generate order number
function generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${year}-${random}`;
}

// POST: Create new order from cart
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            campaignName,
            startDate,
            endDate,
            contactName,
            contactPhone,
            contactEmail,
            companyName,
            notes,
            hasOwnCreatives,
            needsDesignHelp,
            items // Array of { panelId, startDate, endDate, weeklyPrice, creativeUrl }
        } = body;

        // Validation
        if (!campaignName || !startDate || !endDate || !contactName || !contactPhone || !contactEmail) {
            return NextResponse.json(
                { error: 'Eksik bilgi var' },
                { status: 400 }
            );
        }

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'Sepetinizde ürün yok' },
                { status: 400 }
            );
        }

        const session = await getSession();

        // Create order with items
        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                campaignName,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                contactName,
                contactPhone,
                contactEmail,
                companyName: companyName || null,
                notes: notes || null,
                hasOwnCreatives: Boolean(hasOwnCreatives),
                needsDesignHelp: Boolean(needsDesignHelp),
                userId: session?.userId || null,
                items: {
                    create: items.map((item: any) => ({
                        panelId: item.panelId,
                        startDate: new Date(item.startDate),
                        endDate: new Date(item.endDate),
                        weeklyPrice: parseFloat(item.weeklyPrice) || 0,
                        creativeUrl: item.creativeUrl || null
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        panel: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                city: true,
                                district: true
                            }
                        }
                    }
                }
            }
        });

        // Clear cart after order
        const sessionId = req.headers.get('x-session-id') || '';
        if (session?.userId) {
            await prisma.cartItem.deleteMany({
                where: { userId: session.userId }
            });
        } else if (sessionId) {
            await prisma.cartItem.deleteMany({
                where: { sessionId }
            });
        }

        // Send email notifications (don't await - fire and forget)
        sendOrderNotificationEmail({
            orderNumber: order.orderNumber,
            campaignName: order.campaignName,
            contactName: order.contactName,
            contactPhone: order.contactPhone,
            contactEmail: order.contactEmail,
            companyName: order.companyName,
            notes: order.notes,
            hasOwnCreatives: order.hasOwnCreatives,
            needsDesignHelp: order.needsDesignHelp,
            startDate: order.startDate,
            endDate: order.endDate,
            items: order.items.map(item => ({
                panel: {
                    name: item.panel.name,
                    type: item.panel.type,
                    city: item.panel.city,
                    district: item.panel.district
                },
                startDate: item.startDate,
                endDate: item.endDate,
                weeklyPrice: item.weeklyPrice
            }))
        }).catch(err => console.error('Failed to send order notification:', err));

        // Also send confirmation to customer
        sendOrderConfirmationToCustomer({
            orderNumber: order.orderNumber,
            campaignName: order.campaignName,
            contactName: order.contactName,
            contactPhone: order.contactPhone,
            contactEmail: order.contactEmail,
            companyName: order.companyName,
            notes: order.notes,
            hasOwnCreatives: order.hasOwnCreatives,
            needsDesignHelp: order.needsDesignHelp,
            startDate: order.startDate,
            endDate: order.endDate,
            items: order.items.map(item => ({
                panel: {
                    name: item.panel.name,
                    type: item.panel.type,
                    city: item.panel.city,
                    district: item.panel.district
                },
                startDate: item.startDate,
                endDate: item.endDate,
                weeklyPrice: item.weeklyPrice
            }))
        }).catch(err => console.error('Failed to send customer confirmation:', err));

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                campaignName: order.campaignName,
                itemCount: order.items.length
            }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Sipariş oluşturulamadı', details: error?.message },
            { status: 500 }
        );
    }
}

// GET: Get user's orders
export async function GET(req: NextRequest) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ orders: [] });
    }

    try {
        const orders = await prisma.order.findMany({
            where: { userId: session.userId },
            include: {
                items: {
                    include: {
                        panel: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                city: true
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
