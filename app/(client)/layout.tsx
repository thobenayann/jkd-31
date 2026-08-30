import { NavigationEvents } from '@/components/navigation-event';
import { JsonLd } from '@/components/seo/json-ld';
import Footer from '@/components/shared/footer';
import Nav from '@/components/shared/menu';
import { ThemeProvider } from '@/components/theme-provider';
import { SITE } from '@/constant/site';
import {
    buildOrganizationJsonLd,
    buildSportsLocationJsonLd,
    buildWebSiteJsonLd,
} from '@/lib/structured-data';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import {
    Cinzel as FontCinzel,
    Cinzel_Decorative as FontCinzelDecorative,
    Inter as FontSans,
    Merriweather as FontSerif,
} from 'next/font/google';
import { Suspense } from 'react';
import '../globals.css';

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

const fontSerif = FontSerif({
    subsets: ['latin'],
    variable: '--font-serif',
    weight: ['300', '400', '700'],
});

const cinzel = FontCinzel({
    weight: ['400', '700'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-cinzel',
});

const cinzelDecorative = FontCinzelDecorative({
    weight: ['400', '700'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-cinzel-decorative',
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE.url),
    alternates: { canonical: '/' },
    title: {
        // `default` est le titre de l'accueil et le repli des routes sans titre.
        // `template` est hérité par toutes les routes filles, y compris les
        // fiches événement de Sanity, qui n'affichaient pas le nom du club.
        default: 'Jeet Kune Do et self-défense à Muret | JKD Self Defense 31',
        template: '%s | JKD Self Defense 31',
    },
    description:
        'Club de Jeet Kune Do, Kali, Silat et self-défense à Muret, au sud de Toulouse. Cours adultes, ados et self-défense féminine, tous niveaux, sans compétition.',
    keywords: [
        'Jeet Kune Do',
        'arts martiaux',
        'self-defense',
        'self defense',
        'Toulouse',
        'Muret',
        'Ji Dao',
        'JKD Self Defense 31',
    ],
    openGraph: {
        title: 'Jeet Kune Do et self-défense à Muret | JKD Self Defense 31',
        description:
            'Club de Jeet Kune Do, Kali, Silat et self-défense à Muret. Cours adultes, ados et self-défense féminine, tous niveaux.',
        url: SITE.url,
        locale: SITE.locale,
        siteName: 'JKD Self Defense 31 - Arts Martiaux et Self-Défense',
        images: [
            {
                url: '/opengraph-image.png',
                width: 1200,
                height: 630,
                alt: 'Jeet Kune Do Toulouse - Image',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Jeet Kune Do et self-défense à Muret | JKD Self Defense 31',
        description:
            'Club de Jeet Kune Do, Kali, Silat et self-défense à Muret, au sud de Toulouse.',
        images: ['/opengraph-image.png'],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang='fr'
            suppressHydrationWarning
            className='scroll-smooth scrollbar-thin scrollbar-thumb-jkdBlue/50 scrollbar-track-gray-900'
        >
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    fontSans.variable,
                    fontSerif.variable,
                    cinzel.variable,
                    cinzelDecorative.variable
                )}
            >
                {/* Données structurées globales : l'association, le site, le lieu d'entraînement */}
                <JsonLd data={buildOrganizationJsonLd()} />
                <JsonLd data={buildWebSiteJsonLd()} />
                <JsonLd data={buildSportsLocationJsonLd()} />
                {/*
                    `forcedTheme` et non `defaultTheme` : le site est conçu en
                    sombre uniquement, et `components/ui/mode-toggle.tsx` n'est
                    rendu nulle part. Avec `enableSystem`, une clé `theme`
                    laissée dans `localStorage` par une visite précédente, ou par
                    un autre projet servi sur `localhost:3000`, suffisait à
                    basculer tout le site en clair. Vérifié dans
                    `e2e/rendu.spec.ts`.
                */}
                <ThemeProvider
                    attribute='class'
                    forcedTheme='dark'
                    disableTransitionOnChange
                    enableColorScheme={false}
                >
                    <Suspense fallback={null}>
                        <NavigationEvents>
                            <Nav hash={''} />
                        </NavigationEvents>
                    </Suspense>
                    {children}
                    <Footer />
                    <Analytics />
                    <SpeedInsights />
                </ThemeProvider>
            </body>
        </html>
    );
}
