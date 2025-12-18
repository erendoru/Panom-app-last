import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Oturum açmanız gerekiyor" }, { status: 401 });
        }

        // 1. Get or Autosync User in Prisma
        let user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) {
            console.log("User missing in Prisma by ID, checking email...", session.user.email);

            const userByEmail = await prisma.user.findUnique({
                where: { email: session.user.email! }
            });

            if (userByEmail) {
                console.log("User found by email, linking to existing record.");
                user = userByEmail;
            } else {
                console.log("User not found by email, creating new record.");
                try {
                    const name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || "Kullanıcı";

                    user = await prisma.user.create({
                        data: {
                            id: session.user.id,
                            email: session.user.email!,
                            role: "ADVERTISER",
                            name: name,
                            phone: session.user.phone, // Add phone to User model where it belongs
                            passwordHash: "supabase-auth-managed"
                        }
                    });
                } catch (err: any) {
                    console.error("Auto-create user failed:", err);
                    return NextResponse.json({ error: "Kullanıcı kaydı oluşturulamadı: " + (err.message || "Unique Constraint Error") }, { status: 500 });
                }
            }
        }

        const body = await request.json();
        const { panelId, startDate, endDate, creativeUrl, totalPrice, designRequested } = body;

        if (!panelId || !startDate || !endDate || !totalPrice) {
            return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
        }

        // 3. Get or Create Advertiser Profile
        let advertiser = await prisma.advertiser.findUnique({
            where: { userId: user.id },
        });

        if (!advertiser) {
            console.log("Advertiser profile missing, auto-creating...");
            try {
                advertiser = await prisma.advertiser.create({
                    data: {
                        userId: user.id,
                        companyName: user.name || "Bireysel Müşteri",
                        billingInfo: "Otomatik oluşturuldu", // Fixed: Schema uses billingInfo, not address
                        // Phone removed as it's not in Advertiser model
                    }
                });
            } catch (err: any) {
                console.error("Auto-create advertiser failed:", err);
                return NextResponse.json({ error: "Profil oluşturulamadı: " + (err.message || "DB hatası") }, { status: 500 });
            }
        }

        // 4. Create Rental (PENDING_PAYMENT)
        const rental = await prisma.staticRental.create({
            data: {
                advertiserId: advertiser.id,
                panelId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalPrice,
                creativeUrl,
                designRequested: designRequested || false,
                status: "PENDING_PAYMENT",
            },
        });

        return NextResponse.json(rental);

    } catch (error: any) {
        console.error("Rental creation API error:", error);
        return NextResponse.json(
            { error: "İşlem sırasında bir hata oluştu: " + error.message },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        const advertiser = await prisma.advertiser.findUnique({
            where: { userId: session.user.id },
        });

        if (!advertiser && user) {
            const existingUserByEmail = await prisma.user.findUnique({ where: { email: session.user.email! } });
            if (existingUserByEmail) {
                const adv = await prisma.advertiser.findUnique({ where: { userId: existingUserByEmail.id } });
                if (adv) {
                    const rentals = await prisma.staticRental.findMany({
                        where: { advertiserId: adv.id },
                        include: { panel: true },
                        orderBy: { createdAt: "desc" },
                    });
                    return NextResponse.json(rentals);
                }
            }
            return NextResponse.json([]);
        }

        if (!advertiser) return NextResponse.json([]);

        const rentals = await prisma.staticRental.findMany({
            where: { advertiserId: advertiser.id },
            include: { panel: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(rentals);
    } catch (error) {
        console.error("Fetch rentals error:", error);
        return NextResponse.json(
            { error: "Failed to fetch rentals" },
            { status: 500 }
        );
    }
}
