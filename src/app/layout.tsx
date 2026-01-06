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
    return (
        <html lang="tr">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
