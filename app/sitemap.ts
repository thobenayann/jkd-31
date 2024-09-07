import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    // Entrées statiques
    const staticEntries = [
        {
            url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
            lastModified: new Date(2024, 3, 22),
            changeFrequency: 'never' as const,
            priority: 1,
        },
        {
            url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/association`,
            lastModified: new Date(2024, 8, 14),
            changeFrequency: 'never' as const,
            priority: 0.8,
        },
        {
            url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/tarifs`,
            lastModified: new Date(2024, 8, 14),
            changeFrequency: 'never' as const,
            priority: 0.8,
        },
        {
            url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/events`,
            lastModified: new Date(2024, 8, 14),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/contact`,
            lastModified: new Date(2024, 8, 14),
            changeFrequency: 'never' as const,
            priority: 0.8,
        },
        {
            url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/27-styles`,
            lastModified: new Date(2024, 8, 14),
            changeFrequency: 'never' as const,
            priority: 0.8,
        },
        {
            url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/legal`,
            lastModified: new Date(2024, 8, 14),
            changeFrequency: 'never' as const,
            priority: 0.8,
        },
    ];

    return [...staticEntries];
}
