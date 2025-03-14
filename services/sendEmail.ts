// services/sendEmail.ts
'use server';

import { Email } from '@/emails/email-template';
import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import emailConfig from './emailConfig';

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

    // Afficher des informations de débogage en développement
    if (environment === 'development') {
        console.log('Environnement de développement détecté');
        console.log("Envoi d'email à:", config.to);
    }

    // Créer un transporteur Nodemailer avec les informations de Gandi
    const transporter = nodemailer.createTransport({
        host: 'mail.gandi.net',
        port: 465, // Utiliser SSL sur le port 465
        secure: true, // true pour SSL
        auth: {
            user: process.env.SERVER_MAIL, // Adresse email complète pour l'authentification
            pass: process.env.SERVER_MAIL_PASSWORD, // Mot de passe de l'email
        },
    });

    // Rendre le template React Email en HTML
    const emailHtml = render(Email({ ...formData }));

    try {
        const mailOptions = {
            from: config.from, // Adresse expéditeur (e.g., no-reply@domain.com)
            to: config.to, // Adresse du destinataire (admin ou test)
            subject: 'Nouveau message provenant du site jkd-self-defense-31.fr',
            replyTo: formData.email, // Adresse email de la personne ayant rempli le formulaire
            html: emailHtml, // Contenu HTML généré par React Email
        };

        // Afficher les options d'email en développement
        if (environment === 'development') {
            console.log("Options d'email:", mailOptions);
        }

        const response = await transporter.sendMail(mailOptions);

        if (environment === 'development') {
            console.log("Réponse du serveur d'email:", response);
        }

        console.log('Email envoyé avec succès');
        return { success: true };
    } catch (error: any) {
        console.error("Erreur lors de l'envoi de l'email:", error);
        return { success: false, error: error.message };
    }
};
