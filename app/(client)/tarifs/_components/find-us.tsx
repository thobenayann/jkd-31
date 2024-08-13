import InteractiveImage from '@/components/shared/interactive-image';

export default function FindUs() {
    return (
        <section className='flex max-md:flex-col justify-between max-md:space-y-2 md:space-x-8 md:container max-md:w-full max-md:px-4 h-full'>
            <div className='relative w-full h-40 sm:h-96 rounded-md'>
                <InteractiveImage
                    src='/images/content/tarifs/local-nous-trouver.png'
                    alt='nous trouver'
                    fill
                    objectFitOnMobile='contain'
                />
            </div>
            <div className='relative w-full h-96'>
                <InteractiveImage
                    src='/images/content/tarifs/map.png'
                    alt='Map'
                    fill
                />
            </div>
        </section>
    );
}
