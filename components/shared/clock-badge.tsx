import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ClockBadgeProps {
    date: string;
    time: string;
}

function ClockBadge({ date, time }: ClockBadgeProps) {
    const parsedDate = new Date(date);
    const formattedDate = isNaN(parsedDate.getTime())
        ? ''
        : format(parsedDate, 'EEEE', { locale: fr });

    return (
        <Badge className='flex items-center space-x-2 w-fit bg-blue-900 hover:bg-blue-800'>
            <Clock className='w-4 h-4 text-blue-300' />
            <span className='text-blue-300'>{`${formattedDate} - ${time}`}</span>
        </Badge>
    );
}

export default ClockBadge;
