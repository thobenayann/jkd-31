'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface InteractiveImageProps {
    src: string;
    alt: string;
    className?: string;
    fill?: boolean;
    width?: number;
    height?: number;
    objectFitOnMobile?: 'cover' | 'contain' | 'initial';
}

const InteractiveImage = ({
    src,
    alt,
    className,
    fill = false,
    width,
    height,
    objectFitOnMobile = 'cover',
}: InteractiveImageProps) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const [origin, setOrigin] = useState({ x: '50%', y: '50%' });

    const handleMouseMove = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        const { left, top, width, height } =
            event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - left) / width) * 100;
        const y = ((event.clientY - top) / height) * 100;
        setOrigin({ x: `${x}%`, y: `${y}%` });
    };

    // Utilisation du switch pour définir objectFit
    let objectFit: 'cover' | 'contain' | 'initial' = 'initial';

    switch (true) {
        case isDesktop && fill:
            objectFit = 'cover';
            break;
        case !isDesktop && fill:
            objectFit = objectFitOnMobile;
            break;
        default:
            objectFit = 'initial';
    }

    return (
        <div
            className={cn(
                'my-10 overflow-hidden md:rounded-md md:shadow-md md:shadow-jkdBlue',
                className
            )}
            style={{
                width: fill ? '100%' : width,
                height: fill ? '100%' : height,
            }}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className='relative w-full h-full rounded-md overflow-hidden'
                style={{
                    originX: origin.x,
                    originY: origin.y,
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill={fill}
                    width={!fill ? width : undefined}
                    height={!fill ? height : undefined}
                    className='rounded-md overflow-hidden'
                    style={{
                        objectFit: objectFit,
                        objectPosition: fill ? 'center' : 'initial',
                    }}
                />
            </motion.div>
        </div>
    );
};

export default InteractiveImage;
