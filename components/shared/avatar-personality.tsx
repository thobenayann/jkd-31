import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface AvatarPersonalityProps {
    personalityPhotoUrl?: string;
    firstName?: string;
    lastName?: string;
    title?: string;
    avatarClassName?: string;
}

/**
 * Intervenant d'un événement.
 *
 * Ne rend rien tant qu'aucun nom n'est connu. Les valeurs de substitution
 * précédentes (`N/A`, `Unknown Title`) s'affichaient telles quelles sur les
 * événements sans personnalité saisie dans le Studio. Même règle que pour les
 * données structurées : un champ inconnu est omis, jamais remplacé.
 */
function AvatarPersonality({
    personalityPhotoUrl = '',
    firstName = '',
    lastName = '',
    title = '',
    avatarClassName = '',
}: AvatarPersonalityProps) {
    const fullName = [firstName.trim(), lastName.trim()]
        .filter(Boolean)
        .join(' ');

    if (!fullName) return null;

    return (
        <div className='flex items-center mt-4'>
            <Avatar className={avatarClassName}>
                {personalityPhotoUrl ? (
                    <AvatarImage src={personalityPhotoUrl} alt={fullName} />
                ) : (
                    <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
                )}
            </Avatar>
            <div className='ml-4'>
                <p className='font-bold text-white'>{fullName}</p>
                {title.trim() ? (
                    <p className='text-gray-400'>{title}</p>
                ) : null}
            </div>
        </div>
    );
}

export default AvatarPersonality;
