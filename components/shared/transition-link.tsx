'use client';

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

interface TransitionLinkProps extends LinkProps {
    children: React.ReactNode;
    href: string;
    className?: string;
}

// Fonction utilitaire pour ajouter un délai en millisecondes
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
    children,
    href,
    className,
    ...props
}) => {
    const router = useRouter();

    const handleTransition = async (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault();
        const body = document.querySelector('body');

        body?.classList.add('page-transition');

        // Ici, sleep permettra de déterminer la durée avant que l'animation ne s'exécute et que la page ne soit changée
        // Il est important que ce paramètre soit le même que celui défini dans le fichier CSS
        await sleep(200);
        router.push(href);
        await sleep(200);

        body?.classList.remove('page-transition');
    };

    return (
        <Link
            {...props}
            href={href}
            onClick={handleTransition}
            className={className}
        >
            {children}
        </Link>
    );
};
