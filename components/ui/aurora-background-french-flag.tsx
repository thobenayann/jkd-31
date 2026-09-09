'use client';
import { useUserAttention } from '@/hooks/use-user-attention';
import { cn } from '@/lib/utils';
import React, { ReactNode, useEffect, useRef } from 'react';

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children: ReactNode;
    showRadialGradient?: boolean;
    /** Met la dérive en pause (par exemple quand la barre est hors écran). */
    paused?: boolean;
}

/**
 * Fond « aurora » aux couleurs du drapeau français.
 *
 * Mécanique visuelle : deux couches de « drapeau strié » fusionnées en
 * `mix-blend-difference`. Le drapeau reste fixe et identique dans les deux
 * couches, seules les bandes défilent : la différence de deux couleurs
 * identiques vaut zéro, une couleur ne se soustrait qu'à du noir, donc aucune
 * teinte hors drapeau n'apparaît.
 *
 * Performance : les trois couches sont des textures cuites une fois.
 *
 * Un calque qui porte `filter: blur()` ou `invert()` est recalculé par le
 * compositeur à chaque image dès qu'il bouge ou qu'un calque au dessus de lui
 * bouge, à la fréquence de l'écran. C'est ce qui tenait le processus GPU entre
 * 15 et 20 % d'un cœur au repos, sur toutes les pages. Ici, chaque couche est
 * dessinée dans un `<canvas>` au montage : mêmes dégradés, même flou de 10 px
 * (`ctx.filter`, même implémentation Skia que le CSS), même inversion en mode
 * clair (pixel par pixel, l'alpha n'est pas touché, comme `invert()` CSS). Le
 * résultat est une simple texture. Le déplacement des bandes en `transform` et
 * la fusion en `mix-blend-difference` ne coûtent alors qu'une passe triviale
 * par image.
 *
 * Les canvas sont redessinés au redimensionnement (avec délai) et au changement
 * de thème (classe `dark` sur `<html>`). Si le navigateur ne supporte pas
 * `ctx.filter` (Safari < 18), on retombe sur les filtres CSS.
 *
 * Cadence : l'animation `aurora-drift` avance par pas (`steps(1440)`, voir
 * tailwind.config), donc 24 images par seconde au lieu d'une par
 * rafraîchissement d'écran. Sur un dégradé flouté, le pas de 1 à 2 px est
 * invisible, et c'est ce qui divise par six le travail restant du compositeur.
 *
 * `motion-safe` : les bandes ne défilent que si l'utilisateur n'a pas demandé
 * de réduire les animations.
 *
 * Pause : la dérive ne tourne que si quelqu'un regarde (fenêtre au premier
 * plan et interaction récente, voir `useUserAttention`) et si le parent ne
 * demande pas la pause (barre masquée par le défilement). Au repos, le coût
 * est nul.
 */

const BLUR_PX = 10;
const RESIZE_DELAY_MS = 200;

/** Couleurs des dégradés d'origine. */
const FLAG_STOPS: [number, string][] = [
    [0, '#007BFF'],
    [0.33, '#007BFF'],
    [0.33, '#FFFFFF'],
    [0.66, '#FFFFFF'],
    [0.66, '#EF4135'],
    [1, '#EF4135'],
];
/**
 * Trame de fines bandes : `repeating-linear-gradient(100deg, c 0%, c 7%,
 * transparent 10%, transparent 12%, c 16%)`.
 *
 * Le stop transparent garde la couleur de la bande (alpha 0) : CSS interpole
 * les dégradés en alpha prémultiplié, le canvas non. Avec un transparent noir,
 * le canvas passerait par du gris entre la bande et le vide et assombrirait
 * les bords ; avec la même couleur à alpha 0, les deux interpolations
 * coïncident.
 */
const STRIPE_PERIOD = 0.16;
const STRIPE_STOPS = (color: string): [number, string][] => {
    const transparent = color === '#FFFFFF' ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0)';
    return [
        [0, color],
        [0.07, color],
        [0.1, transparent],
        [0.12, transparent],
        [0.16, color],
    ];
};

/**
 * Reproduit `linear-gradient(<angle>, ...)` CSS sur une boîte w × h : la ligne
 * de dégradé passe par le centre, 0deg pointe vers le haut, le sens est
 * horaire, et sa longueur vaut |w sin θ| + |h cos θ|.
 */
const cssLinearGradient = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    angleDeg: number,
    stops: [number, string][],
    repeatPeriod?: number
) => {
    const angle = (angleDeg * Math.PI) / 180;
    const dx = Math.sin(angle);
    const dy = -Math.cos(angle);
    const length = Math.abs(w * dx) + Math.abs(h * dy);
    const cx = w / 2;
    const cy = h / 2;
    const gradient = ctx.createLinearGradient(
        cx - (dx * length) / 2,
        cy - (dy * length) / 2,
        cx + (dx * length) / 2,
        cy + (dy * length) / 2
    );
    if (repeatPeriod === undefined) {
        stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
        return gradient;
    }
    // Émulation de `repeating-linear-gradient` : on répète le motif jusqu'à
    // couvrir toute la ligne, en tronquant proprement à 1.
    let lastOffset = -1;
    for (let k = 0; k * repeatPeriod < 1; k++) {
        for (const [offset, color] of stops) {
            const absolute = Math.min(1, k * repeatPeriod + offset);
            if (absolute < lastOffset) continue;
            gradient.addColorStop(absolute, color);
            lastOffset = absolute;
            if (absolute === 1) return gradient;
        }
    }
    return gradient;
};

const makeCanvas = (w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return canvas;
};

/** Dessine le drapeau plein cadre (`--aurora`, background-size 100 %). */
const drawFlag = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = cssLinearGradient(ctx, w, h, 50, FLAG_STOPS);
    ctx.fillRect(0, 0, w, h);
};

/**
 * Dessine la trame de bandes en tuiles de `tileW × h` répétées
 * horizontalement, calées comme `background-position: <originX> 50%`.
 */
const drawStripes = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    tileW: number,
    originX: number,
    color: string
) => {
    const tile = makeCanvas(Math.max(1, Math.round(tileW)), h);
    const tileCtx = tile.getContext('2d');
    if (!tileCtx) return;
    tileCtx.fillStyle = cssLinearGradient(
        tileCtx,
        tile.width,
        h,
        100,
        STRIPE_STOPS(color),
        STRIPE_PERIOD
    );
    tileCtx.fillRect(0, 0, tile.width, h);
    const pattern = ctx.createPattern(tile, 'repeat-x');
    if (!pattern) return;
    pattern.setTransform(new DOMMatrix().translate(originX, 0));
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, w, h);
};

/**
 * Cuit une couche : contenu dessiné net dans un canvas intermédiaire, puis
 * copié avec `blur(10px)` dans le canvas cible, puis inversé en mode clair.
 * Même ordre que la chaîne de filtres Tailwind (`blur` puis `invert`).
 */
const bake = (
    target: HTMLCanvasElement,
    w: number,
    h: number,
    dpr: number,
    invert: boolean,
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
) => {
    const pw = Math.max(1, Math.round(w * dpr));
    const ph = Math.max(1, Math.round(h * dpr));
    target.width = pw;
    target.height = ph;
    const ctx = target.getContext('2d');
    if (!ctx) return;

    const source = makeCanvas(pw, ph);
    const sourceCtx = source.getContext('2d');
    if (!sourceCtx) return;
    draw(sourceCtx, pw, ph);

    ctx.clearRect(0, 0, pw, ph);
    // Le flou est exprimé en pixels physiques : `ctx.filter` ignore la
    // transformation courante, on n'utilise donc jamais `ctx.scale`.
    ctx.filter = `blur(${BLUR_PX * dpr}px)`;
    ctx.drawImage(source, 0, 0);
    ctx.filter = 'none';

    if (invert) {
        const image = ctx.getImageData(0, 0, pw, ph);
        const data = image.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
        ctx.putImageData(image, 0, 0);
    }
};

const supportsCanvasFilter = () => {
    if (typeof document === 'undefined') return false;
    const ctx = document.createElement('canvas').getContext('2d');
    return !!ctx && 'filter' in ctx;
};

export const AuroraBackground = ({
    className,
    children,
    showRadialGradient = true,
    paused = false,
    ...props
}: AuroraBackgroundProps) => {
    const attentive = useUserAttention();
    const running = attentive && !paused;
    const areaRef = useRef<HTMLDivElement>(null);
    const baseRef = useRef<HTMLCanvasElement>(null);
    const flagRef = useRef<HTMLCanvasElement>(null);
    const stripesRef = useRef<HTMLCanvasElement>(null);
    const cssFallbackRef = useRef(false);

    useEffect(() => {
        const area = areaRef.current;
        const base = baseRef.current;
        const flag = flagRef.current;
        const stripes = stripesRef.current;
        if (!area || !base || !flag || !stripes) return;

        const canBake = supportsCanvasFilter();
        if (!canBake) {
            // Repli : filtres CSS, comportement d'avant.
            cssFallbackRef.current = true;
            [base, flag, stripes].forEach((c) =>
                c.classList.add('blur-[10px]', 'invert', 'dark:invert-0')
            );
        }

        const render = () => {
            const w = area.clientWidth;
            const h = area.clientHeight;
            if (w === 0 || h === 0) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const isDark = document.documentElement.classList.contains('dark');
            // En clair, les bandes sont blanches puis tout est inversé ; en
            // sombre, elles sont noires et rien n'est inversé.
            const stripeColor = isDark ? '#000000' : '#FFFFFF';
            const invert = canBake && !isDark;

            const drawWithFilters = canBake
                ? bake
                : (
                      target: HTMLCanvasElement,
                      tw: number,
                      th: number,
                      tdpr: number,
                      _invert: boolean,
                      draw: (
                          ctx: CanvasRenderingContext2D,
                          w: number,
                          h: number
                      ) => void
                  ) => {
                      target.width = Math.round(tw * tdpr);
                      target.height = Math.round(th * tdpr);
                      const ctx = target.getContext('2d');
                      if (ctx) draw(ctx, target.width, target.height);
                  };

            // Couche de base : drapeau plein cadre + trame fine en tuiles de
            // 30 % de large centrées (`background-size: 30%, 100%`).
            drawWithFilters(base, w, h, dpr, invert, (ctx, pw, ph) => {
                drawFlag(ctx, pw, ph);
                const tileW = pw * 0.3;
                drawStripes(ctx, pw, ph, tileW, (pw - tileW) / 2, stripeColor);
            });
            // Drapeau fixe de la couche fusionnée, identique à celui de la base.
            drawWithFilters(flag, w, h, dpr, invert, drawFlag);
            // Bandes larges qui défilent : calque de 200 % de large, tuiles de
            // la largeur de la barre (`background-size: 50% 100%`), origine 0.
            drawWithFilters(stripes, w * 2, h, dpr, invert, (ctx, pw, ph) =>
                drawStripes(ctx, pw, ph, pw / 2, 0, stripeColor)
            );
        };

        render();

        let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
        const resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(render, RESIZE_DELAY_MS);
        });
        resizeObserver.observe(area);

        const themeObserver = new MutationObserver(render);
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => {
            clearTimeout(resizeTimeout);
            resizeObserver.disconnect();
            themeObserver.disconnect();
        };
    }, []);

    return (
        <div
            className={cn(
                'relative flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950',
                className
            )}
            {...props}
        >
            <div
                ref={areaRef}
                aria-hidden='true'
                className={cn(
                    'pointer-events-none absolute -inset-[10px] overflow-hidden opacity-70 [isolation:isolate]',
                    showRadialGradient &&
                        '[mask-image:radial-gradient(ellipse_at_60%_0%,#000_10%,transparent_80%)]'
                )}
            >
                {/* Couche de base, fixe : drapeau strié fin. */}
                <canvas ref={baseRef} className='absolute inset-0 h-full w-full' />
                {/* Couche fusionnée en différence avec la base. */}
                <div className='absolute inset-0 mix-blend-difference [isolation:isolate]'>
                    {/* Drapeau fixe, identique à celui de la base. */}
                    <canvas
                        ref={flagRef}
                        className='absolute inset-0 h-full w-full'
                    />
                    {/* Bandes larges qui défilent (transform GPU). Largeur 200 %
                        et pas de -50 % : le motif fait une tuile de la largeur
                        de la barre, la boucle est sans couture. */}
                    <canvas
                        ref={stripesRef}
                        className='absolute inset-y-0 left-0 h-full w-[200%] will-change-transform motion-safe:animate-aurora-drift'
                        style={{
                            animationPlayState: running ? 'running' : 'paused',
                        }}
                    />
                </div>
            </div>
            {children}
        </div>
    );
};
