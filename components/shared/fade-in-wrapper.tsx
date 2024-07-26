'use client';

import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

interface FadeInWrapperProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

const FadeInWrapper: React.FC<FadeInWrapperProps> = ({
    children,
    delay = 0,
    className,
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

        if (ref.current) {
            observer.observe(ref.current);
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
            transition={{ duration: 0.8, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FadeInWrapper;
