import Section from '@/components/shared/section';
import AssociationInfo from './_components/asso-info';
import ContactInfo from './_components/contact-info';
import CookiesInfo from './_components/cookies-info';
import LegalHeader from './_components/legal-header';
import PersonalData from './_components/personal-data';
import SiteInfo from './_components/site-info';

export default function Legal() {
    return (
        <div className='container mx-auto px-4 pt-10 md:py-32 space-y-4'>
            <Section>
                <LegalHeader />
            </Section>
            <Section>
                <AssociationInfo />
            </Section>
            <Section>
                <SiteInfo />
            </Section>
            <Section>
                <PersonalData />
            </Section>
            <Section>
                <CookiesInfo />
            </Section>
            <Section>
                <ContactInfo />
            </Section>
        </div>
    );
}
