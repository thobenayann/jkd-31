import { expect, test, type Page } from '@playwright/test';

/**
 * Ce que ces tests garantissent, et que les tests unitaires ne peuvent pas voir :
 * le CSS est bien chargé, le thème sombre est appliqué, et chaque page publique
 * porte un seul `h1`.
 *
 * Le thème sombre est imposé par `forcedTheme` dans `app/(client)/layout.tsx`.
 * Une page qui remonte en fond blanc signifie soit que la classe `dark` n'est pas
 * posée, soit que la feuille de style n'est pas servie.
 */

const PAGES = [
    '/',
    '/association',
    '/tarifs',
    '/events',
    '/contact',
    '/27-styles',
    '/legal',
];

/** `rgb(2, 8, 23)` : `--background` du thème sombre. Le clair est blanc pur. */
const isDarkBackground = (color: string): boolean => {
    const parts = color.match(/\d+/g)?.slice(0, 3).map(Number);
    if (!parts || parts.length < 3) return false;
    return parts.every((channel) => channel < 60);
};

/**
 * Attend la fin des animations d'entrée avant toute mesure.
 *
 * Pas de `networkidle` : Vercel Analytics et Speed Insights émettent des balises
 * en continu, l'état n'arrive jamais de façon fiable.
 */
const settle = async (page: Page) => {
    await page.waitForLoadState('load');
    await page.waitForTimeout(1500);
};

test.describe('rendu des pages publiques', () => {
    for (const path of PAGES) {
        test(`${path} : CSS chargé et thème sombre appliqué`, async ({
            page,
        }) => {
            const failed: string[] = [];
            page.on('response', (response) => {
                if (response.url().endsWith('.css') && response.status() >= 400) {
                    failed.push(`${response.status()} ${response.url()}`);
                }
            });

            await page.goto(path);
            await settle(page);

            expect(failed, 'aucune feuille de style en erreur').toEqual([]);

            const stylesheets = await page.evaluate(
                () => document.styleSheets.length
            );
            expect(stylesheets, 'au moins une feuille de style').toBeGreaterThan(
                0
            );

            await expect(page.locator('html')).toHaveClass(/dark/);

            const { background, nav } = await page.evaluate(() => {
                const auroraNav = document.querySelector('nav div');
                return {
                    background: getComputedStyle(document.body).backgroundColor,
                    nav: auroraNav
                        ? getComputedStyle(auroraNav).backgroundColor
                        : '',
                };
            });
            expect(
                isDarkBackground(background),
                `fond de page attendu sombre, obtenu ${background}`
            ).toBe(true);
            // Le bandeau de navigation est `bg-zinc-50 dark:bg-zinc-900` : c'est
            // lui qui vire au blanc en premier quand la classe `dark` manque.
            expect(
                isDarkBackground(nav),
                `bandeau de navigation attendu sombre, obtenu ${nav}`
            ).toBe(true);
        });

        test(`${path} : un seul titre de niveau 1`, async ({ page }) => {
            await page.goto(path);
            await settle(page);
            await expect(page.locator('h1')).toHaveCount(1);
        });
    }
});

test.describe('le thème sombre ne dépend de rien d’extérieur', () => {
    /**
     * Le défaut qui a fait passer le site en clair chez Yann : `next-themes`
     * était en `enableSystem`, et une clé `theme` laissée dans `localStorage`
     * par une visite précédente, ou par un autre projet servi sur le même
     * `localhost:3000`, gagnait sur le thème par défaut. Le site n'ayant aucun
     * sélecteur de thème, personne ne pouvait revenir en arrière.
     */
    for (const stored of ['system', 'light']) {
        test(`localStorage.theme = "${stored}" ne bascule pas le site en clair`, async ({
            page,
        }) => {
            await page.addInitScript(
                (value) => window.localStorage.setItem('theme', value),
                stored
            );
            await page.goto('/');
            await settle(page);

            await expect(page.locator('html')).toHaveClass(/dark/);

            const nav = await page.evaluate(() => {
                const el = document.querySelector('nav div');
                return el ? getComputedStyle(el).backgroundColor : '';
            });
            expect(
                isDarkBackground(nav),
                `bandeau de navigation attendu sombre, obtenu ${nav}`
            ).toBe(true);
        });
    }
});

test.describe('événements sans intervenant', () => {
    /**
     * `AvatarPersonality` affichait « N/A N/A » et « Unknown Title » sur les
     * événements dont la personnalité n'est pas saisie dans le Studio. Le test
     * balaie la liste et chaque fiche, plutôt que de viser un événement précis
     * dont le contenu peut changer dans Sanity.
     */
    test('aucune valeur de substitution sur la liste et les fiches', async ({
        page,
    }) => {
        test.setTimeout(180_000);
        await page.goto('/events');
        await settle(page);

        const paths = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a[href^="/events/"]'))
                .map((a) => a.getAttribute('href') ?? '')
                .filter((href, index, all) => all.indexOf(href) === index)
        );

        for (const path of ['/events', ...paths]) {
            // Le bloc intervenant est rendu par le serveur : inutile d'attendre
            // les animations, le texte est là dès le HTML initial.
            await page.goto(path, { waitUntil: 'domcontentloaded' });
            const text = (await page.locator('body').innerText()) ?? '';
            expect(text, `${path} ne doit pas afficher N/A`).not.toContain(
                'N/A'
            );
            expect(
                text,
                `${path} ne doit pas afficher Unknown Title`
            ).not.toContain('Unknown Title');
        }
    });
});

test.describe('annonce de rentrée', () => {
    test("s'affiche sur l'accueil sans chevaucher le bouton flottant", async ({
        page,
    }) => {
        await page.goto('/');
        await settle(page);

        const notice = page.getByRole('complementary', {
            name: 'Annonce de rentrée',
        });
        await expect(notice).toBeVisible();

        // Le surtitre est en `whitespace-nowrap` : s'il devient trop large, il
        // déborde de la carte au lieu de passer à la ligne, et ça ne se voit pas
        // depuis le code. Cinzel peut aussi tomber en police de repli.
        const eyebrow = notice.locator('p').first();
        const metrics = await eyebrow.evaluate((el) => {
            // Largeur du texte, mesurée sur son contenu. La boîte du paragraphe
            // occupe toute la largeur disponible et ne dit rien du débordement.
            const range = document.createRange();
            range.selectNodeContents(el);
            const style = getComputedStyle(el);
            return {
                overflows: el.scrollWidth > el.clientWidth + 1,
                textWidth: range.getBoundingClientRect().width,
                available: el.clientWidth,
                fontSize: parseFloat(style.fontSize),
                lines: Math.round(
                    el.getBoundingClientRect().height /
                        parseFloat(style.lineHeight)
                ),
            };
        });

        expect(metrics.lines, 'surtitre sur une seule ligne').toBe(1);
        expect(
            metrics.overflows,
            `surtitre débordant : ${Math.round(metrics.textWidth)}px de texte pour ${metrics.available}px`
        ).toBe(false);
        // Marge suffisante pour absorber une police de repli si Cinzel tarde.
        expect(
            metrics.textWidth,
            'surtitre trop proche du bord de la carte'
        ).toBeLessThan(metrics.available * 0.9);

        const floating = page.getByRole('link', { name: /Notre démo/i });
        if (await floating.count()) {
            const a = await notice.boundingBox();
            const b = await floating.first().boundingBox();
            if (a && b) {
                const overlaps =
                    a.x < b.x + b.width &&
                    a.x + a.width > b.x &&
                    a.y < b.y + b.height &&
                    a.y + a.height > b.y;
                expect(overlaps, 'annonce et bouton flottant disjoints').toBe(
                    false
                );
            }
        }
    });
});
