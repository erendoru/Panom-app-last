"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Monitor, Zap, Clock, Bell, ArrowRight, Sparkles } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

export default function DigitalBillboardsPage() {
    return (
        <PublicLayout activeLink="dijital">
            <div className="container mx-auto px-4 py-16 md:py-24 relative">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />

                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-8">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-300">Çok Yakında</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            Dijital Billboard
                        </span>
                        <br />
                        <span className="text-white">Reklamcılığı Geliyor</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                        AVM ekranları, dijital duraklar, LED billboard'lar ve daha fazlası...
                        <strong className="text-white"> Anlık kiralama</strong> ve
                        <strong className="text-white"> programatik reklam</strong> özellikleriyle
                        dijital açık hava reklamcılığı çok yakında Panobu'da!
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/static-billboards">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 h-14 text-lg font-semibold">
                                Klasik Panolara Göz At
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-14 text-lg">
                                <Bell className="w-5 h-5 mr-2" />
                                Haberdar Ol
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Preview Cards */}
                <div className="relative max-w-5xl mx-auto mb-16">
                    {/* Card Grid */}
                    <div className="relative grid md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Monitor className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">LED Ekranlar</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                AVM içi dev ekranlar, meydan LED'leri ve cadde kenarı dijital panolar ile markanızı milyonlara ulaştırın.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Anlık Kiralama</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Günlük, saatlik veya dakikalık kiralama seçenekleri. İstediğiniz an, istediğiniz süre kadar reklam verin.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Clock className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Gerçek Zamanlı</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Kampanya performansınızı canlı takip edin. Gösterim sayıları, erişim ve etkileşim verilerini anlık görün.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features List */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
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
                                className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                            >
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-green-400 font-bold text-sm">✓</span>
                                </div>
                                <p className="text-slate-300">{feature}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16 pt-16 border-t border-white/10">
                    <h3 className="text-xl md:text-2xl font-bold mb-4">
                        Dijital reklamcılık hakkında sorularınız mı var?
                    </h3>
                    <p className="text-slate-400 mb-6">
                        Şimdilik klasik billboard'larımızı inceleyebilir veya bize ulaşabilirsiniz.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/static-billboards">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                                Klasik Panolara Git
                            </Button>
                        </Link>
                        <Link href="/company/contact">
                            <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-8">
                                İletişime Geç
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
