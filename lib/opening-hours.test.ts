import coursesData from '@/data/courses.json';
import { describe, expect, it } from 'vitest';
import { buildOpeningHours, type CourseWithSchedule } from './opening-hours';

describe('buildOpeningHours', () => {
    it('agrège la première ouverture et la dernière fermeture du jour', () => {
        const courses: CourseWithSchedule[] = [
            { schedule: { tuesday: '20h - 22h' } },
            { schedule: { tuesday: '18h30 - 19h45' } },
            { schedule: { tuesday: '20h - 20h30' } },
        ];

        expect(buildOpeningHours(courses)).toEqual([
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Tuesday',
                opens: '18:30',
                closes: '22:00',
            },
        ]);
    });

    it('ignore les jours sans cours', () => {
        const courses: CourseWithSchedule[] = [
            { schedule: { tuesday: '-', wednesday: '20h - 22h' } },
        ];
        const result = buildOpeningHours(courses);

        expect(result).toHaveLength(1);
        expect(result[0].dayOfWeek).toBe('Wednesday');
    });

    it('ignore une plage illisible plutôt que de publier une heure fausse', () => {
        expect(
            buildOpeningHours([{ schedule: { tuesday: 'le soir' } }])
        ).toEqual([]);
        expect(buildOpeningHours([{ schedule: { tuesday: '25h - 26h' } }])).toEqual(
            []
        );
    });

    it('ignore une plage qui se termine avant de commencer', () => {
        expect(
            buildOpeningHours([{ schedule: { tuesday: '22h - 20h' } }])
        ).toEqual([]);
    });

    it('supporte un cours sans planning', () => {
        expect(buildOpeningHours([{}])).toEqual([]);
    });

    it('produit les horaires réels du club depuis courses.json', () => {
        expect(buildOpeningHours(coursesData)).toEqual([
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Tuesday',
                opens: '18:30',
                closes: '22:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Wednesday',
                opens: '18:30',
                closes: '22:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Thursday',
                opens: '19:00',
                closes: '22:00',
            },
        ]);
    });
});
