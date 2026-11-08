import { checkRateLimit } from '@vercel/firewall';
import { createHmac } from 'node:crypto';

/**
 * Limitation de débit du formulaire de contact.
 *
 * Le compteur vit dans le pare-feu Vercel : une règle WAF de condition
 * `@vercel/firewall` = `contact-form` fixe la fenêtre et le nombre d'envois.
 * Sans cette règle, le SDK répond « non limité ».
 *
 * Le SDK recopie la clé reçue en clair. On lui passe donc un HMAC de l'IP,
 * jamais l'IP elle-même. Sans le secret, retrouver l'IP depuis la clé
 * demanderait de casser le HMAC, pas seulement d'essayer les 2³² IPv4.
 *
 * En cas de doute (hors Vercel, secret absent, IP inconnue, panne, délai
 * dépassé), le message passe : une demande d'essai perdue coûte plus cher
 * qu'un envoi de trop, et la validation ferme déjà le relais.
 */

export const CONTACT_RATE_LIMIT_ID = 'contact-form';

const TIMEOUT_MS = 1500;

const getClientIp = (requestHeaders: Headers) => {
    const realIp = requestHeaders.get('x-real-ip')?.trim();
    if (realIp) return realIp;
    const forwardedFor = requestHeaders.get('x-forwarded-for');
    return forwardedFor?.split(',')[0]?.trim() || undefined;
};

const hashIp = (ip: string, secret: string) =>
    createHmac('sha256', secret).update(ip).digest('hex');

export async function isContactRateLimited(
    requestHeaders: Headers
): Promise<boolean> {
    // En local, `next start` tourne en NODE_ENV=production : le SDK tenterait
    // alors d'appeler https://localhost. On ne compte que sur Vercel.
    if (process.env.VERCEL !== '1') return false;

    const secret = process.env.RATE_LIMIT_SECRET;
    if (!secret) {
        console.warn('[contact] RATE_LIMIT_SECRET absent : limitation désactivée.');
        return false;
    }

    const ip = getClientIp(requestHeaders);
    if (!ip) {
        console.warn('[contact] IP du client inconnue : limitation ignorée.');
        return false;
    }

    try {
        const { rateLimited } = await checkRateLimit(CONTACT_RATE_LIMIT_ID, {
            headers: requestHeaders,
            rateLimitKey: hashIp(ip, secret),
            timeout: TIMEOUT_MS,
        });
        return rateLimited;
    } catch (error) {
        const reason = error instanceof Error ? error.name : 'erreur inconnue';
        console.warn(`[contact] Contrôle de débit indisponible (${reason}).`);
        return false;
    }
}
