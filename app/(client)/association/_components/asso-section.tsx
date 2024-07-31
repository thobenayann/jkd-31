import BlurFadeImages, {
    ObjectFit,
} from '@/components/shared/blur-fade-images';
import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

export default function AssoSection() {
    const firstAssoSectionImages = [
        {
            src: '/images/content/association/salut-kali.jpg',
            alt: 'salut kali',
            fill: true,
            className: 'h-[420px] rounded-lg',
            style: { objectFit: 'cover' as ObjectFit },
        },
        {
            src: '/images/content/association/fanny-nico-trap.jpg',
            alt: 'démonstration trapping',
            fill: true,
            className: 'h-[420px] rounded-lg md:mt-10',
            style: { objectFit: 'cover' as ObjectFit },
        },
    ];
    const secondAssoSectionImages = [
        {
            src: '/images/content/association/bootcamp.jpg',
            alt: 'salut kali',
            fill: true,
            className: 'h-[420px] rounded-lg',
            style: { objectFit: 'cover' as ObjectFit },
        },
    ];
    return (
        <section className='lg:px-20 2xl:px-80 py-10 md:py-20 bg-gray-900'>
            <article className='flex flex-col space-y-10 md:space-y-20'>
                {/* first content */}
                <div className='w-full flex max-md:flex-col md:space-x-20 max-md:space-y-10'>
                    <div className='flex flex-col max-md:items-center space-y-6 md:w-1/2 px-10'>
                        <h2>
                            <TextGenerateEffect
                                words={`Notre asso`}
                                wordsClassName='text-4xl md:text-6xl text-white font-bold'
                            />
                        </h2>
                        <FadeInWrapper
                            className='flex flex-col space-y-4 font-light'
                            direction='right'
                        >
                            <p className='text-white'>
                                Notre association a été crée en 1998 par
                                Jean-Marc Rodriguez sous le nom Do Gei.
                            </p>
                            <p className='text-white'>
                                Elle a été refondu en 2011 sous le nom Ji Dao.
                                Et en 2023 elle devient « On ne sait pas encore
                                ».
                            </p>
                        </FadeInWrapper>
                        <FadeInWrapper>
                            <p className='text-white font-light'>
                                Nous avons eu à cœur de développer l’association
                                et de pouvoir proposer des cours qui parlent à
                                un public plus ciblé. Nous avons créer une
                                session self-défense féminine pour répondre à un
                                réel besoin. Ce cours est basé sur des attaques
                                vécus dans la rue, et donne des clés simples,
                                adaptés à chacun pour pouvoir se défendre. Nous
                                avons également ouvert une session de self pour
                                les ados dès l’entrée au collège, où le
                                harcèlement commence en général.
                            </p>
                        </FadeInWrapper>
                    </div>

                    <div
                        className='flex md:space-x-4 md:w-1/2 max-md:container'
                        id='photos'
                    >
                        <BlurFadeImages images={firstAssoSectionImages} />
                    </div>
                </div>
                {/* second content */}
                <div className='flex w-full md:space-x-20 max-md:container'>
                    <div className='relative md:w-1/2 rounded-lg overflow-hidden md:mx-10'>
                        <BlurFadeImages images={secondAssoSectionImages} />
                    </div>

                    <FadeInWrapper
                        className='flex flex-col justify-center space-y-6 md:w-1/2 font-light'
                        direction='left'
                    >
                        <p className='text-white'>
                            Pour nous il n’y a aucune compétition, nous
                            n’enseignons que la défense personnelle. Et pour
                            cela, nous apprenons aux élèves le combat à chaque
                            distance. Le premier principe pour nos élèves est la
                            ligne centrale. Le système de base qu’ils apprennent
                            ensuite, est le Jun Fan Kung Fu, qui permet de
                            comprendre les concepts du Jeet Kune Do. Le but par
                            la suite est donc de se sentir libre de tout
                            système, garder les techniques qui fonctionnent avec
                            soi-même et faire notre propre Jeet Kune Do. Car le
                            Jeet Kune Do a pour principe de s’adapter à
                            l’individu !
                        </p>
                        <p className='text-white'>
                            Nous avons à cœur de développer votre condition
                            physique, il est important de pouvoir avoir le
                            cardio nécessaire soit pour fuir quand c’est
                            possible, soit pour tenir le temps de se défendre.
                            Pour autant on accepte tout niveaux physiques.
                        </p>
                    </FadeInWrapper>
                </div>
            </article>
        </section>
    );
}
