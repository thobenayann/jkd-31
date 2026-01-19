import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLetter';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { Clock } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ClockBadgeProps {
    date: string;
    time?: string;
    withDay: boolean;
}

/**
 * Détermine le type de format de temps
 * @param time - La chaîne de temps à analyser
 */
type TimeFormat = 'timeRange' | 'isoDate' | 'simpleTime' | 'unknown';

const getTimeFormat = (time: string): TimeFormat => {
    if (!time) return 'unknown';
    if (time.includes(' - ') && !time.includes('-2')) {
        return 'timeRange';
    } else if (time.includes('-') && time.length >= 10) {
        return 'isoDate';
    } else if (time && time.length > 0) {
        return 'simpleTime';
    }
    return 'unknown';
};

/**
 * Formate une date pour afficher le jour de la semaine
 * @param date - La date à formater
 */
const formatDayOfWeek = (date: Date): string => {
    if (isNaN(date.getTime())) return '';
    return capitalizeFirstLetter(format(date, 'EEEE', { locale: fr }));
};

/**
 * Formate une date pour afficher le jour et le mois
 * @param date - La date à formater
 */
const formatDayAndMonth = (date: Date): string => {
    if (isNaN(date.getTime())) return '';
    return format(date, 'd MMMM', { locale: fr });
};

/**
 * Formate une heure à partir d'une date ISO
 * @param isoDate - La date ISO à formater en heure
 */
const formatTimeFromIsoDate = (isoDate: string): string => {
    const timeDate = new Date(isoDate);
    if (isNaN(timeDate.getTime())) return isoDate;
    return format(timeDate, 'HH:mm', { locale: fr });
};

/**
 * Composant d'affichage d'un badge avec horloge pour les dates et heures d'événements
 */
function ClockBadge({ date, time = '', withDay }: ClockBadgeProps) {
    const parsedDate = new Date(date);
    const dayOfWeek = formatDayOfWeek(parsedDate);
    const dayAndMonth = formatDayAndMonth(parsedDate);
    const timeFormat = getTimeFormat(time);

    // Formatage de l'heure selon son format
    let formattedTime: string = '';
    switch (timeFormat) {
        case 'timeRange':
            formattedTime = time; // Garder la plage horaire telle quelle
            break;
        case 'isoDate':
            formattedTime = formatTimeFromIsoDate(time);
            break;
        case 'simpleTime':
        default:
            formattedTime = time;
    }

    // Déterminer si une heure est réellement présente
    const hasTime = (() => {
        if (timeFormat === 'unknown') return false;
        if (timeFormat === 'timeRange') return true;
        const trimmed = (formattedTime || '').trim();
        if (!trimmed) return false;
        // Ne pas afficher 00:00 (date seule)
        return trimmed !== '00:00';
    })();

    // Construction du texte à afficher selon le contexte
    let displayText: string;
    if (!withDay) {
        // Sans le jour: afficher l'heure si disponible, sinon la date
        displayText = hasTime ? formattedTime : `${dayAndMonth}`;
    } else {
        // Avec le jour, on construit l'affichage selon le format de l'heure
        switch (timeFormat) {
            case 'timeRange':
                displayText = `${dayOfWeek} - ${formattedTime}`;
                break;
            case 'isoDate':
                displayText = hasTime
                    ? `${dayOfWeek} ${dayAndMonth} à ${formattedTime}`
                    : `${dayOfWeek} ${dayAndMonth}`;
                break;
            case 'simpleTime':
                displayText = `${dayOfWeek} ${dayAndMonth}${hasTime ? ` de ${formattedTime}` : ''}`;
                break;
            default:
                displayText = `${dayOfWeek} ${dayAndMonth}`;
        }
    }

    return (
        <Badge className='flex items-center space-x-2 w-fit bg-blue-900 hover:bg-blue-800'>
            <Clock className='w-4 h-4 text-blue-300' />
            <span className='text-blue-300'>{displayText}</span>
        </Badge>
    );
}

export default ClockBadge;
