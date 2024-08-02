'use server';

import Email from '@/emails/email-template';
import { Resend } from 'resend';
import emailConfig from './emailConfig';

const resend = new Resend(process.env.RESEND_API_KEY);

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    message: string;
}

export const sendEmail = async (formData: FormData) => {
    const environment =
        process.env.VERCEL_ENV === 'production' ? 'production' : 'development';
    const config = emailConfig[environment];

    try {
        const response = await resend.emails.send({
            from: config.from, // mail server (whatever you want before the @mydomain.com)
            to: config.to, // mail admin (the one who will receive the email)
            subject: 'Nouveau message provenant de jkd-self-defense-31.fr',
            reply_to: formData.email,
            react: Email({ ...formData }),
        });
        console.log('Email sent successfully');
        return { success: true };
    } catch (error: any) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};
