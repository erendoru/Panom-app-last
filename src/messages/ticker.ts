import type { AppLocale } from "@/messages/publicNav";

export type TickerCopy = {
    aria: string;
    live: string;
    cta: string;
};

const TR: TickerCopy = {
    aria: "Örnek kampanya ve talep bilgileri",
    live: "Canlı",
    cta: "Panoları Gör ->",
};

const EN: TickerCopy = {
    aria: "Sample campaigns and demand activity",
    live: "Live",
    cta: "View billboards ->",
};

export function tickerCopy(locale: AppLocale): TickerCopy {
    return locale === "en" ? EN : TR;
}
