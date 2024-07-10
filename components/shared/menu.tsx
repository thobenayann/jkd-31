'use client';

import { CalendarSearch, House, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuroraBackground } from '../ui/aurora-background-french-flag';

// nav data
export const navData = [
    {
        id: 1,
        name: 'Accueil',
        path: '/',
        icon: <House />,
        ariaLabel: 'Aller à la page d’accueil',
    },
    {
        id: 2,
        name: 'Événements',
        path: '/events',
        icon: <CalendarSearch />,
        ariaLabel: 'Aller à la page des événements',
    },
    {
        id: 3,
        name: 'Contact',
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

    return (
        <>
            {/* Desktop NAV */}
            <nav className='fixed z-50 right-0 w-full'>
                <AuroraBackground className='w-full h-full'>
                    <div className='hidden xl:flex w-full items-center justify-between px-4 h-max py-4 bg-transparent backdrop-blur-sm text-lg text-white'>
                        <Image
                            src='/images/logo/logo-jkd31.png'
                            alt='Ji Dao'
                            width={40}
                            height={40}
                        />
                        <div className='flex items-center justify-end gap-x-10'>
                            {navData.map((link) => (
                                <Link
                                    className={getLinkClassName(link.path)}
                                    href={link.path}
                                    key={link.id}
                                    aria-label={link.ariaLabel}
                                    aria-current={
                                        hash === link.path ? 'page' : undefined
                                    }
                                >
                                    <span>{link.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </AuroraBackground>
            </nav>

            {/* Table and mobile NAV */}
            <nav className='flex flex-col items-center xl:justify-center gap-y-4 fixed h-20 md:h-max bottom-0 mt-auto xl:right-[2%] z-50 top-0 w-full xl:hidden'>
                {/* inner */}
                <div className='flex w-full xl:flex-col items-center justify-center gap-x-10 gap-y-10 px-4 md:px-40 xl:px-0 h-[80px] xl:h-max py-8 bg-white/10 backdrop-blur-sm text-3xl xl:text-xl xl:rounded-full'>
                    {navData.map((link) => {
                        return (
                            <Link
                                className={getLinkClassName(link.path)}
                                href={link.path}
                                key={link.id}
                                aria-label={link.ariaLabel}
                                aria-current={
                                    hash === link.path ? 'page' : undefined
                                }
                            >
                                {/* icon */}
                                <div>{link.icon}</div>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default Nav;
