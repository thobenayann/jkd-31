'use client';

import { Button } from '@/components/ui/button';
import { associationConfig } from '@/constant/config';
import { buildMapsLinks, formatVenueQuery } from '@/lib/maps-links';
import { track } from '@vercel/analytics';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type MapPlacement = 'directions' | 'place' | 'embed';

const PAGE = '/tarifs';

/**
 * Carte « Nous trouver ».
 *
 * Deux actions directes (itinéraire, fiche Google Maps) toujours disponibles :
 * ce sont de simples liens, ils n'établissent aucune connexion à Google tant
 * que le visiteur ne clique pas. La carte interactive est un iframe Google
 * Maps créé uniquement après un clic explicite, comme l'impose la gouvernance
 * RGPD du site (`docs/seo/governance/analytics-and-rgpd.md`, §6). Avant ce
 * clic, un aperçu local sert de repère visuel.
 */
export default function FindUsMap() {
    const [isEmbedLoaded, setIsEmbedLoaded] = useState(false);
    const { venue, googleMaps } = associationConfig;
    // Le nom du club, pas celui du gymnase : plusieurs associations y sont
    // référencées et Google renverrait la première venue.
    const place = { ...venue, name: associationConfig.name };
    const links = buildMapsLinks(place, { placeCid: googleMaps.cid });
    const venueLabel = formatVenueQuery(place);

    const reportClick = (placement: MapPlacement) => {
        track('map_click', { page: PAGE, placement });
    };

    return (
        <div className='flex flex-col w-full h-full gap-4 text-white'>
            <address className='not-italic flex items-start gap-2 text-sm md:text-base'>
                <MapPin
                    className='shrink-0 mt-0.5 stroke-jkdBlue'
                    size={20}
                    aria-hidden='true'
                />
                <span>
                    <strong className='block'>{associationConfig.name}</strong>
                    {venue.name}, {venue.streetAddress}, {venue.postalCode}{' '}
                    {venue.city}
                </span>
            </address>

            <div className='relative w-full aspect-[4/3] md:aspect-auto md:flex-1 md:min-h-72 overflow-hidden rounded-md shadow-md shadow-jkdBlue bg-gray-800'>
                {isEmbedLoaded ? (
                    <iframe
                        className='absolute inset-0 w-full h-full border-0'
                        src={links.embed}
                        title={`Carte Google Maps : ${venueLabel}`}
                        loading='lazy'
                        allowFullScreen
                        referrerPolicy='no-referrer-when-downgrade'
                    />
                ) : (
                    <>
                        <Image
                            src='/images/content/tarifs/map.png'
                            alt=''
                            fill
                            sizes='(max-width: 768px) 100vw, 50vw'
                            className='object-cover opacity-60'
                        />
                        <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center bg-gradient-to-t from-gray-900/80 to-gray-900/20'>
                            <Button
                                type='button'
                                variant='secondary'
                                size='lg'
                                onClick={() => {
                                    reportClick('embed');
                                    setIsEmbedLoaded(true);
                                }}
                            >
                                Afficher la carte interactive
                            </Button>
                            <p className='text-xs text-gray-300 max-w-xs'>
                                Charge une carte Google Maps. Une connexion à
                                Google est établie uniquement après ce clic.
                            </p>
                        </div>
                    </>
                )}
            </div>

            <div className='flex flex-col sm:flex-row gap-2'>
                <Button
                    asChild
                    size='lg'
                    className='w-full sm:flex-1 bg-jkdBlue hover:bg-jkdBlue/90 text-white'
                >
                    <a
                        href={links.directions}
                        target='_blank'
                        rel='noopener noreferrer'
                        onClick={() => reportClick('directions')}
                    >
                        <Navigation className='mr-2' size={18} aria-hidden='true' />
                        Itinéraire
                    </a>
                </Button>
                <Button
                    asChild
                    variant='outline'
                    size='lg'
                    className='w-full sm:flex-1'
                >
                    <a
                        href={links.place}
                        target='_blank'
                        rel='noopener noreferrer'
                        onClick={() => reportClick('place')}
                    >
                        <ExternalLink className='mr-2' size={18} aria-hidden='true' />
                        Ouvrir dans Google Maps
                    </a>
                </Button>
            </div>
        </div>
    );
}
