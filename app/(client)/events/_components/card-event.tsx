import AvatarPersonality from '@/components/shared/avatar-personality';
import ClockBadge from '@/components/shared/clock-badge';
import { TransitionLink } from '@/components/shared/transition-link';
import { formatEventDates } from '@/lib/formatEventDate';
import { motion } from 'framer-motion';
import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { EventOriginBadge } from './event-origin-badge';

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
    origin?: 'internal' | 'external';
}

// Les affiches du club sont au format 4:5 (1080 × 1350). Le cadre suit ce
// format pour qu'une affiche s'affiche entière, sans bande ni recadrage.
const IMAGE_SIZES = '(max-width: 768px) 100vw, 33vw';

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
    origin,
}: CardEventProps) {
    const [isHovered, setIsHovered] = useState(false);
    const formattedEventDates = formatEventDates(eventDates);

    return (
        // h-full : la carte prend la hauteur de la ligne, donc celle de la
        // plus haute carte voisine
        <motion.article
            className='flex flex-col h-full rounded-md overflow-hidden shadow-lg shadow-zinc-200 w-full'
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <TransitionLink href={`/events/${id}`}>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className='relative w-full aspect-[4/5] overflow-hidden bg-gray-900 cursor-pointer'
                >
                    {mainImageUrl ? (
                        <>
                            {/* Fond : la même image, floutée et assombrie,
                                remplit les bords quand le format n'est pas 4:5 */}
                            <Image
                                src={mainImageUrl}
                                alt=''
                                aria-hidden
                                fill
                                sizes={IMAGE_SIZES}
                                className='object-cover scale-110 blur-2xl brightness-50'
                            />
                            {/* Affiche entière, jamais recadrée */}
                            <Image
                                src={mainImageUrl}
                                alt={`Affiche : ${title}`}
                                fill
                                sizes={IMAGE_SIZES}
                                className='object-contain'
                            />
                        </>
                    ) : null}
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
                {/* Sous l'image plutôt que dessus, pour ne jamais masquer
                    le texte de l'affiche */}
                <EventOriginBadge origin={origin} className='self-center' />
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
