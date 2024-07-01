import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Evenement, EVENTS_QUERYResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { urlFor } from '@/sanity/lib/imageUrl';
import { EVENTS_QUERY } from '@/sanity/lib/queries';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowRight, Clock } from 'lucide-react';
import Image from 'next/image';

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

    // Format the event dates for display
    const formatEventDates = (dates: string[] | undefined): string => {
        if (!dates || dates.length === 0) return '';
        const formattedDates = dates.map((date) =>
            format(new Date(date), 'd MMMM', { locale: fr })
        ); // Utilisation de la locale française
        return formattedDates.length > 1
            ? `${formattedDates[0]} et ${formattedDates[1]}`
            : formattedDates[0];
    };

    const formattedEventDates = formatEventDates(firstEvent.eventDates);

    console.log('events', events);

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
                            <h2 className='text-2xl font-bold'>
                                {firstEvent.title}
                            </h2>
                            <p className='text-gray-300'>
                                {firstEvent.description}
                            </p>
                            <div className='flex flex-col space-y-1'>
                                {firstEvent.timeSlots?.map(
                                    (timeSlot, index) => (
                                        <Badge
                                            key={index}
                                            className='flex items-center space-x-2 w-fit bg-blue-900 hover:bg-blue-800'
                                        >
                                            <Clock className='w-4 h-4 text-blue-300' />
                                            <span className='text-blue-300'>
                                                {timeSlot}
                                            </span>
                                        </Badge>
                                    )
                                )}
                            </div>
                            <div className='flex items-center mt-4'>
                                <Avatar>
                                    <AvatarImage
                                        src={urlFor(
                                            firstEvent.personality?.photo?.asset
                                                ?._ref ?? ''
                                        )?.url()}
                                        alt={`${firstEvent.personality?.firstName} ${firstEvent.personality?.lastName}`}
                                    />
                                    <AvatarFallback>
                                        {firstEvent.personality?.firstName?.charAt(
                                            0
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='ml-4'>
                                    <p className='font-bold'>{`${firstEvent.personality?.firstName} ${firstEvent.personality?.lastName}`}</p>
                                    <p className='text-gray-400'>
                                        {firstEvent.personality?.title}
                                    </p>
                                </div>
                            </div>
                            <Button className='mt-4 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center w-fit border border-gray-600'>
                                <span>Nous contacter</span>
                                <ArrowRight className='w-4 h-4 ml-2' />
                            </Button>
                        </div>
                        <div className='flex items-center justify-center w-1/2'>
                            {firstEvent.mainImage?.asset ? (
                                <Image
                                    src={urlFor(
                                        firstEvent.mainImage?.asset._ref
                                    ).url()}
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
        </main>
    );
}
