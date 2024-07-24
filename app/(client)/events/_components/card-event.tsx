import AvatarPersonality from '@/components/shared/avatar-personality';
import ClockBadge from '@/components/shared/clock-badge';
import { formatEventDates } from '@/lib/formatEventDate';
import Image from 'next/image';

interface CardEventProps {
    title: string;
    eventDates: string[];
    timeSlots: string[];
    mainImageUrl: string;
    personalityPhotoUrl: string;
    firstName: string;
    lastName: string;
    titlePersonality: string;
}

function CardEvent({
    title,
    eventDates,
    timeSlots,
    mainImageUrl,
    personalityPhotoUrl,
    firstName,
    lastName,
    titlePersonality,
}: CardEventProps) {
    const formattedEventDates = formatEventDates(eventDates);

    return (
        <article className='flex flex-col rounded-md overflow-hidden shadow-lg shadow-zinc-200 w-full'>
            <div className='w-full h-96 relative'>
                <Image
                    src={mainImageUrl}
                    alt='placeholder'
                    className='transition-transform hover:scale-105 duration-300 ease-in-out cursor-pointer'
                    fill
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                    }}
                />
            </div>
            <div className='flex flex-col space-y-1 px-2 py-4'>
                <strong className='text-center font-bold text-lg'>
                    {formattedEventDates}
                </strong>
                <h2>{title}</h2>
                {timeSlots.map((timeSlot, index) => (
                    <ClockBadge
                        key={index}
                        date={eventDates[index]}
                        time={timeSlot}
                        withDay={false}
                    />
                ))}
                <AvatarPersonality
                    personalityPhotoUrl={personalityPhotoUrl}
                    firstName={firstName}
                    lastName={lastName}
                    title={titlePersonality}
                />
            </div>
        </article>
    );
}

export default CardEvent;
