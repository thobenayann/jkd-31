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

/** URL absolue d'un chemin du site, sans double slash ni slash final parasite. */
export const absoluteUrl = (path = '/'): string =>
    new URL(path, SITE.url).toString().replace(/\/$/, '');
