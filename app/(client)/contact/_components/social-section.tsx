'use client';

import dynamic from 'next/dynamic';

const LordIcon = dynamic(() => import('@/components/shared/lord-icon'), {
    ssr: false,
});

export default function SocialSection() {
    return (
        <section className='flex flex-col items-center w-full space-y-10 md:space-y-0'>
            <a
                href='https://www.facebook.com/jkd.jidao'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Visitez notre page Facebook'
            >
                <div
                    className='flex flex-col items-center space-y-1 hover:opacity-80 border-2 hover:border-2 hover:border-jkdBlue hover:shadow-lg p-4 md:p-8 rounded-lg'
                    id='fb'
                >
                    <h2 className='font-bold'>Retrouvez nous sur Facebook</h2>
                    <div className='w-[100px] h-[100px]'>
                        <LordIcon
                            trigger='in'
                            src={'/lottie/fb-animation.json'}
                            style={{ width: '100px', height: '100px' }}
                            colors='primary:#ffffff,secondary:#000000'
                            target={'fb'}
                        />
                    </div>
                </div>
            </a>
        </section>
    );
}
