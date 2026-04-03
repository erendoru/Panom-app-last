import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { Wallet, TrendingUp, Clock, ArrowUpRight, Banknote } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
    const session = await getSession();

    if (!session || !session.userId) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-slate-500">Giriş yapmanız gerekiyor.</p>
            </div>
        );
    }

    let balance = 0;
    let payouts: any[] = [];
    let screenCount = 0;

    try {
        const owner = await prisma.screenOwner.findUnique({
            where: { userId: session.userId },
            include: {
                balance: true,
                payouts: { orderBy: { createdAt: "desc" } },
                screens: { where: { active: true } },
            },
        });

        if (owner) {
            balance = Number(owner.balance?.amount || 0);
            payouts = owner.payouts;
            screenCount = owner.screens.length;
        }
    } catch (error) {
        console.error("Finance data fetch error:", error);
    }

    const totalPaid = payouts
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingPayouts = payouts.filter((p) => p.status === "REQUESTED");

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Kazançlar</h1>
                <p className="text-slate-500 mt-1">
                    Ekranlarınızdan elde ettiğiniz geliri ve ödeme geçmişinizi takip edin.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <Wallet className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-sm text-slate-500">Mevcut Bakiye</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(balance)}</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm text-slate-500">Toplam Kazanç</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalPaid)}</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <span className="text-sm text-slate-500">Bekleyen Ödeme</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{pendingPayouts.length}</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <ArrowUpRight className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-sm text-slate-500">Aktif Ekranlar</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{screenCount}</p>
                </div>
            </div>

            {/* Payout History */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b bg-slate-50">
                    <h2 className="font-semibold text-slate-900">Ödeme Geçmişi</h2>
                </div>

                {payouts.length === 0 ? (
                    <div className="text-center py-12">
                        <Banknote className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">Henüz ödeme geçmişi bulunmuyor.</p>
                        <p className="text-sm text-slate-400 mt-1">
                            Ekranlarınıza kampanya geldiğinde kazancınız burada görünecektir.
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-slate-700">Tarih</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Tutar</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payouts.map((payout) => (
                                <tr key={payout.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(payout.createdAt).toLocaleDateString("tr-TR", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                        {formatCurrency(Number(payout.amount))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                payout.status === "PAID"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {payout.status === "PAID" ? "Ödendi" : "Talep Edildi"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
