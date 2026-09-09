'use client';

import { cn } from '@/lib/utils';
import {
    motion,
    useAnimation,
    useMotionValueEvent,
    useScroll,
} from 'framer-motion';
import {
    CalendarSearch,
    GraduationCap,
    House,
    Phone,
    Ribbon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { AuroraBackground } from '../ui/aurora-background-french-flag';
import GradualSpacing from '../ui/gradual-spacing';
import { TransitionLink } from './transition-link';

// nav data
export const navData = [
    {
        id: 1,
        name: 'Acteurs du JKD',
        mobileName: 'Accueil',
        path: '/',
        icon: <House />,
        hint: 'page d’accueil',
    },
    {
        id: 2,
        name: 'L’association',
        mobileName: "L'Asso",
        path: '/association',
        icon: <Ribbon />,
        hint: 'découvrir l’association',
    },
    {
        id: 3,
        name: 'Tarifs',
        mobileName: 'Tarifs',
        path: '/tarifs',
        icon: <GraduationCap />,
        hint: 'tarifs et horaires des cours',
    },
    {
        id: 4,
        name: 'Événements',
        mobileName: 'Events',
        path: '/events',
        icon: <CalendarSearch />,
        hint: 'stages et actualités du club',
    },
    {
        id: 5,
        name: 'Contact',
        mobileName: 'Contact',
        path: '/contact',
        icon: <Phone />,
        hint: 'nous écrire ou nous appeler',
    },
];

interface NavProps {
    hash: string;
}

const Nav = ({ hash }: NavProps) => {
    const currentPath = usePathname();

    const controls = useAnimation();
    const { scrollY } = useScroll();
    // Position et état de la barre gardés dans des refs : le défilement ne doit
    // pas re-rendre la barre (aurora, GradualSpacing) à chaque image.
    const lastYPos = useRef(0);
    const isHidden = useRef(false);
    // Reflet en état React du masquage, pour mettre l'aurora en pause quand
    // la barre est hors écran. Ne change qu'aux changements de direction.
    const [navHidden, setNavHidden] = useState(false);

    // Fonction pour déterminer le style du lien
    const getLinkClassName = (linkPath: string) => {
        const baseStyle =
            'relative items-center group hover:text-jkdBlue transition-all duration-300 font-cinzel';
        let specificStyle = '';

        if (linkPath === currentPath) {
            specificStyle =
                'underline decoration-jkdBlue decoration-2 underline-offset-4';
        }

        return `${baseStyle} ${specificStyle}`;
    };

    // Abonnement géré par framer-motion (désabonnement propre au démontage,
    // sans purger les autres abonnés du MotionValue partagé). L'animation n'est
    // relancée que lorsque la barre change d'état, pas à chaque image.
    useMotionValueEvent(scrollY, 'change', (latest) => {
        const shouldHide = latest > lastYPos.current && latest > 100;
        lastYPos.current = latest;
        if (shouldHide === isHidden.current) return;
        isHidden.current = shouldHide;
        setNavHidden(shouldHide);
        controls.start({
            y: shouldHide ? '-100%' : '0%',
            transition: { duration: 0.2 },
        });
    });

    return (
        <>
            {/* Desktop NAV */}
            <motion.nav
                className='fixed z-50 right-0 w-full shadow-md shadow-zinc-500'
                animate={controls}
            >
                {/* max-md:hidden : sous md la barre de bureau est masquée, inutile
                    de faire tourner l'aurora dans une bande vide. Pas de
                    backdrop-blur sur le contenu : le fond est déjà flouté à 10 px,
                    et un backdrop-filter au dessus d'un calque animé serait
                    recalculé à chaque image. */}
                <AuroraBackground
                    className='w-full h-full max-md:hidden'
                    paused={navHidden}
                >
                    <div className='hidden h-14 md:flex w-full items-center justify-between px-4 py-2 bg-transparent text-lg text-white'>
                        {/* <TransitionLink href='/' aria-label='accueil'>
                            <Image
                                src='/images/logo/logo-jkd-sd-31.webp'
                                alt='JKD Self Defense 31'
                                width={120}
                                height={100}
                                style={{ width: 'auto', height: 'auto' }}
                            />
                        </TransitionLink> */}
                        <TransitionLink
                            href='/'
                            aria-label='Accueil, Jeet Kune Do, Kali, Silat, Self-défense'
                            className='group'
                        >
                            <GradualSpacing
                                className='max-md:text-center font-cinzel text-white text-base md:text-lg group-hover:text-jkdBlue'
                                text='Jeet Kune Do, Kali, Silat, Self-défense'
                            />
                        </TransitionLink>
                        <div className='flex items-center justify-end gap-x-10'>
                            {navData.map((link) => (
                                <TransitionLink
                                    className={getLinkClassName(link.path)}
                                    href={link.path}
                                    key={link.id}
                                    aria-label={`${link.name}, ${link.hint}`}
                                    aria-current={
                                        hash === link.path ? 'page' : undefined
                                    }
                                >
                                    <span>{link.name}</span>
                                </TransitionLink>
                            ))}
                        </div>
                    </div>
                </AuroraBackground>
            </motion.nav>

            {/* Tablet and mobile NAV */}
            <nav className='flex flex-col items-center md:justify-center gap-y-4 fixed h-20 md:h-max bottom-0 mt-auto md:right-[2%] z-50 top-0 w-full md:hidden'>
                <div className='flex w-full items-center justify-between px-6 h-[80px] bg-white/10 backdrop-blur-sm text-3xl'>
                    {navData.map((link) => {
                        return (
                            <TransitionLink
                                className={cn(
                                    'flex flex-col justify-center w-12 min-h-11',
                                    getLinkClassName(link.path)
                                )}
                                href={link.path}
                                key={link.id}
                                aria-label={`${link.mobileName}, ${link.hint}`}
                                aria-current={
                                    hash === link.path ? 'page' : undefined
                                }
                            >
                                <div>{link.icon}</div>
                                <span className='text-[10px]'>
                                    {link.mobileName}
                                </span>
                            </TransitionLink>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default Nav;
