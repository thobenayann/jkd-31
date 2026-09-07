import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import { TransitionLink } from '@/components/shared/transition-link';
import { Button } from '@/components/ui/button';
import GradualSpacing from '@/components/ui/gradual-spacing';
import coursesData from '@/data/courses.json';
import { buildPriceSummary } from '@/lib/price-summary';
import { ArrowRight, MapPin } from 'lucide-react';

/**
 * Bandeau de fin d'accueil : les prix annuels en un coup d'œil, puis deux
 * sorties, la page tarifs et la section « Nous trouver ».
 *
 * Composant serveur : les prix sont dans le HTML rendu, donc indexables, et
 * ils viennent du même fichier que la page tarifs, il n'y a rien à
 * synchroniser.
 */
export default function PriceSummary() {
    const courses = buildPriceSummary(coursesData);
    const hasReducedPrices = courses.some((c) => c.hasReducedPrice);

    return (
        <section
            aria-label='Rejoindre le club'
            className='bg-gray-900 py-16 md:py-24'
        >
            <div className='container flex flex-col items-center gap-8 md:gap-12'>
                <header className='flex flex-col items-center gap-3 text-center'>
                    <GradualSpacing
                        as='h2'
                        text='Rejoindre le club'
                        className='text-3xl md:text-5xl font-bold leading-none'
                    />
                    <p className='max-w-xl text-sm md:text-base text-gray-400'>
                        Une inscription à l&apos;année, licence et adhésion
                        comprises. Cours d&apos;essai possible, il suffit de
                        nous écrire.
                    </p>
                </header>

                <FadeInWrapper className='w-full'>
                    <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 w-full'>
                        {courses.map((course) => (
                            <li
                                key={course.title}
                                className='flex lg:flex-col items-center justify-between lg:justify-center gap-2 rounded-md border border-white/10 bg-gray-800/80 px-4 py-3 md:py-5 text-white'
                            >
                                <span className='flex flex-col lg:items-center lg:text-center'>
                                    <span className='text-sm md:text-base font-semibold uppercase leading-tight'>
                                        {course.title}
                                    </span>
                                    {course.subtitle ? (
                                        <span className='text-xs text-gray-400'>
                                            {course.subtitle}
                                        </span>
                                    ) : null}
                                </span>
                                <span className='flex items-baseline gap-1 whitespace-nowrap'>
                                    <span className='text-xl md:text-2xl font-bold'>
                                        {course.price}€
                                    </span>
                                    <span className='text-xs text-gray-400'>
                                        /an{course.hasReducedPrice ? '*' : ''}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    {hasReducedPrices ? (
                        <p className='mt-3 text-center text-xs text-gray-500'>
                            * Tarif réduit possible, détail sur la page tarifs.
                        </p>
                    ) : null}
                </FadeInWrapper>

                <FadeInWrapper
                    delay={0.2}
                    className='flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto'
                >
                    <Button
                        asChild
                        size='lg'
                        className='w-full sm:w-auto bg-jkdBlue text-white hover:bg-jkdBlue/85'
                    >
                        <TransitionLink href='/tarifs'>
                            Tarifs et horaires des cours
                            <ArrowRight className='ml-2 h-4 w-4' aria-hidden='true' />
                        </TransitionLink>
                    </Button>
                    <Button
                        asChild
                        size='lg'
                        variant='outline'
                        className='w-full sm:w-auto'
                    >
                        <TransitionLink href='/tarifs#nous-trouver'>
                            <MapPin className='mr-2 h-4 w-4' aria-hidden='true' />
                            Nous trouver
                        </TransitionLink>
                    </Button>
                </FadeInWrapper>
            </div>
        </section>
    );
}
