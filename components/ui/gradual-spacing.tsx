'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, Variants, motion } from 'framer-motion';

/**
 * Éléments sémantiques autorisés pour le conteneur.
 * Le défaut est `span` : une animation de texte ne doit jamais produire un
 * titre par accident. Chaque page déclare explicitement son propre niveau.
 */
type GradualSpacingTag = 'span' | 'p' | 'h1' | 'h2' | 'h3';

interface GradualSpacingProps {
    text: string;
    /** Élément du conteneur. `span` par défaut, donc aucun titre. */
    as?: GradualSpacingTag;
    duration?: number;
    delayMultiple?: number;
    framerProps?: Variants;
    /** Classes appliquées à chaque caractère animé (taille, police, couleur). */
    className?: string;
    /** Classes du conteneur, pour reproduire une mise en page existante. */
    containerClassName?: string;
    onAnimationComplete?: () => void;
}

export default function GradualSpacing({
    text,
    as: Tag = 'span',
    duration = 0.5,
    delayMultiple = 0.04,
    framerProps = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    },
    className,
    containerClassName,
    onAnimationComplete,
}: GradualSpacingProps) {
    return (
        <Tag className={cn('flex max-md:justify-center', containerClassName)}>
            {/*
                Le texte entier, en un seul nœud. C'est lui que lisent les
                lecteurs d'écran et les robots qui n'exécutent pas JavaScript.
                `sr-only` le sort du flux, la mise en page ne bouge pas.
            */}
            <span className='sr-only'>{text}</span>
            <AnimatePresence>
                {text.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        aria-hidden='true'
                        initial='hidden'
                        animate='visible'
                        exit='hidden'
                        variants={framerProps}
                        transition={{ duration, delay: i * delayMultiple }}
                        className={cn('drop-shadow-sm ', className)}
                        onAnimationComplete={
                            i === text.length - 1
                                ? onAnimationComplete
                                : undefined
                        }
                    >
                        {char === ' ' ? <span>&nbsp;</span> : char}
                    </motion.span>
                ))}
            </AnimatePresence>
        </Tag>
    );
}
