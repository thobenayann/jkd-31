import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId, studioUrl, useCdn } from '../env';

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
    stega: {
        studioUrl: studioUrl,
    },
});
