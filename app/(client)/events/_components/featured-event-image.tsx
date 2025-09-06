'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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

    const isExternal = origin === 'external';

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    type='button'
                    className='relative outline-none group'
                    aria-label='Agrandir l’image de l’événement'
                >
                    <Image
                        src={src}
                        alt={alt}
                        width={350}
                        height={200}
                        priority
                        className='rounded-lg shadow-lg'
                        style={{ width: 'auto', height: 'auto' }}
                    />

                    {/* Badge origine */}
                    <EventOriginBadge
                        origin={origin}
                        className='absolute top-3 right-3'
                    />

                    {/* Icône d’agrandissement */}
                    <span className='absolute bottom-3 right-3 rounded-full bg-black/60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                        <Expand className='h-4 w-4' />
                    </span>
                </button>
            </DialogTrigger>
            <DialogContent className='max-w-[90vw] md:max-w-4xl p-0 bg-transparent border-0 shadow-none'>
                <div className='relative w-[90vw] md:w-[800px] aspect-video'>
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes='(max-width: 768px) 90vw, 800px'
                        className='rounded-lg object-contain bg-black'
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
