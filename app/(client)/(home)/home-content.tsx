import CardPersonality from '@/components/shared/card-personality';
import { Button } from '@/components/ui/button';
import personalities from '@/data/personalities-data.json';
import { findPersonalityByLastName } from '@/lib/findPersonalityByLastName';
import Image from 'next/image';
import Link from 'next/link';

export default function HomeContent() {
    if (!personalities) return null;

    const bruceLee = findPersonalityByLastName('Lee', personalities);
    return (
        <div className='pt-10 min-h-screen relative'>
            <Image
                src='/images/content/home/vector.svg'
                alt='Background Image'
                layout='fill'
                style={{ objectFit: 'contain' }}
                quality={100}
                className='-z-10 opacity-50 pt-20'
            />
            <section className='container flex justify-between'>
                <div className='flex flex-col space-y-6'>
                    <h2 className='text-6xl font-bold leading-none md:max-w-xl'>
                        Les acteurs du Jeet Kune Do
                    </h2>
                    <cite className='italic font-serif font-light text-lg text-gray-400'>
                        “La voie du poing qui intercepte.”
                    </cite>
                    <Button
                        asChild
                        className='bg-jkdBlue text-white w-fit hover:bg-jkdBlue/85'
                    >
                        <Link href='/27-styles'>
                            Les 27 styles qui ont influencé Bruce Lee
                        </Link>
                    </Button>
                </div>
                {/* First branch row */}
                <div>
                    {bruceLee ? (
                        <CardPersonality
                            firstName={bruceLee.firstName}
                            lastName={bruceLee.lastName}
                            title={bruceLee.title}
                            personalityPhotoUrl={bruceLee.imgUrl}
                            imageShape='round'
                        />
                    ) : null}
                </div>
            </section>
        </div>
    );
}
