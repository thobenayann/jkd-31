'use client';

import CardPersonality from '@/components/shared/card-personality';
import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import { Button } from '@/components/ui/button';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import personalities from '@/data/personalities-data.json';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
    findPersonalitiesByLastNames,
    Personality,
} from '@/lib/findPersonalityByLastName';
import Image from 'next/image';
import Link from 'next/link';

export default function HomeContent() {
    const isDesktop = useMediaQuery('(min-width: 768px)');
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
        <div className='pt-10 pb-10 md:mb-36 relative'>
            <div className='absolute inset-0 top-52 flex justify-center items-center -z-10'>
                {isDesktop ? (
                    <Image
                        src='/images/content/home/vector.svg'
                        alt='Background Image'
                        width={1280}
                        height={1000}
                        style={{ objectFit: 'contain' }}
                        quality={100}
                        className='opacity-50'
                    />
                ) : (
                    <Image
                        src='/images/content/home/vector.svg'
                        alt='Background Image'
                        fill
                        style={{ objectFit: 'cover' }}
                        quality={100}
                        className='opacity-50'
                    />
                )}
            </div>
            <section className='container flex max-md:flex-col max-md:space-y-14 max-md:items-center justify-between pb-6 w-full'>
                <FadeInWrapper>
                    <div className='flex flex-col max-md:items-center space-y-6'>
                        <h2 className='text-4xl max-md:text-center md:text-6xl font-bold leading-none md:max-w-xl'>
                            Les acteurs du Jeet Kune Do
                        </h2>
                        <cite className='max-md:text-center'>
                            <TextGenerateEffect
                                words={`“La voie du poing qui intercepte”`}
                                wordsClassName='italic font-serif font-light max-md:text-center md:text-lg text-gray-400'
                            />
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
                </FadeInWrapper>
                {/* First branch row */}
                <FadeInWrapper delay={0.2}>
                    <div className='max-md:border-b-2 max-md:border-dashed max-md:w-full'>
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
                </FadeInWrapper>
            </section>
            <div className='flex flex-col max-md:space-y-14 space-y-4'>
                {/* Second branch row */}
                <FadeInWrapper delay={0.4}>
                    <section className='container flex max-md:flex-col max-md:items-center max-md:space-y-14 md:space-x-8 max-md:border-b-2 max-md:border-dashed w-full'>
                        {danTakyJames
                            ? danTakyJames.map((personality, index) => (
                                  <FadeInWrapper
                                      key={index}
                                      delay={0.2 * index}
                                  >
                                      <CardPersonality
                                          firstName={personality.firstName}
                                          lastName={personality.lastName}
                                          title={personality.title}
                                          flagUrl={personality.flagUrl}
                                          personalityPhotoUrl={
                                              personality.imgUrl
                                          }
                                          cardHeaderClass='items-center object-cover object-top'
                                          shortInfo={personality.shortInfo}
                                      />
                                  </FadeInWrapper>
                              ))
                            : null}
                    </section>
                </FadeInWrapper>
                {/* Third branch row */}
                <FadeInWrapper delay={0.6}>
                    <section className='container flex max-md:flex-col max-md:items-center md:space-x-8 max-md:border-b-2 max-md:border-dashed w-full'>
                        {delannoy
                            ? delannoy.map((personality, index) => (
                                  <FadeInWrapper
                                      key={index}
                                      delay={0.2 * index}
                                  >
                                      <CardPersonality
                                          firstName={personality.firstName}
                                          lastName={personality.lastName}
                                          title={personality.title}
                                          flagUrl={personality.flagUrl}
                                          personalityPhotoUrl={
                                              personality.imgUrl
                                          }
                                          cardHeaderClass='items-center object-cover object-top'
                                          shortInfo={personality.shortInfo}
                                      />
                                  </FadeInWrapper>
                              ))
                            : null}
                    </section>
                </FadeInWrapper>
                {/* Fourth branch row */}
                <FadeInWrapper delay={0.8}>
                    <section className='container flex max-md:flex-col max-md:items-center md:space-x-8 max-md:space-y-14'>
                        {instructors
                            ? instructors.map((personality, index) => (
                                  <FadeInWrapper
                                      key={index}
                                      delay={0.2 * index}
                                  >
                                      <CardPersonality
                                          firstName={personality.firstName}
                                          lastName={personality.lastName}
                                          title={personality.title}
                                          flagUrl={personality.flagUrl}
                                          personalityPhotoUrl={
                                              personality.imgUrl
                                          }
                                          cardHeaderClass='items-center object-cover object-top'
                                          shortInfo={personality.shortInfo}
                                      />
                                  </FadeInWrapper>
                              ))
                            : null}
                    </section>
                </FadeInWrapper>
            </div>
        </div>
    );
}
