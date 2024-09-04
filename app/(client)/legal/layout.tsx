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
        images: [
            {
                url: `https://${process.env.VERCEL_URL}/images/logo/logo-jkd-sd-31.webp`,
                width: 1200,
                height: 630,
                alt: 'Association JKD Self Defense 31',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Mentions légales - JKD Self Defense 31',
        description:
            "Mentions légales du site de l'association JKD Self Defense 31 à Muret.",
    },
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
