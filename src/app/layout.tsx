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
        icon: "/favicon.png",
        apple: "/favicon.png",
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

    return (
        <html lang="tr">
            <head>
                <meta name="google-site-verification" content="YVWCl1pbYY9-9ZD5FJsxUNERt70sKg47t3fOff07A4s" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
