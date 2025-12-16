import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/services/payment";
import prisma from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, campaignId } = body;

        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Create a Transaction record in our DB
        const transaction = await prisma.transaction.create({
            data: {
                userId: user.id,
                campaignId: campaignId,
                amount: amount,
                status: "PENDING",
                provider: "MOCK",
            }
        });

        // 2. Initialize Payment
        const paymentIntent = await paymentService.createPaymentIntent({
            amount,
            user: {
                id: user.id,
                email: user.email!,
                name: user.user_metadata?.name || "User"
            },
            metadata: {
                transactionId: transaction.id
            }
        });

        // 3. Update transaction with provider ID? (Not in schema yet, optional)

        return NextResponse.json({
            clientSecret: paymentIntent.clientSecret,
            transactionId: transaction.id
        });

    } catch (error) {
        console.error("Payment API Error:", error);
        return NextResponse.json({ error: "Payment init failed" }, { status: 500 });
    }
}
