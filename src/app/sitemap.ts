import { MetadataRoute } from 'next';
import { TURKEY_CITIES } from '@/lib/turkey-data';

// Convert city names to URL-friendly slugs
function toSlug(cityName: string): string {
    const turkishMap: Record<string, string> = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
    };
    return cityName
        .toLowerCase()
        .split('')
        .map(char => turkishMap[char] || char)
        .join('')
        .replace(/\s+/g, '-');
}

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://panobu.com';

    // Static pages
    const staticPages = [
        { path: '', priority: 1 },
        { path: '/static-billboards', priority: 0.9 },
        { path: '/screens', priority: 0.8 },
        { path: '/how-it-works', priority: 0.8 },
        { path: '/blog', priority: 0.7 },
        { path: '/updates', priority: 0.7 },
        { path: '/kampanya-rehberi', priority: 0.8 },
        { path: '/company/about', priority: 0.5 },
        { path: '/company/privacy', priority: 0.5 },
        { path: '/company/terms', priority: 0.5 },
        { path: '/company/kvkk', priority: 0.5 },
    ];

    const staticUrls = staticPages.map(page => ({
        url: `${baseUrl}${page.path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: page.priority,
    }));

    // City pages (81 il)
    const cityUrls = TURKEY_CITIES.map(city => ({
        url: `${baseUrl}/billboard-kiralama/${toSlug(city)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // Panel type pages
    const panelTypes = [
        'billboard',
        'clp-pano',
        'raket-pano',
        'megalight',
        'totem',
        'dijital-ekran',
    ];

    const panelTypeUrls = panelTypes.map(type => ({
        url: `${baseUrl}/pano-turleri/${type}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticUrls, ...cityUrls, ...panelTypeUrls];
}
