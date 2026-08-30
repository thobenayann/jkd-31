import { absoluteUrl } from '@/constant/site';
import { Metadata } from 'next';
import { ReactNode } from 'react';

// La description reprenait mot pour mot celle de `/association`. Corrigée le
// 30 août 2026 : c'est la deuxième page la plus consultée du site, et celle où
// se prend la décision de venir essayer.
export const metadata: Metadata = {
    title: 'Tarifs et horaires des cours à Muret',
    description:
        'Tarifs, horaires et lieu des cours de Jeet Kune Do, JKD Boxing, Jun Fan conditioning et self-défense féminine à Muret. Licence et adhésion comprises.',
    keywords:
        'tarifs Jeet Kune Do, prix cours arts martiaux, self-défense Toulouse Muret',
    alternates: { canonical: '/tarifs' },
    openGraph: {
        title: 'Tarifs et horaires des cours à Muret | JKD Self Defense 31',
        description:
            'Tarifs, horaires et lieu des cours de Jeet Kune Do, JKD Boxing, conditioning et self-défense féminine à Muret.',
        url: absoluteUrl('/tarifs'),
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tarifs et horaires des cours à Muret | JKD Self Defense 31',
        description:
            'Tarifs, horaires et lieu des cours de Jeet Kune Do, JKD Boxing, conditioning et self-défense féminine à Muret.',
    },
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
