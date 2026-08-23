import { serializeJsonLd } from '@/lib/structured-data';

/**
 * Balise `<script type="application/ld+json">` native, rendue côté serveur.
 * Pas `next/script` : il injecterait le contenu après hydratation, hors du HTML
 * initial lu par les crawlers.
 */
export function JsonLd({ data }: { data: unknown }) {
    return (
        <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
        />
    );
}
