"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

/** Masaüstü: sayfa en üstünde (navbar üstünde), kaydırınca kaybolur; sabit header ile bitişik değildir. */
export default function LiveActivityTicker() {
    const track = (
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

    return (
        <div
            className="hidden lg:flex items-stretch relative z-40 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 via-white to-neutral-50"
            role="region"
            aria-label="Örnek kampanya ve talep bilgileri"
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
                        Canlı
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

                <Link
                    href="/static-billboards"
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white rounded-full px-4 py-2 transition-colors hover:opacity-95 shadow-sm"
                    style={{ backgroundColor: BRAND }}
                >
                    Panoları Gör
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
}
