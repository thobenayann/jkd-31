import { Evenement } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { urlFor } from '@/sanity/lib/imageUrl';
import { EVENTS_QUERY } from '@/sanity/lib/queries';
import { absoluteUrl } from '@/constant/site';
import { Metadata } from 'next';
import { ReactNode } from 'react';

async function getNextEvent(): Promise<Evenement | null> {
    const events: Evenement[] = await sanityFetch({ query: EVENTS_QUERY });
    const now = new Date();
    return (
        events.find((event) => new Date(event.eventDates?.[0] || '') >= now) ||
        null
    );
}

export async function generateMetadata(): Promise<Metadata> {
    const nextEvent = await getNextEvent();
    // Visuel du prochain événement, sinon l'image Open Graph du site
    const imageUrl = nextEvent?.mainImage?.asset?._ref
        ? urlFor(nextEvent.mainImage).width(1200).height(630).url()
        : absoluteUrl('/opengraph-image.png');

    return {
        title: 'Stages et événements du club à Muret',
        description:
            "Stages, démonstrations et rendez-vous de l'association JKD Self Defense 31 à Muret. Dates, horaires, lieux et intervenants de la saison.",
        keywords:
            'événements Jeet Kune Do, stages arts martiaux et self defense, JKD Self Defense 31 Toulouse',
        alternates: { canonical: '/events' },
    openGraph: {
            title: 'Stages et événements du club à Muret | JKD Self Defense 31',
            description:
                "Stages, démonstrations et rendez-vous de l'association JKD Self Defense 31 à Muret. Dates, horaires, lieux et intervenants de la saison.",
            url: absoluteUrl('/events'),
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: 'Prochain événement JKD Self Defense 31',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Stages et événements du club à Muret | JKD Self Defense 31',
            description:
                "Stages, démonstrations et rendez-vous de l'association JKD Self Defense 31 à Muret. Dates, horaires, lieux et intervenants de la saison.",
            images: [imageUrl],
        },
    };
}

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
