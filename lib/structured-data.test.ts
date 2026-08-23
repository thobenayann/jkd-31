import {
    buildEventJsonLd,
    buildOrganizationJsonLd,
    buildSportsLocationJsonLd,
    buildWebSiteJsonLd,
    serializeJsonLd,
    type EventForJsonLd,
} from '@/lib/structured-data';
import { describe, expect, it } from 'vitest';

const internalEvent: EventForJsonLd = {
    _id: 'evt-internal',
    title: 'Stage Jeet-Kune-Do',
    description: 'Un stage convivial.',
    eventDates: ['2026-06-17', '2026-06-18'],
    origin: 'internal',
    location: {
        name: 'Gymnase Albert Camus',
        streetAddress: '6 Rue Pierre Bauduc',
        postalCode: '31600',
        city: 'Muret',
    },
    personality: { firstName: 'David', lastName: 'DELANNOY' },
};

describe('buildEventJsonLd', () => {
    it('describes an internal event with canonical url, location, performer and organizer', () => {
        const ld = buildEventJsonLd(internalEvent, {
            imageUrl: 'https://cdn.sanity.io/poster.jpg',
        });

        expect(ld['@type']).toBe('Event');
        expect(ld.name).toBe('Stage Jeet-Kune-Do');
        expect(ld.startDate).toBe('2026-06-17');
        expect(ld.endDate).toBe('2026-06-18');
        expect(ld.url).toBe('https://www.jkd-selfdefense31.fr/events/evt-internal');
        expect(ld.image).toBe('https://cdn.sanity.io/poster.jpg');
        expect(ld.location).toEqual({
            '@type': 'Place',
            name: 'Gymnase Albert Camus',
            address: {
                '@type': 'PostalAddress',
                streetAddress: '6 Rue Pierre Bauduc',
                postalCode: '31600',
                addressLocality: 'Muret',
                addressCountry: 'FR',
            },
        });
        expect(ld.performer).toEqual({
            '@type': 'Person',
            name: 'David DELANNOY',
        });
        expect(ld.organizer?.['@type']).toBe('Organization');
        expect(ld.organizer?.name).toBe('JKD Self Defense 31');
        expect(ld.eventStatus).toBe('https://schema.org/EventScheduled');
        expect(ld.eventAttendanceMode).toBe('https://schema.org/OfflineEventAttendanceMode');
    });

    it('points an external event to its external url and has no organizer', () => {
        const ld = buildEventJsonLd({
            ...internalEvent,
            _id: 'evt-external',
            origin: 'external',
            externalUrl: 'https://autre-club.fr/stage',
        });

        expect(ld.url).toBe('https://autre-club.fr/stage');
        expect('organizer' in ld).toBe(false);
    });

    it('omits location, performer and image rather than inventing them', () => {
        const ld = buildEventJsonLd({
            _id: 'evt-bare',
            title: 'Sans détails',
            eventDates: ['2026-09-01'],
        });

        expect('location' in ld).toBe(false);
        expect('performer' in ld).toBe(false);
        expect('image' in ld).toBe(false);
        expect('description' in ld).toBe(false);
        expect(ld.startDate).toBe('2026-09-01');
        expect(ld.endDate).toBe('2026-09-01');
    });

    it('omits location when the name or city is missing', () => {
        const ld = buildEventJsonLd({
            ...internalEvent,
            location: { name: 'Gymnase' },
        });
        expect('location' in ld).toBe(false);
    });

    it('omits the performer when only one name part is present', () => {
        const ld = buildEventJsonLd({
            ...internalEvent,
            personality: { firstName: 'David' },
        });
        expect('performer' in ld).toBe(false);
    });
});

describe('global structured data', () => {
    it('describes the organization with canonical url and social profiles', () => {
        const ld = buildOrganizationJsonLd();
        expect(ld['@type']).toBe('Organization');
        expect(ld.url).toBe('https://www.jkd-selfdefense31.fr');
        expect(ld.sameAs.some((u) => u.includes('facebook.com'))).toBe(true);
        expect(ld.sameAs.some((u) => u.includes('instagram.com'))).toBe(true);
    });

    it('describes the training venue as a SportsActivityLocation with a postal address', () => {
        const ld = buildSportsLocationJsonLd();
        expect(ld['@type']).toBe('SportsActivityLocation');
        expect(ld.address.addressLocality).toBe('Muret');
        expect(ld.address.postalCode).toBe('31600');
        expect(ld.address.addressCountry).toBe('FR');
        expect(ld.url).toBe('https://www.jkd-selfdefense31.fr');
    });

    it('describes the website', () => {
        const ld = buildWebSiteJsonLd();
        expect(ld['@type']).toBe('WebSite');
        expect(ld.url).toBe('https://www.jkd-selfdefense31.fr');
    });
});

describe('serializeJsonLd', () => {
    it('escapes "<" so CMS content cannot close the script tag', () => {
        const out = serializeJsonLd({ name: '</script><script>alert(1)' });
        expect(out.includes('</script>')).toBe(false);
        expect(out.includes('\\u003c/script')).toBe(true);
        expect(JSON.parse(out)).toEqual({ name: '</script><script>alert(1)' });
    });
});
