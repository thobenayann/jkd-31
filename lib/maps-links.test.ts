import { describe, expect, it } from 'vitest';
import {
    buildMapsLinks,
    formatVenueQuery,
    type MapsVenue,
} from './maps-links';

const venue: MapsVenue = {
    name: 'JKD Self Defense 31',
    streetAddress: '6 Rue Pierre Bauduc',
    postalCode: '31600',
    city: 'Muret',
    country: 'FR',
};

const QUERY = 'JKD Self Defense 31, 6 Rue Pierre Bauduc, 31600 Muret, France';
const ENCODED = 'JKD+Self+Defense+31%2C+6+Rue+Pierre+Bauduc%2C+31600+Muret%2C+France';

describe('formatVenueQuery', () => {
    it('assemble le lieu dans l’ordre lisible par Google Maps', () => {
        expect(formatVenueQuery(venue)).toBe(QUERY);
    });

    it('omet la rue quand elle est absente', () => {
        expect(
            formatVenueQuery({ ...venue, streetAddress: undefined })
        ).toBe('JKD Self Defense 31, 31600 Muret, France');
    });
});

describe('buildMapsLinks', () => {
    const links = buildMapsLinks(venue);

    it('produit un lien itinéraire au format Maps URLs officiel', () => {
        expect(links.directions).toBe(
            `https://www.google.com/maps/dir/?api=1&destination=${ENCODED}`
        );
    });

    it('sans identifiant de fiche, la fiche est retrouvée par recherche', () => {
        expect(links.place).toBe(
            `https://www.google.com/maps/search/?api=1&query=${ENCODED}`
        );
    });

    it('avec un identifiant de fiche, le lien ouvre exactement cette fiche', () => {
        const withCid = buildMapsLinks(venue, { placeCid: '16806687830570321192' });
        expect(withCid.place).toBe(
            'https://maps.google.com/?cid=16806687830570321192'
        );
        expect(withCid.directions).toBe(links.directions);
        expect(withCid.embed).toBe(links.embed);
    });

    it('produit une URL d’embed sans clé API, centrée sur le lieu', () => {
        const url = new URL(links.embed);
        expect(url.origin + url.pathname).toBe('https://www.google.com/maps');
        expect(url.searchParams.get('q')).toBe(QUERY);
        expect(url.searchParams.get('output')).toBe('embed');
        expect(url.searchParams.get('z')).toBe('16');
        expect(url.searchParams.get('hl')).toBe('fr');
    });

    it('ne contient jamais de caractère non encodé dans les paramètres', () => {
        for (const href of Object.values(links)) {
            expect(href).not.toMatch(/\s/);
            expect(() => new URL(href)).not.toThrow();
        }
    });
});
