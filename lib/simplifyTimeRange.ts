/**
 * Replaces the dash and spaces around it with a single space in the given time range.
 * But only if the time range is not just a dash.
 *
 * @param timeRange - The time range to simplify.
 * @returns The simplified time range.
 */
export function simplifyTimeRange(timeRange: string): string {
    // Si la chaîne est simplement un tiret "-", on la retourne telle quelle
    if (timeRange.trim() === '-') {
        return timeRange;
    }

    // Remplace le tiret et les espaces autour par un seul espace
    return timeRange.replace(/\s*-\s*/g, ' ');
}
