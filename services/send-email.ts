'use server';

import { AdminContactEmail } from '@/emails/admin-contact-email';
import { ConfirmationEmail } from '@/emails/confirmation-email';
import { render } from '@react-email/components';
import { emailConfig } from './email-config';
import { sendEmailWithNodemailer } from './email-transport';
import type { EmailFormData, EmailResult } from './email.types';

const ADMIN_SUBJECT = 'Nouveau message provenant du site jkd-self-defense-31.fr';
const CONFIRMATION_SUBJECT = 'Confirmation de réception - JKD Self Defense 31';

const logDebug = (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Email Debug] ${message}`, data || '');
    }
};

export const sendEmail = async (
    formData: EmailFormData
): Promise<EmailResult> => {
    const environment = emailConfig.getEnvironment();
    const config = emailConfig.getConfig(environment);

    logDebug('Environnement détecté', environment);
    logDebug('Configuration email', {
        to: config.to,
        from: config.from,
        cc: config.cc,
    });

    try {
        // 1. Rendre le template pour l'admin
        const adminEmailHtml = await render(
            AdminContactEmail({ ...formData })
        );

        // 2. Envoyer l'email à l'admin (avec CC si configuré)
        const adminEmailContent = {
            html: adminEmailHtml,
            subject: ADMIN_SUBJECT,
            from: config.from,
            to: config.to,
            replyTo: formData.email,
            cc: config.cc,
        };

        logDebug('Envoi de l\'email admin', {
            to: adminEmailContent.to,
            cc: adminEmailContent.cc,
            replyTo: adminEmailContent.replyTo,
        });

        const adminResult = await sendEmailWithNodemailer(adminEmailContent);

        if (!adminResult.success) {
            logDebug('Erreur lors de l\'envoi de l\'email admin', {
                error: adminResult.error,
            });
            return adminResult;
        }

        logDebug('Email admin envoyé avec succès', {
            messageId: adminResult.messageId,
        });

        // 3. Rendre le template de confirmation
        const confirmationEmailHtml = await render(
            ConfirmationEmail({
                firstName: formData.firstName,
                lastName: formData.lastName,
            })
        );

        // 4. Envoyer l'email de confirmation à l'utilisateur
        const confirmationEmailContent = {
            html: confirmationEmailHtml,
            subject: CONFIRMATION_SUBJECT,
            from: config.from,
            to: formData.email,
        };

        logDebug('Envoi de l\'email de confirmation', {
            to: confirmationEmailContent.to,
        });

        const confirmationResult = await sendEmailWithNodemailer(
            confirmationEmailContent
        );

        if (!confirmationResult.success) {
            logDebug('Erreur lors de l\'envoi de l\'email de confirmation', {
                error: confirmationResult.error,
            });
            // On retourne quand même un succès car l'email admin a été envoyé
            return {
                success: true,
                messageId: adminResult.messageId,
            };
        }

        logDebug('Email de confirmation envoyé avec succès', {
            messageId: confirmationResult.messageId,
        });

        return {
            success: true,
            messageId: adminResult.messageId,
        };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        logDebug('Erreur critique', { error: errorMessage });
        return {
            success: false,
            error: errorMessage,
        };
    }
};
