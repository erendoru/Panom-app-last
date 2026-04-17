import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function cleanString(v: unknown, max = 500): string | null {
    if (typeof v !== "string") return null;
    const s = v.trim();
    if (!s) return null;
    return s.slice(0, max);
}

function sanitizeIban(raw: unknown): string | null {
    if (typeof raw !== "string") return null;
    const s = raw.replace(/\s+/g, "").toUpperCase();
    if (!s) return null;
    // TR IBAN 26 hane (TR + 24 digit)
    if (!/^[A-Z]{2}[0-9A-Z]{5,32}$/.test(s)) return null;
    return s.slice(0, 34);
}

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session.userId },
        include: { user: { select: { name: true, email: true, phone: true } } },
    });
    if (!owner) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
        id: owner.id,
        companyName: owner.companyName,
        taxId: owner.taxId,
        address: owner.address,
        phone: owner.phone,
        contactEmail: owner.contactEmail,
        cities: owner.cities,
        website: owner.website,
        description: owner.description,
        logoUrl: owner.logoUrl,
        coverUrl: owner.coverUrl,
        iban: owner.iban,
        bankName: owner.bankName,
        bankAccountHolder: owner.bankAccountHolder,
        user: owner.user,
    });
}

export async function PATCH(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    const data: Record<string, unknown> = {};

    if ("companyName" in body) {
        const v = cleanString(body.companyName, 200);
        if (v) data.companyName = v;
    }
    if ("taxId" in body) data.taxId = cleanString(body.taxId, 64);
    if ("address" in body) data.address = cleanString(body.address, 1000);
    if ("phone" in body) data.phone = cleanString(body.phone, 40);
    if ("contactEmail" in body) data.contactEmail = cleanString(body.contactEmail, 200);
    if ("website" in body) data.website = cleanString(body.website, 300);
    if ("description" in body) data.description = cleanString(body.description, 2000);

    if ("cities" in body && Array.isArray(body.cities)) {
        data.cities = (body.cities as unknown[])
            .map((v) => (typeof v === "string" ? v.trim() : ""))
            .filter(Boolean)
            .slice(0, 81);
    }

    // Banka bilgileri
    if ("iban" in body) {
        if (body.iban === null || body.iban === "") {
            data.iban = null;
        } else {
            const clean = sanitizeIban(body.iban);
            if (!clean) {
                return NextResponse.json(
                    { error: "IBAN formatı geçersiz." },
                    { status: 400 }
                );
            }
            data.iban = clean;
        }
    }
    if ("bankName" in body) data.bankName = cleanString(body.bankName, 100);
    if ("bankAccountHolder" in body)
        data.bankAccountHolder = cleanString(body.bankAccountHolder, 200);

    // User tablosundaki telefon/ad güncellenirse ayrı işle
    const userData: Record<string, unknown> = {};
    if ("contactName" in body) {
        const v = cleanString(body.contactName, 200);
        if (v) userData.name = v;
    }

    try {
        if (Object.keys(userData).length > 0) {
            await prisma.user.update({
                where: { id: session.userId },
                data: userData,
            });
        }

        const updated = await prisma.screenOwner.update({
            where: { userId: session.userId },
            data,
        });

        return NextResponse.json({ ok: true, owner: updated });
    } catch (err) {
        console.error("[owner/settings/company] update failed:", err);
        return NextResponse.json({ error: "Güncelleme başarısız." }, { status: 500 });
    }
}
