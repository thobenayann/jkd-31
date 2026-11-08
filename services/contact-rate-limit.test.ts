import { checkRateLimit } from '@vercel/firewall';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    CONTACT_RATE_LIMIT_ID,
    checkContactRateLimit,
} from './contact-rate-limit';

vi.mock('@vercel/firewall', () => ({ checkRateLimit: vi.fn() }));

const sdk = vi.mocked(checkRateLimit);

const IP = '203.0.113.42';
const RECIPIENT = 'jean.dupont@exemple.fr';
const headersFor = (ip: string) =>
    new Headers({ host: 'www.jkd-selfdefense31.fr', 'x-real-ip': ip });

/** Lance un contrôle et renvoie les clés transmises au SDK pendant cet appel. */
const keysFor = async (requestHeaders: Headers, recipient = RECIPIENT) => {
    sdk.mockClear();
    await checkContactRateLimit(requestHeaders, recipient);
    return sdk.mock.calls.map(([, options]) => options?.rateLimitKey);
};
const ipKeyOf = async (ip: string) => (await keysFor(headersFor(ip)))[0];
const recipientKeyOf = async (recipient: string) =>
    (await keysFor(headersFor(IP), recipient))[1];

/** Le SDK répond « limité » pour les seules clés données. */
const limitKeys = (...limited: (string | undefined)[]) =>
    sdk.mockImplementation(async (_, options) => ({
        rateLimited: limited.includes(options?.rateLimitKey),
    }));

describe('checkContactRateLimit', () => {
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

    it('laisse passer quand aucun compteur n’est plein', async () => {
        await expect(
            checkContactRateLimit(headersFor(IP), RECIPIENT)
        ).resolves.toBe('ok');
        expect(sdk).toHaveBeenCalledWith(
            CONTACT_RATE_LIMIT_ID,
            expect.objectContaining({ timeout: 1500 })
        );
    });

    it('bloque l’expéditeur dont l’IP a trop envoyé', async () => {
        limitKeys(await ipKeyOf(IP));
        await expect(
            checkContactRateLimit(headersFor(IP), RECIPIENT)
        ).resolves.toBe('sender_limited');
    });

    it('ne consomme pas le compteur du destinataire quand l’IP est bloquée', async () => {
        limitKeys(await ipKeyOf(IP));
        expect(await keysFor(headersFor(IP))).toHaveLength(1);
    });

    it('signale un destinataire saturé, quelle que soit l’IP', async () => {
        limitKeys(await recipientKeyOf(RECIPIENT));
        await expect(
            checkContactRateLimit(headersFor('198.51.100.7'), RECIPIENT)
        ).resolves.toBe('recipient_limited');
    });

    it('compte séparément l’IP et le destinataire', async () => {
        const keys = await keysFor(headersFor(IP));
        expect(keys).toHaveLength(2);
        expect(keys[0]).not.toBe(keys[1]);
    });

    it('ne transmet jamais l’IP ni l’adresse en clair', async () => {
        for (const key of await keysFor(headersFor(IP))) {
            expect(key).toMatch(/^[0-9a-f]{64}$/);
            expect(key).not.toContain(IP);
            expect(key).not.toContain(RECIPIENT);
        }
    });

    describe('clé de l’IP', () => {
        it('est stable pour une IP et change avec l’IP', async () => {
            const first = await ipKeyOf(IP);
            expect(await ipKeyOf(IP)).toBe(first);
            expect(await ipKeyOf('198.51.100.7')).not.toBe(first);
        });

        it('change quand le secret change', async () => {
            const first = await ipKeyOf(IP);
            vi.stubEnv('RATE_LIMIT_SECRET', 'autre-secret');
            expect(await ipKeyOf(IP)).not.toBe(first);
        });

        it('prend la première IP de x-forwarded-for à défaut de x-real-ip', async () => {
            const fromRealIp = await ipKeyOf(IP);
            const [fromForwarded] = await keysFor(
                new Headers({ 'x-forwarded-for': `${IP}, 10.0.0.1` })
            );
            expect(fromForwarded).toBe(fromRealIp);
        });

        it('regroupe les IPv6 d’un même /64, le bloc d’un abonné', async () => {
            const first = await ipKeyOf('2001:db8:85a3:1234:aaaa::1');
            expect(await ipKeyOf('2001:db8:85a3:1234:ffff:ffff:ffff:fffe')).toBe(
                first
            );
            expect(await ipKeyOf('2001:0DB8:85A3:1234:0:0:0:2')).toBe(first);
            expect(await ipKeyOf('2001:db8:85a3:1235::1')).not.toBe(first);
        });

        it('traite une IPv4 notée en IPv6 comme l’IPv4', async () => {
            expect(await ipKeyOf(`::ffff:${IP}`)).toBe(await ipKeyOf(IP));
        });
    });

    describe('clé du destinataire', () => {
        it('ignore la casse et le suffixe +étiquette', async () => {
            const first = await recipientKeyOf(RECIPIENT);
            expect(await recipientKeyOf('Jean.Dupont@Exemple.FR')).toBe(first);
            expect(await recipientKeyOf('jean.dupont+promo@exemple.fr')).toBe(
                first
            );
            expect(await recipientKeyOf('autre@exemple.fr')).not.toBe(first);
        });

        it('garde les points hors Gmail, où ils distinguent deux boîtes', async () => {
            expect(await recipientKeyOf('jeandupont@exemple.fr')).not.toBe(
                await recipientKeyOf(RECIPIENT)
            );
        });

        it('suit Gmail, qui ignore les points et le domaine googlemail.com', async () => {
            const first = await recipientKeyOf('jeandupont@gmail.com');
            expect(await recipientKeyOf('j.ean.dupont@gmail.com')).toBe(first);
            expect(await recipientKeyOf('Jean.Dupont+x@GoogleMail.com')).toBe(
                first
            );
        });
    });

    it.each([
        ['hors de Vercel', () => vi.stubEnv('VERCEL', '')],
        ['sans secret', () => vi.stubEnv('RATE_LIMIT_SECRET', '')],
    ])('laisse passer sans appeler Vercel %s', async (_, setup) => {
        setup();
        await expect(
            checkContactRateLimit(headersFor(IP), RECIPIENT)
        ).resolves.toBe('ok');
        expect(sdk).not.toHaveBeenCalled();
    });

    it('ne compte que le destinataire si l’IP est inconnue', async () => {
        const keys = await keysFor(new Headers());
        expect(keys).toEqual([await recipientKeyOf(RECIPIENT)]);
    });

    it('laisse passer si le contrôle échoue ou dépasse le délai', async () => {
        const timeout = new Error('signal timed out');
        timeout.name = 'TimeoutError';
        sdk.mockRejectedValue(timeout);
        await expect(
            checkContactRateLimit(headersFor(IP), RECIPIENT)
        ).resolves.toBe('ok');
        expect(console.warn).toHaveBeenCalled();
    });
});
