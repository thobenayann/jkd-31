'use client';

import { useSearchParams } from 'next/navigation';
import React, { Children, ReactElement, useEffect, useState } from 'react';

/**
 * Component that handles navigation events to get the hash in url.
 * Wish is actually impossible with router in nextjs14
 *
 * @returns null
 */

interface NavigationEventsProps {
    children: ReactElement;
}

export function NavigationEvents({ children }: NavigationEventsProps) {
    const searchParams = useSearchParams();

    const [hash, setHash] = useState<string>('');

    useEffect(() => {
        // Mise à jour du hash lorsqu'il y a des changements dans l'URL
        const handleHashChange = () => {
            setHash(window.location.hash);
        };

        // Écouter les changements d'URL
        window.addEventListener('hashchange', handleHashChange, false);

        // Définir initialement le hash
        handleHashChange();

        // Nettoyage de l'effet
        return () => {
            window.removeEventListener('hashchange', handleHashChange, false);
        };
    }, [searchParams]);

    // Cloner l'enfant (Nav) et lui passer la props `hash`
    const childWithProps = Children.map(children, (child) => {
        return React.cloneElement(child, { hash });
    });

    return <>{childWithProps}</>;
}
