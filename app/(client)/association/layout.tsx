import { absoluteUrl } from '@/constant/site';
import { Metadata } from 'next';
import { ReactNode } from 'react';

// Le suffixe de marque vient du gabarit défini dans `app/(client)/layout.tsx`.
// Il n'est répété ici que dans Open Graph et Twitter, qui n'ont pas de gabarit.
export const metadata: Metadata = {
    title: 'Notre club d’arts martiaux à Muret',
    description:
        "L'association JKD Self Defense 31 enseigne le Jeet Kune Do à Muret depuis 1998. Son histoire, sa pédagogie sans compétition et ses instructeurs.",
    keywords:
        'association JKD Self Defense 31, Jeet Kune Do, arts martiaux, Toulouse, Muret',
    alternates: { canonical: '/association' },
    openGraph: {
        title: 'Notre club d’arts martiaux à Muret | JKD Self Defense 31',
        description:
            "L'association JKD Self Defense 31 enseigne le Jeet Kune Do à Muret depuis 1998. Son histoire, sa pédagogie et ses instructeurs.",
        url: absoluteUrl('/association'),
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Notre club d’arts martiaux à Muret | JKD Self Defense 31',
        description:
            "L'association JKD Self Defense 31 enseigne le Jeet Kune Do à Muret depuis 1998. Son histoire, sa pédagogie et ses instructeurs.",
    },
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
