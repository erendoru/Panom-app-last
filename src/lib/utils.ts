import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

type PricePanelLike = {
  priceDaily?: number | string | null;
  priceWeekly?: number | string | null;
  priceMonthly?: number | string | null;
  price3Month?: number | string | null;
  price6Month?: number | string | null;
  priceYearly?: number | string | null;
};

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Panonun en güvenilir haftalık-eşdeğer fiyatını üretir.
 * Öncelik: priceWeekly > priceMonthly/4.33 > price3Month/13 > priceDaily*7 >
 * price6Month/26 > priceYearly/52. Hiçbiri yoksa null.
 */
export function weeklyEquivalent(p: PricePanelLike): number | null {
  const w = toNum(p.priceWeekly);
  if (w) return w;
  const m = toNum(p.priceMonthly);
  if (m) return Math.round(m / 4.33);
  const q = toNum(p.price3Month);
  if (q) return Math.round(q / 13);
  const d = toNum(p.priceDaily);
  if (d) return Math.round(d * 7);
  const h = toNum(p.price6Month);
  if (h) return Math.round(h / 26);
  const y = toNum(p.priceYearly);
  if (y) return Math.round(y / 52);
  return null;
}

/** Panonun herhangi bir fiyatı olup olmadığını söyler (form validasyonu için). */
export function hasAnyPrice(p: PricePanelLike): boolean {
  return (
    !!toNum(p.priceDaily) ||
    !!toNum(p.priceWeekly) ||
    !!toNum(p.priceMonthly) ||
    !!toNum(p.price3Month) ||
    !!toNum(p.price6Month) ||
    !!toNum(p.priceYearly)
  );
}
