import nodemailer from 'nodemailer';
import path from 'path';
import { readFileSync } from 'fs';
import type { EmailResult } from './email.types';

type EmailContent = {
    html: string;
    subject: string;
    from: string;
    to: string;
    replyTo?: string;
    cc?: string;
    attachments?: nodemailer.Attachment[];
};

const createNodemailerTransport = () => {
    const serverMail = process.env.SERVER_MAIL;
    const serverMailPassword = process.env.SERVER_MAIL_PASSWORD;

    if (!serverMail || !serverMailPassword) {
        throw new Error(
            'SERVER_MAIL and SERVER_MAIL_PASSWORD must be set'
        );
    }

    return nodemailer.createTransport({
        host: 'mail.gandi.net',
        port: 465,
        secure: true,
        auth: {
            user: serverMail,
            pass: serverMailPassword,
        },
    });
};

const getLogoAttachment = (): nodemailer.Attachment | null => {
    try {
        const logoPath = path.join(process.cwd(), 'public', 'images', 'logo', 'logo-jkd-sd-31.png');
        const logoBuffer = readFileSync(logoPath);
        
        return {
            filename: 'logo-jkd-sd-31.png',
            content: logoBuffer,
            cid: 'logo@jkd-self-defense-31.fr',
        };
    } catch (error) {
        console.error('Erreur lors du chargement du logo:', error);
        return null;
    }
};

export const sendEmailWithNodemailer = async (
    content: EmailContent
): Promise<EmailResult> => {
    try {
        const transporter = createNodemailerTransport();
        
        const mailOptions: nodemailer.SendMailOptions = {
            from: content.from,
            to: content.to,
            subject: content.subject,
            html: content.html,
        };

        if (content.replyTo) {
            mailOptions.replyTo = content.replyTo;
        }

        if (content.cc) {
            mailOptions.cc = content.cc;
        }

        // Ajouter les attachments (logo + autres si présents)
        const attachments: nodemailer.Attachment[] = [];
        
        // Ajouter le logo si pas déjà présent dans les attachments
        if (!content.attachments || !content.attachments.some(att => att.cid === 'logo@jkd-self-defense-31.fr')) {
            const logoAttachment = getLogoAttachment();
            if (logoAttachment) {
                attachments.push(logoAttachment);
            }
        }

        // Ajouter les autres attachments si présents
        if (content.attachments) {
            attachments.push(...content.attachments);
        }

        if (attachments.length > 0) {
            mailOptions.attachments = attachments;
        }

        const response = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: response.messageId,
        };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        return {
            success: false,
            error: errorMessage,
        };
    }
};
