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

// GET /api/admin/owners?status=pending|approved|all&q=...
export async function GET(req: NextRequest) {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const q = (searchParams.get("q") || "").trim();

    const where: any = {};
    if (status === "pending") where.approved = false;
    if (status === "approved") where.approved = true;
    if (q) {
        where.OR = [
            { companyName: { contains: q, mode: "insensitive" } },
            { user: { name: { contains: q, mode: "insensitive" } } },
            { user: { email: { contains: q, mode: "insensitive" } } },
        ];
    }

    const owners = await prisma.screenOwner.findMany({
        where,
        orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
        include: {
            user: { select: { name: true, email: true, createdAt: true } },
            _count: { select: { screens: true, panels: true } },
        },
    });

    const [pending, approved, total] = await Promise.all([
        prisma.screenOwner.count({ where: { approved: false } }),
        prisma.screenOwner.count({ where: { approved: true } }),
        prisma.screenOwner.count(),
    ]);

    return NextResponse.json({
        items: owners.map((o) => ({
            id: o.id,
            companyName: o.companyName,
            approved: o.approved,
            slug: o.slug,
            phone: o.phone,
            contactEmail: o.contactEmail,
            website: o.website,
            cities: o.cities,
            createdAt: o.createdAt.toISOString(),
            user: {
                name: o.user.name,
                email: o.user.email,
                createdAt: o.user.createdAt.toISOString(),
            },
            counts: { screens: o._count.screens, panels: o._count.panels },
        })),
        summary: { pending, approved, total },
    });
}
