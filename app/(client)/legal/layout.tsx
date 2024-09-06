import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Mentions légales - JKD Self Defense 31',
    description:
        "Mentions légales du site de l'association JKD Self Defense 31 à Muret.",
    keywords:
        'mentions légales Jeet Kune Do, prix cours arts martiaux, self-défense Toulouse Muret',
    openGraph: {
        title: 'Mentions légales - JKD Self Defense 31',
        description:
            "Mentions légales du site de l'association JKD Self Defense 31 à Muret.",
        url: `https://${process.env.VERCEL_URL}/association`,
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Mentions légales - JKD Self Defense 31',
        description:
            "Mentions légales du site de l'association JKD Self Defense 31 à Muret.",
    },
    metadataBase: new URL(process.env.VERCEL_URL || 'http://localhost:3000'),
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
