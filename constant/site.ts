/**
 * Identité canonique du site.
 *
 * Volontairement indépendante de `VERCEL_PROJECT_PRODUCTION_URL` : Vercel y met
 * le premier domaine de production déclaré (ici le `.com`), alors que le site
 * vit sur le `.fr`. Toute URL publique (sitemap, canonical, Open Graph, JSON-LD)
 * doit partir d'ici.
 */
export const SITE = {
    name: 'JKD Self Defense 31',
    url: 'https://www.jkd-selfdefense31.fr',
    locale: 'fr_FR',
} as const;

/**
 * Domaine affiché dans les mails, sans `www.` : `jkd-selfdefense31.fr`.
 * Attention au sosie `jkd-self-defense-31.fr`, avec tirets : il n'appartient
 * pas à l'association et les anciens gabarits de mail y renvoyaient.
 */
export const SITE_DOMAIN = new URL(SITE.url).hostname.replace(/^www\./, '');

/** URL absolue d'un chemin du site, sans double slash ni slash final parasite. */
export const absoluteUrl = (path = '/'): string =>
    new URL(path, SITE.url).toString().replace(/\/$/, '');
