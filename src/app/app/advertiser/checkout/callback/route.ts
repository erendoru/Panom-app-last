import { NextRequest, NextResponse } from "next/server";
import { retrieveCheckoutSession } from "@/lib/services/stripe";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function handlePaymentVerification(token: string, requestUrl: string) {
    try {
        const session = await retrieveCheckoutSession(token);

        if (session.payment_status === "paid") {
            const transactionId = session.metadata?.transactionId;
            const rentalId = session.metadata?.rentalId;

            if (transactionId) {
                const existing = await prisma.transaction.findUnique({
                    where: { id: transactionId },
                });

                if (existing && existing.status === "PENDING") {
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
                }
            }

            return NextResponse.redirect(
                new URL(`/app/advertiser/checkout/success?transactionId=${transactionId}`, requestUrl)
            );
        } else {
            return NextResponse.redirect(
                new URL("/app/advertiser/checkout?error=payment_not_completed", requestUrl)
            );
        }
    } catch (error) {
        console.error("Payment callback error:", error);
        return NextResponse.redirect(
            new URL("/app/advertiser/checkout?error=callback_error", requestUrl)
        );
    }
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const token = formData.get("token") as string;

    if (!token) {
        return NextResponse.redirect(
            new URL("/app/advertiser/checkout?error=missing_token", request.url)
        );
    }

    return handlePaymentVerification(token, request.url);
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token") || searchParams.get("session_id");

    if (!token) {
        return NextResponse.redirect(
            new URL("/app/advertiser/checkout?error=missing_token", request.url)
        );
    }

    return handlePaymentVerification(token, request.url);
}
