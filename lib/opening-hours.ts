/**
 * Horaires d'ouverture pour schema.org, dérivés de `data/courses.json`.
 *
 * Source unique : si le planning change dans le JSON, les données structurées
 * suivent. Les écrire en dur ici aurait créé une deuxième vérité, vouée à
 * diverger de la page tarifs.
 */

/** Jours utilisés par `data/courses.json`, dans l'ordre de la semaine. */
const DAYS = ['tuesday', 'wednesday', 'thursday'] as const;

type Day = (typeof DAYS)[number];

const SCHEMA_DAY: Record<Day, string> = {
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
};

export type CourseSchedule = Partial<Record<Day, string>>;
export type CourseWithSchedule = { schedule?: CourseSchedule };

export type OpeningHoursSpecification = {
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string;
    opens: string;
    closes: string;
};

/** `18h30` et `20h` deviennent `18:30` et `20:00`. */
const toIsoTime = (raw: string): string | null => {
    const match = raw.trim().match(/^(\d{1,2})\s*h\s*(\d{2})?$/i);
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2] ?? 0);
    if (hours > 23 || minutes > 59) return null;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/** `18h30 - 19h45` devient `['18:30', '19:45']`. `-` ne donne rien. */
const parseRange = (raw: string | undefined): [string, string] | null => {
    if (!raw) return null;
    const parts = raw.split('-').map((part) => part.trim());
    if (parts.length !== 2) return null;
    const opens = toIsoTime(parts[0]);
    const closes = toIsoTime(parts[1]);
    if (!opens || !closes || closes <= opens) return null;
    return [opens, closes];
};

/**
 * Une plage par jour, de la première ouverture à la dernière fermeture.
 *
 * Un créneau par cours donnerait des plages qui se chevauchent, ce que
 * `openingHoursSpecification` n'est pas censé décrire : la question à laquelle
 * il répond est « à quelle heure peut-on venir », pas « quel cours a lieu ».
 */
export const buildOpeningHours = (
    courses: CourseWithSchedule[]
): OpeningHoursSpecification[] =>
    DAYS.flatMap((day) => {
        const ranges = courses
            .map((course) => parseRange(course.schedule?.[day]))
            .filter((range): range is [string, string] => range !== null);

        if (ranges.length === 0) return [];

        const opens = ranges.reduce(
            (earliest, [start]) => (start < earliest ? start : earliest),
            ranges[0][0]
        );
        const closes = ranges.reduce(
            (latest, [, end]) => (end > latest ? end : latest),
            ranges[0][1]
        );

        return [
            {
                '@type': 'OpeningHoursSpecification' as const,
                dayOfWeek: SCHEMA_DAY[day],
                opens,
                closes,
            },
        ];
    });
