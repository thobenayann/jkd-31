'use client';

import GradualSpacing from '@/components/ui/gradual-spacing';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { useState } from 'react';

export default function StylesAnimateTitle() {
    const [isFirstAnimationComplete, setIsFirstAnimationComplete] =
        useState(false);
    return (
        <div className='flex flex-col items-center h-36'>
            <GradualSpacing
                className='max-md:text-center font-cinzel text-white text-6xl md:text-4xl'
                text='Les 27 styles qui ont influencés'
            />
            <GradualSpacing
                className='max-md:text-center font-cinzel text-white text-6xl md:text-4xl'
                text='Bruce LEE pour le Jeet Kune Do'
                onAnimationComplete={() => setIsFirstAnimationComplete(true)}
            />
            {isFirstAnimationComplete && (
                <TextGenerateEffect
                    words={`selon Paul VUNAK`}
                    wordsClassName='italic font-serif font-light max-md:text-center md:text-base text-gray-400'
                />
            )}
        </div>
    );
}
