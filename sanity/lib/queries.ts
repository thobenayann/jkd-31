import { groq } from 'next-sanity';

export const EVENTS_QUERY = groq`*[_type == "evenement" && defined(slug)]`;

export const EVENT_QUERY = groq`*[_type == "evenement" && _id == $eventId][0]`;

/** Champs minimaux pour le sitemap. */
export const SITEMAP_EVENTS_QUERY = groq`*[_type == "evenement" && defined(slug)]{ _id, _updatedAt, eventDates }`;
