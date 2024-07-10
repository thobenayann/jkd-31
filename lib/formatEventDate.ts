import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format an array of event date strings into a readable string.
 *
 * This function takes an array of date strings, parses them into Date objects,
 * formats them according to the specified format and locale, and returns a
 * combined string of formatted dates. If more than one date is present, it
 * joins the dates with "et". If the dates are in the same month, it displays
 * them as a range within that month. The first letter of the month is capitalized,
 * and the year is omitted from the display.
 * Invalid dates are filtered out.
 *
 * @param {string[] | undefined} dates - An array of date strings to be formatted.
 * @returns {string} A formatted string of event dates.
 *
 * @example
 * // returns "10 Janvier"
 * formatEventDates(["2023-01-10"]);
 *
 * @example
 * // returns "10 - 11 Janvier"
 * formatEventDates(["2023-01-10", "2023-01-11"]);
 *
 * @example
 * // returns "10 Janvier et 11 Février"
 * formatEventDates(["2023-01-10", "2023-02-11"]);
 *
 * @example
 * // returns ""
 * formatEventDates([]);
 *
 * @example
 * // returns ""
 * formatEventDates(undefined);
 */
export const formatEventDates = (dates: string[] | undefined): string => {
    if (!dates || dates.length === 0) return '';

    const formattedDates = dates
        .map((date) => {
            const parsedDate = new Date(date);
            return isNaN(parsedDate.getTime()) ? '' : parsedDate;
        })
        .filter(Boolean) as Date[]; // Filtrer les dates invalides

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    switch (formattedDates.length) {
        case 0:
            return '';

        case 1:
            return capitalizeFirstLetter(
                format(formattedDates[0], 'd MMMM', { locale: fr })
            );

        case 2:
            const [firstDate, secondDate] = formattedDates;

            if (
                firstDate.getMonth() === secondDate.getMonth() &&
                firstDate.getFullYear() === secondDate.getFullYear()
            ) {
                const dayFormat = 'd';
                const monthFormat = 'MMMM';

                const firstDay = format(firstDate, dayFormat, { locale: fr });
                const secondDay = format(secondDate, dayFormat, { locale: fr });
                const month = capitalizeFirstLetter(
                    format(firstDate, monthFormat, { locale: fr })
                );

                return `${firstDay} - ${secondDay} ${month}`;
            } else {
                const fullFormat = 'd MMMM';
                const firstFormattedDate = capitalizeFirstLetter(
                    format(firstDate, fullFormat, { locale: fr })
                );
                const secondFormattedDate = capitalizeFirstLetter(
                    format(secondDate, fullFormat, { locale: fr })
                );

                return `${firstFormattedDate} et ${secondFormattedDate}`;
            }

        default:
            const fullFormat = 'd MMMM';
            const formattedDateStrings = formattedDates.map((date) =>
                capitalizeFirstLetter(format(date, fullFormat, { locale: fr }))
            );
            return formattedDateStrings.join(' et ');
    }
};
