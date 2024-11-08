'use client';

import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import { useMediaQuery } from '@/hooks/use-media-query';
import Image from 'next/image';

export default function HomeTitle() {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    return isDesktop ? (
        <div className='md:pl-[5%] md:pt-[5%] 2xl:pt-[10%]'>
            <FadeInWrapper>
                <div className='relative w-[500px] h-[500px]'>
                    <Image
                        src='/images/logo/logo-jkd-sd-31.webp'
                        alt='JKD Self Defense 31'
                        fill
                        sizes='500px'
                        className='object-contain'
                        priority
                    />
                </div>
            </FadeInWrapper>
        </div>
    ) : (
        <div className='h-full w-full flex flex-col items-center justify-between'>
            <div className='pt-20'>
                <FadeInWrapper>
                    <div className='relative w-[200px] h-[200px]'>
                        <Image
                            src='/images/logo/logo-jkd-sd-31.webp'
                            alt='JKD Self Defense 31'
                            fill
                            sizes='200px'
                            className='object-contain'
                            priority
                        />
                    </div>
                </FadeInWrapper>
            </div>
        </div>
    );
}
