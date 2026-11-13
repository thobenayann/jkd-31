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
            subject: `[À VÉRIFIER] ${ADMIN_SUBJECT}`,
            replyTo: undefined,
            sendConfirmation: false,
        });
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
