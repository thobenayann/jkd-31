import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import { TransitionLink } from '@/components/shared/transition-link';
import GradualSpacing from '@/components/ui/gradual-spacing';
import { associationConfig } from '@/constant/config';
import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import ContactForm from './_components/contact-form';
import SocialSection from './_components/social-section';

export default function Contact() {
    const email = associationConfig.email;
    return (
        <section className='min-h-screen md:h-full w-full flex flex-col items-center justify-between mb-10'>
            <header className='flex flex-col items-center mb-10 space-y-10 md:h-[600px] w-full pt-10 md:pt-28 relative'>
                <Image
                    src='/images/content/contact/kali.jpg'
                    alt='Background de contact'
                    priority
                    fill
                    className='max-md:hidden md:absolute inset-0 z-0 object-contain md:object-cover object-center lg:object-top brightness-50'
                />
                <GradualSpacing
                    as='h1'
                    className='max-md:text-center font-cinzel text-white text-3xl'
                    text='Contactez nous'
                />
                <FadeInWrapper className='flex flex-col items-center w-full z-10'>
                    <p className='text-gray-400 font-normal text-center p-4 lg:px-60 xl:px-0 xl:w-1/3'>
                        N&apos;hésitez pas à nous écrire ou nous appeler, nous
                        accueillons de nouveaux élèves chaque année, quelque
                        soit leur expérience.
                    </p>
                    <TransitionLink
                        href='/tarifs#nous-trouver'
                        className='group inline-flex items-center gap-1.5 text-sm text-white underline decoration-jkdBlueLight decoration-2 underline-offset-4 transition-colors hover:text-jkdBlueLight'
                    >
                        <MapPin className='h-4 w-4' aria-hidden='true' />
                        Plan d&apos;accès et itinéraire jusqu&apos;au gymnase
                        <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                    </TransitionLink>
                </FadeInWrapper>
                <Image
                    src='/images/content/contact/kali.jpg'
                    priority
                    alt='Background de contact'
                    width={600}
                    height={600}
                    className='md:hidden'
                />
                <ContactForm />
            </header>
            <main className='w-full flex items-end md:mt-[25rem]'>
                <SocialSection />
            </main>
        </section>
    );
}
