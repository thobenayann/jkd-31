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
    title: "Site de l'association Ji Dao",
    description:
        'Le site de l’association Ji Dao, pour la pratique du Jeet Kune Do à Muret (31).',
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
