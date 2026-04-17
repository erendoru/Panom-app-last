import type { AppLocale } from "@/messages/publicNav";

export type BudgetStrings = {
    badge: string;
    title: string;
    subtitle: string;
    totalBudget: string;
    duration: string;
    presets: { label: string; value: number }[];
    durations: { label: string; value: number; multiplier: number }[];
    rangeMin: string;
    rangeMax: string;
    panelsTitle: string;
    panelsSub: (dur: string) => string;
    impressions: string;
    impressionsSub: string;
    cpm: string;
    cpmSub: string;
    cta: string;
    disclaimer: string;
};

const TR: BudgetStrings = {
    badge: "Bütçe Hesaplayıcı",
    title: "Ne Kadara Ne Alırım?",
    subtitle: "Bütçenizi girin, süreyi seçin — kaç panoya ulaşabileceğinizi ve tahmini gösterim sayınızı anında görün.",
    totalBudget: "Toplam Bütçe",
    duration: "Kampanya Süresi",
    presets: [
        { label: "5.000 ₺", value: 5000 },
        { label: "10.000 ₺", value: 10000 },
        { label: "25.000 ₺", value: 25000 },
        { label: "50.000 ₺", value: 50000 },
        { label: "100.000 ₺", value: 100000 },
    ],
    durations: [
        { label: "1 Hafta", value: 1, multiplier: 1 },
        { label: "2 Hafta", value: 2, multiplier: 2 },
        { label: "1 Ay", value: 4, multiplier: 4 },
        { label: "3 Ay", value: 12, multiplier: 12 },
    ],
    rangeMin: "1.000 ₺",
    rangeMax: "200.000 ₺",
    panelsTitle: "Ulaşabileceğiniz Pano Sayısı",
    panelsSub: (dur) => `pano × ${dur}`,
    impressions: "Tahmini Gösterim",
    impressionsSub: "toplam kişi",
    cpm: "Bin Gösterim Maliyeti",
    cpmSub: "CPM",
    cta: "Panoları Gör ve Seç",
    disclaimer:
        "* Ortalama pano fiyatları ve gösterim verileri baz alınmıştır. Gerçek fiyatlar lokasyona göre değişir.",
};

const EN: BudgetStrings = {
    badge: "Budget calculator",
    title: "What does my budget get?",
    subtitle: "Enter your budget and duration — see how many faces you can reach and estimated impressions instantly.",
    totalBudget: "Total budget",
    duration: "Campaign duration",
    presets: [
        { label: "TRY 5,000", value: 5000 },
        { label: "TRY 10,000", value: 10000 },
        { label: "TRY 25,000", value: 25000 },
        { label: "TRY 50,000", value: 50000 },
        { label: "TRY 100,000", value: 100000 },
    ],
    durations: [
        { label: "1 week", value: 1, multiplier: 1 },
        { label: "2 weeks", value: 2, multiplier: 2 },
        { label: "1 month", value: 4, multiplier: 4 },
        { label: "3 months", value: 12, multiplier: 12 },
    ],
    rangeMin: "TRY 1,000",
    rangeMax: "TRY 200,000",
    panelsTitle: "Estimated number of faces",
    panelsSub: (dur) => `faces × ${dur}`,
    impressions: "Estimated impressions",
    impressionsSub: "total people",
    cpm: "Cost per thousand impressions",
    cpmSub: "CPM",
    cta: "Browse and choose faces",
    disclaimer:
        "* Based on average face prices and impression benchmarks. Actual prices vary by location.",
};

export function budgetStrings(locale: AppLocale): BudgetStrings {
    return locale === "en" ? EN : TR;
}
