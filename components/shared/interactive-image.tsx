'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface InteractiveImageProps {
    src: string;
    width: number;
    height: number;
    alt: string;
    className?: string;
}

const InteractiveImage = ({
    src,
    width,
    height,
    alt,
    className,
}: InteractiveImageProps) => {
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

    return (
        <div
            className='w-full md:w-96 my-10 overflow-hidden rounded-md shadow-md shadow-jkdBlue'
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className={cn('w-full h-full', className)}
                style={{
                    originX: origin.x,
                    originY: origin.y,
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                <Image
                    src={src}
                    width={width}
                    height={height}
                    alt={alt}
                    className='rounded-md'
                />
            </motion.div>
        </div>
    );
};

export default InteractiveImage;
