import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createNotifications, getAllAdminUserIds } from "@/lib/notify";

export const dynamic = "force-dynamic";

/**
 * Hesap silme talebi oluşturur. Silme işlemi Panobu ekibi tarafından manuel yürütülür
 * — aktif kampanyalar, ödeme yükümlülükleri ve yasal saklama süreleri nedeniyle.
 */
export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as { reason?: string };
    const reason =
        typeof body.reason === "string" ? body.reason.trim().slice(0, 1000) : null;

    try {
        const owner = await prisma.screenOwner.update({
            where: { userId: session.userId },
            data: {
                deletionRequestedAt: new Date(),
                deletionReason: reason || null,
            },
            select: { id: true, companyName: true },
        });

        // Tüm admin'lere bildirim
        const adminIds = await getAllAdminUserIds();
        if (adminIds.length > 0) {
            await createNotifications(adminIds, {
                type: "ACCOUNT_DELETION_REQUESTED",
                title: `${owner.companyName} hesap silme talebi gönderdi`,
                body: reason || "Sebep belirtilmedi.",
                link: `/app/admin/owners/${owner.id}`,
                meta: { ownerId: owner.id },
            });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[owner/account/delete-request] failed:", err);
        return NextResponse.json({ error: "İşlem başarısız." }, { status: 500 });
    }
}

export async function DELETE() {
    // Deletion isteğini iptal et
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        await prisma.screenOwner.update({
            where: { userId: session.userId },
            data: { deletionRequestedAt: null, deletionReason: null },
        });
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[owner/account/delete-request] cancel failed:", err);
        return NextResponse.json({ error: "İşlem başarısız." }, { status: 500 });
    }
}
