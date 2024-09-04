import CardPersonality from '@/components/shared/card-personality';
import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import { TransitionLink } from '@/components/shared/transition-link';
import { Button } from '@/components/ui/button';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import personalities from '@/data/personalities-data.json';
import {
    findPersonalitiesByLastNames,
    PersonalityType,
} from '@/lib/findPersonalityByLastName';
import { motion, useAnimation, useScroll } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import WordCloud from './word-cloud';

interface HomeContentStaticProps {
    setActivePersonality: (personality: PersonalityType | null) => void;
    isDesktop: boolean;
}

export default function HomeContentStatic({
    setActivePersonality,
    isDesktop,
}: HomeContentStaticProps) {
    const bruceLee: PersonalityType[] = findPersonalitiesByLastNames(
        ['Lee'],
        personalities
    );
    const danTakyJames: PersonalityType[] = findPersonalitiesByLastNames(
        ['Inosanto', 'Kimura', 'Yimm lee'],
        personalities
    );
    const delannoy: PersonalityType[] = findPersonalitiesByLastNames(
        ['Delannoy'],
        personalities
    );
    const instructors: PersonalityType[] = findPersonalitiesByLastNames(
        ['Masson', 'Faugere', 'Bertolino', 'Grandclaudon'],
        personalities
    );

    // Détecter le scroll et afficher le bouton fixe en bas
    const controls = useAnimation(); // Animation control from Framer Motion
    const { scrollYProgress } = useScroll(); // Hook to track the scroll progress
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        // This will trigger the animation when the component is fully mounted
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            if (latest > 0.15) {
                setShowButton(true); // Show button if scrolling down 15%
            } else {
                setShowButton(false); // Hide button if scrolling up
            }
        });

        // Cleanup the scroll listener when the component unmounts
        return () => unsubscribe();
    }, [scrollYProgress]);

    useEffect(() => {
        // Handle animation once the button's visibility changes
        if (showButton) {
            controls.start({ opacity: 1, y: 0 });
        } else {
            controls.start({ opacity: 0, y: 50 });
        }
    }, [showButton, controls]);

    return (
        <div className='pt-10 pb-10 md:mb-36 relative'>
            <div className='absolute inset-0 top-52 flex justify-center items-center -z-10'>
                {isDesktop ? (
                    <Image
                        src='/images/content/home/tree.svg'
                        alt='Background Image'
                        width={1280}
                        height={1000}
                        style={{ objectFit: 'contain' }}
                        quality={100}
                        className='opacity-50'
                    />
                ) : (
                    <Image
                        src='/images/content/home/tree.svg'
                        alt='Background Image'
                        fill
                        style={{ objectFit: 'cover' }}
                        quality={100}
                        className='opacity-50'
                    />
                )}
            </div>
            <div className='absolute left-0 top-0 h-full w-1/6 flex justify-center items-center max-2xl:hidden overflow-hidden'>
                <WordCloud />
            </div>
            <div className='absolute right-0 top-0 h-full w-1/6 flex justify-center items-center max-2xl:hidden overflow-hidden'>
                <WordCloud />
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
                            <TransitionLink href='/27-styles'>
                                Les 27 styles qui ont influencé Bruce Lee
                            </TransitionLink>
                        </Button>
                    </div>
                </FadeInWrapper>
                <FadeInWrapper delay={0.2}>
                    <div className='max-md:border-b-2 max-md:border-dashed max-md:w-full'>
                        {bruceLee && (
                            <CardPersonality
                                firstName={bruceLee[0].firstName}
                                lastName={bruceLee[0].lastName}
                                title={bruceLee[0].title}
                                personalityPhotoUrl={bruceLee[0].imgUrl}
                                imageShape='round'
                                cardHeaderClass='items-end'
                                withMoreInfo={bruceLee[0].withMoreInfo}
                                onMoreInfoClick={() =>
                                    setActivePersonality(bruceLee[0])
                                }
                            />
                        )}
                    </div>
                </FadeInWrapper>
            </section>
            <div className='flex flex-col max-md:space-y-14 space-y-4'>
                <FadeInWrapper delay={0.4}>
                    <section className='container flex max-md:flex-col max-md:items-center max-md:space-y-14 md:space-x-8 max-md:border-b-2 max-md:border-dashed w-full'>
                        {danTakyJames.map((personality, index) => (
                            <FadeInWrapper key={index} delay={0.2 * index}>
                                <CardPersonality
                                    firstName={personality.firstName}
                                    lastName={personality.lastName}
                                    title={personality.title}
                                    flagUrl={personality.flagUrl}
                                    personalityPhotoUrl={personality.imgUrl}
                                    cardHeaderClass='items-center object-cover object-top'
                                    shortInfo={personality.shortInfo}
                                    withMoreInfo={personality.withMoreInfo}
                                    onMoreInfoClick={() =>
                                        setActivePersonality(personality)
                                    }
                                />
                            </FadeInWrapper>
                        ))}
                    </section>
                </FadeInWrapper>
                <FadeInWrapper delay={0.6}>
                    <section className='container flex max-md:flex-col max-md:items-center md:space-x-8 max-md:border-b-2 max-md:border-dashed w-full'>
                        {delannoy.map((personality, index) => (
                            <FadeInWrapper key={index} delay={0.2 * index}>
                                <CardPersonality
                                    firstName={personality.firstName}
                                    lastName={personality.lastName}
                                    title={personality.title}
                                    flagUrl={personality.flagUrl}
                                    personalityPhotoUrl={personality.imgUrl}
                                    cardHeaderClass='items-center object-cover object-top'
                                    shortInfo={personality.shortInfo}
                                    withMoreInfo={personality.withMoreInfo}
                                    onMoreInfoClick={() =>
                                        setActivePersonality(personality)
                                    }
                                />
                            </FadeInWrapper>
                        ))}
                    </section>
                </FadeInWrapper>
                <FadeInWrapper delay={0.8}>
                    <section className='container flex max-md:flex-col max-md:items-center md:space-x-8 max-md:space-y-14'>
                        {instructors.map((personality, index) => (
                            <FadeInWrapper key={index} delay={0.2 * index}>
                                <CardPersonality
                                    firstName={personality.firstName}
                                    lastName={personality.lastName}
                                    title={personality.title}
                                    flagUrl={personality.flagUrl}
                                    personalityPhotoUrl={personality.imgUrl}
                                    cardHeaderClass='items-center object-cover object-top'
                                    shortInfo={personality.shortInfo}
                                    withMoreInfo={personality.withMoreInfo}
                                    onMoreInfoClick={() =>
                                        setActivePersonality(personality)
                                    }
                                />
                            </FadeInWrapper>
                        ))}
                    </section>
                </FadeInWrapper>
            </div>
            {/* Bouton fixe en bas de la page */}
            {showButton && (
                <motion.div
                    className='fixed bottom-24 md:bottom-4 right-4 z-50'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Button className='bg-jkdBlue text-white w-fit hover:bg-jkdBlue/85'>
                        <TransitionLink href='/association#demo'>
                            Notre démo
                        </TransitionLink>
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
