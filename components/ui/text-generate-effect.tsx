'use client';
import { cn } from '@/lib/utils';
import { motion, stagger, useAnimate } from 'framer-motion';
import { useEffect, useRef } from 'react';

export const TextGenerateEffect = ({
    words,
    className,
    wordsClassName,
    filter = true,
    duration = 0.5,
}: {
    words: string;
    className?: string;
    wordsClassName?: string;
    filter?: boolean;
    duration?: number;
}) => {
    const [scope, animate] = useAnimate();
    const containerRef = useRef<HTMLDivElement>(null);
    let wordsArray = words.split(' ');
    useEffect(() => {
        const element = containerRef.current;

        const handleScroll = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate(
                        'span',
                        {
                            opacity: 1,
                            filter: filter ? 'blur(0px)' : 'none',
                        },
                        {
                            duration: duration ? duration : 1,
                            delay: stagger(0.2),
                        }
                    );
                }
            });
        };

        const observer = new IntersectionObserver(handleScroll, {
            threshold: 0.1, // Trigger when 10% of the element is in view
        });

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [animate, filter, duration]);

    const renderWords = () => {
        return (
            <motion.div ref={scope}>
                {wordsArray.map((word, idx) => {
                    return (
                        <motion.span
                            key={word + idx}
                            className={cn(
                                'dark:text-white text-black opacity-0',
                                wordsClassName
                            )}
                            style={{
                                filter: filter ? 'blur(10px)' : 'none',
                            }}
                        >
                            {word}{' '}
                        </motion.span>
                    );
                })}
            </motion.div>
        );
    };

    return (
        <div className={cn('font-bold', className)} ref={containerRef}>
            <div className='mt-4'>
                <div className=' dark:text-white text-black text-2xl leading-snug tracking-wide'>
                    {renderWords()}
                </div>
            </div>
        </div>
    );
};
