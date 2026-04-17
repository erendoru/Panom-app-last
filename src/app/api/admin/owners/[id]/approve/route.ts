import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendOwnerApprovedEmail } from "@/lib/email";
import { createNotification } from "@/lib/notify";

export const dynamic = "force-dynamic";

async function requireAdmin() {
    const session = await getSession();
    if (!session) return null;
    if (session.role !== "ADMIN" && session.role !== "REGIONAL_ADMIN") return null;
    return session;
}

// PATCH — firmayı onayla veya onayı geri al
// body: { approved: boolean }
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const approved = Boolean(body?.approved);

    const owner = await prisma.screenOwner.findUnique({
        where: { id: params.id },
        include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!owner) {
        return NextResponse.json({ error: "Firma bulunamadı" }, { status: 404 });
    }

    const wasApproved = owner.approved;

    const updated = await prisma.screenOwner.update({
        where: { id: owner.id },
        data: { approved },
        select: {
            id: true,
            approved: true,
            companyName: true,
            slug: true,
        },
    });

    // Firmayı yeni onayladıysak e-posta gönder (idempotent)
    if (approved && !wasApproved) {
        try {
            const to = owner.contactEmail || owner.user.email;
            if (to) {
                await sendOwnerApprovedEmail({
                    to,
                    name: owner.user.name || "Medya Sahibi",
                    companyName: updated.companyName,
                    slug: updated.slug,
                });
            }
        } catch (err) {
            console.error("[Email] owner approved notify failed:", err);
        }

        await createNotification({
            userId: owner.user.id,
            type: "OWNER_APPROVED",
            title: "Firmanız onaylandı",
            body: `Artık panolarınız panobu.com'da yayımlanabilir. Mağaza sayfanız: panobu.com/medya/${updated.slug ?? ""}`,
            link: "/app/owner/dashboard",
        });
    }

    return NextResponse.json({
        id: updated.id,
        approved: updated.approved,
    });
}
