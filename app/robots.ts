import { SITE, absoluteUrl } from '@/constant/site';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Interface d'édition Sanity : rien à indexer
            disallow: '/studio/',
        },
        sitemap: absoluteUrl('/sitemap.xml'),
        host: SITE.url,
    };
}
