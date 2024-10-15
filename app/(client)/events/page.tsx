import AvatarPersonality from '@/components/shared/avatar-personality';
import ClockBadge from '@/components/shared/clock-badge';
import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import { Button } from '@/components/ui/button';
import GradualSpacing from '@/components/ui/gradual-spacing';
import { formatEventDates } from '@/lib/formatEventDate';
import { getCurrentSeason } from '@/lib/getCurrentSeason';
import { sortEventsByDate } from '@/lib/sortEventsByDate';
import { Evenement, EVENTS_QUERYResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { urlFor } from '@/sanity/lib/imageUrl';
import { EVENTS_QUERY } from '@/sanity/lib/queries';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import ClientEventFilter from './_components/event-filter';

export default async function Events() {
    const events: EVENTS_QUERYResult = await sanityFetch({
        query: EVENTS_QUERY,
    });

    if (!events || events.length === 0) {
        return null;
    }

    // Date et saison actuelle
    const today = new Date();
    const currentSeason = getCurrentSeason();

    // Trouver le premier événement futur ou le dernier événement passé
    const sortedEvents: Evenement[] = sortEventsByDate(events as Evenement[]);
    let firstEventOrLatest: Evenement | undefined = sortedEvents.find(
        (event) => new Date(event.eventDates?.[0] || '') >= today
    );

    // Si aucun événement futur n'est trouvé, prendre le dernier événement passé
    if (!firstEventOrLatest) {
        firstEventOrLatest = sortedEvents
            .slice()
            .reverse()
            .find((event) => new Date(event.eventDates?.[0] || '') < today);
    }

    // Vérifier si firstEvent est toujours undefined
    if (!firstEventOrLatest) {
        return null;
    }

    // URL de l'image principale et de la photo de la personnalité
    const firstEventOrLatestImageUrl = firstEventOrLatest.mainImage?.asset?._ref
        ? urlFor(firstEventOrLatest.mainImage.asset._ref).url()
        : '';
    const firstEventOrLatestPersonalityPhotoUrl = firstEventOrLatest.personality
        ?.photo?.asset?._ref
        ? urlFor(firstEventOrLatest.personality.photo.asset._ref).url()
        : '';

    // Filtrer les événements restants
    const remainingEvents = sortedEvents.filter(
        (event) => event !== firstEventOrLatest
    );

    const formattedEventDates = formatEventDates(firstEventOrLatest.eventDates);

    return (
        <section className='w-full max-md:pb-28'>
            <header className='flex flex-col items-center align-center space-y-2 pb-10'>
                <GradualSpacing
                    text='Événements'
                    className='text-center text-3xl pt-10 md:pt-32 uppercase font-bold'
                />
                <FadeInWrapper delay={0.2}>
                    <p className='text-center text-xl text-gray-400'>
                        {currentSeason}
                    </p>
                </FadeInWrapper>
            </header>
            {/* Section de l'événement principal */}
            <FadeInWrapper
                className='bg-gray-900 max-md:pb-10 max-md:border-b-2 max-md:border-dashed relative'
                delay={0.4}
            >
                <article className='container flex flex-col items-center p-6'>
                    <strong className='text-2xl mb-10'>
                        {formattedEventDates}
                    </strong>
                    <div className='flex max-md:flex-col max-md:space-y-6 md:space-x-4'>
                        <div className='flex flex-col space-y-4 p-2 max-md:items-center md:p-20 md:w-1/2'>
                            <h2 className='text-2xl font-bold text-white'>
                                {firstEventOrLatest.title}
                            </h2>
                            <p className='text-gray-300 max-md:text-center'>
                                {firstEventOrLatest.description}
                            </p>
                            <div className='flex flex-col space-y-1'>
                                {firstEventOrLatest.timeSlots?.map(
                                    (timeSlot, index) =>
                                        firstEventOrLatest.eventDates?.[
                                            index
                                        ] ? (
                                            <ClockBadge
                                                key={index}
                                                date={
                                                    firstEventOrLatest
                                                        .eventDates?.[index]
                                                }
                                                time={timeSlot}
                                                withDay={true}
                                            />
                                        ) : null
                                )}
                            </div>
                            <AvatarPersonality
                                personalityPhotoUrl={
                                    firstEventOrLatestPersonalityPhotoUrl
                                }
                                firstName={
                                    firstEventOrLatest.personality?.firstName
                                }
                                lastName={
                                    firstEventOrLatest.personality?.lastName
                                }
                                title={firstEventOrLatest.personality?.title}
                            />
                            <Button className='mt-4 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center w-fit border border-gray-600'>
                                <span>Nous contacter</span>
                                <ArrowRight className='w-4 h-4 ml-2' />
                            </Button>
                        </div>
                        <div className='flex items-center justify-center md:w-1/2'>
                            {firstEventOrLatest.mainImage?.asset ? (
                                <Image
                                    src={firstEventOrLatestImageUrl}
                                    alt="Poster de l\'événement"
                                    width={350}
                                    height={200}
                                    priority
                                    style={{
                                        width: 'auto',
                                        height: 'auto',
                                    }}
                                />
                            ) : null}
                        </div>
                    </div>
                </article>
                <div className='flex justify-center'>
                    <a
                        href='#event-filter-section'
                        className='absolute -bottom-10'
                    >
                        <svg
                            className='w-10 pt-16 fill-current text-jkdBlue animate-bounce'
                            viewBox='0 0 32 32'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <title />
                            <g data-name='Layer 2' id='Layer_2'>
                                <path
                                    className='cls-1'
                                    d='M16.47,16.88,26.34,7a1,1,0,0,0-1.41-1.41l-9.06,9.06-8.8-8.8a1,1,0,0,0-1.41,0h0a1,1,0,0,0,0,1.42l9.61,9.61A.85.85,0,0,0,16.47,16.88Z'
                                />
                                <path
                                    className='cls-1'
                                    d='M16.47,26.46l9.87-9.88a1,1,0,0,0-1.41-1.41l-9.06,9.06-8.8-8.8a1,1,0,0,0-1.41,0h0a1,1,0,0,0,0,1.41l9.61,9.62A.85.85,0,0,0,16.47,26.46Z'
                                />
                            </g>
                        </svg>
                    </a>
                </div>
            </FadeInWrapper>
            {/* Section des événements restants */}
            <section id='event-filter-section' className='scroll-smooth'>
                <div className='container mx-auto p-4'>
                    <ClientEventFilter
                        events={remainingEvents.map((event) => ({
                            ...event,
                            imageUrl: event.mainImage?.asset?._ref
                                ? urlFor(event.mainImage.asset._ref).url()
                                : '',
                            formattedDates: formatEventDates(event.eventDates),
                        }))}
                    />
                </div>
            </section>
        </section>
    );
}
