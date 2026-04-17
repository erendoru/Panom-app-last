import type { AppLocale } from "@/messages/publicNav";

/** API `category` query stays Turkish; labels switch for UI only. */
export function updatesCategoryChips(locale: AppLocale) {
    const e = locale === "en";
    return [
        { value: "Hepsi", label: e ? "All" : "Hepsi", icon: "none" as const },
        { value: "Kampanya Başlatma", label: e ? "Campaign launch" : "Kampanya Başlatma", icon: "zap" as const },
        { value: "Erişilebilirlik", label: e ? "Accessibility" : "Erişilebilirlik", icon: "users" as const },
        { value: "Raporlama ve Analiz", label: e ? "Reporting & analytics" : "Raporlama ve Analiz", icon: "chart" as const },
        { value: "Genel", label: e ? "General" : "Genel", icon: "settings" as const },
    ];
}

const CATEGORY_DISPLAY_EN: Record<string, string> = {
    Hepsi: "All",
    "Kampanya Başlatma": "Campaign launch",
    Erişilebilirlik: "Accessibility",
    "Raporlama ve Analiz": "Reporting & analytics",
    Genel: "General",
};

export function updatesCategoryBadge(category: string, locale: AppLocale): string {
    if (locale === "tr") return category;
    return CATEGORY_DISPLAY_EN[category] ?? category;
}

export function updatesListingCopy(locale: AppLocale) {
    const e = locale === "en";
    return {
        title: e ? "What’s new" : "Yenilikler",
        subtitle: e
            ? "New features and improvements — explore the latest updates."
            : "Yeni özellikler sizleri bekliyor 🎉 Güncellemelerimizi keşfedin ve deneyin.",
        loading: e ? "Loading…" : "Yükleniyor…",
        emptyTitle: e ? "No updates yet" : "Henüz güncelleme yok",
        emptyLead: e ? "Nothing in this category for now." : "Bu kategoride henüz güncelleme bulunmuyor.",
        readDetails: e ? "Read more" : "Detaylı Oku",
    };
}
