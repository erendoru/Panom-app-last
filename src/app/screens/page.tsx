"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Monitor, Zap, Clock, Bell, ArrowRight, Sparkles } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

export default function DigitalBillboardsPage() {
    return (
        <PublicLayout activeLink="dijital">
            <div className="container mx-auto px-4 py-16 md:py-24 relative bg-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] -z-10" />

                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8">
                        <Sparkles className="w-4 h-4 text-blue-700" />
                        <span className="text-sm font-medium text-blue-800">Çok Yakında</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-neutral-900">
                        Dijital Billboard
                        <br />
                        <span className="text-neutral-700">Reklamcılığı Geliyor</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        AVM ekranları, dijital duraklar, LED billboard&apos;lar ve daha fazlası...
                        <strong className="text-neutral-900"> Anlık kiralama</strong> ve
                        <strong className="text-neutral-900"> programatik reklam</strong> özellikleriyle
                        dijital açık hava reklamcılığı çok yakında Panobu&apos;da!
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/static-billboards">
                            <Button size="lg" variant="outline" className="border-neutral-300 text-neutral-900 hover:bg-neutral-50 rounded-full px-8 h-14 text-lg font-semibold">
                                Klasik Panolara Göz At
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full px-8 h-14 text-lg">
                                <Bell className="w-5 h-5 mr-2" />
                                Haberdar Ol
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="relative max-w-5xl mx-auto mb-16">
                    <div className="relative grid md:grid-cols-3 gap-6">
                        <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 hover:border-neutral-300 transition-all group shadow-sm">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                <Monitor className="w-7 h-7 text-blue-800" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-neutral-900">LED Ekranlar</h3>
                            <p className="text-neutral-600 text-sm leading-relaxed">
                                AVM içi dev ekranlar, meydan LED&apos;leri ve cadde kenarı dijital panolar ile markanızı milyonlara ulaştırın.
                            </p>
                        </div>

                        <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 hover:border-neutral-300 transition-all group shadow-sm">
                            <div className="w-14 h-14 bg-neutral-200 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                <Zap className="w-7 h-7 text-neutral-800" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-neutral-900">Anlık Kiralama</h3>
                            <p className="text-neutral-600 text-sm leading-relaxed">
                                Günlük, saatlik veya dakikalık kiralama seçenekleri. İstediğiniz an, istediğiniz süre kadar reklam verin.
                            </p>
                        </div>

                        <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 hover:border-neutral-300 transition-all group shadow-sm">
                            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                <Clock className="w-7 h-7 text-amber-900" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-neutral-900">Gerçek Zamanlı</h3>
                            <p className="text-neutral-600 text-sm leading-relaxed">
                                Kampanya performansınızı canlı takip edin. Gösterim sayıları, erişim ve etkileşim verilerini anlık görün.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-neutral-900">
                        Dijital Billboard ile Neler Yapabileceksiniz?
                    </h2>

                    <div className="space-y-4">
                        {[
                            "AVM, metro durağı ve cadde kenarındaki dijital ekranlarda reklam verin",
                            "Saatlik veya günlük bazda esnek kiralama yapın",
                            "Hedef kitlenize göre lokasyon ve zaman dilimi seçin",
                            "Kampanya performansınızı gerçek zamanlı takip edin",
                            "Birden fazla ekranı tek platformdan yönetin",
                            "Şeffaf fiyatlandırma ile bütçenizi kontrol altında tutun"
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 bg-neutral-50 border border-neutral-200 rounded-2xl p-4 hover:border-neutral-300 transition-all"
                            >
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-emerald-800 font-bold text-sm">✓</span>
                                </div>
                                <p className="text-neutral-700">{feature}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-16 pt-16 border-t border-neutral-200">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-neutral-900">
                        Dijital reklamcılık hakkında sorularınız mı var?
                    </h3>
                    <p className="text-neutral-600 mb-6">
                        Şimdilik klasik billboard&apos;larımızı inceleyebilir veya bize ulaşabilirsiniz.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/static-billboards">
                            <Button className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full px-8">
                                Klasik Panolara Git
                            </Button>
                        </Link>
                        <Link href="/legal/contact">
                            <Button variant="outline" className="border-neutral-300 text-neutral-900 hover:bg-neutral-50 rounded-full px-8">
                                İletişime Geç
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
