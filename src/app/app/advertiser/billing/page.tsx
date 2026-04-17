import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Receipt, Clock, CheckCircle2, XCircle, ExternalLink, Camera, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
    const session = await getSession();

    if (!session || !session.userId) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-slate-500">Giriş yapmanız gerekiyor.</p>
            </div>
        );
    }

    let transactions: any[] = [];
    let rentals: any[] = [];

    try {
        transactions = await prisma.transaction.findMany({
            where: { userId: session.userId },
            orderBy: { createdAt: "desc" },
            include: { campaign: { select: { name: true } } },
        });

        const advertiser = await prisma.advertiser.findUnique({
            where: { userId: session.userId },
        });

        if (advertiser) {
            rentals = await prisma.staticRental.findMany({
                where: { advertiserId: advertiser.id },
                orderBy: { createdAt: "desc" },
                include: {
                    panel: { select: { name: true, city: true, district: true } },
                },
            });
        }
    } catch (error) {
        console.error("Billing data fetch error:", error);
    }

    const totalSpent = transactions
        .filter((t) => t.status === "COMPLETED" || t.status === "SUCCESS")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const pendingPayments = transactions.filter((t) => t.status === "PENDING").length;

    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
        PENDING: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-700", icon: Clock },
        COMPLETED: { label: "Tamamlandı", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
        SUCCESS: { label: "Başarılı", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
        FAILED: { label: "Başarısız", color: "bg-red-100 text-red-700", icon: XCircle },
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Ödemeler</h1>
                <p className="text-slate-500 mt-1">
                    Ödeme geçmişinizi ve fatura bilgilerinizi buradan takip edebilirsiniz.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm text-slate-500">Toplam Harcama</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalSpent)}</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <Receipt className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-sm text-slate-500">Toplam İşlem</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{transactions.length}</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <span className="text-sm text-slate-500">Bekleyen Ödemeler</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{pendingPayments}</p>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-4 border-b bg-slate-50">
                    <h2 className="font-semibold text-slate-900">İşlem Geçmişi</h2>
                </div>

                {transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">Henüz ödeme işlemi bulunmuyor.</p>
                        <Link
                            href="/static-billboards"
                            className="text-blue-600 hover:underline text-sm mt-2 inline-flex items-center gap-1"
                        >
                            Panoları Keşfet <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-slate-700">Tarih</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Açıklama</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Tutar</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Sağlayıcı</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((tx) => {
                                const status = statusConfig[tx.status] || statusConfig.PENDING;
                                const StatusIcon = status.icon;
                                return (
                                    <tr key={tx.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(tx.createdAt).toLocaleDateString("tr-TR", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-slate-900 font-medium">
                                            {tx.campaign?.name || "Pano Kiralama"}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            {formatCurrency(Number(tx.amount))}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{tx.provider}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
                                            >
                                                <StatusIcon className="w-3 h-3" />
                                                {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Active Rentals */}
            {rentals.length > 0 && (
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b bg-slate-50">
                        <h2 className="font-semibold text-slate-900">Aktif Kiralamalar</h2>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-slate-700">Pano</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Konum</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Tarih Aralığı</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Tutar</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Durum</th>
                                <th className="px-6 py-3 font-medium text-slate-700">Kanıt</th>
                                <th className="px-6 py-3 font-medium text-slate-700"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rentals.map((rental) => (
                                <tr key={rental.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {rental.panel.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {rental.panel.city}, {rental.panel.district}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(rental.startDate).toLocaleDateString("tr-TR")} -{" "}
                                        {new Date(rental.endDate).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                        {formatCurrency(Number(rental.totalPrice))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                rental.status === "ACTIVE"
                                                    ? "bg-green-100 text-green-700"
                                                    : rental.status === "PENDING_PAYMENT"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-slate-100 text-slate-700"
                                            }`}
                                        >
                                            {rental.status === "ACTIVE"
                                                ? "Aktif"
                                                : rental.status === "PENDING_PAYMENT"
                                                ? "Ödeme Bekleniyor"
                                                : rental.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                                                rental.proofStatus === "CONFIRMED"
                                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                                    : rental.proofStatus === "UPLOADED"
                                                    ? "bg-blue-50 border-blue-200 text-blue-700"
                                                    : "bg-slate-50 border-slate-200 text-slate-500"
                                            }`}
                                        >
                                            <Camera className="w-3 h-3" />
                                            {rental.proofStatus === "CONFIRMED"
                                                ? "Onaylı"
                                                : rental.proofStatus === "UPLOADED"
                                                ? "Yeni"
                                                : "Bekliyor"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/app/advertiser/rentals/${rental.id}`}
                                            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Detay <ArrowRight className="w-3 h-3 ml-1" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
