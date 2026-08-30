import typography from '@tailwindcss/typography';
import tailwindScrollbar from 'tailwind-scrollbar';
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
import type { PluginAPI } from 'tailwindcss/types/config';
import tailwindcssAnimate from 'tailwindcss-animate';

const config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                jkdBlue: '#006599',
                /**
                 * Variante éclaircie de `jkdBlue`, pour le petit texte sur fond
                 * sombre. `#006599` sur noir tombe à 2,4:1, sous le minimum de
                 * 4,5:1 exigé par le WCAG pour du texte de moins de 18 px.
                 */
                jkdBlueLight: '#4DA6D9',
                /** Rouge du logo, déjà utilisé par le badge des événements internes. */
                jkdRed: '#E20614',
                /**
                 * Variante éclaircie de `jkdRed` pour le petit texte sur fond
                 * sombre : `#E20614` plafonne à 3,4:1, sous le minimum de 4,5:1.
                 */
                jkdRedLight: '#FF4D57',
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                aurora: {
                    from: {
                        backgroundPosition: '50% 50%, 50% 50%',
                    },
                    to: {
                        backgroundPosition: '350% 50%, 350% 50%',
                    },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                aurora: 'aurora 60s linear infinite',
            },
            fontFamily: {
                sans: ['var(--font-sans)', ...fontFamily.sans],
                serif: ['var(--font-serif)', ...fontFamily.serif],
                cinzel: ['var(--font-cinzel)', ...fontFamily.serif],
                cinzelDecorative: [
                    'var(--font-cinzel-decorative)',
                    ...fontFamily.serif,
                ],
            },
        },
    },
    plugins: [
        tailwindcssAnimate,
        typography,
        tailwindScrollbar,
        addVariablesForColors,
    ],
} satisfies Config;

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: PluginAPI) {
    const allColors = flattenColorPalette(theme('colors'));
    const newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    );

    addBase({
        ':root': newVars,
    });
}

export default config;
