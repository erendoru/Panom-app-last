import type { AppLocale } from "@/messages/publicNav";

export function blogListingCopy(locale: AppLocale) {
    const e = locale === "en";
    return {
        title: e ? "Blog" : "Blog",
        subtitle: e
            ? "The latest on out-of-home advertising, digital marketing and Panobu."
            : "Açık hava reklamcılığı, dijital pazarlama ve Panobu hakkında en güncel içerikler.",
        loading: e ? "Loading…" : "Yükleniyor…",
        emptyTitle: e ? "No posts yet" : "Henüz yazı yok",
        emptyLead: e ? "Great content is coming soon." : "Yakında burada harika içerikler paylaşacağız!",
        readMore: e ? "Read more" : "Devamını Oku",
    };
}
