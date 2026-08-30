import { defineConfig, devices } from '@playwright/test';

/**
 * Vérifications de rendu réel, dans un vrai navigateur.
 *
 * `BASE_URL` permet de viser le serveur de développement déjà lancé
 * (`http://localhost:3000`) plutôt que d'en démarrer un second : `next dev` et
 * `next build` partagent le dossier `.next`, les lancer en parallèle corrompt
 * les fichiers CSS servis en développement.
 */
const baseURL = process.env.BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
    testDir: './e2e',
    timeout: 60_000,
    expect: { timeout: 10_000 },
    fullyParallel: false,
    workers: 1,
    reporter: [['list']],
    use: {
        baseURL,
        // Utilise le Chrome installé sur la machine, pas un binaire téléchargé.
        channel: 'chrome',
        // Volontairement clair : le site doit rester sombre quelle que soit la
        // préférence du système. Forcer `dark` ici rendait le test infalsifiable.
        colorScheme: 'light',
    },
    projects: [
        {
            name: 'desktop',
            use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        },
        {
            name: 'mobile',
            use: {
                ...devices['Pixel 7'],
                channel: 'chrome',
                isMobile: false,
                hasTouch: true,
                defaultBrowserType: 'chromium',
            },
        },
    ],
});
