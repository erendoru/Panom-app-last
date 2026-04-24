"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface Props {
    className?: string;
}

/**
 * "Her pano kendi hikâyesini anlatır" — anasayfa CTA banner.
 * İçgörü motorunu tanıtır. Sadeleştirilmiş, merak uyandıran varyant.
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
                    className="group relative block overflow-hidden rounded-3xl border border-emerald-300/40 bg-gradient-to-br from-[#0ea472] via-[#11b981] to-[#0d9669] p-8 text-white shadow-xl transition-all hover:shadow-2xl sm:p-10"
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

                    <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                                <Sparkles className="h-3.5 w-3.5" />
                                Panobu İçgörü Motoru
                            </div>
                            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                                Panolarınızı hisle değil, <br className="hidden sm:block" />
                                veriyle seçin.
                            </h2>
                            <p className="mt-4 max-w-xl text-base leading-relaxed text-emerald-50 sm:text-lg">
                                Skor, tahmini gösterim, çevre analizi. Panoyu seçmeden önce ne iş çıkardığını gör.
                            </p>

                            {/* Mini istatistik — sade, dikkat çekici */}
                            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold tabular-nums text-white">1–100</span>
                                    <span className="text-xs text-emerald-100">Trafik skoru</span>
                                </div>
                                <div className="h-5 w-px bg-white/20" />
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold tabular-nums text-white">500m</span>
                                    <span className="text-xs text-emerald-100">Çevre analizi</span>
                                </div>
                                <div className="h-5 w-px bg-white/20" />
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold tabular-nums text-white">CPM</span>
                                    <span className="text-xs text-emerald-100">Dijital kıyas</span>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0d9669] shadow-md transition-all group-hover:gap-3 group-hover:bg-emerald-50">
                                Nasıl işliyor, gör
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        </div>
    );
}
