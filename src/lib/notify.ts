import prisma from "@/lib/prisma";

export type NotifyType =
    | "REQUEST_NEW"
    | "REQUEST_APPROVED"
    | "REQUEST_REJECTED"
    | "CREATIVE_SUBMITTED"
    | "CREATIVE_APPROVED"
    | "CREATIVE_REJECTED"
    | "PROOF_UPLOADED"
    | "PROOF_CONFIRMED"
    | "PROOF_REMINDER"
    | "INQUIRY_NEW"
    | "OWNER_APPROVED"
    | "ACCOUNT_DELETION_REQUESTED"
    | "ADMIN_MESSAGE"
    | "CAMPAIGN_START"
    | "GENERIC";

/**
 * In-app bildirim oluşturur.
 * İçeride asla throw etmez — bildirim hatası, iş akışını bozmamalı.
 */
export async function createNotification(opts: {
    userId: string;
    type: NotifyType;
    title: string;
    body?: string | null;
    link?: string | null;
    meta?: Record<string, unknown> | null;
}): Promise<void> {
    try {
        const client = prisma as unknown as {
            notification?: {
                create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
            };
        };
        if (!client.notification) return;
        await client.notification.create({
            data: {
                userId: opts.userId,
                type: opts.type,
                title: opts.title.slice(0, 200),
                body: opts.body ? String(opts.body).slice(0, 2000) : null,
                link: opts.link ?? null,
                meta: opts.meta ?? undefined,
            },
        });
    } catch (err) {
        console.warn("[notify] createNotification failed:", err);
    }
}

/**
 * Birden fazla kullanıcıya toplu bildirim gönder.
 */
export async function createNotifications(
    userIds: string[],
    params: Omit<Parameters<typeof createNotification>[0], "userId">,
): Promise<void> {
    const unique = Array.from(new Set(userIds.filter(Boolean)));
    await Promise.all(unique.map((uid) => createNotification({ ...params, userId: uid })));
}

/**
 * Bir kullanıcının ownerId'si üzerinden User'ını bul (in-app için).
 */
export async function getOwnerUserId(
    ownerId: string | null | undefined,
): Promise<string | null> {
    if (!ownerId) return null;
    const row = await prisma.screenOwner.findUnique({
        where: { id: ownerId },
        select: { userId: true },
    });
    return row?.userId ?? null;
}

/**
 * Advertiser id -> User id çözümle
 */
export async function getAdvertiserUserId(
    advertiserId: string | null | undefined,
): Promise<string | null> {
    if (!advertiserId) return null;
    const row = await prisma.advertiser.findUnique({
        where: { id: advertiserId },
        select: { userId: true },
    });
    return row?.userId ?? null;
}

/**
 * Tüm admin (ADMIN + REGIONAL_ADMIN) kullanıcılarının id'lerini döner.
 */
export async function getAllAdminUserIds(): Promise<string[]> {
    const rows = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "REGIONAL_ADMIN"] } },
        select: { id: true },
    });
    return rows.map((r) => r.id);
}
