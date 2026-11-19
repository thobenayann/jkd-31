'use client';

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Expand } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { EventOriginBadge } from './event-origin-badge';

type FeaturedEventImageProps = {
    src: string;
    alt: string;
    origin?: 'internal' | 'external';
};

export function FeaturedEventImage(props: FeaturedEventImageProps) {
    const { src, alt, origin } = props;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='flex flex-col items-center gap-3 w-full max-w-xl'>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button
                        type='button'
                        className='relative w-full outline-none group'
                        aria-label='Agrandir l’image de l’événement'
                    >
                        {/* L'affiche occupe toute sa colonne (plafonnée à
                            576 px) au lieu de garder sa petite taille
                            intrinsèque. width/height donnent le ratio 4:5 des
                            affiches pour réserver la place avant chargement. */}
                        <Image
                            src={src}
                            alt={alt}
                            width={1080}
                            height={1350}
                            sizes='(max-width: 768px) 100vw, 576px'
                            priority
                            className='w-full h-auto rounded-lg shadow-lg'
                        />

                        {/* Icône d’agrandissement */}
                        <span className='absolute bottom-3 right-3 rounded-full bg-black/60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                            <Expand className='h-4 w-4' />
                        </span>
                    </button>
                </DialogTrigger>
                <DialogContent className='p-0 bg-transparent border-0 shadow-none max-w-none w-auto'>
                    <DialogTitle className='sr-only'>{alt}</DialogTitle>
                    <div className='flex items-center justify-center'>
                        <Image
                            src={src}
                            alt={alt}
                            width={1600}
                            height={900}
                            sizes='(max-width: 1024px) 95vw, 1600px'
                            className='rounded-lg object-contain bg-black'
                            style={{
                                maxWidth: '95vw',
                                maxHeight: '90vh',
                                width: 'auto',
                                height: 'auto',
                            }}
                            priority
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Sous l'affiche plutôt que dessus, pour ne pas masquer son texte */}
            <EventOriginBadge origin={origin} />
        </div>
    );
}
