'use client';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { PersonalityType } from '@/lib/findPersonalityByLastName';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useId, useRef } from 'react';

interface ExpandableCardPersonalityProps {
    activePersonality: PersonalityType | null;
    setActivePersonality: (personality: PersonalityType | null) => void;
}

const ExpandableCardPersonality: React.FC<ExpandableCardPersonalityProps> = ({
    activePersonality,
    setActivePersonality,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const id = useId();

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setActivePersonality(null);
            }
        }

        if (activePersonality) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePersonality]);

    useOutsideClick(ref, () => setActivePersonality(null));

    if (!activePersonality) return null;

    const layoutIdPrefix = `${activePersonality.firstName}-${activePersonality.lastName}`;

    return (
        <>
            <AnimatePresence>
                {activePersonality && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 bg-black/30 h-full w-full z-10'
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {activePersonality ? (
                    <div className='fixed inset-0 grid place-items-center z-[100]'>
                        <motion.div
                            layoutId={`card-${layoutIdPrefix}`}
                            ref={ref}
                            className='w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden p-6 relative'
                        >
                            <button
                                className='absolute top-6 right-4 md:hidden'
                                onClick={() => setActivePersonality(null)}
                            >
                                <CloseIcon />
                            </button>
                            <div className='flex flex-col items-center'>
                                <motion.div
                                    layoutId={`image-${layoutIdPrefix}`}
                                >
                                    <Image
                                        priority
                                        width={200}
                                        height={200}
                                        src={activePersonality.imgUrl}
                                        alt={activePersonality.firstName}
                                        className='w-full h-40 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top'
                                    />
                                </motion.div>
                                <motion.div className='text-center'>
                                    <motion.h3
                                        layoutId={`title-${layoutIdPrefix}`}
                                        className='font-bold text-neutral-700 dark:text-neutral-200 text-2xl mt-4'
                                    >
                                        {activePersonality.firstName}{' '}
                                        {activePersonality.lastName}
                                    </motion.h3>
                                    <motion.p
                                        layoutId={`description-${layoutIdPrefix}`}
                                        className='text-neutral-600 dark:text-neutral-400 text-lg mt-2'
                                    >
                                        {activePersonality.title}
                                    </motion.p>
                                </motion.div>
                                <div className='mt-4 max-md:mb-4 text-neutral-600 dark:text-neutral-400 overflow-auto max-h-[50vh] p-4 scrollbar-thin'>
                                    {activePersonality.longInfo?.map(
                                        (info, index) => (
                                            <p key={index} className='mt-2'>
                                                {Object.values(info).join(' ')}
                                            </p>
                                        )
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
        </>
    );
};

export default ExpandableCardPersonality;

const CloseIcon = () => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-6 w-6 text-white'
        >
            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
            <path d='M18 6L6 18' />
            <path d='M6 6l12 12' />
        </svg>
    );
};
