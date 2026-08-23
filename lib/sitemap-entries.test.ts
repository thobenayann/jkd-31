import {
    buildSitemapEntries,
    type SitemapEvent,
} from '@/lib/sitemap-entries';
import { describe, expect, it } from 'vitest';

const today = new Date('2026-08-23T00:00:00Z');

const event = (id: string, date: string, updatedAt: string): SitemapEvent => ({
    _id: id,
    _updatedAt: updatedAt,
    eventDates: [date],
});

describe('buildSitemapEntries', () => {
    it('lists the public static routes on the canonical .fr domain', () => {
        const urls = buildSitemapEntries([], today).map((e) => e.url);
        expect(urls).toContain('https://www.jkd-selfdefense31.fr');
        expect(urls).toContain('https://www.jkd-selfdefense31.fr/events');
        expect(urls).toContain('https://www.jkd-selfdefense31.fr/tarifs');
        expect(urls).toContain('https://www.jkd-selfdefense31.fr/association');
        expect(urls).toContain('https://www.jkd-selfdefense31.fr/contact');
        expect(urls).toContain('https://www.jkd-selfdefense31.fr/27-styles');
        expect(urls).toContain('https://www.jkd-selfdefense31.fr/legal');
    });

    it('never emits a .com, a Vercel preview or a studio url', () => {
        const urls = buildSitemapEntries(
            [event('e1', '2026-09-01', '2026-08-01T10:00:00Z')],
            today
        ).map((e) => e.url);
        for (const url of urls) {
            expect(url).not.toMatch(/\.com|vercel\.app|\/studio/);
        }
    });

    it('includes upcoming events and past events from the last 12 months only', () => {
        const entries = buildSitemapEntries(
            [
                event('upcoming', '2026-10-03', '2026-08-01T10:00:00Z'),
                event('recent-past', '2026-03-21', '2026-02-03T16:02:53Z'),
                event('old', '2023-06-17', '2025-09-06T16:15:36Z'),
                event('exactly-one-year', '2025-08-23', '2025-08-01T00:00:00Z'),
            ],
            today
        );
        const eventUrls = entries
            .map((e) => e.url)
            .filter((u) => u.includes('/events/'));
        expect(eventUrls).toEqual([
            'https://www.jkd-selfdefense31.fr/events/upcoming',
            'https://www.jkd-selfdefense31.fr/events/recent-past',
            'https://www.jkd-selfdefense31.fr/events/exactly-one-year',
        ]);
    });

    it('uses the Sanity update date as lastModified for events', () => {
        const [entry] = buildSitemapEntries(
            [event('e1', '2026-09-01', '2026-08-01T10:00:00Z')],
            today
        ).filter((e) => e.url.endsWith('/events/e1'));
        expect(entry.lastModified).toEqual(new Date('2026-08-01T10:00:00Z'));
    });

    it('skips events without a valid date', () => {
        const entries = buildSitemapEntries(
            [{ _id: 'no-date', _updatedAt: '2026-08-01T10:00:00Z' }],
            today
        );
        expect(entries.some((e) => e.url.includes('/events/'))).toBe(false);
    });
});
