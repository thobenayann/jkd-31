import { associationConfig } from '@/constant/config';
import { Facebook, Instagram } from 'lucide-react';
import { TransitionLink } from './transition-link';

const Footer = () => {
    return (
        <footer className='flex flex-col p-4 pb-28 md:pb-4 w-full font-serif'>
            <p className='text-center text-gray-400 text-sm font-normal'>
                ©2024 - Association JKD Self Defense 31 à Muret (31600) - Salle
                Albert Camus - Tous droits réservés
            </p>
            <div className='grid w-full grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center'>
                {/* Colonne gauche (vide en desktop pour centrer le bloc central) */}
                <div className='hidden md:block' />

                {/* Bloc central aligné au centre */}
                <div className='flex items-center justify-center space-x-4'>
                    <div className='flex items-center space-x-1'>
                        <p className='text-sm font-normal text-gray-400'>
                            Réalisation{' '}
                        </p>
                        <a
                            className='text-[#00A2FF] text-sm hover:text-blue-600 block'
                            href='https://www.yanndevweb.com/'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Yann THOBENA
                        </a>
                    </div>
                    <span className='hidden md:inline-block h-4 w-px bg-white/20' />
                    <TransitionLink
                        href='/legal'
                        className='text-[#00A2FF] hover:text-blue-600 text-sm font-normal underline underline-offset-2'
                    >
                        Mentions Légales
                    </TransitionLink>
                </div>

                {/* Colonne droite: réseaux sociaux */}
                <div className='mt-3 md:mt-0 flex items-center justify-center md:justify-end gap-3'>
                    <a
                        href={associationConfig.socialMedia.facebook}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label='Nous suivre sur Facebook'
                        className='group relative inline-flex h-9 w-9 items-center justify-center rounded-full text-white bg-black/70 border border-white/10 hover:border-white/30 transition-transform duration-200 hover:scale-105'
                    >
                        <span className='pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300 bg-[conic-gradient(from_0deg,rgba(255,255,255,0.08),rgba(0,162,255,0.35),rgba(255,255,255,0.08))] blur-[2px]' />
                        <Facebook className='h-4 w-4 text-white' />
                    </a>
                    <a
                        href={associationConfig.socialMedia.instagram}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label='Nous suivre sur Instagram'
                        className='group relative inline-flex h-9 w-9 items-center justify-center rounded-full text-white bg-black/70 border border-white/10 hover:border-white/30 transition-transform duration-200 hover:scale-105'
                    >
                        <span className='pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300 bg-[conic-gradient(from_0deg,rgba(226,6,20,0.35),rgba(249,219,6,0.35),rgba(226,6,20,0.35))] blur-[2px]' />
                        <Instagram className='h-4 w-4 text-white' />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
