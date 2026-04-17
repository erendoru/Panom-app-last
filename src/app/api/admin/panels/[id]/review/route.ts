import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function hasAdminAccess(session: any) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const action = String(body?.action || "").toLowerCase();
        const note = body?.note ? String(body.note) : null;

        if (action !== "approve" && action !== "reject") {
            return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
        }

        const panel = await prisma.staticPanel.findUnique({
            where: { id: params.id },
            select: { id: true, city: true },
        });
        if (!panel) {
            return NextResponse.json({ error: "Pano bulunamadı" }, { status: 404 });
        }

        // Regional admin sadece kendi şehrinde onaylayabilir
        if (session.assignedCity && panel.city !== session.assignedCity) {
            return NextResponse.json(
                { error: `Sadece ${session.assignedCity} iline ait panoları onaylayabilirsiniz` },
                { status: 403 }
            );
        }

        const data =
            action === "approve"
                ? {
                    reviewStatus: "APPROVED" as const,
                    active: true,
                    reviewedAt: new Date(),
                    reviewNote: null,
                }
                : {
                    reviewStatus: "REJECTED" as const,
                    active: false,
                    reviewedAt: new Date(),
                    reviewNote: note,
                };

        const updated = await prisma.staticPanel.update({
            where: { id: params.id },
            data,
        });
        return NextResponse.json({ panel: updated });
    } catch (error: any) {
        console.error("admin review error:", error);
        return NextResponse.json(
            { error: "İşlem başarısız", details: error?.message },
            { status: 500 }
        );
    }
}
