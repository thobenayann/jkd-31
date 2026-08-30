import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { dataset, projectId } from '../env';

const builder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
});

/**
 * Construit une URL d'image Sanity.
 *
 * Passer l'objet image complet (`event.mainImage`) et non `asset._ref` : le
 * point de recadrage (`hotspot`) et le cadrage (`crop`) saisis dans le Studio
 * vivent sur cet objet. Avec la seule référence d'asset, ils sont perdus et
 * toute demande de format fixe recadre au centre, ce qui décapite les affiches
 * verticales sur les aperçus Open Graph en 1200 × 630.
 */
export function urlFor(source: SanityImageSource) {
    return builder.image(source);
}
