import { describe, expect, it } from 'vitest';
import type { Course } from '@/types/specific-types';
import { buildPriceSummary } from './price-summary';

const course = (
    title: string,
    inscription: number,
    reduced: number | null = null,
    subtitle?: string
): Course => ({
    title,
    subtitle,
    price: { inscription, reduced, fifth_year: null },
    features: [],
    schedule: { tuesday: '-', wednesday: '-', thursday: '-' },
});

describe('buildPriceSummary', () => {
    it('reprend l’ordre de la page tarifs, pas celui du fichier', () => {
        const summary = buildPriceSummary([
            course('Cours ado', 225),
            course('JKD Boxing', 190),
            course('Jeet Kune Do', 350, 320),
        ]);
        expect(summary.map((c) => c.title)).toEqual([
            'Jeet Kune Do',
            'Cours ado',
            'JKD Boxing',
        ]);
    });

    it('expose le prix plein et signale l’existence d’un tarif réduit', () => {
        const [jkd, ado] = buildPriceSummary([
            course('Jeet Kune Do', 350, 320),
            course('Cours ado', 225, null, '13 - 15 ans'),
        ]);
        expect(jkd).toEqual({
            title: 'Jeet Kune Do',
            subtitle: undefined,
            price: 350,
            hasReducedPrice: true,
        });
        expect(ado).toEqual({
            title: 'Cours ado',
            subtitle: '13 - 15 ans',
            price: 225,
            hasReducedPrice: false,
        });
    });

    it('ne modifie pas le tableau d’entrée', () => {
        const input = [course('JKD Boxing', 190), course('Jeet Kune Do', 350)];
        buildPriceSummary(input);
        expect(input[0].title).toBe('JKD Boxing');
    });
});
