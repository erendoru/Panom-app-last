import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/services/payment";
import prisma from "@/lib/prisma";
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const token = formData.get('token') as string;

        if (!token) {
            return NextResponse.redirect(
                new URL('/app/advertiser/checkout?error=missing_token', request.url)
            );
        }

        // Retrieve payment result from Iyzico
        const result = await paymentService.retrievePayment({ token });

        if (result.status === 'SUCCESS') {
            // Find the transaction by looking for pending transactions
            // In a production app, you'd store the token with the transaction
            const pendingTransaction = await prisma.transaction.findFirst({
                where: {
                    status: 'PENDING',
                    provider: 'IYZICO'
                },
                orderBy: { createdAt: 'desc' }
            });

            if (pendingTransaction) {
                // Update transaction status
                await prisma.transaction.update({
                    where: { id: pendingTransaction.id },
                    data: {
                        status: 'COMPLETED',
                        providerPaymentId: result.paymentId
                    }
                });

                // If there's a linked static rental, update its status
                if (pendingTransaction.campaignId) {
                    // Check if it's a static rental (using campaignId as rentalId for now)
                    const rental = await prisma.staticRental.findUnique({
                        where: { id: pendingTransaction.campaignId }
                    });

                    if (rental) {
                        await prisma.staticRental.update({
                            where: { id: rental.id },
                            data: { status: 'ACTIVE' }
                        });
                    }
                }
            }

            return NextResponse.redirect(
                new URL('/app/advertiser/checkout/success', request.url)
            );
        } else {
            // Payment failed
            return NextResponse.redirect(
                new URL(`/app/advertiser/checkout?error=${encodeURIComponent(result.errorMessage || 'payment_failed')}`, request.url)
            );
        }
    } catch (error) {
        console.error("Payment callback error:", error);
        return NextResponse.redirect(
            new URL('/app/advertiser/checkout?error=callback_error', request.url)
        );
    }
}

// Also handle GET requests (Iyzico sometimes uses GET for callbacks)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(
            new URL('/app/advertiser/checkout?error=missing_token', request.url)
        );
    }

    try {
        const result = await paymentService.retrievePayment({ token });

        if (result.status === 'SUCCESS') {
            return NextResponse.redirect(
                new URL('/app/advertiser/checkout/success', request.url)
            );
        } else {
            return NextResponse.redirect(
                new URL(`/app/advertiser/checkout?error=${encodeURIComponent(result.errorMessage || 'payment_failed')}`, request.url)
            );
        }
    } catch (error) {
        console.error("Payment callback error:", error);
        return NextResponse.redirect(
            new URL('/app/advertiser/checkout?error=callback_error', request.url)
        );
    }
}
