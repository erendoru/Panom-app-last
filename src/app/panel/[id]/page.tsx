import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PublicLayout from "@/components/PublicLayout";
import TrafficAnalysis from "@/components/static/TrafficAnalysis";
import PanelDetailAddToCart from "@/components/static/PanelDetailAddToCart";
import { ROAD_TYPE_LABELS, trafficLevelLabel, type RoadTypeKey } from "@/lib/traffic/score";
import { PANEL_TYPE_LABELS } from "@/lib/turkey-data";
import { ArrowLeft, ExternalLink, MapPin, Navigation } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

type RouteParams = { params: { id: string } };

/**
 * Pano verisini güvenli haliyle (Decimal → number) çeker.
 * SSR metadata + sayfada ortak kullanılır.
 */
async function getPanel(id: string) {
    try {
        const panel = await prisma.staticPanel.findFirst({
            where: {
                id,
                active: true,
                reviewStatus: "APPROVED",
                ownerStatus: "ACTIVE",
            },
            select: {
                id: true,
                name: true,
                type: true,
                city: true,
                district: true,
                address: true,
                latitude: true,
                longitude: true,
                width: true,
                height: true,
                priceWeekly: true,
                priceDaily: true,
                imageUrl: true,
                imageUrls: true,
                description: true,
                isAVM: true,
                avmName: true,
                locationType: true,
                minRentalDays: true,
                isStartingPrice: true,
                trafficLevel: true,
                trafficScore: true,
                roadType: true,
                nearbyPoiCount: true,
                nearbyTags: true,
                estimatedDailyImpressions: true,
                estimatedWeeklyImpressions: true,
                estimatedCpm: true,
                trafficDataUpdatedAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!panel) return null;

        return {
            ...panel,
            priceWeekly: Number(panel.priceWeekly),
            priceDaily: panel.priceDaily != null ? Number(panel.priceDaily) : null,
            width: Number(panel.width),
            height: Number(panel.height),
            estimatedCpm: panel.estimatedCpm != null ? Number(panel.estimatedCpm) : null,
            trafficDataUpdatedAt: panel.trafficDataUpdatedAt
                ? panel.trafficDataUpdatedAt.toISOString()
                : null,
            createdAt: panel.createdAt.toISOString(),
            updatedAt: panel.updatedAt.toISOString(),
        };
    } catch (err) {
        console.error("[panel/[id]] getPanel error:", err);
        return null;
    }
}

// ---------------------------------------------------------------------------
// generateMetadata — Dinamik SEO (title, description, OG, canonical)
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
    const panel = await getPanel(params.id);
    if (!panel) {
        return {
            title: "Pano Bulunamadı | Panobu",
            description: "Aradığınız pano mevcut değil veya kaldırılmış.",
            robots: { index: false, follow: false },
        };
    }

    const typeLabel = PANEL_TYPE_LABELS[panel.type as string] ?? (panel.type as string);
    const location = `${panel.district}, ${panel.city}`;
    const size = `${panel.width}×${panel.height} m`;
    const title = `${panel.name} — ${typeLabel} (${location}) | Panobu`;

    const trafficNote =
        panel.trafficScore != null
            ? ` Trafik skoru ${panel.trafficScore}/100`
            : "";
    const impressionNote =
        panel.estimatedDailyImpressions && panel.estimatedDailyImpressions > 0
            ? `, günlük ~${panel.estimatedDailyImpressions.toLocaleString("tr-TR")} tahmini gösterim.`
            : ".";

    const description =
        panel.description?.slice(0, 160) ||
        `${location} konumunda ${typeLabel} pano. Boyut ${size}. Haftalık ${formatCurrency(
            panel.priceWeekly,
        )} fiyatla online kiralama.${trafficNote}${impressionNote}`;

    const ogImage = panel.imageUrl || panel.imageUrls?.[0];
    const url = `https://panobu.com/panel/${panel.id}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            locale: "tr_TR",
            siteName: "Panobu",
            images: ogImage ? [{ url: ogImage, alt: panel.name }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}

// ---------------------------------------------------------------------------
// Sayfa
// ---------------------------------------------------------------------------
export default async function PanelDetailPage({ params }: RouteParams) {
    const panel = await getPanel(params.id);
    if (!panel) notFound();

    const typeLabel = PANEL_TYPE_LABELS[panel.type as string] ?? (panel.type as string);
    const level = trafficLevelLabel(panel.trafficScore);
    const roadLabel = panel.roadType
        ? ROAD_TYPE_LABELS[panel.roadType as RoadTypeKey] ?? panel.roadType
        : null;
    const gmapsUrl = `https://www.google.com/maps?q=${panel.latitude},${panel.longitude}`;

    // schema.org JSON-LD — hem Place hem de Service/Product
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Place",
                name: panel.name,
                address: {
                    "@type": "PostalAddress",
                    streetAddress: panel.address,
                    addressLocality: panel.district,
                    addressRegion: panel.city,
                    addressCountry: "TR",
                },
                geo: {
                    "@type": "GeoCoordinates",
                    latitude: panel.latitude,
                    longitude: panel.longitude,
                },
                image: panel.imageUrl || panel.imageUrls?.[0],
            },
            {
                "@type": "Product",
                name: `${panel.name} — ${typeLabel}`,
                description:
                    panel.description ||
                    `${panel.district}, ${panel.city} konumunda ${typeLabel} reklam panosu kiralama.`,
                image: panel.imageUrl || panel.imageUrls?.[0],
                brand: { "@type": "Brand", name: "Panobu" },
                offers: {
                    "@type": "Offer",
                    priceCurrency: "TRY",
                    price: panel.priceWeekly,
                    availability: "https://schema.org/InStock",
                    url: `https://panobu.com/panel/${panel.id}`,
                    priceSpecification: {
                        "@type": "UnitPriceSpecification",
                        price: panel.priceWeekly,
                        priceCurrency: "TRY",
                        unitText: "WEEK",
                    },
                },
            },
        ],
    };

    return (
        <PublicLayout activeLink="klasik">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
                {/* Breadcrumb + back */}
                <nav className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                    <Link href="/" className="hover:text-slate-900">
                        Ana Sayfa
                    </Link>
                    <span>/</span>
                    <Link href="/static-billboards" className="hover:text-slate-900">
                        Reklam Üniteleri
                    </Link>
                    <span>/</span>
                    <span className="truncate text-slate-900">{panel.name}</span>
                </nav>

                <Link
                    href="/static-billboards"
                    className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Haritaya dön
                </Link>

                {/* Hero */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative aspect-[16/7] w-full bg-slate-100">
                        <img
                            src={
                                panel.imageUrl ||
                                panel.imageUrls?.[0] ||
                                "https://images.unsplash.com/photo-1637606346315-d353ec6d3c81?q=80&w=2000&auto=format&fit=crop"
                            }
                            alt={panel.name}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                            <span className="inline-flex items-center rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-sm">
                                {typeLabel}
                            </span>
                            {panel.isAVM ? (
                                <span className="inline-flex items-center rounded-md bg-pink-500/95 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                                    {panel.avmName || "AVM"}
                                </span>
                            ) : (
                                <span className="inline-flex items-center rounded-md bg-sky-500/95 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                                    Açık alan
                                </span>
                            )}
                            {panel.trafficScore != null && (
                                <span className="inline-flex items-center rounded-md bg-emerald-500/95 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                                    {level} • {panel.trafficScore}/100
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-5 sm:p-7">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            {panel.name}
                        </h1>
                        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
                            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                            <span>
                                {panel.district}, {panel.city}
                            </span>
                        </div>
                        {panel.address && (
                            <div className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-500">
                                <Navigation className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span>{panel.address}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid: sol içerik / sağ aksiyon */}
                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
                    {/* Sol sütun — analiz + detaylar */}
                    <div className="space-y-6">
                        {/* Özet tablo */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                Pano Özeti
                            </h2>
                            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <div className="rounded-xl bg-slate-50 p-3">
                                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Boyut
                                    </dt>
                                    <dd className="mt-1 text-base font-bold text-slate-900">
                                        {panel.width}×{panel.height} m
                                    </dd>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-3">
                                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Alan
                                    </dt>
                                    <dd className="mt-1 text-base font-bold text-slate-900">
                                        {(panel.width * panel.height).toFixed(1)} m²
                                    </dd>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-3">
                                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Min. kiralama
                                    </dt>
                                    <dd className="mt-1 text-base font-bold text-slate-900">
                                        {panel.minRentalDays || 7} gün
                                    </dd>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-3">
                                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Aydınlatma
                                    </dt>
                                    <dd className="mt-1 text-base font-bold text-slate-900">LED</dd>
                                </div>
                            </dl>

                            {panel.description && (
                                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                    {panel.description}
                                </p>
                            )}
                        </section>

                        {/* Trafik analizi */}
                        <TrafficAnalysis
                            variant="full"
                            data={{
                                trafficScore: panel.trafficScore,
                                roadType: panel.roadType as RoadTypeKey | null,
                                nearbyPoiCount: panel.nearbyPoiCount,
                                estimatedDailyImpressions: panel.estimatedDailyImpressions,
                                estimatedWeeklyImpressions: panel.estimatedWeeklyImpressions,
                                estimatedCpm: panel.estimatedCpm,
                                trafficDataUpdatedAt: panel.trafficDataUpdatedAt,
                            }}
                        />

                        {/* Konum */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                        Konum
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {panel.district}, {panel.city}
                                        {roadLabel ? ` • ${roadLabel}` : ""}
                                    </p>
                                </div>
                                <a
                                    href={gmapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Google Haritalar'da aç
                                </a>
                            </div>
                            <div className="mt-4 aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                <iframe
                                    title={`${panel.name} konumu`}
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                                        panel.longitude - 0.01
                                    }%2C${panel.latitude - 0.006}%2C${panel.longitude + 0.01}%2C${
                                        panel.latitude + 0.006
                                    }&layer=mapnik&marker=${panel.latitude}%2C${panel.longitude}`}
                                    className="h-full w-full"
                                    loading="lazy"
                                />
                            </div>
                        </section>
                    </div>

                    {/* Sağ — fiyat + aksiyon */}
                    <aside className="lg:sticky lg:top-6 lg:self-start">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Haftalık kiralama
                            </div>
                            <div className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-slate-900">
                                {panel.isStartingPrice ? "" : ""}
                                {formatCurrency(panel.priceWeekly)}
                                {panel.isStartingPrice ? (
                                    <span className="ml-1 text-xs font-medium text-slate-500">
                                        'den başlayan
                                    </span>
                                ) : null}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-400">+ KDV</div>

                            <div className="mt-5">
                                <PanelDetailAddToCart panelId={panel.id} />
                            </div>

                            <div className="mt-5 border-t border-slate-100 pt-4 text-[11px] text-slate-500">
                                <div className="flex items-center justify-between">
                                    <span>Pano tipi</span>
                                    <span className="font-medium text-slate-800">{typeLabel}</span>
                                </div>
                                {panel.trafficScore != null && (
                                    <div className="mt-1.5 flex items-center justify-between">
                                        <span>Trafik skoru</span>
                                        <span className="font-medium text-slate-800">
                                            {panel.trafficScore}/100
                                        </span>
                                    </div>
                                )}
                                {panel.estimatedCpm != null && (
                                    <div className="mt-1.5 flex items-center justify-between">
                                        <span>CPM</span>
                                        <span className="font-medium text-slate-800">
                                            ₺
                                            {panel.estimatedCpm.toLocaleString("tr-TR", {
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </PublicLayout>
    );
}
