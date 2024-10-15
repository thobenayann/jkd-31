import { Evenement } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { urlFor } from '@/sanity/lib/imageUrl';
import { EVENT_QUERY } from '@/sanity/lib/queries';
import { Metadata, ResolvingMetadata } from 'next';
import EventDetail from '../_components/event-detail';

type Props = {
    params: { eventId: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const event: Evenement | null = await sanityFetch({
        query: EVENT_QUERY,
        params: { eventId: params.eventId },
    });

    if (!event) {
        return {
            title: 'Événement non trouvé',
        };
    }

    const imageUrl = event.mainImage?.asset?._ref
        ? urlFor(event.mainImage.asset._ref).width(1200).height(630).url()
        : '';

    return {
        title: event.title,
        description: event.description,
        openGraph: {
            title: event.title,
            description: event.description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: event.title,
                },
            ],
            type: 'website',
            locale: 'fr_FR',
            siteName: 'JKD Self Defense 31',
        },
        twitter: {
            card: 'summary_large_image',
            title: event.title,
            description: event.description,
            images: [imageUrl],
        },
    };
}

export default async function EventPage({
    params,
}: {
    params: { eventId: string };
}) {
    const event: Evenement | null = await sanityFetch({
        query: EVENT_QUERY,
        params: { eventId: params.eventId },
    });

    if (!event) {
        return <div>Événement non trouvé</div>;
    }

    return <EventDetail event={event} />;
}
