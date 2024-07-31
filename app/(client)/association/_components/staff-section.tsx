import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import StaffDisplay from '@/components/shared/staff-display';
import { associationConfig } from '@/constant/config';
import { StaffMember } from '@/types/specific-types';

export default function StafSection() {
    const staff: StaffMember[] = associationConfig.staff;
    return (
        <div className='lg:mx-20 2xl:mx-80 pb-10 md:pb-28 mt-10 md:mt-24'>
            <div className='flex flex-col space-y-16 md:space-y-20 lg:mr-48'>
                <FadeInWrapper delay={0.2}>
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
                </FadeInWrapper>
                <FadeInWrapper delay={0.2} className='self-center'>
                    <StaffDisplay
                        rolesToDisplay={['Instructeur']}
                        staff={staff}
                        title={'Les instructeurs'}
                    />
                </FadeInWrapper>
                <FadeInWrapper delay={0.2} className='lg:self-end'>
                    <StaffDisplay
                        rolesToDisplay={['Assistant']}
                        staff={staff}
                        title={"L'assistant"}
                    />
                </FadeInWrapper>
            </div>
        </div>
    );
}
