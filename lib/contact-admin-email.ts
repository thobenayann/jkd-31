/**
 * Enveloppe du mail envoyé au bureau pour un message du formulaire : objet,
 * destinataire de la réponse, envoi ou non de la confirmation au visiteur,
 * selon le tri des liens (`contact-screening.ts`). Fonctions pures.
 *
 * Inspiré de `src/lib/contact-email-content.mjs` d'Hexoprint.
 */

import { SITE_DOMAIN } from '@/constant/site';
import type { ScreeningReason, ScreeningResult } from './contact-screening';

export const ADMIN_SUBJECT = `Nouveau message provenant du site ${SITE_DOMAIN}`;
export const SUSPECT_SUBJECT_PREFIX = '[À VÉRIFIER] ';
export const SUSPECT_BANNER_TITLE = 'Message à vérifier avant toute action';
export const SUSPECT_BANNER_BODY =
    "Ce message a été mis de côté automatiquement. Ses liens ont été désactivés. N'en recopiez aucun dans un navigateur tant que vous n'avez pas vérifié l'expéditeur. Pour répondre à une vraie demande, copiez son adresse e-mail ci-dessous.";

/** Motifs du tri, formulés pour suivre « Signalé car ». */
export const REASON_LABELS: Readonly<Record<ScreeningReason, string>> = Object.freeze({
    link_not_allowed: 'il contient un lien vers un site extérieur au club',
    link_in_identity_field: 'un lien figure dans le nom ou le téléphone',
});

export type AdminEnvelope = {
    subject: string;
    /**
     * Absent si le message est suspect : répondre au mail écrirait à
     * l'expéditeur du message piégé.
     */
    replyTo: string | undefined;
    /** Faux si le message est suspect : le site ne relaie rien vers l'adresse saisie. */
    sendConfirmation: boolean;
};

/**
 * Seul un message `clean` suit le parcours normal. Tout le reste, y compris un
 * verdict absent ou inattendu, est traité comme suspect : en cas de doute, on
 * n'envoie rien au visiteur.
 */
export function isCleanScreening(screening: Pick<ScreeningResult, 'verdict'> | undefined): boolean {
    return screening?.verdict === 'clean';
}

export function buildAdminEnvelope(
    screening: Pick<ScreeningResult, 'verdict'> | undefined,
    senderEmail: string
): AdminEnvelope {
    const clean = isCleanScreening(screening);
    return {
        subject: clean ? ADMIN_SUBJECT : `${SUSPECT_SUBJECT_PREFIX}${ADMIN_SUBJECT}`,
        replyTo: clean ? senderEmail : undefined,
        sendConfirmation: clean,
    };
}

/** Libellés des motifs connus, dans l'ordre du tri. Un motif inconnu est ignoré. */
export function reasonLabels(reasons: readonly string[] | undefined): string[] {
    return (reasons ?? [])
        .filter((reason): reason is ScreeningReason => Object.hasOwn(REASON_LABELS, reason))
        .map((reason) => REASON_LABELS[reason]);
}
