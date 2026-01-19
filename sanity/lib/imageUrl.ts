// ./sanity/lib/imageUrl.js
import { createImageUrlBuilder } from '@sanity/image-url';
import { dataset, projectId } from '../env';

const builder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
});

export function urlFor(source: string) {
    return builder.image(source);
}
