import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

export default function VideoSection() {
    return (
        <div
            className='lg:px-20 2xl:px-80 pb-10 md:pb-28 pt-10 md:pt-24 bg-gray-900'
            id='demo'
        >
            <h2 className='flex justify-center'>
                <TextGenerateEffect
                    words={'Mannequin Challenge'}
                    wordsClassName='text-3xl md:text-5xl text-white font-bold'
                />
            </h2>
            <FadeInWrapper
                className='flex justify-center mt-8 md:mt-16'
                delay={0.2}
            >
                <div
                    className='relative w-full max-w-4xl overflow-hidden rounded-lg shadow-lg'
                    style={{ paddingTop: '56.25%' }}
                >
                    <iframe
                        className='absolute top-0 left-0 w-full h-full'
                        src='https://www.youtube.com/embed/_b_DuXq0_LE?si=vLnr8pVloDatnhq-'
                        title='Mannequin Challenge Video'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin'
                        allowFullScreen
                    />
                </div>
            </FadeInWrapper>
        </div>
    );
}
