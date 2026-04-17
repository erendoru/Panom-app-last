import type { AppLocale } from "@/messages/publicNav";

export type FooterCopy = {
    demoBooking: string;
    colProducts: string;
    colPlatform: string;
    colCompany: string;
    products: { outdoor: string; digital: string; rental: string };
    platform: { why: string; advantages: string; advertisers: string; publishers: string };
    company: { about: string; careers: string; blog: string; updates: string; help: string; contact: string };
    legal: { privacy: string; refund: string; terms: string; distance: string; delivery: string };
    paymentAlt: string;
    copyright: string;
};

const TR: FooterCopy = {
    demoBooking: "Demo Rezervasyon",
    colProducts: "Ürünler",
    colPlatform: "Platform",
    colCompany: "Şirket",
    products: {
        outdoor: "Açık Hava Reklamcılığı",
        digital: "Dijital Panolar",
        rental: "Billboard Kiralama",
    },
    platform: {
        why: "Neden Panobu Platformu?",
        advantages: "Panobu Avantajları",
        advertisers: "Reklam Verenler İçin",
        publishers: "Reklam Alanları İçin",
    },
    company: {
        about: "Hakkımızda",
        careers: "Kariyer",
        blog: "Blog",
        updates: "Yenilikler",
        help: "Yardım Merkezi",
        contact: "İletişim",
    },
    legal: {
        privacy: "Gizlilik Politikası",
        refund: "İade Politikası",
        terms: "Hizmet Şartları",
        distance: "Mesafeli Satış Sözleşmesi",
        delivery: "Teslimat Koşulları",
    },
    paymentAlt: "Ödeme Yöntemleri - iyzico, Mastercard, Visa, American Express, Troy",
    copyright: "© 2026 Panobu. Tüm hakları saklıdır.",
};

const EN: FooterCopy = {
    demoBooking: "Book a demo",
    colProducts: "Products",
    colPlatform: "Platform",
    colCompany: "Company",
    products: {
        outdoor: "Out-of-home advertising",
        digital: "Digital screens",
        rental: "Billboard rental",
    },
    platform: {
        why: "Why Panobu?",
        advantages: "Panobu advantages",
        advertisers: "For advertisers",
        publishers: "For media owners",
    },
    company: {
        about: "About us",
        careers: "Careers",
        blog: "Blog",
        updates: "Updates",
        help: "Help center",
        contact: "Contact",
    },
    legal: {
        privacy: "Privacy policy",
        refund: "Refund policy",
        terms: "Terms of service",
        distance: "Distance sales contract",
        delivery: "Delivery terms",
    },
    paymentAlt: "Payment methods — iyzico, Mastercard, Visa, American Express, Troy",
    copyright: "© 2026 Panobu. All rights reserved.",
};

export function footerCopy(locale: AppLocale): FooterCopy {
    return locale === "en" ? EN : TR;
}
