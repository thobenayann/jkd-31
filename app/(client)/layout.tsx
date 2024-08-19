import { NavigationEvents } from '@/components/navigation-event';
import Footer from '@/components/shared/footer';
import Nav from '@/components/shared/menu';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
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
    title: 'Jeet Kune Do Toulouse - Arts Martiaux et Self-Défense',
    description:
        "Découvrez le Jeet Kune Do à Muret avec l'association JKD Self Defense 31. Cours d'arts martiaux, de self-défense et de développement physique pour tous les niveaux.",
    keywords: [
        'Jeet Kune Do',
        'arts martiaux',
        'self-défense',
        'Toulouse',
        'Muret',
        'Ji Dao',
        'JKD Self Defense 31',
    ],
    openGraph: {
        title: 'Jeet Kune Do Toulouse - Arts Martiaux et Self-Défense',
        description:
            'Apprenez le Jeet Kune Do avec JKD Self Defense 31 à Muret. Cours adaptés à tous les niveaux.',
        url: process.env.VERCEL_URL || '',
        images: [
            {
                url: `https://${process.env.VERCEL_URL}/images/logo/logo.svg`,
                width: 1200,
                height: 630,
                alt: 'Jeet Kune Do Toulouse',
            },
        ],
        siteName: 'JKD Self Defense 31 - Jeet Kune Do Toulouse',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Jeet Kune Do Toulouse - Arts Martiaux et Self-Défense',
        description:
            'Découvrez le Jeet Kune Do avec JKD Self Defense 31 à Toulouse.',
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
                <ThemeProvider
                    attribute='class'
                    defaultTheme='dark'
                    enableSystem
                    disableTransitionOnChange
                >
                    <Suspense fallback={null}>
                        <NavigationEvents>
                            <Nav hash={''} />
                        </NavigationEvents>
                    </Suspense>
                    {children}
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
