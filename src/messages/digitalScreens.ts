import type { AppLocale } from "@/messages/publicNav";

export function digitalScreensCopy(locale: AppLocale) {
    const e = locale === "en";
    return {
        badge: e ? "Coming soon" : "Çok Yakında",
        h1a: e ? "Digital billboard" : "Dijital Billboard",
        h1b: e ? "advertising is on the way" : "Reklamcılığı Geliyor",
        leadBefore: e
            ? "Mall screens, digital transit, LED boards and more — with "
            : "AVM ekranları, dijital duraklar, LED billboard'lar ve daha fazlası... ",
        strong1: e ? "instant booking" : "Anlık kiralama",
        leadMid: e ? " and " : " ve ",
        strong2: e ? "programmatic buying" : "programatik reklam",
        leadAfter: e
            ? ", digital out-of-home is almost here on Panobu."
            : " özellikleriyle dijital açık hava reklamcılığı çok yakında Panobu'da!",
        ctaClassic: e ? "Browse classic faces" : "Klasik Panolara Göz At",
        notify: e ? "Notify me" : "Haberdar Ol",
        card1t: e ? "LED screens" : "LED Ekranlar",
        card1d: e
            ? "Reach millions with mall giants, plaza LEDs and roadside digital faces."
            : "AVM içi dev ekranlar, meydan LED'leri ve cadde kenarı dijital panolar ile markanızı milyonlara ulaştırın.",
        card2t: e ? "Instant booking" : "Anlık Kiralama",
        card2d: e
            ? "Daily, hourly or even slot-based rentals — book exactly when you need airtime."
            : "Günlük, saatlik veya dakikalık kiralama seçenekleri. İstediğiniz an, istediğiniz süre kadar reklam verin.",
        card3t: e ? "Real-time insights" : "Gerçek Zamanlı",
        card3d: e
            ? "Monitor delivery, impressions and performance live from your dashboard."
            : "Kampanya performansınızı canlı takip edin. Gösterim sayıları, erişim ve etkileşim verilerini anlık görün.",
        midTitle: e ? "What you will be able to do" : "Dijital Billboard ile Neler Yapabileceksiniz?",
        bullets: e
            ? [
                  "Run ads on mall, metro and roadside digital screens",
                  "Book flexibly by hour or by day",
                  "Target locations and dayparts for your audience",
                  "Track performance in real time",
                  "Manage many screens from one workspace",
                  "Keep budgets predictable with transparent pricing",
              ]
            : [
                  "AVM, metro durağı ve cadde kenarındaki dijital ekranlarda reklam verin",
                  "Saatlik veya günlük bazda esnek kiralama yapın",
                  "Hedef kitlenize göre lokasyon ve zaman dilimi seçin",
                  "Kampanya performansınızı gerçek zamanlı takip edin",
                  "Birden fazla ekranı tek platformdan yönetin",
                  "Şeffaf fiyatlandırma ile bütçenizi kontrol altında tutun",
              ],
        bottomTitle: e ? "Questions about digital?" : "Dijital reklamcılık hakkında sorularınız mı var?",
        bottomLead: e
            ? "Explore our classic inventory today or reach out to the team."
            : "Şimdilik klasik billboard'larımızı inceleyebilir veya bize ulaşabilirsiniz.",
        bottomClassic: e ? "Go to classic faces" : "Klasik Panolara Git",
        bottomContact: e ? "Contact us" : "İletişime Geç",
    };
}
