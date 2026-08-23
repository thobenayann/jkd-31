import { absoluteUrl } from '@/constant/site';
import type { MetadataRoute } from 'next';

/** Ce que le sitemap a besoin de connaître d'un événement Sanity. */
export type SitemapEvent = {
    _id: string;
    _updatedAt: string;
    eventDates?: string[];
};

type ChangeFrequency = NonNullable<
    MetadataRoute.Sitemap[number]['changeFrequency']
>;

/** Routes publiques. `/studio` est volontairement absent. */
const STATIC_ROUTES: Array<{
    path: string;
    changeFrequency: ChangeFrequency;
    priority: number;
}> = [
    { path: '/', changeFrequency: 'monthly', priority: 1 },
    { path: '/association', changeFrequency: 'yearly', priority: 0.8 },
    { path: '/tarifs', changeFrequency: 'yearly', priority: 0.8 },
    { path: '/events', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/contact', changeFrequency: 'yearly', priority: 0.7 },
    { path: '/27-styles', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/legal', changeFrequency: 'yearly', priority: 0.3 },
];

/** Au-delà, un événement passé n'a plus d'intérêt pour le référencement. */
const PAST_EVENT_RETENTION_MONTHS = 12;

const startTimestamp = (event: SitemapEvent): number | null => {
    const raw = event.eventDates?.[0];
    if (!raw) return null;
    const time = new Date(raw).getTime();
    return Number.isNaN(time) ? null : time;
};

const isWorthIndexing = (event: SitemapEvent, today: Date): boolean => {
    const start = startTimestamp(event);
    if (start === null) return false;
    const cutoff = new Date(today);
    cutoff.setMonth(cutoff.getMonth() - PAST_EVENT_RETENTION_MONTHS);
    return start >= cutoff.getTime();
};

export const buildSitemapEntries = (
    events: SitemapEvent[],
    today: Date = new Date()
): MetadataRoute.Sitemap => {
    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
        ({ path, changeFrequency, priority }) => ({
            url: absoluteUrl(path),
            changeFrequency,
            priority,
        })
    );

    const eventEntries: MetadataRoute.Sitemap = events
        .filter((event) => isWorthIndexing(event, today))
        .map((event) => ({
            url: absoluteUrl(`/events/${event._id}`),
            lastModified: new Date(event._updatedAt),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

    return [...staticEntries, ...eventEntries];
};
