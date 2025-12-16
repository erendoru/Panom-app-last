import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Monitor, MapPin, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function PublicScreensPage() {
    const screens = await prisma.screen.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-blue-600">
                        Panobu
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/auth/login" className="text-sm font-medium hover:text-blue-600">
                            Giriş Yap
                        </Link>
                        <Link href="/auth/register">
                            <Button>Hemen Başla</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Keşfet</h1>
                    <p className="text-slate-500 mt-2">Şehrin en iyi dijital ekranlarını inceleyin.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {screens.map((screen) => (
                        <div
                            key={screen.id}
                            className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                        >
                            <div className="h-48 bg-slate-200 relative overflow-hidden">
                                {screen.previewImageUrl ? (
                                    <img
                                        src={screen.previewImageUrl}
                                        alt={screen.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <Monitor className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <span className="text-white text-xs font-medium bg-blue-600 px-2 py-1 rounded">
                                        Dijital
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg mb-1 leading-tight">{screen.name}</h3>
                                <div className="flex items-center text-slate-500 text-sm mb-4">
                                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                    <span className="truncate">{screen.district}, {screen.city}</span>
                                </div>

                                <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
                                    <div>
                                        <span className="text-xs text-slate-400 block">Başlangıç</span>
                                        <span className="font-bold text-blue-600 text-lg">
                                            {formatCurrency(Number(screen.basePricePerPlay))}
                                        </span>
                                        <span className="text-xs text-slate-400"> / play</span>
                                    </div>
                                    <Link href="/auth/register">
                                        <Button size="sm" variant="outline" className="group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200">
                                            Kirala <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
