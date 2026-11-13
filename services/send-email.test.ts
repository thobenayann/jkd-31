import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HONEYPOT_FIELD } from '@/lib/validation/contact';
import { checkContactRateLimit } from './contact-rate-limit';
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

vi.mock('./contact-rate-limit', () => ({ checkContactRateLimit: vi.fn() }));
const rateLimit = vi.mocked(checkContactRateLimit);

const ADMIN = 'bureau@jkd-selfdefense31.fr';

const valid = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@exemple.fr',
    phoneNumber: '06 12 34 56 78',
    message: 'Je voudrais faire un cours d’essai.',
    [HONEYPOT_FIELD]: '',
};

type SentMail = { to: string; replyTo?: string; subject: string; html: string };
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
        rateLimit.mockResolvedValue('ok');
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        vi.spyOn(console, 'info').mockImplementation(() => {});
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

    it('n’envoie rien quand l’expéditeur dépasse la limite', async () => {
        rateLimit.mockResolvedValue('sender_limited');
        await expect(sendEmail(valid)).resolves.toEqual({
            status: 'rate_limited',
        });
        expect(rateLimit).toHaveBeenCalledWith(REQUEST_HEADERS, valid.email);
        expect(sendMail).not.toHaveBeenCalled();
    });

    it('prévient le bureau mais épargne un destinataire saturé', async () => {
        // Un tiers qui sature l'adresse de quelqu'un ne doit pas l'empêcher
        // de joindre le club : seule la confirmation saute.
        rateLimit.mockResolvedValue('recipient_limited');
        await expect(sendEmail(valid)).resolves.toEqual({ status: 'success' });
        expect(sent().map((mail) => mail.to)).toEqual([ADMIN]);
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

    describe('tri des liens (campagne de phishing de novembre 2026)', () => {
        const PHISHING = {
            ...valid,
            message:
                'Bonjour, nous organisons un stage régional. Le dossier est ici : https://partagepro.online/fr/b2b/jkd31',
        };

        it('un message propre garde son objet, son Reply-To et sa confirmation', async () => {
            await expect(sendEmail(valid)).resolves.toEqual({ status: 'success' });

            const [admin, confirmation] = sent();
            expect(admin.subject).toBe(
                'Nouveau message provenant du site jkd-selfdefense31.fr'
            );
            expect(admin.replyTo).toBe(valid.email);
            expect(admin.html).not.toContain('À VÉRIFIER');
            expect(admin.html).not.toContain('Message à vérifier');
            expect(confirmation.to).toBe(valid.email);
        });

        it('un message avec un lien inconnu arrive au bureau, signalé et sans lien', async () => {
            await expect(sendEmail(PHISHING)).resolves.toEqual({ status: 'success' });

            const [admin] = sent();
            expect(sent()).toHaveLength(1);
            expect(admin.to).toBe(ADMIN);
            expect(admin.subject).toBe(
                '[À VÉRIFIER] Nouveau message provenant du site jkd-selfdefense31.fr'
            );
            expect(admin.replyTo).toBeUndefined();
            expect(admin.html).toContain('Message à vérifier avant toute action');
            expect(admin.html).toContain('hxxps://partagepro[.]online/fr/b2b/jkd31');
            expect(admin.html).not.toContain('partagepro.online');
            // L'adresse du demandeur reste lisible, mais n'est plus un lien.
            expect(admin.html).toContain(valid.email);
            expect(admin.html).not.toContain(`mailto:${valid.email}`);
        });

        it('ne répond pas « suspect » au visiteur, pour ne rien lui apprendre', async () => {
            const result = await sendEmail(PHISHING);
            expect(JSON.stringify(result)).not.toMatch(/suspect|vérifier/i);
        });

        it('un lien vers le site reste lisible et ne rend pas le message suspect', async () => {
            const message =
                'J’ai vu les tarifs sur https://www.jkd-selfdefense31.fr/tarifs, la licence est-elle comprise ?';
            await sendEmail({ ...valid, message });

            const [admin] = sent();
            expect(sent()).toHaveLength(2);
            expect(admin.subject).not.toContain('À VÉRIFIER');
            expect(admin.html).toContain('https://www.jkd-selfdefense31.fr/tarifs');
        });

        it('un lien caché par un caractère invisible est repéré quand même', async () => {
            await sendEmail({
                ...valid,
                message: 'Le dossier : partagepro­.online/fr',
            });
            expect(sent()).toHaveLength(1);
            expect(sent()[0].subject).toMatch(/^\[À VÉRIFIER\] /);
            expect(sent()[0].html).toContain('partagepro[.]online/fr');
        });

        it('un domaine caché derrière un lien vers le site est signalé et désamorcé', async () => {
            await sendEmail({
                ...valid,
                message: "Voir https://www.jkd-selfdefense31.fr/x'www.partagepro.online/fr",
            });
            const [admin] = sent();
            expect(sent()).toHaveLength(1);
            expect(admin.subject).toMatch(/^\[À VÉRIFIER\] /);
            expect(admin.html).toContain('www[.]partagepro[.]online/fr');
            expect(admin.html).not.toContain('partagepro.online');
        });

        it('trace le verdict sans aucune donnée personnelle', async () => {
            await sendEmail(PHISHING);

            expect(console.warn).toHaveBeenCalledTimes(1);
            const [line] = vi.mocked(console.warn).mock.calls[0];
            expect(JSON.parse(line as string)).toEqual({
                event: 'contact_screening',
                verdict: 'suspect',
                reasons: ['link_not_allowed'],
                linkHosts: ['partagepro.online'],
            });
            for (const value of [valid.email, valid.firstName, valid.lastName, valid.phoneNumber]) {
                expect(line).not.toContain(value);
            }
        });

        it('trace aussi les messages propres, au niveau info', async () => {
            await sendEmail(valid);
            const [line] = vi.mocked(console.info).mock.calls[0];
            expect(JSON.parse(line as string)).toMatchObject({ verdict: 'clean' });
        });
    });

    describe('domaine du site dans les mails', () => {
        it('ne renvoie que vers le domaine de l’association', async () => {
            await sendEmail(valid);

            for (const mail of sent()) {
                // `jkd-self-defense-31.fr`, avec tirets, n'appartient pas à l'association.
                expect(mail.html).not.toContain('jkd-self-defense-31');
                expect(mail.subject).not.toContain('jkd-self-defense-31');
                expect(mail.html).toContain('href="https://www.jkd-selfdefense31.fr"');
            }
        });
    });
});
