/**
 * Domaines qui servent le même contenu que le site canonique et doivent
 * rediriger vers lui. Le site canonique est défini dans `constant/site.ts`
 * (ce fichier étant du JS pur, il ne peut pas l'importer).
 */
const CANONICAL_ORIGIN = 'https://www.jkd-selfdefense31.fr';
const NON_CANONICAL_HOSTS = [
    'www.jkd-selfdefense31.com',
    'jkd-selfdefense31.com',
    'jkd-31.vercel.app',
];

/**
 * Projet Sanity du site, le même que `NEXT_PUBLIC_SANITY_PROJECT_ID`. Valeur
 * publique : elle figure dans chaque URL d'image. Sans elle dans `pathname`,
 * l'optimiseur redimensionnerait les images de n'importe quel projet Sanity
 * aux frais de notre quota Vercel.
 */
const SANITY_PROJECT_ID = '6aynvirp';

/** @type {import('next').NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                pathname: `/images/${SANITY_PROJECT_ID}/**`,
            },
        ],
    },
    async redirects() {
        return NON_CANONICAL_HOSTS.map((host) => ({
            source: '/:path*',
            has: [{ type: 'host', value: host }],
            destination: `${CANONICAL_ORIGIN}/:path*`,
            permanent: true,
        }));
    },
};

export default config;
