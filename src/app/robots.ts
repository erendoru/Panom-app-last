import type { MetadataRoute } from "next";

const BASE_URL = "https://panobu.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/app/",
                    "/auth/",
                    "/admin/",
                    "/checkout/",
                    "/dashboard/",
                    "/_next/",
                ],
            },
            // Bazı crawl bot'larını açıkça izin ver (Google/Bing, sosyal)
            { userAgent: "Googlebot", allow: "/" },
            { userAgent: "Bingbot", allow: "/" },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}
