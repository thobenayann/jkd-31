'use client';

import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    EventOriginFilter,
    EventPeriod,
    selectEventsByPeriod,
} from '@/lib/selectEventsByPeriod';
import { Evenement } from '@/sanity.types';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import NextEventCard from './next-event-card';

interface ClientEventFilterProps {
    events: Evenement[];
    /**
     * Période sélectionnée au chargement. Le serveur la calcule : "past" s'il
     * n'y a aucun événement à venir en dehors de celui mis en avant.
     */
    defaultPeriod?: EventPeriod;
}

const SECTION_TITLE: Record<EventPeriod, string> = {
    next: 'Nos autres événements à venir',
    past: 'Nos derniers événements',
};

const EMPTY_MESSAGE: Record<EventPeriod, string> = {
    next: "Nous n'avons pas encore publié d'événements à venir.",
    past: "Aucun événement passé ne correspond à ce filtre.",
};

const ClientEventFilter: React.FC<ClientEventFilterProps> = ({
    events,
    defaultPeriod = 'next',
}) => {
    const [period, setPeriod] = useState<EventPeriod>(defaultPeriod);
    const [originFilter, setOriginFilter] = useState<EventOriginFilter>('all');
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    // Liste dérivée de l'état, donc disponible dès le rendu serveur
    const filteredEvents = useMemo(
        () => selectEventsByPeriod(events, { period, origin: originFilter }),
        [events, period, originFilter]
    );

    // Skeleton uniquement lors d'un changement de filtre, pas au chargement initial
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 100);
        return () => clearTimeout(timer);
    }, [period, originFilter]);

    return (
        <FadeInWrapper delay={0.2}>
            <div className='flex flex-col gap-4 items-center justify-center mt-16 max-md:py-8 w-full'>
                <h2 className='text-2xl font-bold text-white text-center px-10'>
                    {SECTION_TITLE[period]}
                </h2>
                <div className='flex justify-center px-6 w-full gap-3'>
                    <Select
                        value={period}
                        onValueChange={(value) =>
                            setPeriod(value as EventPeriod)
                        }
                    >
                        <SelectTrigger className='w-full md:w-fit space-x-2'>
                            <SelectValue placeholder='Sélectionner les événements' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Période</SelectLabel>
                                <SelectItem value='next'>
                                    3 prochains événements
                                </SelectItem>
                                <SelectItem value='past'>
                                    3 derniers événements
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select
                        value={originFilter}
                        onValueChange={(value) =>
                            setOriginFilter(value as EventOriginFilter)
                        }
                    >
                        <SelectTrigger className='w-full md:w-fit space-x-2'>
                            <SelectValue placeholder="Origine de l'événement" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Origine</SelectLabel>
                                <SelectItem value='all'>Tous</SelectItem>
                                <SelectItem value='internal'>
                                    Interne
                                </SelectItem>
                                <SelectItem value='external'>
                                    Externe
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <NextEventCard
                events={filteredEvents}
                isLoading={isLoading}
                emptyMessage={EMPTY_MESSAGE[period]}
            />
        </FadeInWrapper>
    );
};

export default ClientEventFilter;
