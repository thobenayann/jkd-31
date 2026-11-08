/**
 * Constantes partagées entre le formulaire (client) et la validation (serveur).
 *
 * Fichier séparé de `contact.ts` : le composant client l'importe sans tirer
 * zod dans le bundle du navigateur.
 */

export const CONTACT_LIMITS = {
    name: 50,
    email: 254,
    phoneNumber: 20,
    message: 2000,
} as const;

/** Champ piège, invisible pour un humain. Un robot qui le remplit se trahit. */
export const HONEYPOT_FIELD = 'website';
