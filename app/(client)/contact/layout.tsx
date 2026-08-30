import { absoluteUrl } from '@/constant/site';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Contacter le club à Muret',
    description:
        "Une question avant de venir essayer le Jeet Kune Do ou la self-défense à Muret ? Écrivez au club ou appelez le 06 84 05 93 26. Débutants bienvenus.",
    keywords:
        'contact Jeet Kune Do, prix cours arts martiaux, self-défense Toulouse Muret',
    alternates: { canonical: '/contact' },
    openGraph: {
        title: 'Contacter le club à Muret | JKD Self Defense 31',
        description:
            "Une question avant de venir essayer le Jeet Kune Do ou la self-défense à Muret ? Écrivez au club ou appelez le 06 84 05 93 26.",
        url: absoluteUrl('/contact'),
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contacter le club à Muret | JKD Self Defense 31',
        description:
            "Une question avant de venir essayer le Jeet Kune Do ou la self-défense à Muret ? Écrivez au club ou appelez le 06 84 05 93 26.",
    },
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
