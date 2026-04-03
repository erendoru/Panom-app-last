import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/services/stripe";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ error: "orderId gerekli" }, { status: 400 });
        }

        const session = await getSession();

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        panel: { select: { name: true, city: true, district: true } },
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
        }

        const totalAmount = order.items.reduce((sum, item) => {
            const weeks = Math.ceil(
                (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) /
                    (7 * 24 * 60 * 60 * 1000)
            );
            return sum + item.weeklyPrice * Math.max(1, weeks);
        }, 0);

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const lineItems = order.items.map((item) => {
            const weeks = Math.max(
                1,
                Math.ceil(
                    (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) /
                        (7 * 24 * 60 * 60 * 1000)
                )
            );
            return {
                name: `${item.panel.name} - ${item.panel.city} (${weeks} hafta)`,
                amount: item.weeklyPrice * weeks,
                quantity: 1,
            };
        });

        const result = await createCheckoutSession({
            amount: totalAmount,
            description: `Panobu Sipariş: ${order.orderNumber}`,
            customerEmail: order.contactEmail,
            metadata: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                ...(session?.userId && { userId: session.userId }),
            },
            lineItems,
            successUrl: `${appUrl}/checkout/success?order=${order.orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${appUrl}/checkout?orderId=${order.id}&cancelled=true`,
        });

        return NextResponse.json({
            url: result.url,
            sessionId: result.sessionId,
        });
    } catch (error: any) {
        console.error("Order payment error:", error);
        return NextResponse.json(
            { error: "Ödeme başlatılamadı", details: error.message },
            { status: 500 }
        );
    }
}
