/**
 * Utilitaire interne de Tailwind v3, sans déclaration de types fournie.
 * Aplatit la palette `theme('colors')` en paires `nom -> valeur CSS`
 * (ex. `gray-200 -> #e5e7eb`). Utilisé par `addVariablesForColors`
 * dans `tailwind.config.ts`.
 */
declare module 'tailwindcss/lib/util/flattenColorPalette' {
    const flattenColorPalette: (colors: unknown) => Record<string, string>;
    export default flattenColorPalette;
}
