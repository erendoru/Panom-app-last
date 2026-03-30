import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

function hasAdminAccess(session: any) {
    return session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN";
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || !hasAdminAccess(session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { action, panelIds, value } = body as {
            action: 'delete' | 'updateStatus' | 'updatePrice' | 'rename';
            panelIds: string[];
            value?: any;
        };

        if (!panelIds || panelIds.length === 0) {
            return NextResponse.json({ error: 'No panels selected' }, { status: 400 });
        }

        const cityFilter = session.assignedCity
            ? { city: session.assignedCity }
            : {};

        switch (action) {
            case 'delete': {
                const activeRentals = await prisma.staticRental.findMany({
                    where: { panelId: { in: panelIds }, status: 'ACTIVE' },
                    select: { panelId: true }
                });
                const blockedIds = new Set(activeRentals.map(r => r.panelId));
                const deletableIds = panelIds.filter(id => !blockedIds.has(id));

                if (deletableIds.length === 0) {
                    return NextResponse.json(
                        { error: 'Seçili panoların tamamında aktif kiralama var, silinemez.' },
                        { status: 400 }
                    );
                }

                await prisma.cartItem.deleteMany({ where: { panelId: { in: deletableIds } } });
                await prisma.orderItem.deleteMany({ where: { panelId: { in: deletableIds } } });
                await prisma.staticRental.deleteMany({ where: { panelId: { in: deletableIds }, status: { not: 'ACTIVE' } } });
                await prisma.staticPanel.deleteMany({
                    where: { id: { in: deletableIds }, ...cityFilter }
                });

                const skipped = panelIds.length - deletableIds.length;
                return NextResponse.json({
                    success: true,
                    deleted: deletableIds.length,
                    skipped,
                    message: skipped > 0
                        ? `${deletableIds.length} pano silindi, ${skipped} pano aktif kiralama nedeniyle atlandı.`
                        : `${deletableIds.length} pano silindi.`
                });
            }

            case 'updateStatus': {
                const active = value === true || value === 'active';
                await prisma.staticPanel.updateMany({
                    where: { id: { in: panelIds }, ...cityFilter },
                    data: { active }
                });
                return NextResponse.json({
                    success: true,
                    message: `${panelIds.length} pano ${active ? 'aktif' : 'pasif'} yapıldı.`
                });
            }

            case 'updatePrice': {
                const price = parseFloat(value);
                if (isNaN(price) || price < 0) {
                    return NextResponse.json({ error: 'Geçersiz fiyat' }, { status: 400 });
                }
                await prisma.staticPanel.updateMany({
                    where: { id: { in: panelIds }, ...cityFilter },
                    data: { priceWeekly: price }
                });
                return NextResponse.json({
                    success: true,
                    message: `${panelIds.length} panonun fiyatı ₺${price.toLocaleString('tr-TR')} olarak güncellendi.`
                });
            }

            case 'rename': {
                const prefix = String(value || '').trim();
                if (!prefix) {
                    return NextResponse.json({ error: 'Ad boş olamaz' }, { status: 400 });
                }
                const panels = await prisma.staticPanel.findMany({
                    where: { id: { in: panelIds }, ...cityFilter },
                    select: { id: true },
                    orderBy: { createdAt: 'asc' }
                });
                for (let i = 0; i < panels.length; i++) {
                    await prisma.staticPanel.update({
                        where: { id: panels[i].id },
                        data: { name: panels.length === 1 ? prefix : `${prefix} ${i + 1}` }
                    });
                }
                return NextResponse.json({
                    success: true,
                    message: `${panels.length} panonun adı güncellendi.`
                });
            }

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Bulk action error:', error);
        return NextResponse.json(
            { error: 'İşlem sırasında hata oluştu', details: error.message },
            { status: 500 }
        );
    }
}
