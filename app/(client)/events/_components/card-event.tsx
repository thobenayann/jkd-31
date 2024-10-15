import AvatarPersonality from '@/components/shared/avatar-personality';
import ClockBadge from '@/components/shared/clock-badge';
import { TransitionLink } from '@/components/shared/transition-link';
import { formatEventDates } from '@/lib/formatEventDate';
import { motion } from 'framer-motion';
import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface CardEventProps {
    id: string;
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
    id,
    title,
    eventDates,
    timeSlots,
    mainImageUrl,
    personalityPhotoUrl,
    firstName,
    lastName,
    titlePersonality,
}: CardEventProps) {
    const [isHovered, setIsHovered] = useState(false);
    const formattedEventDates = formatEventDates(eventDates);

    return (
        <motion.article
            className='flex flex-col rounded-md overflow-hidden shadow-lg shadow-zinc-200 w-full'
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <TransitionLink href={`/events/${id}`}>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className='w-full h-96 relative'
                >
                    <Image
                        src={mainImageUrl}
                        alt='placeholder'
                        className='transition-transform duration-500 ease-in-out cursor-pointer'
                        fill
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                    />
                    {/* Project Info Overlay */}
                    <div
                        className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6 transition-opacity duration-500 ease-in-out ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <h3 className='text-xl font-bold text-white'>
                            détails de l&apos;événement
                        </h3>
                    </div>
                    {/* Icon at the bottom right */}
                    <div
                        className={`absolute bottom-5 right-5 p-3 bg-black/70 rounded-full text-white transition-all duration-500 ease-in-out ${
                            isHovered
                                ? 'opacity-100 scale-125'
                                : 'opacity-0 scale-100'
                        }`}
                    >
                        <MoveUpRight className='w-6 h-4' />
                    </div>
                </motion.div>
            </TransitionLink>

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
        </motion.article>
    );
}

export default CardEvent;
