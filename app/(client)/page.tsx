import SeasonAnnouncement from '@/components/shared/season-announcement';
import HomeTitle from './(home)/_components/home-title';
import HomeContent from './(home)/home-content';

/**
 * L'annonce de rentrée a une fenêtre d'affichage. Sans revalidation, la page
 * étant statique, la fenêtre serait figée à l'heure du build et l'annonce
 * resterait en ligne après sa date de fin.
 */
export const revalidate = 3600;

export default function Home() {
    return (
        <div>
            <header
                className='relative h-screen w-full bg-contain md:bg-cover bg-no-repeat bg-center md:bg-top'
                style={{
                    backgroundImage: `url(/images/content/home/home-background.webp)`,
                }}
            >
                {/*
                    Le visuel d'accueil est un logo, il ne porte aucun texte.
                    Le titre de page n'existe donc que pour les robots et les
                    lecteurs d'écran. C'est la cible de « Jeet Kune Do Muret ».
                    Le rendre visible demanderait de redessiner le héros.
                */}
                <h1 className='sr-only'>
                    Jeet Kune Do et self-défense à Muret
                </h1>
                <HomeTitle />
                {/*
                    L'annonce occupe le bas du héros, resté vide par construction.
                    Positionnée en absolu : elle ne décale aucun bloc existant et
                    disparaît d'elle-même hors de sa fenêtre d'affichage.
                    `bottom-40` sur mobile passe au-dessus de la barre de
                    navigation basse et du bouton flottant « Notre démo »,
                    tous deux en `fixed bottom-24`.
                */}
                <div className='absolute inset-x-0 bottom-40 flex justify-center px-6 md:bottom-[8%] md:left-[5%] md:right-auto md:justify-start md:px-0'>
                    <SeasonAnnouncement
                        ctaLabel='Horaires, tarifs et lieu des cours'
                        ctaHref='/tarifs'
                    />
                </div>
            </header>
            <HomeContent />
        </div>
    );
}
