import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface CartItemWithPanel {
    id: string;
    panelId: string;
    startDate: Date | null;
    endDate: Date | null;
    panel: {
        id: string;
        name: string;
        type: string;
        city: string;
        priceWeekly: number;
        priceDaily: number | null;
        ownerName: string | null;
    };
}

interface DiscountSuggestion {
    panelType: string;
    ownerName: string | null;
    currentCount: number;
    neededCount: number;
    discountPercent?: number;
    fixedUnitPrice?: number;
    potentialSavings: number;
}

// POST: Calculate cart totals with discounts
export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        const sessionId = req.headers.get('x-session-id') || '';

        if (!sessionId && !session) {
            return NextResponse.json({
                subtotal: 0,
                discount: 0,
                total: 0,
                items: [],
                suggestions: []
            });
        }

        // Fetch cart items
        const cartItems = await prisma.cartItem.findMany({
            where: session?.userId
                ? { userId: session.userId }
                : { sessionId },
            include: {
                panel: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        city: true,
                        priceWeekly: true,
                        priceDaily: true,
                        ownerName: true
                    }
                }
            }
        }) as CartItemWithPanel[];

        if (cartItems.length === 0) {
            return NextResponse.json({
                subtotal: 0,
                discount: 0,
                total: 0,
                items: [],
                suggestions: []
            });
        }

        // Fetch all active pricing rules
        const pricingRules = await prisma.pricingRule.findMany({
            where: { active: true },
            orderBy: { priority: 'desc' }
        });

        // Group items by type + owner
        const groups: Map<string, CartItemWithPanel[]> = new Map();

        for (const item of cartItems) {
            const key = `${item.panel.type}-${item.panel.ownerName || 'default'}`;
            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key)!.push(item);
        }

        // Calculate prices per item
        let subtotal = 0;
        let totalDiscount = 0;
        const itemPrices: { itemId: string; originalPrice: number; discountedPrice: number; weeks: number }[] = [];
        const suggestions: DiscountSuggestion[] = [];

        for (const [groupKey, groupItems] of Array.from(groups)) {
            const firstItem = groupItems[0];
            const panelType = firstItem.panel.type;
            const ownerName = firstItem.panel.ownerName;
            const city = firstItem.panel.city;

            // Find applicable rules for this group
            const applicableRules = pricingRules.filter(rule => {
                if (rule.panelType && rule.panelType !== panelType) return false;
                if (rule.ownerName && rule.ownerName !== ownerName) return false;
                if (rule.city && rule.city !== city) return false;
                return true;
            });

            // Find the best applicable rule (if quantity threshold is met)
            const activeRule = applicableRules.find(rule => groupItems.length >= rule.minQuantity);

            // Find next threshold for suggestions
            const nextRule = applicableRules.find(rule => groupItems.length < rule.minQuantity);

            for (const item of groupItems) {
                // Calculate weeks based on dates
                let weeks = 1;
                if (item.startDate && item.endDate) {
                    const diffTime = Math.abs(item.endDate.getTime() - item.startDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    weeks = Math.max(1, Math.ceil(diffDays / 7));
                }

                const originalPrice = item.panel.priceWeekly * weeks;
                let discountedPrice = originalPrice;

                if (activeRule) {
                    if (activeRule.fixedUnitPrice) {
                        discountedPrice = activeRule.fixedUnitPrice * weeks;
                    } else if (activeRule.discountPercent) {
                        discountedPrice = originalPrice * (1 - activeRule.discountPercent / 100);
                    }
                }

                subtotal += originalPrice;
                totalDiscount += (originalPrice - discountedPrice);

                itemPrices.push({
                    itemId: item.id,
                    originalPrice,
                    discountedPrice,
                    weeks
                });
            }

            // Add suggestion if there's a next threshold
            if (nextRule) {
                const neededCount = nextRule.minQuantity - groupItems.length;
                const avgPrice = groupItems.reduce((sum, i) => sum + i.panel.priceWeekly, 0) / groupItems.length;

                let potentialSavings = 0;
                if (nextRule.fixedUnitPrice) {
                    potentialSavings = (avgPrice - nextRule.fixedUnitPrice) * nextRule.minQuantity;
                } else if (nextRule.discountPercent) {
                    potentialSavings = avgPrice * nextRule.minQuantity * (nextRule.discountPercent / 100);
                }

                suggestions.push({
                    panelType,
                    ownerName,
                    currentCount: groupItems.length,
                    neededCount,
                    discountPercent: nextRule.discountPercent || undefined,
                    fixedUnitPrice: nextRule.fixedUnitPrice || undefined,
                    potentialSavings
                });
            }
        }

        return NextResponse.json({
            subtotal,
            discount: totalDiscount,
            total: subtotal - totalDiscount,
            itemPrices,
            suggestions,
            itemCount: cartItems.length
        });
    } catch (error) {
        console.error('Error calculating cart:', error);
        return NextResponse.json(
            { error: 'Failed to calculate cart' },
            { status: 500 }
        );
    }
}
