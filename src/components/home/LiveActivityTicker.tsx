"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useAppLocale } from "@/contexts/LocaleContext";
import { tickerCopy } from "@/messages/ticker";
import LanguageToggle from "@/components/LanguageToggle";

const BRAND = "#11b981";

function PriceBadge({ children }: { children: ReactNode }) {
    return (
        <span
            className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums"
            style={{
                backgroundColor: "rgba(17, 185, 129, 0.1)",
                borderColor: "rgba(17, 185, 129, 0.35)",
                color: "#0d9e6e",
            }}
        >
            {children}
        </span>
    );
}

function TickerItem({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-0.5 shrink-0 px-6 text-sm text-neutral-700 [&>*]:shrink-0">
            {children}
        </span>
    );
}

function Separator() {
    return <span className="text-neutral-300 select-none shrink-0" aria-hidden>|</span>;
}

function TrackTr() {
    return (
        <>
            <TickerItem>
                <span className="font-semibold text-neutral-900">Sakarya Üniversite Önü</span>
                <span>CLP</span>
                <PriceBadge>1.800 TL / günlük</PriceBadge>
                <span className="text-neutral-500">(Normalden %40 indirimli)</span>
            </TickerItem>
            <Separator />
            <TickerItem>
                <span>Bir giyim markası</span>
                <span className="font-semibold text-neutral-900">Sakarya&apos;da</span>
                <span>Billboard arıyor. Bütçe</span>
                <PriceBadge>30.000 TL</PriceBadge>
            </TickerItem>
            <Separator />
            <TickerItem>
                <span className="font-semibold text-neutral-900">Gebze OSB</span>
                <span>megalight</span>
                <PriceBadge>12.500 TL / hafta</PriceBadge>
                <span className="text-neutral-500">— 2 pano kaldı</span>
            </TickerItem>
            <Separator />
            <TickerItem>
                <span>Yerel zincir</span>
                <span className="font-semibold text-neutral-900">İzmit merkez</span>
                <span>raket pano arıyor.</span>
                <PriceBadge>4.200 TL / hafta</PriceBadge>
            </TickerItem>
            <Separator />
            <TickerItem>
                <span className="font-semibold text-neutral-900">D-100 Kartepe</span>
                <span>billboard</span>
                <PriceBadge>%25 kampanya</PriceBadge>
                <span className="text-neutral-500">bu ay</span>
            </TickerItem>
            <Separator />
            <TickerItem>
                <span>AVM önü CLP</span>
                <span className="font-semibold text-neutral-900">Derince</span>
                <PriceBadge>950 TL / günlük</PriceBadge>
            </TickerItem>
            <Separator />
        </>
    );
}

function TrackEn() {
    return (
        <>
            <TickerItem>
                <span className="font-semibold text-neutral-900">Sakarya University front</span>
                <span>CLP</span>
                <PriceBadge>1,800 TRY / day</PriceBadge>
                <span className="text-neutral-500">(~40% off typical rate)</span>
            </TickerItem>
            <Separator />
            <TickerItem>
                <span>A fashion brand</span>
                <span className="font-semibold text-neutral-900">in Sakarya</span>
                <span>is looking for a billboard. Budget</span>
                <PriceBadge>30,000 TRY</PriceBadge>
            </TickerItem>
            <Separator />
            <TickerItem>
                <span className="font-semibold text-neutral-900">Gebze organized zone</span>
                <span>megalight</span>
                <PriceBadge>12,500 TRY / week</PriceBadge>
                <span className="text-neutral-500">— 2 faces left</span>
            </TickerItem>
            <Separator />
            <TickerItem>
                <span>A local chain</span>
                <span className="font-semibold text-neutral-900">Izmit center</span>
                <span>wants a rocket board.</span>
                <PriceBadge>4,200 TRY / week</PriceBadge>
            </TickerItem>
            <Separator />
            <TickerItem>
                <span className="font-semibold text-neutral-900">D-100 Kartepe</span>
                <span>billboard</span>
                <PriceBadge>25% promo</PriceBadge>
                <span className="text-neutral-500">this month</span>
            </TickerItem>
            <Separator />
            <TickerItem>
                <span>Mall-front CLP</span>
                <span className="font-semibold text-neutral-900">Derince</span>
                <PriceBadge>950 TRY / day</PriceBadge>
            </TickerItem>
            <Separator />
        </>
    );
}

/** Masaüstü: sayfa en üstünde (navbar üstünde), kaydırınca kaybolur; sabit header ile bitişik değildir. */
export default function LiveActivityTicker() {
    const { locale } = useAppLocale();
    const tc = tickerCopy(locale);
    const track = locale === "en" ? <TrackEn /> : <TrackTr />;

    return (
        <div
            className="hidden lg:flex items-stretch relative z-40 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 via-white to-neutral-50"
            role="region"
            aria-label={tc.aria}
        >
            <div className="container mx-auto px-4 flex items-center min-h-[2.75rem] gap-3">
                <div className="flex items-center gap-2 shrink-0 pr-2 border-r border-neutral-200">
                    <span className="relative flex h-2 w-2">
                        <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                            style={{ backgroundColor: BRAND }}
                        />
                        <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: BRAND }} />
                    </span>
                    <span
                        className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-full border bg-white text-neutral-800"
                        style={{ borderColor: "rgba(17, 185, 129, 0.35)" }}
                    >
                        {tc.live}
                    </span>
                </div>

                <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="panobu-marquee-track flex w-max items-center">
                        <div className="flex items-center">{track}</div>
                        <div className="flex items-center" aria-hidden>
                            {track}
                        </div>
                    </div>
                </div>

                <div className="shrink-0 flex items-center gap-3 pl-3 ml-1 border-l border-neutral-200">
                    <Link
                        href="/static-billboards"
                        className="text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-600 underline-offset-4 hover:underline whitespace-nowrap"
                    >
                        {tc.cta}
                    </Link>
                    <LanguageToggle className="shrink-0" />
                </div>
            </div>
        </div>
    );
}
