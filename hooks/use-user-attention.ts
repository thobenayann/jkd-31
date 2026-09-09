'use client';

import { useEffect, useRef, useState } from 'react';
import {
    IDLE_DELAY_MS,
    isAttentive,
    nextIdleCheckDelay,
    type AttentionState,
} from '@/lib/attention';

/**
 * Vrai tant que quelqu'un regarde la page : fenêtre au premier plan, onglet
 * visible, et une interaction (souris, clavier, défilement, toucher) il y a
 * moins de `idleMs`. Sert à mettre en pause les animations décoratives quand
 * personne ne les voit.
 *
 * Coût au repos nul : les événements d'entrée ne font que dater la dernière
 * interaction, un seul minuteur programme le passage en inactif, et l'état
 * React ne change que quand la valeur bascule. Vaut `true` côté serveur et
 * au premier rendu, pour que le HTML initial soit animé.
 */
export function useUserAttention(idleMs: number = IDLE_DELAY_MS): boolean {
    const [attentive, setAttentive] = useState(true);
    const attentiveRef = useRef(true);

    useEffect(() => {
        const state: AttentionState = {
            focused: document.hasFocus() && !document.hidden,
            lastInputAt: performance.now(),
        };
        let timer: ReturnType<typeof setTimeout> | undefined;

        const apply = () => {
            const next = isAttentive(state, performance.now(), idleMs);
            if (next !== attentiveRef.current) {
                attentiveRef.current = next;
                setAttentive(next);
            }
            clearTimeout(timer);
            const delay = nextIdleCheckDelay(state, performance.now(), idleMs);
            // Petite marge : le minuteur retombe juste après le seuil.
            if (delay !== null) timer = setTimeout(apply, delay + 50);
        };

        const onInput = () => {
            state.lastInputAt = performance.now();
            // Pas de minuteur par événement : celui en cours reconstate au
            // réveil que l'interaction est récente et se reprogramme.
            if (!attentiveRef.current) apply();
        };
        const onFocusChange = () => {
            state.focused = document.hasFocus() && !document.hidden;
            if (state.focused) state.lastInputAt = performance.now();
            apply();
        };

        const inputEvents = [
            'pointermove',
            'pointerdown',
            'keydown',
            'wheel',
            'scroll',
            'touchstart',
        ] as const;
        inputEvents.forEach((name) =>
            window.addEventListener(name, onInput, { passive: true })
        );
        window.addEventListener('focus', onFocusChange);
        window.addEventListener('blur', onFocusChange);
        document.addEventListener('visibilitychange', onFocusChange);

        apply();

        return () => {
            clearTimeout(timer);
            inputEvents.forEach((name) =>
                window.removeEventListener(name, onInput)
            );
            window.removeEventListener('focus', onFocusChange);
            window.removeEventListener('blur', onFocusChange);
            document.removeEventListener('visibilitychange', onFocusChange);
        };
    }, [idleMs]);

    return attentive;
}
