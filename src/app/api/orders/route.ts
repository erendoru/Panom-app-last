import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import {
    sendOrderNotificationEmail,
    sendOrderConfirmationToCustomer,
    sendNewRequestToOwner,
} from '@/lib/email';
import { createNotification } from '@/lib/notify';

export const dynamic = 'force-dynamic';

// Order item -> StaticRental dönüşümü için yardımcı
async function ensureAdvertiserForContact(params: {
    userId: string | null;
    email: string;
    name: string;
    phone: string | null;
    companyName: string | null;
}): Promise<string | null> {
    const { userId, email, name, phone, companyName } = params;
    try {
        // 1) Oturumlu ise onun ID'si üzerinden
        if (userId) {
            const adv = await prisma.advertiser.findUnique({ where: { userId } });
            if (adv) return adv.id;
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (user) {
                const created = await prisma.advertiser.create({
                    data: {
                        userId: user.id,
                        companyName: companyName || user.name || 'Bireysel Müşteri',
                        billingInfo: 'Otomatik oluşturuldu (panobu.com sipariş)',
                    },
                });
                return created.id;
            }
        }

        // 2) Email üzerinden mevcut kullanıcı
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            const adv = await prisma.advertiser.findUnique({ where: { userId: existing.id } });
            if (adv) return adv.id;
            const created = await prisma.advertiser.create({
                data: {
                    userId: existing.id,
                    companyName: companyName || existing.name || 'Bireysel Müşteri',
                    billingInfo: 'Otomatik oluşturuldu (panobu.com sipariş)',
                },
            });
            return created.id;
        }

        // 3) Misafir müşteri — User + Advertiser oluştur (şifre placeholder)
        const newUser = await prisma.user.create({
            data: {
                email,
                role: 'ADVERTISER',
                name: name || email.split('@')[0] || 'Misafir',
                phone: phone || null,
                passwordHash: 'guest-order-no-password',
            },
        });
        const newAdv = await prisma.advertiser.create({
            data: {
                userId: newUser.id,
                companyName: companyName || newUser.name || 'Misafir Müşteri',
                billingInfo: 'Otomatik oluşturuldu (panobu.com misafir sipariş)',
            },
        });
        return newAdv.id;
    } catch (err) {
        console.error('[orders] ensureAdvertiserForContact failed:', err);
        return null;
    }
}

function daysBetween(a: Date, b: Date): number {
    const ms = b.getTime() - a.getTime();
    return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

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

        // Her OrderItem için StaticRental oluştur (owner dashboard'ında "Kiralama Talepleri"ne düşsün)
        // Ve ilgili ünite sahibine e-posta bildirimi gönder.
        try {
            const advertiserId = await ensureAdvertiserForContact({
                userId: session?.userId ?? null,
                email: contactEmail,
                name: contactName,
                phone: contactPhone ?? null,
                companyName: companyName ?? null,
            });

            if (advertiserId) {
                for (const orderItem of order.items) {
                    try {
                        // Fiyat: haftalık × (gün/7) — yaklaşık toplam
                        const days = daysBetween(
                            new Date(orderItem.startDate),
                            new Date(orderItem.endDate)
                        );
                        const totalPrice = (orderItem.weeklyPrice / 7) * days;

                        const rental = await prisma.staticRental.create({
                            data: {
                                advertiserId,
                                panelId: orderItem.panelId,
                                startDate: orderItem.startDate,
                                endDate: orderItem.endDate,
                                totalPrice,
                                status: 'PENDING_PAYMENT',
                                creativeUrl: orderItem.creativeUrl ?? null,
                                designRequested: Boolean(needsDesignHelp),
                                ownerReviewStatus: 'PENDING',
                                creativeStatus: orderItem.creativeUrl ? 'PENDING' : 'NONE',
                                totalDays: days,
                            },
                        });

                        // Owner'a bildirim
                        try {
                            const full = await prisma.staticRental.findUnique({
                                where: { id: rental.id },
                                include: {
                                    panel: {
                                        include: {
                                            owner: {
                                                include: {
                                                    user: {
                                                        select: { id: true, name: true, email: true },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    advertiser: {
                                        include: {
                                            user: { select: { name: true, email: true } },
                                        },
                                    },
                                },
                            });

                            // In-app bildirim (owner'a)
                            if (full?.panel.owner?.user?.id) {
                                await createNotification({
                                    userId: full.panel.owner.user.id,
                                    type: 'REQUEST_NEW',
                                    title: `Yeni kiralama talebi — ${full.panel.name}`,
                                    body: `${
                                        full.advertiser?.user?.name || contactName || 'Bir reklam veren'
                                    } panoyu kiralamak istiyor.`,
                                    link: `/app/owner/requests/${full.id}`,
                                    meta: { rentalId: full.id, panelId: full.panel.id },
                                });
                            }

                            if (full && full.panel.owner?.user) {
                                await sendNewRequestToOwner({
                                    rentalId: full.id,
                                    panel: {
                                        name: full.panel.name,
                                        city: full.panel.city,
                                        district: full.panel.district,
                                    },
                                    owner: {
                                        name:
                                            full.panel.owner.user.name ||
                                            'Medya Sahibi',
                                        companyName: full.panel.owner.companyName,
                                        email:
                                            full.panel.owner.contactEmail ||
                                            full.panel.owner.user.email,
                                    },
                                    advertiser: {
                                        name:
                                            full.advertiser?.user?.name ||
                                            contactName ||
                                            'Müşteri',
                                        companyName:
                                            full.advertiser?.companyName ??
                                            companyName ??
                                            null,
                                        email:
                                            full.advertiser?.user?.email ??
                                            contactEmail ??
                                            null,
                                    },
                                    startDate: full.startDate,
                                    endDate: full.endDate,
                                    totalPrice: full.totalPrice.toString(),
                                    currency: full.currency,
                                });
                            }
                        } catch (mailErr) {
                            console.error(
                                '[orders] owner email failed for rental',
                                rental.id,
                                mailErr
                            );
                        }
                    } catch (itemErr) {
                        console.error(
                            '[orders] rental create failed for item',
                            orderItem.id,
                            itemErr
                        );
                    }
                }
            }
        } catch (rentalErr) {
            console.error('[orders] static rental sync failed:', rentalErr);
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
