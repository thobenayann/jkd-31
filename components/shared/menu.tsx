'use client';

import { cn } from '@/lib/utils';
import { motion, useAnimation, useScroll } from 'framer-motion';
import {
    CalendarSearch,
    GraduationCap,
    House,
    Phone,
    Ribbon,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuroraBackground } from '../ui/aurora-background-french-flag';
import { TransitionLink } from './transition-link';

// nav data
export const navData = [
    {
        id: 1,
        name: 'Acteurs du JKD',
        mobileName: 'Accueil',
        path: '/',
        icon: <House />,
        ariaLabel: 'Aller à la page d’accueil',
    },
    {
        id: 2,
        name: 'L’association',
        mobileName: "L'Asso",
        path: '/association',
        icon: <Ribbon />,
        ariaLabel: 'Découvrir l’association',
    },
    {
        id: 3,
        name: 'Tarifs',
        mobileName: 'Tarifs',
        path: '/tarifs',
        icon: <GraduationCap />,
        ariaLabel: 'Tarifs des cours',
    },
    {
        id: 4,
        name: 'Événements',
        mobileName: 'Events',
        path: '/events',
        icon: <CalendarSearch />,
        ariaLabel: 'Aller à la page des événements',
    },
    {
        id: 5,
        name: 'Contact',
        mobileName: 'Contact',
        path: '/contact',
        icon: <Phone />,
        ariaLabel: 'Aller à la section contact',
    },
];

interface NavProps {
    hash: string;
}

const Nav = ({ hash }: NavProps) => {
    const currentPath = usePathname();

    const [lastYPos, setLastYPos] = useState(0);
    const controls = useAnimation();
    const { scrollY } = useScroll();

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

    useEffect(() => {
        const updateMenuVisibility = () => {
            if (scrollY.get() > lastYPos && scrollY.get() > 100) {
                // Scroll Down
                controls.start({ y: '-100%', transition: { duration: 0.2 } });
            } else {
                // Scroll Up
                controls.start({ y: '0%', transition: { duration: 0.2 } });
            }
            setLastYPos(scrollY.get());
        };

        scrollY.on('change', updateMenuVisibility);

        return () => {
            scrollY.clearListeners();
        };
    }, [lastYPos, scrollY, controls]);

    return (
        <>
            {/* Desktop NAV */}
            <motion.nav
                className='fixed z-50 right-0 w-full shadow-md shadow-zinc-500'
                animate={controls}
            >
                <AuroraBackground className='w-full h-full'>
                    <div className='hidden md:flex w-full items-center justify-between px-4 h-max py-4 bg-transparent backdrop-blur-sm text-lg text-white'>
                        <TransitionLink href='/' aria-label='accueil'>
                            <Image
                                src='/images/logo/logo-jkd31.png'
                                alt='JKD Self Defense 31'
                                width={40}
                                height={40}
                                style={{ width: 'auto', height: 'auto' }}
                            />
                        </TransitionLink>
                        <div className='flex items-center justify-end gap-x-10'>
                            {navData.map((link) => (
                                <TransitionLink
                                    className={getLinkClassName(link.path)}
                                    href={link.path}
                                    key={link.id}
                                    aria-label={link.ariaLabel}
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
                                    'flex flex-col w-12',
                                    getLinkClassName(link.path)
                                )}
                                href={link.path}
                                key={link.id}
                                aria-label={link.ariaLabel}
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
