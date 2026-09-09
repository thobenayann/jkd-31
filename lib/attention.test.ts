import { describe, expect, it } from 'vitest';
import { IDLE_DELAY_MS, isAttentive, nextIdleCheckDelay } from './attention';

describe('isAttentive', () => {
    it('est attentif juste après une interaction, fenêtre au premier plan', () => {
        expect(isAttentive({ focused: true, lastInputAt: 1000 }, 1500)).toBe(
            true
        );
    });

    it("n'est plus attentif une fois le délai d'inactivité écoulé", () => {
        expect(
            isAttentive({ focused: true, lastInputAt: 0 }, IDLE_DELAY_MS)
        ).toBe(false);
        expect(
            isAttentive({ focused: true, lastInputAt: 0 }, IDLE_DELAY_MS - 1)
        ).toBe(true);
    });

    it("n'est jamais attentif sans le focus, même en pleine interaction", () => {
        expect(isAttentive({ focused: false, lastInputAt: 1000 }, 1001)).toBe(
            false
        );
    });

    it('accepte un délai personnalisé', () => {
        expect(isAttentive({ focused: true, lastInputAt: 0 }, 500, 1000)).toBe(
            true
        );
        expect(isAttentive({ focused: true, lastInputAt: 0 }, 1000, 1000)).toBe(
            false
        );
    });
});

describe('nextIdleCheckDelay', () => {
    it('renvoie le temps restant avant inactivité', () => {
        expect(nextIdleCheckDelay({ focused: true, lastInputAt: 0 }, 0)).toBe(
            IDLE_DELAY_MS
        );
        expect(
            nextIdleCheckDelay({ focused: true, lastInputAt: 1000 }, 21_000)
        ).toBe(IDLE_DELAY_MS - 20_000);
    });

    it('ne programme rien quand déjà inactif ou sans focus', () => {
        expect(
            nextIdleCheckDelay({ focused: true, lastInputAt: 0 }, IDLE_DELAY_MS)
        ).toBeNull();
        expect(nextIdleCheckDelay({ focused: false, lastInputAt: 0 }, 1)).toBe(
            null
        );
    });
});
