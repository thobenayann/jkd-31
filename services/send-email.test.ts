import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HONEYPOT_FIELD } from '@/lib/validation/contact';
import { isContactRateLimited } from './contact-rate-limit';
import { sendEmail } from './send-email';

// Nodemailer est simulé : aucun mail ne part, on inspecte ce qui aurait été envoyé.
const { sendMail } = vi.hoisted(() => ({ sendMail: vi.fn() }));
vi.mock('nodemailer', () => ({
    default: { createTransport: vi.fn(() => ({ sendMail })) },
}));

const REQUEST_HEADERS = new Headers({
    host: 'www.jkd-selfdefense31.fr',
    'x-real-ip': '203.0.113.42',
});
vi.mock('next/headers', () => ({ headers: vi.fn(async () => REQUEST_HEADERS) }));

vi.mock('./contact-rate-limit', () => ({ isContactRateLimited: vi.fn() }));
const rateLimit = vi.mocked(isContactRateLimited);

const ADMIN = 'bureau@jkd-selfdefense31.fr';

const valid = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@exemple.fr',
    phoneNumber: '06 12 34 56 78',
    message: 'Je voudrais faire un cours d’essai.',
    [HONEYPOT_FIELD]: '',
};

type SentMail = { to: string; replyTo?: string; html: string };
const sent = () => sendMail.mock.calls.map(([options]) => options as SentMail);

describe('sendEmail (server action du formulaire de contact)', () => {
    beforeEach(() => {
        vi.stubEnv('VERCEL_ENV', 'production');
        vi.stubEnv('SERVER_MAIL', 'contact@jkd-selfdefense31.fr');
        vi.stubEnv('SERVER_MAIL_PASSWORD', 'mot-de-passe-smtp');
        vi.stubEnv('ADMIN_MAIL', ADMIN);
        vi.stubEnv('ADMIN_MAIL_CC', '');
        sendMail.mockReset();
        sendMail.mockResolvedValue({ messageId: '<id@gandi>' });
        rateLimit.mockReset();
        rateLimit.mockResolvedValue(false);
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    it('envoie le mail admin puis la confirmation au seul visiteur', async () => {
        await expect(sendEmail(valid)).resolves.toEqual({ status: 'success' });

        const [admin, confirmation] = sent();
        expect(sent()).toHaveLength(2);
        expect(admin.to).toBe(ADMIN);
        expect(admin.replyTo).toBe(valid.email);
        expect(confirmation.to).toBe(valid.email);
    });

    it('envoie les valeurs normalisées', async () => {
        await sendEmail({ ...valid, email: '  jean.dupont@exemple.fr  ' });
        expect(sent()[1].to).toBe('jean.dupont@exemple.fr');
    });

    it('refuse une liste d’adresses sans rien envoyer (relais de spam)', async () => {
        const result = await sendEmail({
            ...valid,
            email: 'victime1@exemple.fr, victime2@exemple.org',
        });

        expect(result).toEqual({
            status: 'invalid',
            fieldErrors: { email: "Format d'email invalide." },
        });
        expect(sendMail).not.toHaveBeenCalled();
        expect(rateLimit).not.toHaveBeenCalled();
    });

    it('refuse un champ inattendu sans rien envoyer', async () => {
        const result = await sendEmail({ ...valid, bcc: 'victime@exemple.fr' });
        expect(result.status).toBe('invalid');
        expect(sendMail).not.toHaveBeenCalled();
    });

    it('refuse un payload qui n’est pas un objet', async () => {
        await expect(sendEmail('jean.dupont@exemple.fr')).resolves.toEqual({
            status: 'invalid',
            fieldErrors: {},
        });
        expect(sendMail).not.toHaveBeenCalled();
    });

    it('fait croire au succès quand le honeypot est rempli, sans rien envoyer', async () => {
        const result = await sendEmail({ ...valid, [HONEYPOT_FIELD]: 'x' });
        expect(result).toEqual({ status: 'success' });
        expect(sendMail).not.toHaveBeenCalled();
        expect(rateLimit).not.toHaveBeenCalled();
    });

    it('n’envoie rien quand la limite de débit est atteinte', async () => {
        rateLimit.mockResolvedValue(true);
        await expect(sendEmail(valid)).resolves.toEqual({
            status: 'rate_limited',
        });
        expect(rateLimit).toHaveBeenCalledWith(REQUEST_HEADERS, valid.email);
        expect(sendMail).not.toHaveBeenCalled();
    });

    it('renvoie une erreur générique quand le SMTP échoue, sans en exposer le détail', async () => {
        sendMail.mockRejectedValue(
            new Error('Invalid login: 535 5.7.8 Authentication failed')
        );

        const result = await sendEmail(valid);

        expect(result).toEqual({ status: 'error' });
        expect(JSON.stringify(result)).not.toMatch(/535|Authentication/);
        expect(console.error).toHaveBeenCalled();
    });

    it('n’expose pas une configuration SMTP manquante', async () => {
        vi.stubEnv('SERVER_MAIL_PASSWORD', '');
        const result = await sendEmail(valid);
        expect(result).toEqual({ status: 'error' });
        expect(JSON.stringify(result)).not.toContain('SERVER_MAIL');
    });

    it('reste un succès si seule la confirmation échoue', async () => {
        sendMail
            .mockResolvedValueOnce({ messageId: '<admin@gandi>' })
            .mockRejectedValueOnce(new Error('550 mailbox unavailable'));

        await expect(sendEmail(valid)).resolves.toEqual({ status: 'success' });
    });

    it('échappe le HTML saisi dans le message', async () => {
        await sendEmail({
            ...valid,
            message: '<script>alert(1)</script><img src=x onerror=alert(2)>',
        });

        const adminHtml = sent()[0].html;
        expect(adminHtml).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
        expect(adminHtml).not.toContain('<script>');
        expect(adminHtml).not.toContain('<img src=x');
    });
});
