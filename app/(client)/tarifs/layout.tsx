import { absoluteUrl } from '@/constant/site';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Tarifs des cours - JKD Self Defense 31',
    description:
        'Découvrez notre association et son histoire, nos valeurs et notre équipe.',
    keywords:
        'tarifs Jeet Kune Do, prix cours arts martiaux, self-défense Toulouse Muret',
    alternates: { canonical: '/tarifs' },
    openGraph: {
        title: 'Tarifs des cours - JKD Self Defense 31',
        description:
            'Découvrez les tarifs de nos cours, les horaires et réductions.',
        url: absoluteUrl('/tarifs'),
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
