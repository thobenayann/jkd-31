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

/** @type {import('next').NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                hostname: 'cdn.sanity.io',
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
