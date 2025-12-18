import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";
import { addDays, format, differenceInDays } from "date-fns";

const createCampaignSchema = z.object({
    name: z.string().min(3),
    brandName: z.string().min(2),
    startDate: z.string(), // ISO Date string
    endDate: z.string(),
    screenIds: z.array(z.string()).min(1),
    totalBudget: z.number().positive(),
    creativeUrl: z.string().url(),
    creativeType: z.enum(["IMAGE", "VIDEO"]),
});

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADVERTISER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const result = createCampaignSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const data = result.data;
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        // Get Advertiser
        const advertiser = await prisma.advertiser.findUnique({
            where: { userId: session.user.id },
        });

        if (!advertiser) {
            return NextResponse.json({ error: "Advertiser profile not found" }, { status: 404 });
        }

        // Get Screens to calculate costs
        const screens = await prisma.screen.findMany({
            where: { id: { in: data.screenIds } },
        });

        if (screens.length !== data.screenIds.length) {
            return NextResponse.json({ error: "Some screens not found" }, { status: 400 });
        }

        // Simple Budget Allocation Logic for MVP
        // We assume equal distribution of budget across screens
        const budgetPerScreen = data.totalBudget / screens.length;

        // Create Campaign
        const campaign = await prisma.$transaction(async (tx) => {
            // 1. Create Campaign Record
            const newCampaign = await tx.campaign.create({
                data: {
                    advertiserId: advertiser.id,
                    name: data.name,
                    brandName: data.brandName,
                    startDate: startDate,
                    endDate: endDate,
                    totalBudget: data.totalBudget,
                    status: "PENDING_APPROVAL", // Needs admin approval
                    daysOfWeek: "1,2,3,4,5,6,7", // Default all days
                    timeWindows: JSON.stringify([]), // Default all day
                },
            });

            // 2. Create CampaignScreen records
            for (const screen of screens) {
                const price = Number(screen.basePricePerPlay);
                const allocatedPlays = Math.floor(budgetPerScreen / price);

                await tx.campaignScreen.create({
                    data: {
                        campaignId: newCampaign.id,
                        screenId: screen.id,
                        allocatedPlays: allocatedPlays,
                        pricePerPlay: price,
                    },
                });
            }

            // 3. Create Creative Record
            await tx.creative.create({
                data: {
                    campaignId: newCampaign.id,
                    type: data.creativeType,
                    fileUrl: data.creativeUrl,
                    width: 1920, // Mock dimensions
                    height: 1080,
                    status: "PENDING_APPROVAL",
                },
            });

            // 4. Create Transaction (Mock Payment)
            await tx.transaction.create({
                data: {
                    userId: session.user.id,
                    campaignId: newCampaign.id,
                    amount: data.totalBudget,
                    status: "SUCCESS",
                    provider: "MOCK_PROVIDER",
                },
            });

            return newCampaign;
        });

        // 5. Scheduling (Async in real world, sync here for MVP simplicity)
        // We will generate a few sample schedule slots for demonstration
        // In a real app, this would be a complex algorithm respecting capacity

        // For each screen, distribute allocated plays across the date range
        const daysCount = differenceInDays(endDate, startDate) + 1;

        // We'll just schedule 1 play per day per screen for the MVP demo to avoid flooding DB
        // Real logic would be: allocatedPlays / daysCount -> plays per day

        const schedulePromises = [];
        for (const screen of screens) {
            for (let i = 0; i < Math.min(daysCount, 7); i++) { // Limit to 7 days for demo
                const playDate = addDays(startDate, i);
                // Set a random time between 08:00 and 20:00
                playDate.setHours(8 + Math.floor(Math.random() * 12), 0, 0, 0);

                schedulePromises.push(
                    prisma.scheduledPlay.create({
                        data: {
                            campaignId: campaign.id,
                            screenId: screen.id,
                            playTime: playDate,
                            status: "SCHEDULED"
                        }
                    })
                );
            }
        }

        await Promise.all(schedulePromises);

        return NextResponse.json({ success: true, campaign });
    } catch (error) {
        console.error("Create campaign error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
