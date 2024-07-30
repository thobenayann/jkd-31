import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import Image from 'next/image';
import WordCloud from '../../(home)/_components/word-cloud';

export default function JkdSection() {
    return (
        <>
            <section className='relative lg:mx-20 2xl:mx-80 pb-28'>
                <header className='container flex max-md:flex-col max-md:space-y-14 max-md:items-center justify-between pb-6 w-full pt-10 md:pt-32'>
                    <FadeInWrapper>
                        <div className='flex flex-col max-md:items-center space-y-6'>
                            <h1 className='text-4xl max-md:text-center md:text-6xl font-bold leading-none md:max-w-xl'>
                                Le Jeet Kune Do
                            </h1>
                            <cite className='max-md:text-center'>
                                <TextGenerateEffect
                                    words={`“La voie du poing qui intercepte”`}
                                    wordsClassName='italic font-serif font-light max-md:text-center md:text-lg text-gray-400'
                                />
                            </cite>
                        </div>
                    </FadeInWrapper>
                </header>

                <article className='container text-justify flex flex-col text-sm md:text-base space-y-2 font-light'>
                    <FadeInWrapper delay={0.6}>
                        <p>
                            Jeet Kune Do est un art martial, principalement à
                            mains nues, créé par Bruce Lee aux alentours de
                            1967. Cela veut dire littéralement : « la voie du
                            poing qui intercepte ».
                        </p>
                        <p>
                            Bruce Lee a étudié différents arts martiaux et a
                            reçu un diplôme de philosophie avant de créer le
                            Jeet Kune Do. Son but était de trouver un art qui
                            soit simple, direct et efficace. Il part du principe
                            ou l’échange de coups ne se fait pas dans la logique
                            d’un enchaînement : action-réponse. Mais plutôt, de
                            manière simultanée en un seul mouvement : le blocage
                            et la frappe en même temps, pour intercepter le
                            mouvement et y répondre en même temps.
                        </p>
                        <p>
                            Son fondateur disait : « On absorbe ce qui est
                            utile, on rejette ce qui ne l’est pas et on ajoute
                            ce qui nous appartient ». Le Jeet Kune Do a été
                            épuré de tout ce qui est visuel et inefficace pour
                            garder ce qui va à l’essentiel, car B. Lee partait
                            du principe que dans un combat avec plusieurs
                            adversaires, on ne doit passer que 2 secondes par
                            adversaire.
                        </p>
                        <p>
                            Bruce Lee s’est appuyé sur le Wing Chun et 27 styles
                            différents supplémentaires pour créer le JKD.
                        </p>
                        <p>
                            Le JKD est une philosophie de vie mais avec une
                            absence totale de forme martiale, étant perçue comme
                            une perte de temps. Il est très ciblé sur le
                            développement physique, l’autodéfense et le combat.
                            Physiquement le devoir est d’être explosif, rapide
                            et d’acquérir une puissance de frappe.
                        </p>
                    </FadeInWrapper>
                    <FadeInWrapper className='place-self-center' delay={0.9}>
                        <div className='w-96 py-10'>
                            <Image
                                src='/images/content/association/asso.jpg'
                                width={800}
                                height={600}
                                alt='équipe Ji Dao'
                            />
                        </div>
                    </FadeInWrapper>
                </article>
            </section>
            <div className='absolute left-0 top-32 h-full w-1/6 flex justify-center items-center max-2xl:hidden overflow-hidden'>
                <WordCloud />
            </div>
            <div className='absolute right-0 top-32 h-full w-1/6 flex justify-center items-center max-2xl:hidden overflow-hidden'>
                <WordCloud />
            </div>
        </>
    );
}
