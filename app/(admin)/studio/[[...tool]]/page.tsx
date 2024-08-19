/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import config from '@/sanity.config';
import dynamic from 'next/dynamic';

export { metadata, viewport } from 'next-sanity/studio';

const LazyNextStudio = dynamic(
    () => import('next-sanity/studio').then((mod) => mod.NextStudio),
    {
        ssr: false, // Désactive le rendu côté serveur pour ce composant
    }
);

export default function StudioPage() {
    return <LazyNextStudio config={config} />;
}
