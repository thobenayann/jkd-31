'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxBackgroundProps {
    imageUrl: string;
}

export default function ParallaxBackground({
    imageUrl,
}: ParallaxBackgroundProps) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 300], [0, 100]);

    return (
        <motion.div
            className='absolute inset-0'
            style={{
                y,
                backgroundImage: imageUrl,
                backgroundSize: 'cover',
                opacity: 0.3,
            }}
        />
    );
}
