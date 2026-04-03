import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createCheckoutSession } from "@/lib/services/stripe";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, campaignId, rentalId, description } = body;

        const supabase = createRouteHandlerClient({ cookies });
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let dbUserId = session.user.id;
        let userName = session.user.user_metadata?.name || "Kullanıcı";

        let user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            const userByEmail = await prisma.user.findUnique({
                where: { email: session.user.email! },
            });

            if (userByEmail) {
                user = userByEmail;
                dbUserId = user.id;
                userName = user.name || userName;
            } else {
                try {
                    user = await prisma.user.create({
                        data: {
                            id: session.user.id,
                            email: session.user.email!,
                            role: "ADVERTISER",
                            name: userName,
                            phone: session.user.phone || "",
                            passwordHash: "supabase-auth-managed",
                        },
                    });
                    dbUserId = user.id;
                } catch (err: any) {
                    return NextResponse.json(
                        { error: "Ödeme hesabı doğrulanamadı: " + err.message },
                        { status: 500 }
                    );
                }
            }
        } else {
            dbUserId = user.id;
            userName = user.name || userName;
        }

        const transaction = await prisma.transaction.create({
            data: {
                userId: dbUserId,
                campaignId: campaignId || null,
                amount: amount,
                status: "PENDING",
                provider: "STRIPE",
            },
        });

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const result = await createCheckoutSession({
            amount,
            description: description || "Panobu Reklam Hizmeti",
            customerEmail: session.user.email!,
            metadata: {
                transactionId: transaction.id,
                ...(rentalId && { rentalId }),
                ...(campaignId && { campaignId }),
                userId: dbUserId,
            },
            successUrl: `${appUrl}/app/advertiser/checkout/success?session_id={CHECKOUT_SESSION_ID}&transactionId=${transaction.id}`,
            cancelUrl: `${appUrl}/app/advertiser/checkout?cancelled=true`,
        });

        await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
                providerPaymentId: result.sessionId,
            },
        });

        return NextResponse.json({
            sessionId: result.sessionId,
            url: result.url,
            transactionId: transaction.id,
        });
    } catch (error: any) {
        console.error("Payment API Error:", error);
        return NextResponse.json(
            {
                error: "Ödeme başlatılamadı",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
