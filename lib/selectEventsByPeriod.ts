/**
 * Sélection des événements affichés sous l'événement mis en avant.
 *
 * Logique métier pure, sans dépendance React ni Sanity, pour rester testable.
 * Le composant client ne fait que relier l'état des <Select> à cette fonction.
 */

export type EventPeriod = 'next' | 'past';
export type EventOriginFilter = 'all' | 'internal' | 'external';

/** Sous-ensemble minimal d'un `Evenement` Sanity nécessaire à la sélection. */
export type SelectableEvent = {
    eventDates?: string[];
    origin?: 'internal' | 'external';
};

export type SelectEventsOptions = {
    period: EventPeriod;
    origin: EventOriginFilter;
    /** Injectable pour les tests. Par défaut : maintenant. */
    today?: Date;
    /** Nombre maximum d'événements retournés. Par défaut : 3. */
    limit?: number;
};

const DEFAULT_LIMIT = 3;

/** Timestamp de la première date de l'événement, ou `null` si absente/invalide. */
const startTimestamp = (event: SelectableEvent): number | null => {
    const raw = event.eventDates?.[0];
    if (!raw) return null;
    const time = new Date(raw).getTime();
    return Number.isNaN(time) ? null : time;
};

const isUpcoming = (event: SelectableEvent, today: Date): boolean => {
    const time = startTimestamp(event);
    return time !== null && time >= today.getTime();
};

/**
 * Retourne les `limit` événements de la période demandée.
 *
 * - `next` : événements à venir, du plus proche au plus lointain.
 * - `past` : événements passés, du plus récent au plus ancien.
 *
 * Le filtre d'origine s'applique avant la troncature, pour que "3 derniers
 * événements externes" renvoie bien 3 événements externes si disponibles.
 */
export const selectEventsByPeriod = <T extends SelectableEvent>(
    events: T[],
    { period, origin, today = new Date(), limit = DEFAULT_LIMIT }: SelectEventsOptions
): T[] => {
    const now = today.getTime();

    const inPeriod = (event: T): boolean => {
        const time = startTimestamp(event);
        if (time === null) return false;
        return period === 'next' ? time >= now : time < now;
    };

    const inOrigin = (event: T): boolean =>
        origin === 'all' || event.origin === origin;

    // Croissant pour "à venir" (le plus proche d'abord),
    // décroissant pour "passés" (le plus récent d'abord).
    const direction = period === 'next' ? 1 : -1;

    return events
        .filter((event) => inPeriod(event) && inOrigin(event))
        .sort(
            (a, b) =>
                ((startTimestamp(a) as number) -
                    (startTimestamp(b) as number)) *
                direction
        )
        .slice(0, limit);
};

/** Vrai s'il existe au moins un événement qui commence aujourd'hui ou plus tard. */
export const hasUpcomingEvents = (
    events: SelectableEvent[],
    today: Date = new Date()
): boolean => events.some((event) => isUpcoming(event, today));
