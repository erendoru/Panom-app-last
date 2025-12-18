"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, TrendingUp, Eye, Clock, ArrowRight, PlusCircle, BarChart3, Rocket } from "lucide-react";
import Link from "next/link";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { formatCurrency } from "@/lib/utils";

interface DashboardProps {
    userName: string;
    kpi: {
        activeCampaigns: number;
        totalCampaigns: number;
        totalSpend: number;
        totalImpressions: number;
        avgCPM: number;
    };
    chartData: any[]; // Impression data over time
    recentCampaigns: any[];
}

export default function AdvertiserDashboardClient({ userName, kpi, chartData, recentCampaigns }: DashboardProps) {
    const hasData = kpi.totalCampaigns > 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Hoşgeldiniz, {userName}</h1>
                    <p className="text-slate-500 mt-2">
                        {hasData
                            ? "Kampanyalarınızın performansını ve izleyici etkileşimlerini buradan takip edin."
                            : "Panobu ile reklam yolculuğunuza başlamaya hazır mısınız?"}
                    </p>
                </div>
                <Button size="lg" className="shadow-lg shadow-blue-200" asChild>
                    <Link href="/app/advertiser/campaigns/new">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Yeni Kampanya Oluştur
                    </Link>
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Aktif Kampanyalar"
                    value={kpi.activeCampaigns}
                    subValue={`Toplam ${kpi.totalCampaigns} kampanya`}
                    icon={Megaphone}
                    trend={kpi.activeCampaigns > 0 ? "+1" : undefined}
                    className="bg-gradient-to-br from-blue-50 to-white border-blue-100"
                />
                <KPICard
                    title="Toplam Harcama"
                    value={formatCurrency(kpi.totalSpend)}
                    subValue="Bu ay"
                    icon={TrendingUp}
                    className="bg-white"
                />
                <KPICard
                    title="Toplam Gösterim"
                    value={kpi.totalImpressions > 0 ? kpi.totalImpressions.toLocaleString('tr-TR') : '0'}
                    subValue="Tahmini erişim"
                    icon={Eye}
                    className="bg-white"
                    trend={kpi.totalImpressions > 100000 ? "+12%" : undefined}
                />
                <KPICard
                    title="Ortalama BGBM"
                    value={formatCurrency(kpi.avgCPM)}
                    subValue="Bin gösterim başı maliyet"
                    icon={BarChart3}
                    className="bg-white"
                />
            </div>

            {/* Main Content Area */}
            {hasData ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Charts Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Impression Chart */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle>Görünürlük Analizi</CardTitle>
                                <CardDescription>Son 30 günlük toplam gösterim performansı</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#64748b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => new Date(value).getDate().toString()}
                                        />
                                        <YAxis
                                            stroke="#64748b"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            labelStyle={{ color: '#64748b' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="impressions"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorImpressions)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Campaigns List */}
                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm h-full">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Son Kampanyalar</CardTitle>
                                <Link href="/app/advertiser/campaigns" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                                    Tümü <ArrowRight className="w-3 h-3 ml-1" />
                                </Link>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentCampaigns.map((campaign) => (
                                    <div key={campaign.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div>
                                            <div className="font-medium text-slate-900">{campaign.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{campaign.brandName || "Markasız"}</div>
                                        </div>
                                        <div className="text-right">
                                            <Badge status={campaign.status} />
                                            <div className="text-xs font-medium text-slate-600 mt-1">
                                                {formatCurrency(Number(campaign.totalBudget || campaign.totalPrice))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="mt-8">
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Rocket className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Henüz Bir Kampanyanız Yok</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Panobu ile reklam vermeye başlamak çok kolay. İlk kampanyanızı oluşturun ve milyonlarca kişiye ulaşın.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                            <Button className="w-full" size="lg" asChild>
                                <Link href="/app/advertiser/campaigns/new">
                                    Dijital Kampanya Oluştur
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full" size="lg" asChild>
                                <Link href="/static-billboards">
                                    Billboard Kirala
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function KPICard({ title, value, subValue, icon: Icon, trend, className }: any) {
    return (
        <Card className={`border-slate-200 shadow-sm ${className}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
                <Icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold text-slate-900">{value}</div>
                    {trend && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                            {trend}
                        </span>
                    )}
                </div>
                <p className="text-xs text-slate-400 mt-1">{subValue}</p>
            </CardContent>
        </Card>
    );
}

function Badge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        ACTIVE: "bg-green-100 text-green-700",
        PENDING: "bg-yellow-100 text-yellow-700",
        PENDING_PAYMENT: "bg-orange-100 text-orange-700",
        COMPLETED: "bg-slate-100 text-slate-700",
        CANCELLED: "bg-red-50 text-red-600",
        DRAFT: "bg-slate-100 text-slate-500",
    };

    const labels: Record<string, string> = {
        ACTIVE: "Aktif",
        PENDING: "Bekliyor",
        PENDING_PAYMENT: "Ödeme Bekliyor",
        COMPLETED: "Tamamlandı",
        CANCELLED: "İptal",
        DRAFT: "Taslak",
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${styles[status] || styles.DRAFT}`}>
            {labels[status] || status}
        </span>
    );
}
