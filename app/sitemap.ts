import { buildSitemapEntries, type SitemapEvent } from '@/lib/sitemap-entries';
import { client } from '@/sanity/lib/client';
import { SITEMAP_EVENTS_QUERY } from '@/sanity/lib/queries';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const events = await client.fetch<SitemapEvent[]>(
        SITEMAP_EVENTS_QUERY,
        {},
        {
            perspective: 'published',
            useCdn: true,
            next: { revalidate: 3600 },
        }
    );

    return buildSitemapEntries(events ?? []);
}
