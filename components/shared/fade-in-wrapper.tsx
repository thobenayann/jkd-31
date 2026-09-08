'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

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
    className = '',
    direction = 'up',
}) => {
    const ref = useRef<HTMLDivElement>(null);
    // Apparition pilotée par un état déclaratif plutôt que par `useAnimation()`
    // impératif : `controls.start()` appelé sur des controls dont l'élément
    // vient d'être démonté (double montage de React en dev) levait l'erreur
    // « controls.start() should only be called after a component has mounted ».
    const [isVisible, setIsVisible] = useState(false);

    // L'effet ne s'exécute que côté client, après montage.
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // L'apparition ne joue qu'une fois : on cesse d'observer.
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <motion.div
            ref={ref}
            initial='hidden'
            animate={isVisible ? 'visible' : 'hidden'}
            exit='hidden'
            variants={fadeInVariants}
            custom={direction}
            transition={{
                duration: 0.8,
                delay,
                ease: 'easeOut',
            }}
            className={className}
            style={{
                willChange: 'opacity, transform',
            }}
        >
            {children}
        </motion.div>
    );
};

export default FadeInWrapper;
