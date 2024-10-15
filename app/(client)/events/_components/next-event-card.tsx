import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Evenement } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/imageUrl';
import CardEvent from './card-event';

interface NextEventCardProps {
    events: Evenement[];
    isLoading: boolean;
}

function NextEventCard({ events, isLoading }: NextEventCardProps) {
    if (isLoading) {
        return (
            <section className='container flex max-md:flex-col max-md:space-y-20 md:p-20 md:justify-between'>
                <div className='flex max-md:flex-col max-md:items-center items-top justify-between w-full max-md:space-y-20 md:space-x-20'>
                    {[1, 2, 3].map((index) => (
                        <div key={index} className='w-full'>
                            <Skeleton className='h-96 w-full mb-4' />
                            <Skeleton className='h-4 w-3/4 mb-2' />
                            <Skeleton className='h-4 w-1/2' />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className='container flex max-md:flex-col max-md:space-y-20 md:p-20 md:justify-between'>
            {events.length > 0 ? (
                <FadeInWrapper
                    delay={0.2}
                    className='flex max-md:flex-col max-md:items-center items-top justify-between w-full max-md:space-y-20 md:space-x-20'
                >
                    {events.map((event) => {
                        const mainImageUrl = event.mainImage?.asset?._ref
                            ? urlFor(event.mainImage.asset._ref).url()
                            : '';
                        const personalityPhotoUrl = event.personality?.photo
                            ?.asset?._ref
                            ? urlFor(event.personality.photo.asset._ref).url()
                            : '';

                        return (
                            <CardEvent
                                key={event._id}
                                id={event._id}
                                title={event.title || ''}
                                eventDates={event.eventDates || []}
                                timeSlots={event.timeSlots || []}
                                mainImageUrl={mainImageUrl}
                                personalityPhotoUrl={personalityPhotoUrl}
                                firstName={event.personality?.firstName || ''}
                                lastName={event.personality?.lastName || ''}
                                titlePersonality={
                                    event.personality?.title || ''
                                }
                            />
                        );
                    })}
                </FadeInWrapper>
            ) : (
                <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-4'>
                    <div className='flex flex-col items-center gap-1 text-center'>
                        <h3 className='text-base md:text-2xl font-bold tracking-tight'>
                            Nous n&apos;avons pas encore publié
                            d&apos;événements à venir.
                        </h3>
                    </div>
                </div>
            )}
        </section>
    );
}

export default NextEventCard;
