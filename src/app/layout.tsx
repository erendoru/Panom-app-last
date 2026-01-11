import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Billboard Kiralama | Açık Hava Reklam Platformu - Panobu",
        template: "%s | Panobu"
    },
    description: "Türkiye genelinde billboard ve açık hava reklam alanı kiralama platformu. 81 ilde outdoor reklam, dijital ekran, CLP, raket pano kiralama. Şeffaf fiyatlar, hızlı rezervasyon.",
    keywords: [
        "billboard kiralama",
        "açık hava reklamcılığı",
        "outdoor reklam",
        "pano kiralama",
        "dijital billboard",
        "clp pano",
        "raket pano",
        "reklam panosu fiyatları",
        "kocaeli billboard",
        "istanbul billboard",
        "panobu"
    ],
    icons: {
        icon: [
            { url: "/favicon.png", type: "image/png" },
        ],
        apple: "/favicon.png",
        shortcut: "/favicon.png",
    },
    openGraph: {
        title: "Billboard Kiralama | Açık Hava Reklam Platformu - Panobu",
        description: "Türkiye genelinde billboard ve açık hava reklam alanı kiralama. Şeffaf fiyatlar, online rezervasyon.",
        type: "website",
        locale: "tr_TR",
        url: "https://panobu.com",
        siteName: "Panobu",
        images: [
            {
                url: "/images/og-image.png",
                width: 1200,
                height: 630,
                alt: "Panobu - Billboard Kiralama Platformu"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Billboard Kiralama | Panobu",
        description: "Türkiye genelinde açık hava reklam alanı kiralama platformu.",
        images: ["/images/og-image.png"]
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: "https://panobu.com",
    },
    metadataBase: new URL("https://panobu.com"),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Panobu",
        "alternateName": "Panobu Billboard Kiralama",
        "url": "https://panobu.com",
        "logo": "https://panobu.com/favicon.png",
        "description": "Türkiye genelinde billboard ve açık hava reklam alanı kiralama platformu. 81 ilde outdoor reklam, dijital ekran, CLP, raket pano kiralama.",
        "foundingDate": "2024",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kocaeli",
            "addressCountry": "TR"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+90-555-123-4567",
            "contactType": "customer service",
            "availableLanguage": "Turkish"
        },
        "sameAs": [
            "https://www.linkedin.com/company/panobu",
            "https://www.instagram.com/panobutr",
            "https://twitter.com/panobu"
        ],
        "areaServed": {
            "@type": "Country",
            "name": "Turkey"
        },
        "serviceType": [
            "Billboard Kiralama",
            "Açık Hava Reklamcılığı",
            "Dijital Ekran Kiralama",
            "CLP Pano Kiralama",
            "Outdoor Reklam"
        ]
    };
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Panobu",
        "image": "https://panobu.com/favicon.png",
        "url": "https://panobu.com",
        "telephone": "+90-555-123-4567",
        "priceRange": "₺₺",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Merkez",
            "addressLocality": "Kocaeli",
            "addressRegion": "Kocaeli",
            "postalCode": "41000",
            "addressCountry": "TR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 40.7654,
            "longitude": 29.9408
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
        },
        "areaServed": [
            { "@type": "City", "name": "Kocaeli" },
            { "@type": "City", "name": "İstanbul" },
            { "@type": "City", "name": "Ankara" },
            { "@type": "City", "name": "İzmir" },
            { "@type": "City", "name": "Bursa" }
        ],
        "serviceType": "Billboard Kiralama",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Açık Hava Reklam Hizmetleri",
            "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Billboard Kiralama" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CLP Pano Kiralama" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dijital Ekran Kiralama" } }
            ]
        }
    };

    return (
        <html lang="tr">
            <head>
                <meta name="google-site-verification" content="YVWCl1pbYY9-9ZD5FJsxUNERt70sKg47t3fOff07A4s" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
                />
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
