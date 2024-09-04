'use client';

import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import { useMediaQuery } from '@/hooks/use-media-query';
import Image from 'next/image';

export default function HomeTitle() {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    return isDesktop ? (
        <div className='md:pl-[5%] md:pt-[5%] 2xl:pt-[10%]'>
            {/* <GradualSpacing
                className='max-md:text-center font-cinzel text-white text-6xl md:text-6xl'
                text='JKD Self Defense 31'
            /> */}
            <FadeInWrapper>
                <Image
                    src='/images/logo/logo-jkd-sd-31.webp'
                    alt='JKD Self Defense 31'
                    width={500}
                    height={500}
                    style={{ width: 'auto', height: 'auto' }}
                />
            </FadeInWrapper>
        </div>
    ) : (
        <div className='h-full w-full flex flex-col items-center justify-between'>
            {/* <div className='flex flex-col pt-16 space-y-2'>
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
            </div> */}
            <div className='pt-20'>
                <FadeInWrapper>
                    <Image
                        src='/images/logo/logo-jkd-sd-31.webp'
                        alt='JKD Self Defense 31'
                        width={200}
                        height={200}
                        style={{ width: 'auto', height: 'auto' }}
                    />
                </FadeInWrapper>
            </div>
        </div>
    );
}
