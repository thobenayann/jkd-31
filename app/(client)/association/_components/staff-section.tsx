import StaffDisplay from '@/components/shared/staff-display';
import { associationConfig } from '@/constant/config';
import { StaffMember } from '@/types/specific-types';

export default function StafSection() {
    const staff: StaffMember[] = associationConfig.staff;
    return (
        <div className='lg:mx-20 2xl:mx-80 pb-10 md:pb-28 mt-24'>
            <StaffDisplay
                rolesToDisplay={[
                    'Présidente',
                    'Trésorier',
                    'Secrétaire',
                    'Responsable communication',
                    'Responsable technique',
                ]}
                staff={staff}
                title={'Le staff'}
            />
        </div>
    );
}
