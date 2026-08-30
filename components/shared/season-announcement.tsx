import { SEASON_ANNOUNCEMENT } from '@/constant/announcement';
import { selectVisibleAnnouncement } from '@/lib/announcement';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { TransitionLink } from './transition-link';

type SeasonAnnouncementProps = {
    /** Destination du lien. Le libellé doit décrire cette destination. */
    ctaLabel: string;
    ctaHref: string;
    className?: string;
};

/**
 * Annonce de saison. Composant serveur : le texte est dans le HTML rendu, donc
 * lisible par les robots qui n'exécutent pas JavaScript, et rien ne clignote à
 * l'hydratation.
 *
 * Il ne rend rien en dehors de sa fenêtre d'affichage, ce qui évite l'écueil
 * habituel de ce genre de bloc : rester en ligne jusqu'en mars.
 */
export default function SeasonAnnouncement({
    ctaLabel,
    ctaHref,
    className,
}: SeasonAnnouncementProps) {
    const announcement = selectVisibleAnnouncement(SEASON_ANNOUNCEMENT);
    if (!announcement) return null;

    return (
        <aside
            aria-label='Annonce de rentrée'
            className={cn(
                'w-full max-w-md md:max-w-xl rounded-md border border-white/10 border-l-4 border-l-jkdBlueLight',
                'bg-black/60 px-5 py-4 shadow-lg shadow-black/50 backdrop-blur-md',
                className
            )}
        >
            <p className='font-cinzel text-sm md:text-3xl font-bold uppercase tracking-[0.18em] md:tracking-[0.08em] text-jkdBlueLight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] whitespace-nowrap'>
                {announcement.eyebrow}
            </p>
            <p className='mt-2 md:mt-3 text-sm leading-snug text-white md:text-lg'>
                {announcement.message}
            </p>
            {announcement.detail ? (
                <p className='mt-1.5 text-xs leading-snug text-gray-400 md:text-sm'>
                    {announcement.detail}
                </p>
            ) : null}
            <TransitionLink
                href={ctaHref}
                className='group mt-3 inline-flex items-center gap-1.5 text-sm text-white underline decoration-jkdBlueLight decoration-2 underline-offset-4 transition-colors hover:text-jkdBlueLight'
            >
                {ctaLabel}
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
            </TransitionLink>
        </aside>
    );
}
