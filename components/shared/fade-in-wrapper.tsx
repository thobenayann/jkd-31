'use client';

import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

const fadeInVariants = {
    hidden: (direction: string) => {
        switch (direction) {
            case 'up':
                return { opacity: 0, y: 20 };
            case 'down':
                return { opacity: 0, y: -20 };
            case 'left':
                return { opacity: 0, x: 20 };
            case 'right':
                return { opacity: 0, x: -20 };
            default:
                return { opacity: 0, y: 20 };
        }
    },
    visible: { opacity: 1, x: 0, y: 0 },
};

interface FadeInWrapperProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
}

const FadeInWrapper: React.FC<FadeInWrapperProps> = ({
    children,
    delay = 0,
    className,
    direction = 'up',
}) => {
    const controls = useAnimation();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    controls.start('visible');
                }
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
            }
        );

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [controls]);

    return (
        <motion.div
            ref={ref}
            initial='hidden'
            animate={controls}
            exit='hidden'
            variants={fadeInVariants}
            custom={direction}
            transition={{ duration: 0.8, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FadeInWrapper;
