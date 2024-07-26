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
        <div className='flex flex-col items-center h-36'>
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

            {isFirstAnimationComplete && (
                <TextGenerateEffect
                    words={`selon Paul VUNAK`}
                    wordsClassName='italic font-serif font-light max-md:text-center text-sm md:text-base text-gray-400'
                />
            )}
        </div>
    );
}
