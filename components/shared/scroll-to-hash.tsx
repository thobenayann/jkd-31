'use client';

import { useEffect } from 'react';

/** Fenêtre pendant laquelle on recale encore la page sur l'ancre. */
const SETTLE_DURATION_MS = 1500;
/** Recalages programmés, en plus de ceux déclenchés par un changement de hauteur. */
const RETRY_DELAYS_MS = [50, 200, 500, 1000];
/** Le visiteur reprend la main : on cesse de recaler dès qu'il agit. */
const USER_INTENT_EVENTS = ['wheel', 'touchstart', 'keydown'] as const;

/**
 * Recale la page sur l'ancre de l'URL une fois la mise en page stabilisée.
 *
 * Pourquoi : à l'arrivée sur la page, l'ancre est visée avant que tout soit
 * en place. Plusieurs blocs changent de hauteur juste après l'hydratation
 * (les composants qui lisent `useMediaQuery` rendent d'abord la version
 * mobile, puis la version desktop), et la navigation client remet le
 * défilement en haut après le rendu. La section visée finit hors écran.
 *
 * On recale donc pendant un court instant, à chaque variation de hauteur du
 * document et à quelques échéances fixes, puis on arrête. Le premier geste du
 * visiteur interrompt le recalage.
 */
export default function ScrollToHash() {
    useEffect(() => {
        let active = true;

        const align = () => {
            if (!active) return;
            const id = decodeURIComponent(window.location.hash.slice(1));
            if (!id) return;
            // Instantané : on arrive sur la page, il n'y a rien à animer depuis
            // le haut (et `scroll-smooth` sur <html> animerait 2 000 px).
            document
                .getElementById(id)
                ?.scrollIntoView({ block: 'start', behavior: 'instant' });
        };

        const stop = () => {
            active = false;
            observer.disconnect();
            timers.forEach((timer) => window.clearTimeout(timer));
            USER_INTENT_EVENTS.forEach((event) =>
                window.removeEventListener(event, stop)
            );
        };

        const observer = new ResizeObserver(align);
        const timers = [
            ...RETRY_DELAYS_MS.map((ms) => window.setTimeout(align, ms)),
            window.setTimeout(stop, SETTLE_DURATION_MS),
        ];

        align();
        observer.observe(document.documentElement);
        USER_INTENT_EVENTS.forEach((event) =>
            window.addEventListener(event, stop, { passive: true })
        );

        return stop;
    }, []);

    return null;
}
