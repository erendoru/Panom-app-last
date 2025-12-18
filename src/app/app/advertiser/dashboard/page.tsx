import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import AdvertiserDashboardClient from "@/components/dashboard/advertiser/AdvertiserDashboardClient";
import { subDays, format } from "date-fns";

export default async function AdvertiserDashboard() {
    const session = await getSession();

    if (!session || !session.userId) {
        return <div>Giriş yapmanız gerekiyor.</div>;
    }

    // Fetch Advertiser with related Campaigns and StaticRentals
    const advertiser = await prisma.advertiser.findUnique({
        where: { userId: session.userId },
        include: {
            campaigns: {
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: {
                    campaignScreens: {
                        include: {
                            screen: true
                        }
                    }
                }
            },
            staticRentals: {
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: {
                    panel: true
                }
            }
        }
    });

    if (!advertiser) {
        return (
            <AdvertiserDashboardClient
                userName={session.user.user_metadata.name || session.user.email}
                kpi={{
                    activeCampaigns: 0,
                    totalCampaigns: 0,
                    totalSpend: 0,
                    totalImpressions: 0,
                    avgCPM: 0
                }}
                chartData={[]}
                recentCampaigns={[]}
            />
        );
    }

    // 1. Calculate KPI Data
    const campaigns = advertiser.campaigns || [];
    const rentals = advertiser.staticRentals || [];

    const activeDigital = campaigns.filter(c => c.status === 'ACTIVE').length;
    const activeStatic = rentals.filter(r => r.status === 'ACTIVE').length;

    // Total Spend Logic (Simplified: Sum of totalBudget and totalPrice)
    // Note: In a real app, calculate from actual transactions or daily spend
    const digitalSpend = campaigns.reduce((sum, c) => sum + Number(c.totalBudget), 0);
    const staticSpend = rentals.reduce((sum, r) => sum + Number(r.totalPrice), 0);
    const totalSpend = digitalSpend + staticSpend;

    // Total Impressions Logic (Simplified estimates)
    const digitalImpressions = campaigns.reduce((sum, c) => {
        // Calculate theoretical capacity: allocatedPlays * playCount (simplified)
        // For now, let's assume a dummy multiplier per budget for demo
        return sum + (Number(c.totalBudget) / 10) * 1000;
    }, 0);

    const staticImpressions = rentals.reduce((sum, r) => sum + (r.estimatedImpressions || 0), 0);
    const totalImpressions = Math.floor(digitalImpressions + staticImpressions);

    // CPM Calc
    const avgCPM = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0;

    // 2. Prepare Chart Data (Last 30 Days Impressions)
    // Generating dummy trend for demo since we don't have daily analytics table yet
    const chartData = Array.from({ length: 30 }).map((_, i) => {
        const date = subDays(new Date(), 29 - i);
        return {
            date: date.toISOString(),
            impressions: Math.floor(Math.random() * (totalImpressions / 30) * 1.5) + 1000 // Randomized daily distribution
        };
    });

    // 3. Combine Recent Activities
    const recentActivities = [
        ...campaigns.map(c => ({ ...c, type: 'DIGITAL' })),
        ...rentals.map(r => ({ ...r, name: `Billboard: ${r.panel.district}`, brandName: r.panel.city, totalBudget: r.totalPrice, type: 'STATIC' }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const kpi = {
        activeCampaigns: activeDigital + activeStatic,
        totalCampaigns: campaigns.length + rentals.length,
        totalSpend: totalSpend,
        totalImpressions: totalImpressions,
        avgCPM: avgCPM
    };

    return (
        <AdvertiserDashboardClient
            userName={session.user.user_metadata?.name || session.user.email}
            kpi={kpi}
            chartData={chartData}
            recentCampaigns={recentActivities as any}
        />
    );
}

