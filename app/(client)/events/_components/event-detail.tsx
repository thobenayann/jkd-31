import AvatarPersonality from '@/components/shared/avatar-personality';
import ClockBadge from '@/components/shared/clock-badge';
import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import { Button } from '@/components/ui/button';
import { formatEventDates } from '@/lib/formatEventDate';
import { Evenement } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/imageUrl';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Script from 'next/script';

interface EventDetailProps {
    event: Evenement;
}

export default function EventDetail({ event }: EventDetailProps) {
    const imageUrl = event.mainImage?.asset?._ref
        ? urlFor(event.mainImage.asset._ref).url()
        : '';
    const personalityPhotoUrl = event.personality?.photo?.asset?._ref
        ? urlFor(event.personality.photo.asset._ref).url()
        : '';
    const formattedEventDates = formatEventDates(event.eventDates);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        description: event.description,
        image: imageUrl,
        startDate: event.eventDates?.[0],
        endDate: event.eventDates?.[event.eventDates.length - 1],
        location: {
            '@type': 'Place',
            name: "Lieu de l'événement", // Ajoutez le lieu réel si disponible
            address: "Adresse de l'événement", // Ajoutez l'adresse réelle si disponible
        },
        performer: {
            '@type': 'Person',
            name: `${event.personality?.firstName} ${event.personality?.lastName}`,
        },
    };

    return (
        <>
            <Script
                id='event-jsonld'
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <article className='container flex flex-col items-center justify-center p-4 max-w-4xl'>
                <FadeInWrapper delay={0.2} className='relative md:pt-20'>
                    <Image
                        src={imageUrl}
                        alt={event.title || "Image de l'événement"}
                        width={1200}
                        height={600}
                        className='w-full max-h-[600px] mb-8 rounded-lg shadow-lg'
                    />
                </FadeInWrapper>
                <FadeInWrapper delay={0.4}>
                    <h1 className='text-2xl md:text-4xl font-bold mb-4 text-center'>
                        {event.title || 'Événement sans titre'}
                    </h1>
                    <div className='flex justify-center mb-6'>
                        <strong className='text-lg md:text-2xl text-gray-600'>
                            {formattedEventDates}
                        </strong>
                    </div>
                </FadeInWrapper>
                <FadeInWrapper
                    delay={0.6}
                    className='bg-gray-900 p-6 rounded-lg mb-8'
                >
                    <p className='text-md max-md:text-center md:text-lg text-white mb-4'>
                        {event.description}
                    </p>
                    <div className='flex flex-col max-md:items-center space-y-2'>
                        {event.timeSlots?.map((timeSlot, index) =>
                            event.eventDates?.[index] ? (
                                <ClockBadge
                                    key={index}
                                    date={event.eventDates[index]}
                                    time={timeSlot}
                                    withDay={true}
                                />
                            ) : null
                        )}
                    </div>
                    <Button className='mt-4 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center w-fit border border-gray-600 mx-auto'>
                        <span>Nous contacter</span>
                        <ArrowRight className='w-4 h-4 ml-2' />
                    </Button>
                </FadeInWrapper>
                {event.personality && (
                    <FadeInWrapper
                        delay={0.6}
                        className='flex justify-center mb-8'
                    >
                        <AvatarPersonality
                            personalityPhotoUrl={personalityPhotoUrl}
                            firstName={event.personality.firstName}
                            lastName={event.personality.lastName}
                            title={event.personality.title}
                            avatarClassName='w-24 h-24'
                        />
                    </FadeInWrapper>
                )}
            </article>
        </>
    );
}
