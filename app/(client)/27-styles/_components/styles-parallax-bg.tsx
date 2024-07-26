'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxBackground() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 300], [0, 100]);

    return (
        <motion.div
            className='absolute inset-0'
            style={{
                y,
                backgroundImage: `url(/images/content/27-styles/self-bg-2.jpg)`,
                backgroundSize: 'cover',
                opacity: 0.3,
            }}
        />
    );
}
