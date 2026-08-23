import { SITE, absoluteUrl } from '@/constant/site';
import { Evenement } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { urlFor } from '@/sanity/lib/imageUrl';
import { EVENT_QUERY } from '@/sanity/lib/queries';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventDetail from '../_components/event-detail';

type Props = {
    params: Promise<{ eventId: string }>;
};

async function getEvent(eventId: string): Promise<Evenement | null> {
    return sanityFetch({
        query: EVENT_QUERY,
        params: { eventId },
    });
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const event = await getEvent(params.eventId);

    if (!event) {
        return {
            title: 'Événement non trouvé',
            robots: { index: false, follow: false },
        };
    }

    const imageUrl = event.mainImage?.asset?._ref
        ? urlFor(event.mainImage.asset._ref).width(1200).height(630).url()
        : undefined;
    const isExternal = event.origin === 'external';
    const externalUrl = event.externalUrl;
    // Un événement externe est une republication : la page d'origine fait référence
    const canonical =
        isExternal && externalUrl
            ? externalUrl
            : absoluteUrl(`/events/${event._id}`);
    const images = imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: event.title }]
        : undefined;

    return {
        title: event.title,
        description: event.description,
        alternates: { canonical },
        openGraph: {
            title: event.title,
            description: event.description,
            url: canonical,
            images,
            type: 'website',
            locale: SITE.locale,
            siteName: SITE.name,
        },
        twitter: {
            card: 'summary_large_image',
            title: event.title,
            description: event.description,
            images: imageUrl ? [imageUrl] : undefined,
        },
    };
}

export default async function EventPage(props: Props) {
    const params = await props.params;
    const event = await getEvent(params.eventId);

    if (!event) {
        notFound();
    }

    return <EventDetail event={event} />;
}
