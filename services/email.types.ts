import type {
    ContactFieldErrors,
    ContactFormData,
} from '@/lib/validation/contact';

/** Données du formulaire, validées et normalisées par `parseContactSubmission`. */
export type EmailFormData = ContactFormData;

export type EmailConfig = {
    from: string;
    to: string;
    cc?: string;
};

export type EmailEnvironment = 'development' | 'production';

/**
 * Résultat interne du transport Nodemailer. `error` peut contenir une réponse
 * SMTP brute : ne jamais le renvoyer au navigateur.
 */
export type EmailResult = {
    success: boolean;
    error?: string;
    messageId?: string;
};

/** Réponse de la server action au navigateur. Aucun détail technique. */
export type ContactFormResult =
    | { status: 'success' }
    | { status: 'invalid'; fieldErrors: ContactFieldErrors }
    | { status: 'rate_limited' }
    | { status: 'error' };
