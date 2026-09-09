'use client';
import { useUserAttention } from '@/hooks/use-user-attention';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children: ReactNode;
    showRadialGradient?: boolean;
    /** Met la dérive en pause (par exemple quand la barre est hors écran). */
    paused?: boolean;
}

/**
 * Dégradés d'origine : une trame de fines bandes (blanc ou noir selon le
 * thème) et le drapeau français en biais.
 */
const AURORA_VARS = cn(
    '[--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]',
    '[--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]',
    '[--aurora:repeating-linear-gradient(50deg,#007BFF_0%,#007BFF_33%,#FFFFFF_33%,#FFFFFF_66%,#EF4135_66%,#EF4135_100%)]'
);

/**
 * Fond « aurora » aux couleurs du drapeau français, dans la mécanique
 * d'origine (Aceternity) : une couche de base (trame fine + drapeau) et une
 * couche fusionnée en `mix-blend-difference` (drapeau identique + bandes
 * larges qui défilent), puis **un seul** `blur(10px)` et une inversion en
 * mode clair, appliqués au résultat de la fusion.
 *
 * L'ordre compte pour le rendu. Flouter chaque couche avant la fusion laisse
 * des arêtes nettes là où la différence change de signe, ce qui dessine des
 * cellules rectangulaires. Flouter après la fusion adoucit ces arêtes : c'est
 * l'effet de drapeau qui flotte.
 *
 * Performance. L'original animait `background-position` avec
 * `background-attachment: fixed`, ce qui repeignait tout à chaque image. Ici
 * les bandes se déplacent par `transform` (déplacement d'une texture déjà
 * peinte), en `steps()` : le compositeur ne recalcule le flou que quand la
 * position change, 24 fois par seconde au lieu d'une fois par
 * rafraîchissement d'écran. La dérive ne tourne que si quelqu'un regarde
 * (`useUserAttention`) et si le parent ne demande pas la pause. Elle respecte
 * `prefers-reduced-motion` (`motion-safe`).
 *
 * Vitesse conservée : l'original déplaçait les bandes de trois largeurs de
 * fenêtre en 60 s ; ici deux largeurs (une tuile exacte, boucle sans saut)
 * en 40 s, soit la même vitesse.
 */
export const AuroraBackground = ({
    className,
    children,
    showRadialGradient = true,
    paused = false,
    ...props
}: AuroraBackgroundProps) => {
    const attentive = useUserAttention();
    const running = attentive && !paused;

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
                    'pointer-events-none absolute -inset-[10px] overflow-hidden opacity-70',
                    showRadialGradient &&
                        '[mask-image:radial-gradient(ellipse_at_60%_0%,#000_10%,transparent_80%)]'
                )}
            >
                {/* Groupe filtré : flou puis inversion sur le résultat de la
                    fusion. `overflow-hidden` est indispensable : sans lui, la
                    surface floutée par le compositeur englobe tout le calque
                    mobile (400 % de large) avant découpe, et coûte trois fois
                    plus. */}
                <div
                    className={cn(
                        AURORA_VARS,
                        'absolute inset-0 overflow-hidden blur-[10px] invert dark:invert-0'
                    )}
                >
                    {/* Couche de base, fixe : trame fine sur le drapeau. */}
                    <div
                        className={cn(
                            'absolute inset-0',
                            '[background-image:var(--white-gradient),var(--aurora)]',
                            'dark:[background-image:var(--dark-gradient),var(--aurora)]',
                            '[background-size:30%,_100%] [background-position:50%_50%,50%_50%]'
                        )}
                    />
                    {/* Couche fusionnée en différence avec la base. */}
                    <div className='absolute inset-0 mix-blend-difference [isolation:isolate]'>
                        {/* Drapeau fixe, identique à celui de la base. */}
                        <div
                            className={cn(
                                'absolute inset-0',
                                '[background-image:var(--aurora)]',
                                '[background-size:100%] [background-position:50%_50%]'
                            )}
                        />
                        {/* Bandes larges qui défilent : tuile de deux largeurs de
                            barre (`background-size: 50%` d'un calque à 400 %),
                            déplacement d'une tuile par boucle. */}
                        <div
                            className={cn(
                                'absolute inset-y-0 left-0 w-[400%] will-change-transform motion-safe:animate-aurora-drift',
                                '[background-image:var(--white-gradient)]',
                                'dark:[background-image:var(--dark-gradient)]',
                                '[background-size:50%_100%]'
                            )}
                            style={{
                                animationPlayState: running
                                    ? 'running'
                                    : 'paused',
                            }}
                        />
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
};
