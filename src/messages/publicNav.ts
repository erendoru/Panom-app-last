export type AppLocale = "tr" | "en";

const STORAGE_KEY = "panobu-locale";

export function readStoredLocale(): AppLocale | null {
    if (typeof window === "undefined") return null;
    try {
        const v = window.localStorage.getItem(STORAGE_KEY);
        if (v === "en" || v === "tr") return v;
    } catch {
        /* ignore */
    }
    return null;
}

export function persistLocale(locale: AppLocale) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
        /* ignore */
    }
}

export const publicNav = {
    tr: {
        home: "Anasayfa",
        classic: "Klasik Panolar",
        digital: "Dijital Billboard",
        howItWorks: "Nasıl Çalışır?",
        blog: "Blog",
        updates: "Yenilikler",
        login: "Giriş Yap",
        getStarted: "Hemen Başla",
        ariaMenu: "Menüyü aç/kapat",
    },
    en: {
        home: "Home",
        classic: "Classic Billboards",
        digital: "Digital Billboard",
        howItWorks: "How it works",
        blog: "Blog",
        updates: "Updates",
        login: "Log in",
        getStarted: "Get started",
        ariaMenu: "Toggle menu",
    },
} as const;

export type PublicNavKey = keyof typeof publicNav.tr;

export function navLabel(locale: AppLocale, key: PublicNavKey): string {
    return publicNav[locale][key] ?? publicNav.tr[key];
}
