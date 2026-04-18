"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight, BarChart3, MapPin, Sparkles, TrendingUp } from "lucide-react";

interface Props {
    className?: string;
}

/**
 * "Veriler ile Açık Hava Reklamı Verin" — CTA banner.
 * Hem ana sayfa hem de /how-it-works üzerinde kullanılır.
 * Panobu yeşili (#11b981) tonlarında.
 */
export default function DataDrivenBanner({ className = "" }: Props) {
    return (
        <div className={`container mx-auto px-4 ${className}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-5xl"
            >
                <Link
                    href="/veri-ile-reklam"
                    className="group relative block overflow-hidden rounded-3xl border border-emerald-300/40 bg-gradient-to-br from-[#0ea472] via-[#11b981] to-[#0d9669] p-6 text-white shadow-xl transition-all hover:shadow-2xl sm:p-8"
                >
                    {/* Dekoratif arka plan */}
                    <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl transition-all group-hover:bg-white/15" />
                    <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
                    <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                            backgroundSize: "24px 24px",
                        }}
                    />

                    <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                                <Sparkles className="h-3.5 w-3.5" />
                                YENİ · Veri Destekli Billboard Seçimi
                            </div>
                            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                                Veriler ile Açık Hava Reklamı Verin
                            </h2>
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-emerald-50 sm:text-base">
                                Her billboard için <strong>trafik skoru (1-100)</strong>, tahmini günlük/haftalık/aylık
                                gösterim ve <strong>CPM</strong> değerini; OpenStreetMap, yol tipi, POI yoğunluğu ve
                                pano tipi görünürlük katsayılarıyla nasıl hesapladığımızı adım adım açıklıyoruz.
                            </p>

                            {/* Mini özellikler */}
                            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-emerald-50">
                                <div className="inline-flex items-center gap-1.5">
                                    <Activity className="h-3.5 w-3.5" />
                                    <span>Trafik Skoru</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5">
                                    <BarChart3 className="h-3.5 w-3.5" />
                                    <span>CPM Hesabı</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>500m POI Analizi</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    <span>Dijital Reklamla Kıyas</span>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0d9669] shadow-md transition-all group-hover:gap-3 group-hover:bg-emerald-50">
                                Metodolojiyi İncele
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        </div>
    );
}
