import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    hasUpcomingEvents,
    selectEventsByPeriod,
} from './selectEventsByPeriod.ts';

type TestEvent = {
    _id: string;
    eventDates?: string[];
    origin?: 'internal' | 'external';
};

const today = new Date('2026-08-23T00:00:00Z');

const event = (
    id: string,
    date: string,
    origin: 'internal' | 'external' = 'internal'
): TestEvent => ({ _id: id, eventDates: [date], origin });

// Volontairement dans le désordre pour vérifier que le tri ne dépend pas de l'entrée
const events: TestEvent[] = [
    event('past-2023', '2023-06-17'),
    event('future-2027', '2027-01-10', 'external'),
    event('past-2025-apr', '2025-04-05'),
    event('past-2026-mar', '2026-03-21'),
    event('future-2026-oct', '2026-10-03'),
    event('past-2024', '2024-11-09', 'external'),
    event('past-2025-dec', '2025-12-06'),
    event('future-2026-sep', '2026-09-12'),
];

describe('selectEventsByPeriod', () => {
    it('returns the 3 most recent past events, newest first', () => {
        const result = selectEventsByPeriod(events, {
            period: 'past',
            origin: 'all',
            today,
        });
        assert.deepEqual(
            result.map((e) => e._id),
            ['past-2026-mar', 'past-2025-dec', 'past-2025-apr']
        );
    });

    it('returns the 3 next upcoming events, soonest first', () => {
        const result = selectEventsByPeriod(events, {
            period: 'next',
            origin: 'all',
            today,
        });
        assert.deepEqual(
            result.map((e) => e._id),
            ['future-2026-sep', 'future-2026-oct', 'future-2027']
        );
    });

    it('applies the origin filter before taking the first 3', () => {
        const result = selectEventsByPeriod(events, {
            period: 'past',
            origin: 'external',
            today,
        });
        assert.deepEqual(
            result.map((e) => e._id),
            ['past-2024']
        );
    });

    it('ignores events without a valid date', () => {
        const result = selectEventsByPeriod(
            [{ _id: 'no-date' }, { _id: 'bad-date', eventDates: ['nope'] }],
            { period: 'past', origin: 'all', today }
        );
        assert.deepEqual(result, []);
    });

    it('counts an event starting today as upcoming', () => {
        const result = selectEventsByPeriod(
            [event('today', '2026-08-23')],
            { period: 'next', origin: 'all', today }
        );
        assert.deepEqual(
            result.map((e) => e._id),
            ['today']
        );
    });
});

describe('hasUpcomingEvents', () => {
    it('is true when at least one event starts today or later', () => {
        assert.equal(hasUpcomingEvents(events, today), true);
    });

    it('is false when every event is in the past', () => {
        const pastOnly = events.filter((e) => e._id.startsWith('past'));
        assert.equal(hasUpcomingEvents(pastOnly, today), false);
    });

    it('is false for an empty list', () => {
        assert.equal(hasUpcomingEvents([], today), false);
    });
});
