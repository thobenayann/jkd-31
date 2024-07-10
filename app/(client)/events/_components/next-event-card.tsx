import { Evenement } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/imageUrl';
import CardEvent from './card-event';

interface NextEventCardProps {
    events: Evenement[];
}

function NextEventCard({ events }: NextEventCardProps) {
    return (
        <section className='container flex p-20 justify-between'>
            {events.map((event, index) => {
                const mainImageUrl = event.mainImage?.asset?._ref
                    ? urlFor(event.mainImage.asset._ref).url()
                    : '';
                const personalityPhotoUrl = event.personality?.photo?.asset
                    ?._ref
                    ? urlFor(event.personality.photo.asset._ref).url()
                    : '';

                return (
                    <CardEvent
                        key={index}
                        title={event.title || ''}
                        eventDates={event.eventDates || []}
                        timeSlots={event.timeSlots || []}
                        mainImageUrl={mainImageUrl}
                        personalityPhotoUrl={personalityPhotoUrl}
                        firstName={event.personality?.firstName || ''}
                        lastName={event.personality?.lastName || ''}
                        titlePersonality={event.personality?.title || ''}
                    />
                );
            })}
        </section>
    );
}

export default NextEventCard;
