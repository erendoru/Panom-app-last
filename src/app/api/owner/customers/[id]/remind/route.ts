import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendReengagementEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session.userId },
        include: { user: { select: { name: true, email: true } } },
    });
    if (!owner) return NextResponse.json({ error: "Owner not found" }, { status: 404 });

    let body: { message?: string } = {};
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const message = (body.message || "").trim();
    if (message.length < 10) {
        return NextResponse.json(
            { error: "Mesaj en az 10 karakter olmalı." },
            { status: 400 }
        );
    }

    // Müşteri doğrulaması: bu owner'ın panosu kiralamış mı?
    const rental = await prisma.staticRental.findFirst({
        where: { advertiserId: params.id, panel: { ownerId: owner.id } },
        select: {
            id: true,
            advertiser: {
                include: { user: { select: { name: true, email: true } } },
            },
        },
    });
    if (!rental) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const customer = rental.advertiser?.user;
    if (!customer?.email) {
        return NextResponse.json(
            { error: "Müşteri e-postası bulunamadı." },
            { status: 400 }
        );
    }

    try {
        const ok = await sendReengagementEmail({
            customerEmail: customer.email,
            customerName: customer.name || "Müşteri",
            ownerCompanyName: owner.companyName,
            ownerContactName: owner.user.name,
            ownerEmail: owner.contactEmail || owner.user.email,
            ownerPhone: owner.phone || null,
            ownerStoreSlug: owner.slug || null,
            message,
        });
        if (!ok) {
            return NextResponse.json(
                { error: "E-posta gönderilemedi." },
                { status: 500 }
            );
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[owner/customers/remind] send failed:", err);
        return NextResponse.json({ error: "E-posta gönderilemedi." }, { status: 500 });
    }
}
