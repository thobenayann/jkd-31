import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import GradualSpacing from '@/components/ui/gradual-spacing';
import { associationConfig } from '@/constant/config';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ContactForm from './_components/contact-form';

const LordIcon = dynamic(() => import('@/components/shared/lord-icon'), {
    ssr: false,
});

const Contact = () => {
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
                    className='max-md:text-center font-cinzel text-white text-3xl'
                    text='Contactez nous'
                />
                <FadeInWrapper className='flex justify-center w-full'>
                    <p className='text-gray-400 font-normal text-center p-4 lg:px-60 xl:px-0 xl:w-1/3 z-10'>
                        N&apos;hésitez pas à nous écrire ou nous appeler, nous
                        accueillons de nouveaux élèves chaque année, quelque
                        soit leur expérience.
                    </p>
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
            <main className='w-full flex items-end md:mt-[300px]'>
                <section className='flex flex-col items-center w-full space-y-10 md:space-y-0'>
                    <a
                        href='https://www.facebook.com/jkd.jidao'
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label='Visitez notre page Facebook'
                    >
                        <div
                            className='flex flex-col items-center space-y-1 hover:opacity-80 border-2 hover:border-2 hover:border-jkdBlue hover:shadow-lg p-4 md:p-8 rounded-lg'
                            id='fb'
                        >
                            <h2 className='font-bold'>
                                Retrouvez nous sur Facebook
                            </h2>
                            <div className='w-[100px] h-[100px]'>
                                <LordIcon
                                    trigger='in'
                                    src={'/lottie/fb-animation.json'}
                                    style={{ width: '100px', height: '100px' }}
                                    colors='primary:#ffffff,secondary:#000000'
                                    target={'fb'}
                                />
                            </div>
                        </div>
                    </a>
                </section>
            </main>
        </section>
    );
};

export default Contact;
