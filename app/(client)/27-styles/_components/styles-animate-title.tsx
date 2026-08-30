'use client';

import GradualSpacing from '@/components/ui/gradual-spacing';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useState } from 'react';

export default function StylesAnimateTitle() {
    const [isFirstAnimationComplete, setIsFirstAnimationComplete] =
        useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <header className='flex flex-col items-center max-md:mb-4 md:h-36'>
            {/*
                Le titre est découpé en deux ou quatre fragments animés selon la
                largeur d'écran. Un seul `h1` les enveloppe : son nom accessible
                est la concaténation des fragments, et la page garde un titre
                unique. Le `h1` reprend la mise en page du `header` pour que rien
                ne bouge à l'écran.
            */}
            <h1 className='flex flex-col items-center'>
                {isDesktop ? (
                    <>
                        <GradualSpacing
                            className='max-md:text-center font-cinzel text-white md:text-4xl'
                            text='Les 27 styles qui ont influencés'
                        />
                        <GradualSpacing
                            className='max-md:text-center font-cinzel text-white md:text-4xl'
                            text='Bruce LEE pour le Jeet Kune Do'
                            onAnimationComplete={() =>
                                setIsFirstAnimationComplete(true)
                            }
                        />
                    </>
                ) : (
                    <>
                        <GradualSpacing
                            className='max-md:text-center font-cinzel text-white text-3xl'
                            text='Les 27 styles'
                        />
                        <GradualSpacing
                            className='max-md:text-center font-cinzel text-white text-3xl'
                            text='qui ont influencés'
                        />
                        <GradualSpacing
                            className='max-md:text-center font-cinzel text-white text-3xl'
                            text='Bruce LEE pour'
                        />
                        <GradualSpacing
                            className='max-md:text-center font-cinzel text-white text-3xl'
                            text='le Jeet Kune Do'
                            onAnimationComplete={() =>
                                setIsFirstAnimationComplete(true)
                            }
                        />
                    </>
                )}
            </h1>

            <div className='h-14'>
                {isFirstAnimationComplete && (
                    <TextGenerateEffect
                        words={`selon Paul VUNAK`}
                        wordsClassName='italic font-serif font-light max-md:text-center text-sm md:text-base text-gray-400'
                    />
                )}
            </div>
        </header>
    );
}
