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
    },
    twitter: {
        card: 'summary_large_image',
        title: "27 styles d'arts martiaux - JKD Self Defense 31",
        description:
            'Les 27 Styles qui ont influencés Bruce Lee pour le Jeet Kune Do - JKD Self Defense 31 à Muret.',
    },
    metadataBase: new URL(process.env.VERCEL_URL || 'http://localhost:3000'),
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
