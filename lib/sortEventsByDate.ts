import { Evenement } from '@/sanity.types';

/**
 * Sorts an array of events by date.
 *
 * @param events - The array of events to be sorted.
 * @returns The sorted array of events.
 */
export const sortEventsByDate = (events: Evenement[]): Evenement[] => {
    return events.slice().sort((a, b) => {
        const aDate = new Date(a.eventDates?.[0] || '').getTime();
        const bDate = new Date(b.eventDates?.[0] || '').getTime();
        return aDate - bDate;
    });
};
