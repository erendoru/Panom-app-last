import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendStoreInquiryToOwner } from "@/lib/email";
import { createNotification } from "@/lib/notify";

export const dynamic = "force-dynamic";

type InquiryPanel = {
    id: string;
    name: string;
    type: string;
    city: string;
    district: string;
    priceWeekly: number | null;
};

type Body = {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    message?: string;
    startDate?: string | null;
    endDate?: string | null;
    panels?: Array<{ id: string }>;
    /** Optional honeypot field — if present, treat as spam */
    website?: string;
};

function isValidEmail(v: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    let body: Body = {};
    try {
        body = (await req.json()) as Body;
    } catch {
        return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    if (body.website && body.website.length > 0) {
        // honeypot triggered — silently OK
        return NextResponse.json({ ok: true });
    }

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const company = (body.company ?? "").trim();
    const message = (body.message ?? "").trim().slice(0, 2000);

    if (!name || name.length < 2) {
        return NextResponse.json({ error: "Ad Soyad gerekli." }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
        return NextResponse.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
    }

    const panelIds = (body.panels ?? [])
        .map((p) => p?.id)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
        .slice(0, 100);

    const owner = await prisma.screenOwner.findUnique({
        where: { slug: params.slug },
        select: {
            id: true,
            userId: true,
            slug: true,
            companyName: true,
            contactEmail: true,
            user: { select: { name: true, email: true } },
        },
    });

    if (!owner || !owner.slug) {
        return NextResponse.json({ error: "Mağaza bulunamadı." }, { status: 404 });
    }

    let panels: InquiryPanel[] = [];
    if (panelIds.length > 0) {
        try {
            const rows = await prisma.staticPanel.findMany({
                where: {
                    ownerId: owner.id,
                    id: { in: panelIds },
                    active: true,
                    reviewStatus: "APPROVED",
                    ownerStatus: "ACTIVE",
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    city: true,
                    district: true,
                    priceWeekly: true,
                },
            });
            panels = rows.map((p) => ({
                id: p.id,
                name: p.name,
                type: p.type,
                city: p.city,
                district: p.district,
                priceWeekly: p.priceWeekly != null ? Number(p.priceWeekly) : null,
            }));
        } catch (err) {
            console.error("[store/inquiry] fetch panels failed:", err);
        }
    }

    const ownerEmail = owner.contactEmail || owner.user.email;

    // DB'ye yaz (owner dashboard'ında görünsün)
    const parsedStart = body.startDate ? new Date(body.startDate) : null;
    const parsedEnd = body.endDate ? new Date(body.endDate) : null;

    let inquiryId: string | null = null;
    try {
        const inq = await prisma.storeInquiry.create({
            data: {
                ownerId: owner.id,
                name,
                email,
                phone: phone || null,
                company: company || null,
                message: message || null,
                startDate: parsedStart && !isNaN(parsedStart.getTime()) ? parsedStart : null,
                endDate: parsedEnd && !isNaN(parsedEnd.getTime()) ? parsedEnd : null,
                panels: panels,
            },
        });
        inquiryId = inq.id;
    } catch (err) {
        console.error("[store/inquiry] DB write failed:", err);
        return NextResponse.json(
            { error: "Talebiniz kaydedilemedi. Lütfen tekrar deneyin." },
            { status: 500 }
        );
    }

    // Email bildirimi (varsa ve yapılandırılmışsa)
    if (ownerEmail) {
        try {
            await sendStoreInquiryToOwner({
                ownerEmail,
                ownerName: owner.user.name,
                companyName: owner.companyName,
                slug: owner.slug,
                customer: {
                    name,
                    email,
                    phone: phone || null,
                    company: company || null,
                },
                period: {
                    startDate: body.startDate || null,
                    endDate: body.endDate || null,
                },
                message: message || null,
                panels,
            });
        } catch (err) {
            console.error("[store/inquiry] email send failed:", err);
            // Email hatası talebi kaybetmesin — DB'de zaten kayıtlı
        }
    }

    // In-app bildirim
    await createNotification({
        userId: owner.userId,
        type: "INQUIRY_NEW",
        title: "Yeni mağaza talebi",
        body: `${name}${company ? ` (${company})` : ""} — ${panels.length} pano için teklif istedi.`,
        link: "/app/owner/inquiries",
        meta: { inquiryId, panelCount: panels.length },
    });

    return NextResponse.json({ ok: true });
}
