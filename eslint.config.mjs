import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/**
 * Configuration ESLint au format "flat" (ESLint 9+).
 * Next.js 16 a retiré la commande `next lint` : le script `lint` appelle
 * ESLint directement, et cette config remplace l'ancien `.eslintrc.json`.
 */
export default defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores([
        // Ignorés par défaut par eslint-config-next
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
        // Spécifiques au projet
        'ds-bundle/**', // export du design system, code généré
        '.design-sync/**',
        '.ds-sync/**', // outillage de synchronisation du design system
        'sanity.types.ts', // généré par `sanity typegen`
    ]),
]);
