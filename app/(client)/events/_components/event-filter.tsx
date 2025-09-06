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
import { Evenement } from '@/sanity.types';
import * as React from 'react';
import { useEffect, useState } from 'react';
import NextEventCard from './next-event-card';

interface ClientEventFilterProps {
    events: Evenement[];
}

const ClientEventFilter: React.FC<ClientEventFilterProps> = ({ events }) => {
    const [selectedOption, setSelectedOption] = useState('next');
    const [originFilter, setOriginFilter] = useState<
        'all' | 'internal' | 'external'
    >('all');
    const [filteredEvents, setFilteredEvents] = useState<Evenement[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const today = new Date();
        const byOrigin = (evts: Evenement[]) =>
            originFilter === 'all'
                ? evts
                : evts.filter((e: any) => e.origin === originFilter);

        if (selectedOption === 'next') {
            const nextEvents = byOrigin(
                events.filter(
                    (event) => new Date(event.eventDates?.[0] || '') >= today
                )
            ).slice(0, 3);
            setFilteredEvents(nextEvents);
        } else {
            const pastEvents = byOrigin(
                events.filter(
                    (event) => new Date(event.eventDates?.[0] || '') < today
                )
            ).slice(0, 3);
            setFilteredEvents(pastEvents);
        }
        // Simuler un délai de chargement
        setTimeout(() => setIsLoading(false), 100);
    }, [selectedOption, originFilter, events]);

    const handleSelectChange = (value: string) => {
        setSelectedOption(value);
    };
    const handleOriginChange = (value: 'all' | 'internal' | 'external') => {
        setOriginFilter(value);
    };

    return (
        <FadeInWrapper delay={0.2}>
            <div className='flex flex-col gap-4 items-center justify-center mt-16 max-md:py-8 w-full'>
                <h2 className='text-2xl font-bold text-white text-center px-10'>
                    Nos autres événements à venir
                </h2>
                <div className='flex justify-center px-6 w-full gap-3'>
                    <Select
                        value={selectedOption}
                        onValueChange={handleSelectChange}
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
                        onValueChange={(v) => handleOriginChange(v as any)}
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
            <NextEventCard events={filteredEvents} isLoading={isLoading} />
        </FadeInWrapper>
    );
};

export default ClientEventFilter;
