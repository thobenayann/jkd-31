import AvatarPersonality from '@/components/shared/avatar-personality';
import ClockBadge from '@/components/shared/clock-badge';
import { Button } from '@/components/ui/button';
import { formatEventDates } from '@/lib/formatEventDate';
import { Evenement, EVENTS_QUERYResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { urlFor } from '@/sanity/lib/imageUrl';
import { EVENTS_QUERY } from '@/sanity/lib/queries';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import NextEventCard from './_components/next-event-card';

export default async function Events() {
    const events: EVENTS_QUERYResult = await sanityFetch({
        query: EVENTS_QUERY,
    });

    if (!events || events.length === 0) {
        return null;
    }

    const today = new Date();
    let firstEvent: Evenement | undefined = events.find(
        (event) => new Date(event.eventDates?.[0] || '') >= today
    );

    if (!firstEvent) {
        firstEvent = events[events.length - 1];
    }

    const remainingEvents = events.filter((event) => event !== firstEvent);

    const formattedEventDates = formatEventDates(firstEvent.eventDates);

    const firstEventImageUrl = firstEvent.mainImage?.asset?._ref
        ? urlFor(firstEvent.mainImage.asset._ref).url()
        : '';

    const firstEventPersonalityPhotoUrl = firstEvent.personality?.photo?.asset
        ?._ref
        ? urlFor(firstEvent.personality.photo.asset._ref).url()
        : '';

    // TODO: Gérer l'affichage de la saison
    // Proposer d'afficher les événements passés ou futurs
    // Gérer le cas ou il n'y a pas d'événement a montrer
    // Gérer la grid des événéments pour le responsive

    return (
        <main className='w-full'>
            <header className='flex flex-col align-center space-y-2 pb-10'>
                <h1 className='text-center text-3xl pt-32 uppercase font-bold'>
                    Événements
                </h1>
                <p className='text-center text-xl text-gray-400'>
                    saison 2023-2024
                </p>
            </header>
            <section className='bg-gray-900'>
                <article className='container flex flex-col items-center p-6'>
                    <strong className='text-2xl mb-10'>
                        {formattedEventDates}
                    </strong>
                    <div className='flex space-x-4'>
                        <div className='flex flex-col space-y-4 p-20 w-1/2'>
                            <h2 className='text-2xl font-bold text-white'>
                                {firstEvent.title}
                            </h2>
                            <p className='text-gray-300'>
                                {firstEvent.description}
                            </p>
                            <div className='flex flex-col space-y-1'>
                                {firstEvent.timeSlots?.map((timeSlot, index) =>
                                    firstEvent.eventDates ? (
                                        <ClockBadge
                                            key={index}
                                            date={
                                                firstEvent.eventDates?.[index]
                                            }
                                            time={timeSlot}
                                        />
                                    ) : null
                                )}
                            </div>
                            <AvatarPersonality
                                personalityPhotoUrl={
                                    firstEventPersonalityPhotoUrl
                                }
                                firstName={firstEvent.personality?.firstName}
                                lastName={firstEvent.personality?.lastName}
                                title={firstEvent.personality?.title}
                            />
                            <Button className='mt-4 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center w-fit border border-gray-600'>
                                <span>Nous contacter</span>
                                <ArrowRight className='w-4 h-4 ml-2' />
                            </Button>
                        </div>
                        <div className='flex items-center justify-center w-1/2'>
                            {firstEvent.mainImage?.asset ? (
                                <Image
                                    src={firstEventImageUrl}
                                    alt="Poster de l\'événement"
                                    width={350}
                                    height={200}
                                    priority
                                />
                            ) : null}
                        </div>
                    </div>
                </article>
            </section>
            <NextEventCard events={remainingEvents} />
        </main>
    );
}
