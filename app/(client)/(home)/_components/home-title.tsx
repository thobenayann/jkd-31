'use client';

import GradualSpacing from '@/components/ui/gradual-spacing';
import { useMediaQuery } from '@/hooks/use-media-query';

export default function HomeTitle() {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    return isDesktop ? (
        <div className='md:pl-52 pt-40 md:pt-80'>
            <GradualSpacing
                className='max-md:text-center font-cinzel text-white text-6xl md:text-6xl'
                text='JKD Self Defense 31'
            />
        </div>
    ) : (
        <div className='flex flex-col pt-20 space-y-2'>
            <GradualSpacing
                className='max-md:text-center font-cinzel text-white text-5xl'
                text='JKD'
            />
            <GradualSpacing
                className='max-md:text-center font-cinzel text-white text-5xl'
                text='Self Defense'
            />
            <GradualSpacing
                className='max-md:text-center font-cinzel text-white text-5xl'
                text='31'
            />
        </div>
    );
}
