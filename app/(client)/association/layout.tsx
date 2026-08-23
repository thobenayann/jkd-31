import { absoluteUrl } from '@/constant/site';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Notre Association - JKD Self Defense 31',
    description:
        'Découvrez notre association et son histoire, nos valeurs et notre équipe.',
    keywords:
        'association JKD Self Defense 31, Jeet Kune Do, arts martiaux, Toulouse, Muret',
    alternates: { canonical: '/association' },
    openGraph: {
        title: 'Notre Association - JKD Self Defense 31',
        description: 'Tout savoir sur notre association et son engagement.',
        url: absoluteUrl('/association'),
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Notre Association - JKD Self Defense 31',
        description: 'Découvrez notre association, ses membres et ses valeurs.',
    },
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
