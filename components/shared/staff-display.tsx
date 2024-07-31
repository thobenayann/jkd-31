import { associationConfig } from '@/constant/config';
import { cn } from '@/lib/utils';
import { StaffMember, StaffRoles } from '@/types/specific-types';
import ContactModal from './contact-button';

interface StaffDisplayProps {
    title: string;
    staff: StaffMember[];
    rolesToDisplay: StaffRoles[];
    className?: string;
}

export default function StaffDisplay({
    title,
    staff,
    rolesToDisplay,
    className,
}: StaffDisplayProps) {
    const adminEmail = associationConfig.email;
    // Fonction pour déterminer les rôles à afficher pour un membre
    const getMemberRolesToDisplay = (memberRoles: StaffRoles[]): string[] => {
        return memberRoles.filter((role) => rolesToDisplay.includes(role));
    };

    // Filtrer les membres qui ont au moins un rôle dans rolesToDisplay
    const members = staff.filter((member) =>
        member.role.some((role) => rolesToDisplay.includes(role))
    );
    return (
        <div className={cn('flex space-x-20', className)}>
            <h2 className='text-4xl md:text-6xl font-bold text-white'>
                {title}
            </h2>
            <ul className='flex flex-col space-y-4'>
                {members.map((member) => {
                    const rolesToShow = getMemberRolesToDisplay(member.role);
                    const isPresident =
                        rolesToShow.includes('Présidente') ||
                        rolesToShow.includes('Président');
                    return (
                        <li
                            key={member.name}
                            className='mb-2 flex flex-col space-y-2 border-separate border-b border-gray-700 pb-6'
                        >
                            <div className='flex justify-between items-center'>
                                <div>
                                    <strong className='text-white text-lg font-bold'>
                                        {member.name}
                                    </strong>
                                    <p className='text-gray-400'>
                                        {rolesToShow.join(', ')}
                                    </p>
                                </div>
                                {isPresident && (
                                    <div className='flex flex-col space-y-2 text-white text-sm'>
                                        <div className='flex items-center space-x-2'>
                                            <ContactModal
                                                object='email'
                                                email={adminEmail}
                                                iconSrc='/lottie/system-regular-59-email.json'
                                            />
                                        </div>

                                        <div className='flex items-center space-x-2'>
                                            <ContactModal
                                                object='phone'
                                                phone={'06 84 05 93 26'}
                                                iconSrc='/lottie/system-regular-58-call-phone.json'
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
