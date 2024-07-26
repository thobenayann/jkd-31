'use client';

import ExpandableCardPersonality from '@/components/shared/expandable-card-personality';
import { useMediaQuery } from '@/hooks/use-media-query';
import { PersonalityType } from '@/lib/findPersonalityByLastName';
import { useState } from 'react';
import HomeContentStatic from './home-content-static';

export default function HomeContentClient() {
    const [activePersonality, setActivePersonality] =
        useState<PersonalityType | null>(null);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <>
            <HomeContentStatic
                setActivePersonality={setActivePersonality}
                isDesktop={isDesktop}
            />
            <ExpandableCardPersonality
                activePersonality={activePersonality}
                setActivePersonality={setActivePersonality}
            />
        </>
    );
}
