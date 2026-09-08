'use client';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children: ReactNode;
    showRadialGradient?: boolean;
}

/**
 * Dégradés d'origine, conservés à l'identique : une trame de fines bandes
 * (blanc ou noir selon le thème) et le drapeau français en biais.
 */
const AURORA_VARS = cn(
    '[--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]',
    '[--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]',
    '[--aurora:repeating-linear-gradient(50deg,#007BFF_0%,#007BFF_33%,#FFFFFF_33%,#FFFFFF_66%,#EF4135_66%,#EF4135_100%)]'
);

/**
 * Fond « aurora » aux couleurs du drapeau français.
 *
 * Mécanique d'origine préservée : deux couches de « drapeau strié » fusionnées
 * en `mix-blend-difference`. C'est le décalage des stries qui fait vivre les
 * couleurs.
 *
 * Point clé sur les couleurs. Le drapeau (`--aurora`) reste FIXE et identique
 * dans les deux couches. Là où elles s'alignent, la différence de deux couleurs
 * identiques vaut zéro (noir) ; ailleurs, une couleur ne se soustrait qu'à du
 * noir, ce qui la laisse intacte. On ne génère donc jamais de teinte hors
 * drapeau (pas de magenta ni d'orange). Dans l'original, cette invariance
 * venait de `background-size: 100%`, qui neutralise `background-position` sur la
 * couche de couleur. Ici on l'obtient en n'animant que les bandes.
 *
 * Performance. Seules les bandes bougent, par `transform` (déplacement GPU d'une
 * texture déjà peinte) et non par `background-position` qui repeignait chaque
 * image. Le flou est posé par couche, donc calculé une fois. On a retiré
 * `background-attachment: fixed` (il étalait la peinture sur tout le viewport)
 * et borné la zone à la barre. Résultat : aucune repeinture au repos.
 *
 * `motion-safe` : les bandes ne défilent que si l'utilisateur n'a pas demandé de
 * réduire les animations. Sinon le motif reste figé, le drapeau flou reste
 * visible.
 */
export const AuroraBackground = ({
    className,
    children,
    showRadialGradient = true,
    ...props
}: AuroraBackgroundProps) => {
    return (
        <div
            className={cn(
                'relative flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950',
                className
            )}
            {...props}
        >
            <div
                aria-hidden='true'
                className={cn(
                    AURORA_VARS,
                    'pointer-events-none absolute -inset-[10px] overflow-hidden opacity-70 [isolation:isolate]',
                    showRadialGradient &&
                        '[mask-image:radial-gradient(ellipse_at_60%_0%,#000_10%,transparent_80%)]'
                )}
            >
                {/* Couche de base, fixe : drapeau strié fin. */}
                <div
                    className={cn(
                        'absolute inset-0 blur-[10px] invert dark:invert-0',
                        '[background-image:var(--white-gradient),var(--aurora)]',
                        'dark:[background-image:var(--dark-gradient),var(--aurora)]',
                        '[background-size:30%,_100%] [background-position:50%_50%,50%_50%]'
                    )}
                />
                {/* Couche fusionnée en différence avec la base. */}
                <div className='absolute inset-0 mix-blend-difference [isolation:isolate]'>
                    {/* Drapeau FIXE, identique à celui de la base (mêmes couleurs,
                        même position) : garantit qu'aucune teinte hors drapeau
                        n'apparait. */}
                    <div
                        className={cn(
                            'absolute inset-0 blur-[10px] invert dark:invert-0',
                            '[background-image:var(--aurora)]',
                            '[background-size:100%] [background-position:50%_50%]'
                        )}
                    />
                    {/* Bandes larges qui défilent (transform GPU), par-dessus le
                        drapeau. Largeur 200 % et pas de -50 % : le motif fait une
                        tuile de la largeur de la barre, la boucle est sans couture. */}
                    <div
                        className={cn(
                            'absolute inset-y-0 left-0 w-[200%] blur-[10px] invert dark:invert-0',
                            'will-change-transform motion-safe:animate-aurora-drift',
                            '[background-image:var(--white-gradient)]',
                            'dark:[background-image:var(--dark-gradient)]',
                            '[background-size:50%_100%]'
                        )}
                    />
                </div>
            </div>
            {children}
        </div>
    );
};
