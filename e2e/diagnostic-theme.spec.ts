import { chromium, test } from '@playwright/test';

/**
 * Diagnostic, pas une garantie. Rapporte la classe posée sur `<html>` et la
 * couleur réelle du bandeau de navigation selon deux variables : la préférence
 * de couleur du système, et ce que `next-themes` a pu écrire dans
 * `localStorage` lors d'une visite précédente.
 *
 * `pnpm exec playwright test e2e/diagnostic-theme.spec.ts --project=desktop`
 */

const CASES = [
    { scheme: 'dark' as const, stored: null },
    { scheme: 'light' as const, stored: null },
    { scheme: 'light' as const, stored: 'system' },
    { scheme: 'dark' as const, stored: 'system' },
    { scheme: 'light' as const, stored: 'light' },
];

test('diagnostic du thème', async () => {
    const browser = await chromium.launch({ channel: 'chrome' });
    const rows: string[] = [];

    for (const { scheme, stored } of CASES) {
        const context = await browser.newContext({ colorScheme: scheme });
        const page = await context.newPage();

        if (stored) {
            await page.addInitScript(
                (value) => window.localStorage.setItem('theme', value),
                stored
            );
        }

        await page.goto('http://localhost:3000/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1200);

        const state = await page.evaluate(() => {
            const aurora = document.querySelector('nav div');
            return {
                htmlClass: document.documentElement.className,
                stored: window.localStorage.getItem('theme'),
                nav: aurora
                    ? getComputedStyle(aurora).backgroundColor
                    : 'introuvable',
                body: getComputedStyle(document.body).backgroundColor,
            };
        });

        rows.push(
            [
                `système=${scheme}`.padEnd(16),
                `localStorage avant=${String(stored)}`.padEnd(28),
                `class="${state.htmlClass}"`.padEnd(24),
                `localStorage après=${state.stored}`.padEnd(26),
                `nav=${state.nav}`.padEnd(28),
                `body=${state.body}`,
            ].join(' | ')
        );

        await context.close();
    }

    await browser.close();
    console.log('\n' + rows.join('\n') + '\n');
});
