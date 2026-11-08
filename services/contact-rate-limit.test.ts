import { checkRateLimit } from '@vercel/firewall';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    CONTACT_RATE_LIMIT_ID,
    isContactRateLimited,
} from './contact-rate-limit';

vi.mock('@vercel/firewall', () => ({ checkRateLimit: vi.fn() }));

const sdk = vi.mocked(checkRateLimit);

const IP = '203.0.113.42';
const headersFor = (ip: string) =>
    new Headers({ host: 'www.jkd-selfdefense31.fr', 'x-real-ip': ip });

/** Clé transmise au SDK lors du dernier appel. */
const lastKey = () => sdk.mock.lastCall?.[1]?.rateLimitKey;

describe('isContactRateLimited', () => {
    beforeEach(() => {
        vi.stubEnv('VERCEL', '1');
        vi.stubEnv('RATE_LIMIT_SECRET', 'secret-de-test');
        sdk.mockReset();
        sdk.mockResolvedValue({ rateLimited: false });
        vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    it('relaie la décision de la règle Vercel', async () => {
        sdk.mockResolvedValue({ rateLimited: true });
        await expect(isContactRateLimited(headersFor(IP))).resolves.toBe(true);
        expect(sdk).toHaveBeenCalledWith(
            CONTACT_RATE_LIMIT_ID,
            expect.objectContaining({ timeout: 1500 })
        );
    });

    it('ne transmet jamais l’IP en clair dans la clé', async () => {
        await isContactRateLimited(headersFor(IP));
        const key = lastKey();
        expect(key).toMatch(/^[0-9a-f]{64}$/);
        expect(key).not.toContain(IP);
    });

    it('donne la même clé pour la même IP et une autre pour une autre IP', async () => {
        await isContactRateLimited(headersFor(IP));
        const first = lastKey();
        await isContactRateLimited(headersFor(IP));
        expect(lastKey()).toBe(first);
        await isContactRateLimited(headersFor('198.51.100.7'));
        expect(lastKey()).not.toBe(first);
    });

    it('change de clé quand le secret change', async () => {
        await isContactRateLimited(headersFor(IP));
        const first = lastKey();
        vi.stubEnv('RATE_LIMIT_SECRET', 'autre-secret');
        await isContactRateLimited(headersFor(IP));
        expect(lastKey()).not.toBe(first);
    });

    it('prend la première IP de x-forwarded-for à défaut de x-real-ip', async () => {
        await isContactRateLimited(headersFor(IP));
        const fromRealIp = lastKey();
        await isContactRateLimited(
            new Headers({ 'x-forwarded-for': `${IP}, 10.0.0.1` })
        );
        expect(lastKey()).toBe(fromRealIp);
    });

    it.each([
        ['hors de Vercel', () => vi.stubEnv('VERCEL', '')],
        ['sans secret', () => vi.stubEnv('RATE_LIMIT_SECRET', '')],
    ])('laisse passer sans appeler Vercel %s', async (_, setup) => {
        setup();
        await expect(isContactRateLimited(headersFor(IP))).resolves.toBe(false);
        expect(sdk).not.toHaveBeenCalled();
    });

    it('laisse passer sans appeler Vercel si l’IP est inconnue', async () => {
        await expect(isContactRateLimited(new Headers())).resolves.toBe(false);
        expect(sdk).not.toHaveBeenCalled();
    });

    it('laisse passer si le contrôle échoue ou dépasse le délai', async () => {
        const timeout = new Error('signal timed out');
        timeout.name = 'TimeoutError';
        sdk.mockRejectedValue(timeout);
        await expect(isContactRateLimited(headersFor(IP))).resolves.toBe(false);
        expect(console.warn).toHaveBeenCalled();
    });
});
