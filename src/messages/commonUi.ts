import type { AppLocale } from "@/messages/publicNav";

export function loadingText(locale: AppLocale): string {
    return locale === "en" ? "Loading…" : "Yükleniyor…";
}

export function mapLoadingText(locale: AppLocale): string {
    return locale === "en" ? "Loading map…" : "Harita Yükleniyor...";
}
