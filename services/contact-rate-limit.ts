import { checkRateLimit } from '@vercel/firewall';
import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';

/**
 * Limitation de débit du formulaire de contact.
 *
 * Le compteur vit dans le pare-feu Vercel : une règle WAF de condition
 * `@vercel/firewall` = `contact-form` fixe la fenêtre et le nombre d'envois.
 * Sans cette règle, le SDK répond « non limité ».
 *
 * Deux compteurs, sous la même règle :
 * - par IP (par bloc /64 en IPv6), contre un robot qui insiste ;
 * - par destinataire, pour qu'une même boîte ne reçoive pas plus de N mails de
 *   confirmation par fenêtre, même envoyés depuis des milliers d'IP.
 *
 * Le SDK recopie la clé reçue en clair. On lui passe donc un HMAC, jamais l'IP
 * ni l'adresse. Sans le secret, retrouver l'IP depuis la clé demanderait de
 * casser le HMAC, pas seulement d'essayer les 2³² IPv4.
 *
 * En cas de doute (hors Vercel, secret absent, panne, délai dépassé), le
 * message passe : une demande d'essai perdue coûte plus cher qu'un envoi de
 * trop, et la validation ferme déjà le relais.
 */

export const CONTACT_RATE_LIMIT_ID = 'contact-form';

const TIMEOUT_MS = 1500;

const getClientIp = (requestHeaders: Headers) => {
    const realIp = requestHeaders.get('x-real-ip')?.trim();
    if (realIp) return realIp;
    const forwardedFor = requestHeaders.get('x-forwarded-for');
    return forwardedFor?.split(',')[0]?.trim() || undefined;
};

const normalizeGroup = (group: string) => parseInt(group, 16).toString(16);

/** Développe une IPv6 en 8 groupes hexadécimaux, sans zéros de tête. */
const expandIpv6 = (ip: string): string[] => {
    let address = ip.toLowerCase();

    // Notation mixte (::ffff:203.0.113.42) : la partie IPv4 vaut deux groupes.
    const lastColon = address.lastIndexOf(':');
    const tail = address.slice(lastColon + 1);
    if (tail.includes('.')) {
        const [a, b, c, d] = tail.split('.').map(Number);
        const high = ((a << 8) | b).toString(16);
        const low = ((c << 8) | d).toString(16);
        address = `${address.slice(0, lastColon + 1)}${high}:${low}`;
    }

    const [head, rest] = address.split('::');
    const headGroups = head ? head.split(':') : [];
    if (rest === undefined) return headGroups.map(normalizeGroup);

    const tailGroups = rest ? rest.split(':') : [];
    const zeros = Array<string>(8 - headGroups.length - tailGroups.length).fill('0');
    return [...headGroups, ...zeros, ...tailGroups].map(normalizeGroup);
};

/**
 * Ce que l'on compte pour une IP. Une IPv4 compte seule. Une IPv6 compte par
 * bloc /64 : un fournisseur attribue au moins ce bloc à chaque abonné, qui peut
 * y changer d'adresse à volonté.
 */
const ipSubject = (rawIp: string) => {
    const ip = rawIp.split('%')[0]; // zone d'interface, par exemple fe80::1%eth0
    if (isIP(ip) !== 6) return ip;

    const groups = expandIpv6(ip);
    const isMappedIpv4 =
        groups.slice(0, 5).every((group) => group === '0') && groups[5] === 'ffff';
    if (isMappedIpv4) {
        return groups
            .slice(6)
            .flatMap((group) => {
                const value = parseInt(group, 16);
                return [value >> 8, value & 0xff];
            })
            .join('.');
    }
    return `${groups.slice(0, 4).join(':')}::/64`;
};

/** Une même boîte : casse ignorée, suffixe « +étiquette » retiré. */
const recipientSubject = (email: string) => {
    const address = email.toLowerCase();
    const at = address.lastIndexOf('@');
    const local = address.slice(0, at).split('+')[0];
    return `${local}${address.slice(at)}`;
};

const hashKey = (subject: string, secret: string) =>
    createHmac('sha256', secret).update(subject).digest('hex');

export async function isContactRateLimited(
    requestHeaders: Headers,
    recipient: string
): Promise<boolean> {
    // En local, `next start` tourne en NODE_ENV=production : le SDK tenterait
    // alors d'appeler https://localhost. On ne compte que sur Vercel.
    if (process.env.VERCEL !== '1') return false;

    const secret = process.env.RATE_LIMIT_SECRET;
    if (!secret) {
        console.warn('[contact] RATE_LIMIT_SECRET absent : limitation désactivée.');
        return false;
    }

    // Préfixes distincts : une IP et une adresse ne partagent jamais un compteur.
    const subjects: string[] = [];
    const ip = getClientIp(requestHeaders);
    if (ip) {
        subjects.push(`ip:${ipSubject(ip)}`);
    } else {
        console.warn('[contact] IP du client inconnue : seul le destinataire est compté.');
    }
    subjects.push(`to:${recipientSubject(recipient)}`);

    try {
        const results = await Promise.all(
            subjects.map((subject) =>
                checkRateLimit(CONTACT_RATE_LIMIT_ID, {
                    headers: requestHeaders,
                    rateLimitKey: hashKey(subject, secret),
                    timeout: TIMEOUT_MS,
                })
            )
        );
        return results.some(({ rateLimited }) => rateLimited);
    } catch (error) {
        const reason = error instanceof Error ? error.name : 'erreur inconnue';
        console.warn(`[contact] Contrôle de débit indisponible (${reason}).`);
        return false;
    }
}
