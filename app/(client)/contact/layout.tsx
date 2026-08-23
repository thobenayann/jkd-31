import { absoluteUrl } from '@/constant/site';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Contactez-nous - JKD Self Defense 31',
    description:
        "N'hésitez pas à nous contacter pour toute question sur nos cours de Jeet Kune Do ou pour rejoindre l'association JKD Self Defense 31 à Muret.",
    keywords:
        'contact Jeet Kune Do, prix cours arts martiaux, self-défense Toulouse Muret',
    alternates: { canonical: '/contact' },
    openGraph: {
        title: 'Contactez-nous - JKD Self Defense 31',
        description:
            "N'hésitez pas à nous contacter pour toute question sur nos cours de Jeet Kune Do ou pour rejoindre l'association JKD Self Defense 31 à Muret.",
        url: absoluteUrl('/contact'),
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contactez-nous - JKD Self Defense 31',
        description:
            "N'hésitez pas à nous contacter pour toute question sur nos cours de Jeet Kune Do ou pour rejoindre l'association JKD Self Defense 31 à Muret.",
    },
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
