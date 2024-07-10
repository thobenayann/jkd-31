import AvatarPersonality from '@/components/shared/avatar-personality';
import { Badge } from '@/components/ui/badge';
import { formatEventDates } from '@/lib/formatEventDate';
import { Clock } from 'lucide-react';
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
        <article className='flex flex-col rounded-md overflow-hidden shadow-lg shadow-zinc-200'>
            <div className='overflow-hidden'>
                <Image
                    src={mainImageUrl}
                    width={300}
                    height={300}
                    alt='placeholder'
                    className='transition-transform hover:scale-105 duration-300 ease-in-out'
                />
            </div>
            <div className='flex flex-col space-y-1 px-2 py-4'>
                <strong className='text-center font-bold text-lg'>
                    {formattedEventDates}
                </strong>
                <h2>{title}</h2>
                {timeSlots.map((timeSlot, index) => (
                    <Badge
                        key={index}
                        className='flex items-center space-x-2 w-fit bg-blue-900 hover:bg-blue-800'
                    >
                        <Clock className='w-4 h-4 text-blue-300' />
                        <span className='text-blue-300'>{timeSlot}</span>
                    </Badge>
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
