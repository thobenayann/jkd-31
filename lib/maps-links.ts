/**
 * Liens Google Maps construits à partir du lieu d'entraînement.
 *
 * Trois usages, trois URLs :
 * - `directions` : lance un itinéraire vers le lieu. Sur mobile, ce format
 *   (Maps URLs, `api=1`) ouvre l'application Google Maps si elle est installée.
 * - `place` : ouvre la fiche du lieu dans Google Maps, pour l'enregistrer ou
 *   consulter les avis. Avec `placeCid`, le lien vise exactement la fiche
 *   Google Business du club ; sans, Google la retrouve par recherche.
 * - `embed` : carte intégrable sans clé API, à charger uniquement après un
 *   clic du visiteur (voir `docs/seo/governance/analytics-and-rgpd.md`, §6).
 *
 * Le nom passé dans `venue.name` doit être celui de la fiche Google Business
 * visée : le gymnase est partagé par plusieurs associations, et une recherche
 * par adresse seule tombe sur n'importe laquelle. Aucune coordonnée GPS en
 * dur : Google géocode le nom et l'adresse.
 */

export interface MapsVenue {
    name: string;
    streetAddress?: string;
    postalCode: string;
    city: string;
    country: string;
}

export interface MapsLinks {
    directions: string;
    place: string;
    embed: string;
}

export interface MapsLinksOptions {
    /** Paramètre `cid` de la fiche Google Business, en décimal. */
    placeCid?: string;
}

const COUNTRY_LABELS: Record<string, string> = {
    FR: 'France',
};

const EMBED_ZOOM = '16';
const EMBED_LANGUAGE = 'fr';

export function formatVenueQuery(venue: MapsVenue): string {
    const country = COUNTRY_LABELS[venue.country] ?? venue.country;
    return [
        venue.name,
        venue.streetAddress,
        `${venue.postalCode} ${venue.city}`,
        country,
    ]
        .filter((part): part is string => Boolean(part))
        .join(', ');
}

export function buildMapsLinks(
    venue: MapsVenue,
    options: MapsLinksOptions = {}
): MapsLinks {
    const query = formatVenueQuery(venue);

    const directions = new URL('https://www.google.com/maps/dir/');
    directions.searchParams.set('api', '1');
    directions.searchParams.set('destination', query);

    const place = options.placeCid
        ? new URL(`https://maps.google.com/?cid=${options.placeCid}`)
        : new URL('https://www.google.com/maps/search/');
    if (!options.placeCid) {
        place.searchParams.set('api', '1');
        place.searchParams.set('query', query);
    }

    const embed = new URL('https://www.google.com/maps');
    embed.searchParams.set('q', query);
    embed.searchParams.set('z', EMBED_ZOOM);
    embed.searchParams.set('hl', EMBED_LANGUAGE);
    embed.searchParams.set('output', 'embed');

    return {
        directions: directions.toString(),
        place: place.toString(),
        embed: embed.toString(),
    };
}
