/**
 * Générateurs de données structurées (schema.org, sérialisées en JSON-LD).
 *
 * Règle : on n'invente jamais une donnée. Un champ inconnu est omis, jamais
 * remplacé par un texte de substitution, car Google lit le JSON-LD comme un fait.
 */
import { associationConfig } from '@/constant/config';
import { SITE, absoluteUrl } from '@/constant/site';
import type { Evenement } from '@/sanity.types';

/** Sous-ensemble d'un `Evenement` Sanity utilisé par le JSON-LD. */
export type EventForJsonLd = Pick<
    Evenement,
    | 'title'
    | 'description'
    | 'eventDates'
    | 'origin'
    | 'externalUrl'
    | 'location'
    | 'personality'
> & { _id: string };

type PostalAddress = {
    '@type': 'PostalAddress';
    streetAddress?: string;
    postalCode?: string;
    addressLocality: string;
    addressCountry: string;
};

type Place = {
    '@type': 'Place';
    name: string;
    address: PostalAddress;
};

export type EventJsonLd = {
    '@context': 'https://schema.org';
    '@type': 'Event';
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    eventStatus: 'https://schema.org/EventScheduled';
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode';
    url: string;
    image?: string;
    location?: Place;
    performer?: { '@type': 'Person'; name: string };
    organizer?: { '@type': 'Organization'; name: string; url: string };
};

const venueAddress: PostalAddress = {
    '@type': 'PostalAddress',
    streetAddress: associationConfig.venue.streetAddress,
    postalCode: associationConfig.venue.postalCode,
    addressLocality: associationConfig.venue.city,
    addressCountry: associationConfig.venue.country,
};

const socialProfiles = [
    associationConfig.socialMedia.facebook,
    associationConfig.socialMedia.instagram,
];

const buildPlace = (location: EventForJsonLd['location']): Place | undefined => {
    // Nom et ville sont le minimum pour qu'un lieu ait un sens
    if (!location?.name || !location.city) return undefined;
    return {
        '@type': 'Place',
        name: location.name,
        address: {
            '@type': 'PostalAddress',
            ...(location.streetAddress && {
                streetAddress: location.streetAddress,
            }),
            ...(location.postalCode && { postalCode: location.postalCode }),
            addressLocality: location.city,
            addressCountry: 'FR',
        },
    };
};

const buildPerformer = (
    personality: EventForJsonLd['personality']
): EventJsonLd['performer'] => {
    if (!personality?.firstName || !personality.lastName) return undefined;
    return {
        '@type': 'Person',
        name: `${personality.firstName} ${personality.lastName}`,
    };
};

export const buildEventJsonLd = (
    event: EventForJsonLd,
    { imageUrl }: { imageUrl?: string } = {}
): EventJsonLd => {
    const isExternal = event.origin === 'external';
    const dates = event.eventDates ?? [];
    const place = buildPlace(event.location);
    const performer = buildPerformer(event.personality);

    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        ...(event.title && { name: event.title }),
        ...(event.description && { description: event.description }),
        ...(dates[0] && { startDate: dates[0] }),
        ...(dates.length > 0 && { endDate: dates[dates.length - 1] }),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        url:
            isExternal && event.externalUrl
                ? event.externalUrl
                : absoluteUrl(`/events/${event._id}`),
        ...(imageUrl && { image: imageUrl }),
        ...(place && { location: place }),
        ...(performer && { performer }),
        ...(!isExternal && {
            organizer: {
                '@type': 'Organization',
                name: SITE.name,
                url: SITE.url,
            },
        }),
    };
};

export const buildOrganizationJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    sameAs: socialProfiles,
    contactPoint: [
        {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: associationConfig.email,
            telephone: associationConfig.phoneNumber,
            areaServed: 'FR',
            availableLanguage: ['fr'],
        },
    ],
});

/** Lieu d'entraînement : ce que Google rapproche de la fiche Business Profile. */
export const buildSportsLocationJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: SITE.name,
    url: SITE.url,
    telephone: associationConfig.phoneNumber,
    email: associationConfig.email,
    address: venueAddress,
    sameAs: socialProfiles,
});

export const buildWebSiteJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    inLanguage: 'fr',
});

/**
 * Sérialise pour un `<script type="application/ld+json">`.
 * `<` est échappé : un contenu CMS contenant `</script>` ne peut pas fermer
 * la balise et injecter du script dans la page.
 */
export const serializeJsonLd = (data: unknown): string =>
    JSON.stringify(data).replace(/</g, '\\u003c');
