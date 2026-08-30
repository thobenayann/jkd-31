import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        // Même alias que tsconfig.json (`@/` = racine du projet)
        alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
    },
    test: {
        // Les tests de composants rendent du HTML serveur (`renderToStaticMarkup`),
        // ce qui teste exactement ce que voient les robots. Pas besoin de jsdom.
        include: ['lib/**/*.test.ts', 'components/**/*.test.tsx'],
        environment: 'node',
    },
});
