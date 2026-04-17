"use client";

import { useAppLocale } from "@/contexts/LocaleContext";
import { trafficCopy, roadTypeLabel, scoreVisual } from "@/messages/trafficAnalysis";
import type { RoadTypeKey } from "@/lib/traffic/score";
import { Activity, Building2, Car, Eye, TrendingUp } from "lucide-react";

export interface TrafficAnalysisData {
    trafficScore: number | null | undefined;
    roadType: RoadTypeKey | string | null | undefined;
    nearbyPoiCount: number | null | undefined;
    estimatedDailyImpressions: number | null | undefined;
    estimatedWeeklyImpressions: number | null | undefined;
    estimatedCpm: number | string | null | undefined;
    trafficDataUpdatedAt?: string | Date | null;
}

interface Props {
    data: TrafficAnalysisData;
    /** Kompakt mod — sidebar için küçük kart */
    variant?: "compact" | "full";
    className?: string;
}

/** CPM karşılaştırma: dijital reklamla kıyas */
function cpmAdvantage(cpm: number | null): "low" | "mid" | "high" | null {
    if (cpm == null) return null;
    if (cpm < 80) return "low";
    if (cpm <= 250) return "mid";
    return "high";
}

/** Dairesel ilerleme halkası (SVG) */
function ScoreRing({ score, size = 120, stroke = 10 }: { score: number; size?: number; stroke?: number }) {
    const { color, ring } = scoreVisual(score);
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(1, Math.min(100, score));
    const dash = (clamped / 100) * circumference;

    return (
        <svg width={size} height={size} className="shrink-0">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={ring}
                strokeWidth={stroke}
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: "stroke-dasharray 600ms ease-out" }}
            />
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={size * 0.32}
                fontWeight={800}
                fill={color}
                fontFamily="system-ui, -apple-system, sans-serif"
            >
                {clamped}
            </text>
        </svg>
    );
}

export default function TrafficAnalysis({ data, variant = "full", className = "" }: Props) {
    const { locale } = useAppLocale();
    const t = trafficCopy(locale);
    const numLocale = locale === "en" ? "en-US" : "tr-TR";

    const score = typeof data.trafficScore === "number" ? data.trafficScore : null;
    const roadType = (data.roadType as RoadTypeKey | null) ?? null;
    const poi = typeof data.nearbyPoiCount === "number" ? data.nearbyPoiCount : null;
    const daily =
        typeof data.estimatedDailyImpressions === "number" && data.estimatedDailyImpressions > 0
            ? data.estimatedDailyImpressions
            : null;
    const weekly =
        typeof data.estimatedWeeklyImpressions === "number" && data.estimatedWeeklyImpressions > 0
            ? data.estimatedWeeklyImpressions
            : daily
            ? daily * 7
            : null;
    const monthly = daily ? daily * 30 : null;

    const cpmNum =
        typeof data.estimatedCpm === "number"
            ? data.estimatedCpm
            : typeof data.estimatedCpm === "string"
            ? Number(data.estimatedCpm)
            : null;
    const cpm = cpmNum != null && !Number.isNaN(cpmNum) && cpmNum > 0 ? cpmNum : null;
    const adv = cpmAdvantage(cpm);

    // Veri yoksa — bekliyor durumu
    if (score == null && daily == null && roadType == null) {
        return (
            <div
                className={`rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center ${className}`}
            >
                <Activity className="mx-auto h-5 w-5 text-slate-400" />
                <p className="mt-1.5 text-xs font-medium text-slate-600">{t.scorePending}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{t.computeHint}</p>
            </div>
        );
    }

    const { color: scoreColor, level } = scoreVisual(score);
    const levelLabel =
        level === "high" ? t.levelHigh : level === "mid" ? t.levelMedium : level === "low" ? t.levelLow : "";

    const updatedAt = data.trafficDataUpdatedAt ? new Date(data.trafficDataUpdatedAt) : null;

    if (variant === "compact") {
        // -----------------------------------------------------------------
        // COMPACT — haritadaki sidebar için
        // -----------------------------------------------------------------
        return (
            <div className={`rounded-xl border border-slate-200 bg-white p-3 ${className}`}>
                <div className="flex items-center gap-3">
                    {score != null ? (
                        <ScoreRing score={score} size={74} stroke={7} />
                    ) : (
                        <div className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-slate-100">
                            <Activity className="h-6 w-6 text-slate-400" />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {t.trafficScore}
                        </div>
                        <div className="truncate text-sm font-semibold" style={{ color: scoreColor }}>
                            {levelLabel || t.scorePending}
                        </div>
                        {roadType && (
                            <div className="mt-0.5 truncate text-[11px] text-slate-600">
                                <Car className="mr-1 inline h-3 w-3 text-slate-400" />
                                {roadTypeLabel(roadType as RoadTypeKey, locale)}
                            </div>
                        )}
                        {poi != null && (
                            <div className="mt-0.5 truncate text-[11px] text-slate-600">
                                <Building2 className="mr-1 inline h-3 w-3 text-slate-400" />
                                {poi} {t.poiCount.toLowerCase()}
                            </div>
                        )}
                    </div>
                </div>

                {(weekly != null || monthly != null) && (
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-center">
                        {weekly != null && (
                            <div className="rounded-md bg-slate-50 px-2 py-1.5">
                                <div className="text-[9px] font-medium uppercase tracking-wide text-slate-500">
                                    {t.weekly}
                                </div>
                                <div className="text-sm font-bold tabular-nums text-slate-900">
                                    {weekly.toLocaleString(numLocale)}
                                </div>
                            </div>
                        )}
                        {monthly != null && (
                            <div className="rounded-md bg-slate-50 px-2 py-1.5">
                                <div className="text-[9px] font-medium uppercase tracking-wide text-slate-500">
                                    {t.monthly}
                                </div>
                                <div className="text-sm font-bold tabular-nums text-slate-900">
                                    {monthly.toLocaleString(numLocale)}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {cpm != null && (
                    <div className="mt-2 flex items-center justify-between rounded-md bg-gradient-to-r from-indigo-50 to-blue-50 px-2 py-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                            CPM
                        </span>
                        <span className="text-sm font-bold tabular-nums text-blue-800">
                            ₺{cpm.toLocaleString(numLocale, { maximumFractionDigits: 2 })}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    // ---------------------------------------------------------------------
    // FULL — detay sayfası için büyük kart
    // ---------------------------------------------------------------------
    return (
        <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-bold tracking-tight text-slate-900">{t.sectionTitle}</h2>
                    </div>
                    <p className="mt-1 max-w-xl text-xs text-slate-500">{t.methodologyNote}</p>
                </div>
                {updatedAt && (
                    <div className="hidden shrink-0 text-right text-[10px] text-slate-400 sm:block">
                        {t.dataUpdated}:<br />
                        {updatedAt.toLocaleDateString(numLocale)}
                    </div>
                )}
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-[auto_1fr]">
                {/* Sol: skor halkası */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 p-5">
                    {score != null ? (
                        <ScoreRing score={score} size={140} stroke={12} />
                    ) : (
                        <div className="flex h-[140px] w-[140px] items-center justify-center rounded-full bg-slate-100">
                            <Activity className="h-10 w-10 text-slate-400" />
                        </div>
                    )}
                    <div className="mt-3 text-center">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {t.trafficScore}
                        </div>
                        <div className="text-sm font-semibold" style={{ color: scoreColor }}>
                            {levelLabel || t.scorePending}
                        </div>
                    </div>
                </div>

                {/* Sağ: KPI'lar */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <KpiCard
                        icon={<Car className="h-4 w-4" />}
                        label={t.roadType}
                        value={roadType ? roadTypeLabel(roadType as RoadTypeKey, locale) : "—"}
                    />
                    <KpiCard
                        icon={<Building2 className="h-4 w-4" />}
                        label={t.poiCount}
                        value={poi != null ? String(poi) : "—"}
                        hint={t.poiHint}
                    />
                    <KpiCard
                        icon={<Eye className="h-4 w-4" />}
                        label={`${t.daily} ${t.impressions}`}
                        value={daily != null ? daily.toLocaleString(numLocale) : "—"}
                        accent="blue"
                    />
                    <KpiCard
                        label={`${t.weekly} ${t.impressions}`}
                        value={weekly != null ? weekly.toLocaleString(numLocale) : "—"}
                        accent="blue"
                    />
                    <KpiCard
                        label={`${t.monthly} ${t.impressions}`}
                        value={monthly != null ? monthly.toLocaleString(numLocale) : "—"}
                        accent="blue"
                    />
                    <KpiCard
                        label="CPM"
                        value={
                            cpm != null
                                ? `₺${cpm.toLocaleString(numLocale, { maximumFractionDigits: 2 })}`
                                : "—"
                        }
                        hint={t.cpmLabel}
                        accent="emerald"
                    />
                </div>
            </div>

            {/* CPM karşılaştırma */}
            {cpm != null && adv && (
                <div
                    className={`mt-5 rounded-xl border p-4 text-xs ${
                        adv === "low"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                            : adv === "mid"
                            ? "border-blue-200 bg-blue-50 text-blue-900"
                            : "border-amber-200 bg-amber-50 text-amber-900"
                    }`}
                >
                    <div className="flex items-center gap-2 font-semibold">
                        <TrendingUp className="h-4 w-4" />
                        {adv === "low"
                            ? t.cpmAdvantageLow
                            : adv === "mid"
                            ? t.cpmAdvantageMid
                            : t.cpmAdvantageHigh}
                    </div>
                    <p className="mt-1 text-[11px] opacity-80">{t.cpmVsDigital}</p>
                </div>
            )}
        </div>
    );
}

function KpiCard({
    icon,
    label,
    value,
    hint,
    accent,
}: {
    icon?: React.ReactNode;
    label: string;
    value: string;
    hint?: string;
    accent?: "blue" | "emerald";
}) {
    const accentClass =
        accent === "blue"
            ? "bg-blue-50/60 border-blue-100"
            : accent === "emerald"
            ? "bg-emerald-50/60 border-emerald-100"
            : "bg-slate-50/80 border-slate-100";
    return (
        <div className={`rounded-xl border ${accentClass} p-3`}>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {icon}
                <span>{label}</span>
            </div>
            <div className="mt-1 text-base font-bold tabular-nums leading-tight text-slate-900">
                {value}
            </div>
            {hint && <div className="mt-0.5 text-[10px] text-slate-500">{hint}</div>}
        </div>
    );
}
