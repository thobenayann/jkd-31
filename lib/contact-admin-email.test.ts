import { describe, expect, it } from 'vitest';
import {
    ADMIN_SUBJECT,
    buildAdminEnvelope,
    reasonLabels,
} from './contact-admin-email';

describe('buildAdminEnvelope', () => {
    it('garde le parcours normal pour un message propre', () => {
        expect(buildAdminEnvelope({ verdict: 'clean' }, 'jean@exemple.fr')).toEqual({
            subject: 'Nouveau message provenant du site jkd-selfdefense31.fr',
            replyTo: 'jean@exemple.fr',
            sendConfirmation: true,
        });
    });

    it('signale un message suspect, sans Reply-To ni confirmation', () => {
        expect(buildAdminEnvelope({ verdict: 'suspect' }, 'x@piege.online')).toEqual({
            subject: '[À VÉRIFIER] Message signalé sur le site jkd-selfdefense31.fr',
            replyTo: undefined,
            sendConfirmation: false,
        });
    });

    it('donne au message suspect un objet qui ne rejoint pas la conversation des messages propres', () => {
        // Gmail regroupe les mails d'un même expéditeur au même objet en
        // ignorant un préfixe entre crochets : constaté sur la preview le
        // 13 novembre 2026. Le texte après le préfixe doit donc différer.
        const { subject } = buildAdminEnvelope({ verdict: 'suspect' }, 'x@piege.online');
        const withoutTag = subject.replace(/^\[[^\]]*\]\s*/, '');
        expect(withoutTag).not.toBe(ADMIN_SUBJECT);
        expect(withoutTag.toLowerCase()).not.toContain(ADMIN_SUBJECT.toLowerCase());
    });

    it('traite un verdict absent ou inattendu comme suspect', () => {
        for (const screening of [undefined, { verdict: 'inconnu' }] as const) {
            const envelope = buildAdminEnvelope(
                screening as Parameters<typeof buildAdminEnvelope>[0],
                'jean@exemple.fr'
            );
            expect(envelope.sendConfirmation).toBe(false);
            expect(envelope.replyTo).toBeUndefined();
        }
    });
});

describe('reasonLabels', () => {
    it('traduit les motifs connus et ignore les autres', () => {
        expect(reasonLabels(['link_not_allowed', 'autre', 'link_in_identity_field'])).toEqual([
            'il contient un lien vers un site extérieur au club',
            'un lien figure dans le nom ou le téléphone',
        ]);
        expect(reasonLabels(undefined)).toEqual([]);
    });
});
