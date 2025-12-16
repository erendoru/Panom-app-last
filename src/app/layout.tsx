import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Panobu - Türkiye'nin Online Reklam Platformu",
    description: "Dijital ve statik outdoor reklamlarınızı kolayca yönetin. Billboard, raket ve dijital ekran kiralama platformu.",
    keywords: "billboard kiralama, outdoor reklam, açık hava reklamcılığı, dijital ekran, panobu",
    openGraph: {
        title: "Panobu - Türkiye'nin Online Reklam Platformu",
        description: "Dijital ve statik outdoor reklamlarınızı kolayca yönetin.",
        type: "website",
        locale: "tr_TR",
        url: "https://panobu.com.tr",
    },
    metadataBase: new URL("https://panobu.com.tr"),
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
