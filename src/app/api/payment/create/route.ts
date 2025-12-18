import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { paymentService } from "@/lib/services/payment";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, campaignId, rentalId, description } = body;

        const supabase = createRouteHandlerClient({ cookies });
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Sync/Get DB User
        let dbUserId = session.user.id;
        let userName = session.user.user_metadata?.name || "Kullanıcı";
        let userPhone = session.user.phone || "";

        let user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) {
            const userByEmail = await prisma.user.findUnique({
                where: { email: session.user.email! }
            });

            if (userByEmail) {
                user = userByEmail;
                dbUserId = user.id;
                userName = user.name || userName;
                userPhone = user.phone || userPhone;
            } else {
                try {
                    user = await prisma.user.create({
                        data: {
                            id: session.user.id,
                            email: session.user.email!,
                            role: "ADVERTISER",
                            name: userName,
                            phone: userPhone,
                            passwordHash: "supabase-auth-managed"
                        }
                    });
                    dbUserId = user.id;
                } catch (err: any) {
                    return NextResponse.json({ error: "Ödeme hesabı doğrulanamadı: " + err.message }, { status: 500 });
                }
            }
        } else {
            dbUserId = user.id;
            userName = user.name || userName;
            userPhone = user.phone || userPhone;
        }

        // 2. Create a Transaction record
        // FIX: Do NOT assign rentalId to campaignId field, as it triggers FK constraint.
        // campaignId field refers strictly to Campaign model.
        // Static Rental ID will be tracked via Iyzico metadata/basketId.
        const transaction = await prisma.transaction.create({
            data: {
                userId: dbUserId,
                campaignId: campaignId || null, // Only set if it's a real Campaign ID
                amount: amount,
                status: "PENDING",
                provider: "IYZICO",
            }
        });

        // 3. Initialize Iyzico Checkout Form
        const paymentResult = await paymentService.createCheckoutForm({
            amount,
            user: {
                id: dbUserId,
                email: session.user.email!,
                name: userName,
                phone: userPhone
            },
            callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/app/advertiser/checkout/callback`,
            metadata: {
                transactionId: transaction.id,
                rentalId: rentalId, // Passed here for callback logic
                campaignId
            },
            basketItems: [{
                id: transaction.id,
                name: description || 'Panobu Reklam Hizmeti',
                category: 'Reklam',
                price: amount.toString()
            }]
        });

        // 4. Update transaction with Iyzico token
        await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
                providerPaymentId: paymentResult.token
            }
        });

        return NextResponse.json({
            checkoutFormContent: paymentResult.checkoutFormContent,
            token: paymentResult.token,
            transactionId: transaction.id
        });

    } catch (error: any) {
        console.error("Payment API Error:", error);
        return NextResponse.json({
            error: "Ödeme başlatılamadı",
            details: error.message
        }, { status: 500 });
    }
}
