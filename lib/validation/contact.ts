import { z } from 'zod';
import { CONTACT_LIMITS, HONEYPOT_FIELD } from './contact-limits';

/**
 * Validation du formulaire de contact, exécutée côté serveur.
 *
 * La server action est un point d'entrée POST public : tout ce qui arrive est
 * traité comme `unknown`. React Hook Form ne sert qu'au confort du visiteur.
 */

export { CONTACT_LIMITS, HONEYPOT_FIELD };

export type ContactFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    message: string;
};

export type ContactField = keyof ContactFormData;

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactSubmission =
    | { kind: 'valid'; data: ContactFormData }
    | { kind: 'spam' }
    | { kind: 'invalid'; fieldErrors: ContactFieldErrors };

/** Une ligne : tout blanc (tabulation, espace insécable, saut de ligne) devient un espace. */
const collapseWhitespace = (value: string) => value.replace(/\s+/gu, ' ').trim();

/** Texte libre : fins de ligne unifiées, caractères de contrôle retirés sauf `\n` et `\t`. */
const normalizeMultiline = (value: string) =>
    value
        .replace(/\r\n?/g, '\n')
        .replace(/[^\P{Cc}\n\t]/gu, '')
        .trim();

/**
 * Commence par une lettre, puis lettres, accents, espaces, apostrophes, tirets
 * ou points. Prénom et nom sont repris dans le mail de confirmation : refuser
 * chiffres, `@`, `/` et `:` empêche d'y glisser un lien ou une adresse.
 *
 * Un point ne peut pas être suivi d'une lettre : « J.-P. » passe, mais pas
 * « casino.com », que les messageries transforment en lien cliquable.
 */
const PERSON_NAME = /^(?!.*\.[\p{L}\p{M}])\p{L}[\p{L}\p{M} '’.-]*$/u;

const PHONE_CHARACTERS = /^\+?[0-9 .()-]+$/;
const MIN_PHONE_DIGITS = 6;

const personName = (label: 'Le prénom' | 'Le nom') =>
    z
        .string({ error: `${label} est requis.` })
        .overwrite(collapseWhitespace)
        .min(1, `${label} est requis.`)
        .max(
            CONTACT_LIMITS.name,
            `${label} ne doit pas dépasser ${CONTACT_LIMITS.name} caractères.`
        )
        .regex(PERSON_NAME, `${label} ne doit contenir que des lettres.`);

const INVALID_EMAIL = "Format d'email invalide.";

const contactSchema = z.strictObject({
    firstName: personName('Le prénom'),
    lastName: personName('Le nom'),
    // `z.email()` n'accepte qu'une adresse nue : ni liste, ni nom affiché,
    // ni retour à la ligne. C'est ce qui ferme le relais de spam.
    email: z
        .string({ error: "L'email est requis." })
        .trim()
        .min(1, "L'email est requis.")
        .pipe(z.email(INVALID_EMAIL).max(CONTACT_LIMITS.email, INVALID_EMAIL)),
    phoneNumber: z
        .string({ error: 'Le numéro de téléphone est requis.' })
        .overwrite(collapseWhitespace)
        .min(1, 'Le numéro de téléphone est requis.')
        .max(CONTACT_LIMITS.phoneNumber, 'Numéro de téléphone invalide.')
        .regex(PHONE_CHARACTERS, 'Numéro de téléphone invalide.')
        .refine(
            (value) => (value.match(/\d/g)?.length ?? 0) >= MIN_PHONE_DIGITS,
            'Numéro de téléphone invalide.'
        ),
    message: z
        .string({ error: 'Un message est requis.' })
        .overwrite(normalizeMultiline)
        .min(1, 'Un message est requis.')
        .max(
            CONTACT_LIMITS.message,
            `Le message ne doit pas dépasser ${CONTACT_LIMITS.message} caractères.`
        ),
    [HONEYPOT_FIELD]: z.string().optional(),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const isHoneypotFilled = (payload: unknown) => {
    if (!isRecord(payload) || !(HONEYPOT_FIELD in payload)) return false;
    const value = payload[HONEYPOT_FIELD];
    if (value === undefined) return false;
    return !(typeof value === 'string' && value.trim() === '');
};

export function parseContactSubmission(payload: unknown): ContactSubmission {
    // Le piège passe en premier : un robot ne doit apprendre ni qu'il est
    // repéré, ni ce qui cloche dans ses autres champs.
    if (isHoneypotFilled(payload)) return { kind: 'spam' };

    const result = contactSchema.safeParse(payload);
    if (!result.success) {
        const { fieldErrors } = z.flattenError(result.error);
        const firstErrors: ContactFieldErrors = {};
        for (const field of Object.keys(fieldErrors) as ContactField[]) {
            const message = fieldErrors[field]?.[0];
            if (message) firstErrors[field] = message;
        }
        return { kind: 'invalid', fieldErrors: firstErrors };
    }

    const { firstName, lastName, email, phoneNumber, message } = result.data;
    return {
        kind: 'valid',
        data: { firstName, lastName, email, phoneNumber, message },
    };
}
