import { absoluteUrl } from '@/constant/site';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: "Les 27 styles qui ont influencé Bruce Lee",
    description:
        "Les 27 styles d'arts martiaux qui ont influencé Bruce Lee dans la construction du Jeet Kune Do, présentés par le club JKD Self Defense 31 à Muret.",
    keywords:
        '27 Styles arts martiaux Jeet Kune Do, self-défense Toulouse Muret',
    alternates: { canonical: '/27-styles' },
    openGraph: {
        title: "Les 27 styles qui ont influencé Bruce Lee | JKD Self Defense 31",
        description:
            "Les 27 styles d'arts martiaux qui ont influencé Bruce Lee dans la construction du Jeet Kune Do, présentés par le club JKD Self Defense 31 à Muret.",
        url: absoluteUrl('/27-styles'),
    },
    twitter: {
        card: 'summary_large_image',
        title: "Les 27 styles qui ont influencé Bruce Lee | JKD Self Defense 31",
        description:
            "Les 27 styles d'arts martiaux qui ont influencé Bruce Lee dans la construction du Jeet Kune Do, présentés par le club JKD Self Defense 31 à Muret.",
    },
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
