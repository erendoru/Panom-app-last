import { MetadataRoute } from 'next';
import { TURKEY_CITIES } from '@/lib/turkey-data';
import { cityToSlug } from '@/lib/city-slug';
import prisma from '@/lib/prisma';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://panobu.com';
    const now = new Date().toISOString();

    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/billboard-kiralama`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${baseUrl}/static-billboards`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
        { url: `${baseUrl}/screens`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${baseUrl}/updates`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
        { url: `${baseUrl}/kampanya-rehberi`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

        { url: `${baseUrl}/platform/why-panobu`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/platform/advantages`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/platform/advertisers`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/platform/publishers`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

        { url: `${baseUrl}/company/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${baseUrl}/company/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/company/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/company/kvkk`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ];

    const cityPages: MetadataRoute.Sitemap = TURKEY_CITIES.map(city => ({
        url: `${baseUrl}/billboard-kiralama/${cityToSlug(city)}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    const panelTypes = ['billboard', 'clp-pano', 'raket-pano', 'megalight', 'totem', 'dijital-ekran'];
    const panelTypePages: MetadataRoute.Sitemap = panelTypes.map(type => ({
        url: `${baseUrl}/pano-turleri/${type}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Dinamik: onaylı medya sahibi mağazaları
    let storePages: MetadataRoute.Sitemap = [];
    try {
        const owners = await prisma.screenOwner.findMany({
            where: { approved: true, slug: { not: null } },
            select: { slug: true, updatedAt: true },
            take: 2000,
        });
        storePages = owners
            .filter((o): o is { slug: string; updatedAt: Date } => !!o.slug)
            .flatMap((o) => [
                {
                    url: `${baseUrl}/medya/${o.slug}`,
                    lastModified: o.updatedAt.toISOString(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.7,
                },
                {
                    url: `${baseUrl}/medya/${o.slug}/panolar`,
                    lastModified: o.updatedAt.toISOString(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.65,
                },
                {
                    url: `${baseUrl}/medya/${o.slug}/iletisim`,
                    lastModified: o.updatedAt.toISOString(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.5,
                },
            ]);
    } catch {
        // DB hatası sitemap'i patlatmasın
    }

    return [
        ...staticPages,
        ...cityPages,
        ...panelTypePages,
        ...storePages,
    ];
}
