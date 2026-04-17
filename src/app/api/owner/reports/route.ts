import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
    buildOwnerReport,
    resolvePeriod,
    type ReportPeriodKey,
} from "@/lib/owner/reports";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== "SCREEN_OWNER" || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const owner = await prisma.screenOwner.findUnique({
        where: { userId: session.userId },
        select: { id: true },
    });
    if (!owner) {
        return NextResponse.json({ error: "Medya sahibi profili bulunamadı" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const periodKey = (searchParams.get("period") || "last_3m") as ReportPeriodKey;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const period = resolvePeriod(periodKey, from, to);
    const report = await buildOwnerReport(owner.id, period);

    return NextResponse.json({
        period: {
            key: report.period.key,
            label: report.period.label,
            start: report.period.start.toISOString(),
            end: report.period.end.toISOString(),
        },
        kpis: report.kpis,
        monthly: report.monthly,
        units: report.units,
        statusDistribution: report.statusDistribution,
        panelTypeRevenue: report.panelTypeRevenue,
        topCustomers: report.topCustomers,
    });
}
