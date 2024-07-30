'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import React from 'react';

interface ParallaxImageProps {
    src: string;
    alt: string;
    height: string; // e.g., '500px' or '100vh'
    className?: string;
    speed?: number; // Higher value means slower movement (default: 0.5)
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({
    src,
    alt,
    height,
    className = '',
    speed = 0.5,
}) => {
    // `scrollY` provides the current scroll position
    const { scrollY } = useScroll();
    // `y` is the amount of vertical movement, slower than scroll (hence parallax effect)
    const y = useTransform(scrollY, [0, 1000], [0, -500 * speed]);

    return (
        <div
            className={`relative overflow-hidden rounded-lg ${className}`}
            style={{ height }}
        >
            <motion.img
                src={src}
                alt={alt}
                style={{ y }}
                className='absolute inset-0 w-full h-full object-cover'
            />
        </div>
    );
};

export default ParallaxImage;
