import { groq } from 'next-sanity';

export const EVENTS_QUERY = groq`*[_type == "evenement" && defined(slug)]`;
