import type { Course } from '@/types/specific-types';
import { getCourseOrderIndex } from './courseOrderHelper';

/**
 * Résumé d'un cours pour la page d'accueil : le titre, le prix plein annuel
 * et un signal « tarif réduit possible ». Les détails (réductions, contenu,
 * horaires) restent sur la page tarifs, l'accueil ne fait que donner l'ordre
 * de grandeur et renvoyer vers elle.
 */
export interface PriceSummaryItem {
    title: string;
    subtitle?: string;
    price: number;
    hasReducedPrice: boolean;
}

export function buildPriceSummary(courses: Course[]): PriceSummaryItem[] {
    return [...courses]
        .sort((a, b) => {
            const diff =
                getCourseOrderIndex(a.title) - getCourseOrderIndex(b.title);
            return diff !== 0 ? diff : a.title.localeCompare(b.title, 'fr');
        })
        .map((course) => ({
            title: course.title,
            subtitle: course.subtitle,
            price: course.price.inscription,
            hasReducedPrice:
                course.price.reduced !== null ||
                course.price.fifth_year !== null,
        }));
}
