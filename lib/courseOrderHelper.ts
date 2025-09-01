// Helpers & ordre de tri configurable
export function normalizeTitle(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[-_]/g, ' ')
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function getCourseOrderIndex(title: string): number {
    const normalized = normalizeTitle(title);
    const key = TITLE_ALIASES[normalized] ?? normalized.replace(/\s+/g, '-');
    const index = DESIRED_ORDER.indexOf(key);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

export const DESIRED_ORDER: string[] = [
    'jeet-kune-do',
    'self-defense-feminine',
    'cours-ado',
    'jkd-boxing',
    'jkd-conditioning',
];

export const TITLE_ALIASES: Record<string, string> = {
    'jeet kune do': 'jeet-kune-do',
    'self-defense feminine': 'self-defense-feminine',
    'self defense feminine': 'self-defense-feminine',
    'cours ado': 'cours-ado',
    'jkd boxing': 'jkd-boxing',
    'jkd boxin': 'jkd-boxing',
    'jkd conditioning': 'jkd-conditioning',
    'jkd conditionning': 'jkd-conditioning',
};
