import { NavigationEvents } from '@/components/navigation-event';
import Footer from '@/components/shared/footer';
import Nav from '@/components/shared/menu';
import { ThemeProvider } from '@/components/theme-provider';
import { associationConfig } from '@/constant/config';
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
import Script from 'next/script';
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

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000';

export const metadata: Metadata = {
    title: 'Jeet Kune Do Toulouse - Arts Martiaux et Self-Défense',
    description:
        "Découvrez le Jeet Kune Do à Muret avec l'association JKD Self Defense 31. Cours d'arts martiaux, de self-défense et de développement physique pour tous les niveaux.",
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
        title: 'Jeet Kune Do Toulouse - Arts Martiaux et Self-Défense',
        description:
            'Apprenez le Jeet Kune Do avec JKD Self Defense 31 à Muret. Cours adaptés à tous les niveaux.',
        url: baseUrl,
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
        title: 'Jeet Kune Do Toulouse - Arts Martiaux et Self-Défense',
        description:
            'Découvrez le Jeet Kune Do avec JKD Self Defense 31 à Toulouse.',
        images: ['/opengraph-image.png'],
    },
    metadataBase: new URL(baseUrl),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const sameAs = [
        associationConfig.socialMedia.facebook,
        associationConfig.socialMedia.instagram,
    ];
    // JSON-LD Organization: relie le site aux profils sociaux et aux infos de contact
    const orgJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: associationConfig.name,
        url: baseUrl,
        sameAs,
        contactPoint: [
            {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                email: associationConfig.email,
                telephone: associationConfig.phoneNumber,
                areaServed: 'FR',
                availableLanguage: ['fr'],
            },
        ],
    };

    // JSON-LD WebSite: expose l'entité "site" et réplique les profils sociaux
    const websiteJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: associationConfig.name,
        url: baseUrl,
        sameAs,
    };
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
                {/* Organization JSON-LD global */}
                <Script
                    id='org-jsonld'
                    type='application/ld+json'
                    strategy='afterInteractive'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(orgJsonLd),
                    }}
                />
                {/* WebSite JSON-LD global (sans SearchAction car pas de recherche interne) */}
                <Script
                    id='website-jsonld'
                    type='application/ld+json'
                    strategy='afterInteractive'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(websiteJsonLd),
                    }}
                />
                <ThemeProvider
                    attribute='class'
                    defaultTheme='dark'
                    enableSystem
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
