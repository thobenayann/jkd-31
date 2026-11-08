'use server';

import { AdminContactEmail } from '@/emails/admin-contact-email';
import { ConfirmationEmail } from '@/emails/confirmation-email';
import { parseContactSubmission } from '@/lib/validation/contact';
import { render } from '@react-email/components';
import { headers } from 'next/headers';
import { checkContactRateLimit } from './contact-rate-limit';
import { emailConfig } from './email-config';
import { sendEmailWithNodemailer } from './email-transport';
import type { ContactFormResult, EmailFormData } from './email.types';

const ADMIN_SUBJECT = 'Nouveau message provenant du site jkd-self-defense-31.fr';
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
 * Ordre : honeypot, validation, limitation de débit, envoi. Seules les
 * soumissions valides consomment le quota, car seules elles coûtent des mails.
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

    // Destinataire saturé : le bureau reçoit la demande, la confirmation saute.
    return deliver(submission.data, rateLimit !== 'recipient_limited');
};

const deliver = async (
    formData: EmailFormData,
    sendConfirmation: boolean
): Promise<ContactFormResult> => {
    const environment = emailConfig.getEnvironment();
    const config = emailConfig.getConfig(environment);

    logDebug('Environnement détecté', environment);
    logDebug('Configuration email', {
        to: config.to,
        from: config.from,
        cc: config.cc,
    });

    try {
        // 1. Mail à l'admin (avec CC si configuré)
        const adminResult = await sendEmailWithNodemailer({
            html: await render(AdminContactEmail({ ...formData })),
            subject: ADMIN_SUBJECT,
            from: config.from,
            to: config.to,
            replyTo: formData.email,
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

        if (!sendConfirmation) {
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
