import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/services/stripe";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event;
    try {
        event = constructWebhookEvent(body, signature);
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const transactionId = session.metadata?.transactionId;
        const rentalId = session.metadata?.rentalId;
        const campaignId = session.metadata?.campaignId;
        const orderId = session.metadata?.orderId;

        try {
            if (transactionId) {
                await prisma.transaction.update({
                    where: { id: transactionId },
                    data: {
                        status: "COMPLETED",
                        providerPaymentId: session.payment_intent as string,
                    },
                });

                if (rentalId) {
                    await prisma.staticRental.update({
                        where: { id: rentalId },
                        data: { status: "ACTIVE" },
                    });
                }

                if (campaignId) {
                    const campaign = await prisma.campaign.findUnique({
                        where: { id: campaignId },
                    });
                    if (campaign && campaign.status === "DRAFT") {
                        await prisma.campaign.update({
                            where: { id: campaignId },
                            data: { status: "PENDING_APPROVAL" },
                        });
                    }
                }
            }

            if (orderId) {
                await prisma.order.update({
                    where: { id: orderId },
                    data: { status: "REVIEWING" },
                });
            }
        } catch (error) {
            console.error("Webhook DB update error:", error);
            return NextResponse.json({ error: "DB update failed" }, { status: 500 });
        }
    }

    if (event.type === "checkout.session.expired") {
        const session = event.data.object;
        const transactionId = session.metadata?.transactionId;

        if (transactionId) {
            try {
                await prisma.transaction.update({
                    where: { id: transactionId },
                    data: { status: "FAILED" },
                });
            } catch (error) {
                console.error("Webhook session expired error:", error);
            }
        }
    }

    return NextResponse.json({ received: true });
}
