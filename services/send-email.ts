'use server';

import { AdminContactEmail } from '@/emails/admin-contact-email';
import { ConfirmationEmail } from '@/emails/confirmation-email';
import { buildAdminEnvelope } from '@/lib/contact-admin-email';
import {
    type ScreeningResult,
    screenContactSubmission,
    toScreeningLog,
} from '@/lib/contact-screening';
import { parseContactSubmission } from '@/lib/validation/contact';
import { render } from '@react-email/components';
import { headers } from 'next/headers';
import { checkContactRateLimit } from './contact-rate-limit';
import { emailConfig } from './email-config';
import { sendEmailWithNodemailer } from './email-transport';
import type { ContactFormResult, EmailFormData } from './email.types';

const CONFIRMATION_SUBJECT = 'Confirmation de réception - JKD Self Defense 31';

const logDebug = (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Email Debug] ${message}`, data || '');
    }
};

/**
 * Server action du formulaire de contact.
 *
 * Next.js l'expose comme un point d'entrée POST public : le payload est
 * `unknown` tant que `parseContactSubmission` ne l'a pas validé.
 *
 * Ordre : honeypot, validation, limitation de débit, tri des liens, envoi.
 * Seules les soumissions valides consomment le quota, car seules elles coûtent
 * des mails. Le tri ne bloque rien : un message suspect part au bureau
 * signalé et désamorcé, sans Reply-To ni confirmation, pour ne jamais perdre
 * une vraie demande. Le visiteur reçoit la même réponse dans les deux cas.
 */
export const sendEmail = async (
    payload: unknown
): Promise<ContactFormResult> => {
    const submission = parseContactSubmission(payload);

    if (submission.kind === 'spam') {
        // Faux succès : le robot ne doit pas savoir qu'il est repéré.
        logDebug('Honeypot rempli, soumission ignorée');
        return { status: 'success' };
    }

    if (submission.kind === 'invalid') {
        return { status: 'invalid', fieldErrors: submission.fieldErrors };
    }

    const rateLimit = await checkContactRateLimit(
        await headers(),
        submission.data.email
    );
    if (rateLimit === 'sender_limited') {
        return { status: 'rate_limited' };
    }

    const screening = screenContactSubmission(submission.data);
    logScreening(screening);

    // Destinataire saturé : le bureau reçoit la demande, la confirmation saute.
    return deliver(
        submission.data,
        screening,
        rateLimit !== 'recipient_limited'
    );
};

/**
 * Une ligne JSON par message valide, sans aucune donnée saisie : verdict,
 * motifs et hôtes des liens. Au niveau `warn` si le message est suspect, pour
 * le repérer d'un filtre dans les logs Vercel.
 */
const logScreening = (screening: ScreeningResult) => {
    const line = JSON.stringify(toScreeningLog(screening));
    if (screening.verdict === 'suspect') {
        console.warn(line);
    } else {
        console.info(line);
    }
};

const deliver = async (
    formData: EmailFormData,
    screening: ScreeningResult,
    recipientAvailable: boolean
): Promise<ContactFormResult> => {
    const environment = emailConfig.getEnvironment();
    const config = emailConfig.getConfig(environment);
    const envelope = buildAdminEnvelope(screening, formData.email);

    logDebug('Environnement détecté', environment);
    logDebug('Configuration email', {
        to: config.to,
        from: config.from,
        cc: config.cc,
    });

    try {
        // 1. Mail à l'admin (avec CC si configuré). Message suspect : objet
        // signalé, liens désamorcés, pas de Reply-To.
        const adminResult = await sendEmailWithNodemailer({
            html: await render(AdminContactEmail({ ...formData, screening })),
            subject: envelope.subject,
            from: config.from,
            to: config.to,
            replyTo: envelope.replyTo,
            cc: config.cc,
        });

        if (!adminResult.success) {
            // Le détail SMTP reste dans les logs serveur.
            console.error(
                "[contact] Échec de l'envoi du mail admin :",
                adminResult.error
            );
            return { status: 'error' };
        }

        logDebug('Email admin envoyé avec succès', {
            messageId: adminResult.messageId,
        });

        // Message suspect : rien ne part vers l'adresse saisie.
        if (!envelope.sendConfirmation) {
            return { status: 'success' };
        }

        if (!recipientAvailable) {
            console.warn(
                '[contact] Destinataire saturé : confirmation non envoyée.'
            );
            return { status: 'success' };
        }

        // 2. Confirmation au visiteur, une seule adresse validée
        const confirmationResult = await sendEmailWithNodemailer({
            html: await render(
                ConfirmationEmail({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                })
            ),
            subject: CONFIRMATION_SUBJECT,
            from: config.from,
            to: formData.email,
        });

        if (!confirmationResult.success) {
            // Pas de détail : la réponse SMTP contient souvent l'adresse du visiteur.
            // Le bureau a reçu la demande, c'est l'essentiel.
            console.error("[contact] Mail de confirmation non envoyé.");
            logDebug('Erreur du mail de confirmation', {
                error: confirmationResult.error,
            });
        }

        return { status: 'success' };
    } catch (error) {
        console.error("[contact] Erreur inattendue pendant l'envoi :", error);
        return { status: 'error' };
    }
};
