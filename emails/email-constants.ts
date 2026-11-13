import { SITE_DOMAIN } from '@/constant/site';

/**
 * Identifiant du logo joint aux mails, référencé par `cid:` dans les gabarits.
 * Ce n'est pas une adresse web, mais il reprend le vrai domaine pour ne jamais
 * afficher le sosie `jkd-self-defense-31.fr`.
 */
export const EMAIL_LOGO_CID = `logo@${SITE_DOMAIN}`;
