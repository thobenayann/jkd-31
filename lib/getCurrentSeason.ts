/**
 * Returns the current season based on the current date.
 * The season is determined by the month of the year.
 *
 * @returns A string representing the current season in the format "saison YYYY-YYYY".
 */
export const getCurrentSeason = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-based, so January is 0, February is 1, etc.

    if (month >= 8) {
        // From September (8) to December (11)
        return `saison ${year}-${year + 1}`;
    } else {
        // From January (0) to August (7)
        return `saison ${year - 1}-${year}`;
    }
};
