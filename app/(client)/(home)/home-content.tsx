import CardPersonality from '@/components/shared/card-personality';
import { Button } from '@/components/ui/button';
import personalities from '@/data/personalities-data.json';
import {
    findPersonalitiesByLastNames,
    Personality,
} from '@/lib/findPersonalityByLastName';
import Image from 'next/image';
import Link from 'next/link';

export default function HomeContent() {
    if (!personalities) return null;

    const bruceLee: Personality[] = findPersonalitiesByLastNames(
        ['Lee'],
        personalities
    );
    const danTakyJames: Personality[] = findPersonalitiesByLastNames(
        ['Inosanto', 'Kimura', 'Yimm lee'],
        personalities
    );
    const delannoy: Personality[] = findPersonalitiesByLastNames(
        ['Delannoy'],
        personalities
    );
    const instructors: Personality[] = findPersonalitiesByLastNames(
        ['Masson', 'Faugere', 'Bertolino', 'Grandclaudon'],
        personalities
    );

    return (
        <div className='pt-10 pb-36 min-h-screen relative'>
            <div className='absolute inset-0 top-32 flex justify-center items-center'>
                <Image
                    src='/images/content/home/vector.svg'
                    alt='Background Image'
                    width={1380}
                    height={1000}
                    style={{ objectFit: 'contain' }}
                    quality={100}
                    className='-z-10 opacity-50'
                />
            </div>
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
                            firstName={bruceLee[0].firstName}
                            lastName={bruceLee[0].lastName}
                            title={bruceLee[0].title}
                            personalityPhotoUrl={bruceLee[0].imgUrl}
                            imageShape='round'
                            cardHeaderClass='items-end'
                        />
                    ) : null}
                </div>
            </section>
            <div className='flex flex-col space-y-4'>
                {/* Second branch row */}
                <section className='container flex space-x-8'>
                    {danTakyJames
                        ? danTakyJames.map((personality, index) => (
                              <CardPersonality
                                  key={index}
                                  firstName={personality.firstName}
                                  lastName={personality.lastName}
                                  title={personality.title}
                                  flagUrl={personality.flagUrl}
                                  personalityPhotoUrl={personality.imgUrl}
                                  cardHeaderClass='items-center object-cover object-top'
                                  shortInfo={personality.shortInfo}
                              />
                          ))
                        : null}
                </section>
                {/* Third branch row */}
                <section className='container flex space-x-8'>
                    {delannoy
                        ? delannoy.map((personality, index) => (
                              <CardPersonality
                                  key={index}
                                  firstName={personality.firstName}
                                  lastName={personality.lastName}
                                  title={personality.title}
                                  flagUrl={personality.flagUrl}
                                  personalityPhotoUrl={personality.imgUrl}
                                  cardHeaderClass='items-center object-cover object-top'
                                  shortInfo={personality.shortInfo}
                              />
                          ))
                        : null}
                </section>
                {/* Fourth branch row */}
                <section className='container flex space-x-8'>
                    {instructors
                        ? instructors.map((personality, index) => (
                              <CardPersonality
                                  key={index}
                                  firstName={personality.firstName}
                                  lastName={personality.lastName}
                                  title={personality.title}
                                  flagUrl={personality.flagUrl}
                                  personalityPhotoUrl={personality.imgUrl}
                                  cardHeaderClass='items-center object-cover object-top'
                                  shortInfo={personality.shortInfo}
                              />
                          ))
                        : null}
                </section>
            </div>
        </div>
    );
}
