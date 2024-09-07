import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Événements - JKD Self Defense 31',
    description:
        "Restez informé des prochains événements, stages et démonstrations organisés par l'association JKD Self Defense 31 à Muret.",
    keywords:
        'événements Jeet Kune Do, stages arts martiaux et self defense, JKD Self Defense 31 Toulouse',
    openGraph: {
        title: 'Événements - JKD Self Defense 31',
        description:
            "Restez informé des prochains événements, stages et démonstrations organisés par l'association JKD Self Defense 31 à Muret.",
        url: process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/events`
            : 'http://localhost:3000/events',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Événements - JKD Self Defense 31',
        description:
            "Restez informé des prochains événements, stages et démonstrations organisés par l'association JKD Self Defense 31 à Muret.",
    },
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <main>{children}</main>
        </>
    );
}
