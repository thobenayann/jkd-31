import InteractiveImage from '@/components/shared/interactive-image';
import FindUsMap from './find-us-map';

export default function FindUs() {
    return (
        <section className='grid md:grid-cols-2 gap-8 md:gap-12 md:container max-md:w-full max-md:px-4 h-full'>
            <div className='flex flex-col gap-6'>
                <figure className='flex flex-col gap-3'>
                    <figcaption className='text-base md:text-lg font-semibold text-white'>
                        Plan d&apos;accès
                    </figcaption>
                    <div className='relative w-full aspect-[794/493] rounded-md'>
                        <InteractiveImage
                            src='/images/content/tarifs/jkd-plan-d-acces.png'
                            alt='Vue satellite du quartier : depuis la rue de Monzon, un tracé rouge longe le parking de la rue Pierre Bauduc jusqu’à la salle du club, marquée d’une croix, entre le Lidl et l’école Mermoz'
                            fill
                            objectFitOnMobile='contain'
                            className='my-0'
                        />
                    </div>
                </figure>
                <figure className='flex flex-col gap-3'>
                    <div className='relative w-full aspect-[794/283] rounded-md'>
                        <InteractiveImage
                            src='/images/content/tarifs/jkd-batiment-acces-sans-txt.png'
                            alt='Portail vert entre le gymnase et le boulodrome, signalé par une flèche rouge'
                            fill
                            objectFitOnMobile='contain'
                            className='my-0'
                        />
                    </div>
                    <figcaption className='text-sm md:text-base text-gray-300 text-center md:text-left'>
                        Passer par le portail vert entre le gymnase et le
                        boulodrome. L&apos;entrée se trouve au fond à gauche.
                    </figcaption>
                </figure>
            </div>
            <FindUsMap />
        </section>
    );
}
