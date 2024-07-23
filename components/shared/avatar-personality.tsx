import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface AvatarPersonalityProps {
    personalityPhotoUrl?: string;
    firstName?: string;
    lastName?: string;
    title?: string;
}

function AvatarPersonality({
    personalityPhotoUrl = '',
    firstName = 'N/A',
    lastName = 'N/A',
    title = 'Unknown Title',
}: AvatarPersonalityProps) {
    return (
        <div className='flex items-center mt-4'>
            <Avatar>
                {personalityPhotoUrl ? (
                    <AvatarImage
                        src={personalityPhotoUrl}
                        alt={`${firstName} ${lastName}`}
                    />
                ) : (
                    <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
                )}
            </Avatar>
            <div className='ml-4'>
                <p className='font-bold text-white'>{`${firstName} ${lastName}`}</p>
                <p className='text-gray-400'>{title}</p>
            </div>
        </div>
    );
}

export default AvatarPersonality;
