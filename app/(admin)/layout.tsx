import type { Metadata } from 'next';
import { viewport } from 'next-sanity/studio';

export { viewport };

export const metadata: Metadata = {
    title: 'Sanity studio - JKD Self Defense 31',
    description:
        'Espace de création de contenu pour le site JKD Self Defense 31',
    // Interface d'édition : jamais indexée, même si une URL fuit
    robots: { index: false, follow: false },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='fr'>
            <body>{children}</body>
        </html>
    );
}
