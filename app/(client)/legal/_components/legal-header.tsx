'use client';

import GradualSpacing from '@/components/ui/gradual-spacing';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

export default function LegalHeader() {
    return (
        <header className='flex flex-col items-center justify-center'>
            <GradualSpacing
                className='max-md:text-center font-cinzel text-white text-3xl md:text-4xl'
                text='Mentions Légales'
            />
            <div className='h-14 flex justify-center text-center'>
                <TextGenerateEffect
                    words={`Les informations légales l'association sportive JKD Self Defense 31.`}
                    wordsClassName='italic font-serif font-light max-md:text-center text-sm md:text-base text-gray-400'
                />
            </div>
        </header>
    );
}
