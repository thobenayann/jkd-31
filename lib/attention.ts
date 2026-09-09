/**
 * Attention de l'utilisateur : logique pure, sans DOM, testable en node.
 *
 * Un visiteur est « attentif » si la fenêtre a le focus et qu'il a interagi
 * (souris, clavier, défilement, toucher) il y a moins de `idleMs`. Les
 * animations décoratives ne tournent que dans ce cas : quand personne ne
 * regarde, elles sont en pause, et une dérive lente qui s'arrête ne se voit
 * pas.
 */

export const IDLE_DELAY_MS = 60_000;

export interface AttentionState {
    /** La fenêtre a le focus et l'onglet est visible. */
    focused: boolean;
    /** Horodatage (ms, même horloge que `now`) de la dernière interaction. */
    lastInputAt: number;
}

export const isAttentive = (
    state: AttentionState,
    now: number,
    idleMs: number = IDLE_DELAY_MS
): boolean => state.focused && now - state.lastInputAt < idleMs;

/**
 * Délai (ms) avant que l'état ne bascule en inactif, ou `null` s'il n'y a
 * rien à programmer (déjà inactif, ou fenêtre sans focus : c'est alors
 * l'événement de focus qui réveillera).
 */
export const nextIdleCheckDelay = (
    state: AttentionState,
    now: number,
    idleMs: number = IDLE_DELAY_MS
): number | null => {
    if (!isAttentive(state, now, idleMs)) return null;
    return idleMs - (now - state.lastInputAt);
};
