import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

export default function VideoSection() {
    return (
        <div className='lg:px-20 2xl:px-80 pb-10 md:pb-28 pt-10 md:pt-24 bg-gray-900'>
            <h2 className='flex justify-center'>
                <TextGenerateEffect
                    words={'Démonstration Jeet Kune Do'} // TODO: A remplacer par le Mannequin Challenge
                    wordsClassName='text-3xl md:text-6xl text-white font-bold'
                />
            </h2>
            <div className='flex justify-center mt-8'>
                <div
                    className='relative w-full max-w-4xl overflow-hidden rounded-lg shadow-lg'
                    style={{ paddingTop: '56.25%' }}
                >
                    <iframe
                        className='absolute top-0 left-0 w-full h-full'
                        src='https://www.youtube.com/embed/w1zXumWKezA'
                        title='Mannequin Challenge Video'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}
