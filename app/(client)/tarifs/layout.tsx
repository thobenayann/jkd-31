import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Tarifs des cours - JKD Self Defense 31',
    description:
        'Découvrez notre association et son histoire, nos valeurs et notre équipe.',
    keywords:
        'tarifs Jeet Kune Do, prix cours arts martiaux, self-défense Toulouse Muret',
    openGraph: {
        title: 'Tarifs des cours - JKD Self Defense 31',
        description:
            'Découvrez les tarifs de nos cours, les horaires et réductions.',
        url: `https://${process.env.VERCEL_URL}/association`,
        images: [
            {
                url: `https://${process.env.VERCEL_URL}/images/logo/logo.svg`,
                width: 1200,
                height: 630,
                alt: 'Association JKD Self Defense 31',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tarifs des cours - JKD Self Defense 31',
        description:
            'Découvrez les tarifs de nos cours, les horaires et réductions.',
    },
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
