'use client';

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
    useEffect(() => {
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
    }, [selectedOption, events]);

    return (
        <div>
            <div className='flex justify-center mt-8'>
                <Select
                    value={selectedOption}
                    onValueChange={setSelectedOption}
                >
                    <SelectTrigger className='w-fit space-x-2'>
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
            <NextEventCard events={filteredEvents} />
        </div>
    );
};

export default ClientEventFilter;
