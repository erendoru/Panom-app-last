import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function requireAdmin() {
    const session = await getSession();
    if (!session) return null;
    if (session.role !== "ADMIN" && session.role !== "REGIONAL_ADMIN") return null;
    return session;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const owner = await prisma.screenOwner.findUnique({
        where: { id: params.id },
        include: {
            user: {
                select: { id: true, name: true, email: true, phone: true, createdAt: true },
            },
            _count: {
                select: {
                    screens: true,
                    panels: true,
                    inquiries: true,
                    customerNotes: true,
                },
            },
        },
    });

    if (!owner) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

    // Aktif kampanyalar (bu owner'ın panolarında)
    const activeRentalsCount = await prisma.staticRental.count({
        where: {
            panel: { ownerId: owner.id },
            status: { in: ["PENDING_PAYMENT", "PAID", "ACTIVE"] },
        },
    });

    const lifetimeRentalsCount = await prisma.staticRental.count({
        where: { panel: { ownerId: owner.id } },
    });

    const pendingRequestsCount = await prisma.staticRental.count({
        where: {
            panel: { ownerId: owner.id },
            ownerReviewStatus: "PENDING",
        },
    });

    return NextResponse.json({
        id: owner.id,
        companyName: owner.companyName,
        approved: owner.approved,
        slug: owner.slug,
        phone: owner.phone,
        contactEmail: owner.contactEmail,
        website: owner.website,
        description: owner.description,
        cities: owner.cities,
        logoUrl: owner.logoUrl,
        coverUrl: owner.coverUrl,
        taxId: owner.taxId,
        address: owner.address,
        iban: owner.iban,
        bankName: owner.bankName,
        bankAccountHolder: owner.bankAccountHolder,
        createdAt: owner.createdAt.toISOString(),
        deletionRequestedAt: owner.deletionRequestedAt?.toISOString() ?? null,
        deletionReason: owner.deletionReason,
        user: {
            id: owner.user.id,
            name: owner.user.name,
            email: owner.user.email,
            phone: owner.user.phone,
            createdAt: owner.user.createdAt.toISOString(),
        },
        counts: {
            screens: owner._count.screens,
            panels: owner._count.panels,
            inquiries: owner._count.inquiries,
            customers: owner._count.customerNotes,
            activeRentals: activeRentalsCount,
            lifetimeRentals: lifetimeRentalsCount,
            pendingRequests: pendingRequestsCount,
        },
    });
}

/**
 * PATCH — admin, silme talebini iptal edebilir (deny) veya onaylayabilir (approve).
 * body: { deletionAction: "cancel" | "approve" }
 *
 * "approve" seçilirse: firma soft-silinir (suspended + cleared).
 * Gerçek hard-delete Panobu ekibi tarafından manuel yürütülür (DB+Auth).
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => ({}))) as {
        deletionAction?: "cancel" | "approve";
    };

    const action = body.deletionAction;
    if (!action) {
        return NextResponse.json({ error: "deletionAction gerekli" }, { status: 400 });
    }

    const owner = await prisma.screenOwner.findUnique({ where: { id: params.id } });
    if (!owner) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

    if (action === "cancel") {
        await prisma.screenOwner.update({
            where: { id: owner.id },
            data: { deletionRequestedAt: null, deletionReason: null },
        });
        return NextResponse.json({ ok: true });
    }

    if (action === "approve") {
        // Tüm aktif panoları pasif hale getir ve firmayı onaysız yap
        await prisma.$transaction([
            prisma.staticPanel.updateMany({
                where: { ownerId: owner.id },
                data: { active: false, ownerStatus: "PAUSED" },
            }),
            prisma.screenOwner.update({
                where: { id: owner.id },
                data: {
                    approved: false,
                    deletionRequestedAt: null,
                    deletionReason: `Silme onaylandı: ${owner.deletionReason || "-"}`,
                },
            }),
        ]);
        return NextResponse.json({ ok: true, softDeleted: true });
    }

    return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
}
