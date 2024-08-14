import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: "27 styles d'arts martiaux - JKD Self Defense 31",
    description:
        'Les 27 Styles qui ont influencés Bruce Lee pour le Jeet Kune Do - JKD Self Defense 31 à Muret.',
    keywords:
        '27 Styles arts martiaux Jeet Kune Do, self-défense Toulouse Muret',
    openGraph: {
        title: "27 styles d'arts martiaux - JKD Self Defense 31",
        description:
            'Les 27 Styles qui ont influencés Bruce Lee pour le Jeet Kune Do - JKD Self Defense 31 à Muret.',
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
        title: "27 styles d'arts martiaux - JKD Self Defense 31",
        description:
            'Les 27 Styles qui ont influencés Bruce Lee pour le Jeet Kune Do - JKD Self Defense 31 à Muret.',
    },
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
