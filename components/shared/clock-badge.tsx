import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLetter';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ClockBadgeProps {
    date: string;
    time: string;
    withDay: boolean;
}

function ClockBadge({ date, time, withDay }: ClockBadgeProps) {
    const parsedDate = new Date(date);
    const formattedDate = isNaN(parsedDate.getTime())
        ? ''
        : format(parsedDate, 'EEEE', { locale: fr });

    return (
        <Badge className='flex items-center space-x-2 w-fit bg-blue-900 hover:bg-blue-800'>
            <Clock className='w-4 h-4 text-blue-300' />
            {withDay ? (
                <span className='text-blue-300'>{`${capitalizeFirstLetter(
                    formattedDate
                )} - ${time}`}</span>
            ) : (
                <span className='text-blue-300'>{`${time}`}</span>
            )}
        </Badge>
    );
}

export default ClockBadge;
