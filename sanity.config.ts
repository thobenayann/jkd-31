'use client';

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works

import { MyLogo } from './components/shared/logo';
import { apiVersion, dataset, projectId } from './sanity/env';
import { schema } from './sanity/schema';

export default defineConfig({
    basePath: '/studio',
    projectId,
    dataset,
    title: 'Ji Dao 31 - Création de contenu',
    icon: MyLogo,
    // Add and edit the content schema in the './sanity/schema' folder
    schema,
    perspectives: 'published',
    stega: {
        enabled: false,
        studioUrl: '/studio',
    },
    plugins: [
        structureTool(),
        // Vision is a tool that lets you query your content with GROQ in the studio
        // https://www.sanity.io/docs/the-vision-plugin
        visionTool({ defaultApiVersion: apiVersion }),
    ],
});
