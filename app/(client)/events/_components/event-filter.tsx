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
    const [filteredEvents, setFilteredEvents] = useState<Evenement[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const today = new Date();
        if (selectedOption === 'next') {
            const nextEvents = events
                .filter(
                    (event) => new Date(event.eventDates?.[0] || '') >= today
                )
                .slice(0, 3);
            setFilteredEvents(nextEvents);
        } else {
            const pastEvents = events
                .filter(
                    (event) => new Date(event.eventDates?.[0] || '') < today
                )
                .slice(-3);
            setFilteredEvents(pastEvents);
        }
        // Simuler un délai de chargement
        setTimeout(() => setIsLoading(false), 100);
    }, [selectedOption, events]);

    const handleSelectChange = (value: string) => {
        setSelectedOption(value);
    };

    return (
        <FadeInWrapper delay={0.2}>
            <div className='flex flex-col space-y-4 items-center justify-center mt-16 max-md:py-8 w-full'>
                <h2 className='text-2xl font-bold text-white text-center px-10'>
                    Nos autres événements à venir
                </h2>
                <div className='flex justify-center px-6 w-full'>
                    <Select
                        value={selectedOption}
                        onValueChange={handleSelectChange}
                    >
                        <SelectTrigger className='w-full md:w-fit space-x-2'>
                            <SelectValue placeholder='Sélectionner les événements' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Options</SelectLabel>
                                <SelectItem value='next'>
                                    3 prochains événements
                                </SelectItem>
                                <SelectItem value='past'>
                                    3 derniers événements
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
