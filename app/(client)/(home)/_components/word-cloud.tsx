'use client';

import { useUserAttention } from '@/hooks/use-user-attention';
import { useEffect, useRef, useState, type Ref } from 'react';

const words = [
    'Respect',
    'valeur',
    'martial',
    'honneur',
    'humilité',
    'persévérance',
    'groupe',
    'cohésion',
    'loyauté',
    'martial',
    'sport',
    'dépassement',
];

/**
 * Hauteur moyenne approximative d'un mot (ligne + espacement). Sert au
 * dimensionnement initial du bloc et au calcul de la vitesse d'origine.
 */
const WORD_HEIGHT = 40;

/**
 * L'animation d'origine faisait descendre une liste de `ceil(h / 40) * 6` mots
 * de `translateY(-100 %)` à `translateY(100 %)` en 180 s, soit deux fois la
 * hauteur de la liste. On conserve cette vitesse et ce sens à l'identique.
 */
const ORIGINAL_WORDS_PER_ROW = 6;
const ORIGINAL_DURATION_S = 180;
/** Taille d'un pas de défilement, en px. */
const STEP_PX = 2;

const getRandomSize = () => {
    const sizes = [
        'text-xs',
        'text-sm',
        'text-base',
        'text-lg',
        'text-xl',
        'text-2xl',
    ];
    return sizes[Math.floor(Math.random() * sizes.length)];
};

const getRandomColor = () => {
    const shades = [
        'text-white',
        'text-[#8A8A8A]',
        'text-[#6C6C6C]',
        'text-[#979797]',
        'text-[#414141]',
    ];
    return shades[Math.floor(Math.random() * shades.length)];
};

type StyledWord = { word: string; size: string; color: string };

const generateWords = (baseWords: string[], count: number): StyledWord[] => {
    const wordList: StyledWord[] = [];
    for (let i = 0; i < count; i++) {
        const word = baseWords[i % baseWords.length];
        wordList.push({
            word,
            size: getRandomSize(),
            color: getRandomColor(),
        });
    }
    return wordList;
};

/**
 * Nuage de mots qui défile verticalement.
 *
 * Performance. Un seul bloc de mots, à peine plus haut que le conteneur, est
 * rendu deux fois de suite et animé de `translateY(-50 %)` à `translateY(0)`,
 * donc de haut en bas comme l'original : la boucle repart sans saut visible et
 * le calque animé fait deux hauteurs de conteneur, au lieu d'une liste six fois
 * plus haute qui traversait le cadre.
 * L'animation est mise en pause quand la colonne n'est pas visible
 * (IntersectionObserver), quand personne ne regarde (`useUserAttention` :
 * fenêtre sans focus ou inactivité), et respecte `prefers-reduced-motion`
 * (`motion-safe`).
 *
 * Écart visuel assumé par rapport à l'original : plus de conteneur vide en début
 * et en fin de cycle.
 */
const WordCloud = () => {
    const [styledWords, setStyledWords] = useState<StyledWord[]>([]);
    const [durationS, setDurationS] = useState(ORIGINAL_DURATION_S);
    const [stepCount, setStepCount] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const attentive = useUserAttention();
    const containerRef = useRef<HTMLDivElement>(null);
    const blockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateWords = () => {
            const containerHeight = container.clientHeight;
            if (containerHeight === 0) return;
            // Deux fois la hauteur du conteneur : garantit un bloc au moins aussi
            // haut que le cadre, condition de la boucle sans couture.
            const count = Math.ceil(containerHeight / WORD_HEIGHT) * 2;
            setStyledWords(generateWords(words, count));
        };

        // Délai : la hauteur du conteneur n'est pas stable au premier rendu.
        const timeoutId = setTimeout(updateWords, 400);

        let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
        const onResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateWords, 200);
        };
        window.addEventListener('resize', onResize);

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { rootMargin: '100px' }
        );
        observer.observe(container);

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(resizeTimeout);
            window.removeEventListener('resize', onResize);
            observer.disconnect();
        };
    }, []);

    // Une fois le bloc rendu, on cale la durée pour retrouver la vitesse
    // d'origine : (2 × hauteur de la liste d'origine) / 180 s.
    useEffect(() => {
        const container = containerRef.current;
        const block = blockRef.current;
        if (!container || !block || styledWords.length === 0) return;
        const blockHeight = block.offsetHeight;
        if (blockHeight === 0) return;
        const averageWordHeight = blockHeight / styledWords.length;
        const originalListHeight =
            Math.ceil(container.clientHeight / WORD_HEIGHT) *
            ORIGINAL_WORDS_PER_ROW *
            averageWordHeight;
        const speedPxPerS = (2 * originalListHeight) / ORIGINAL_DURATION_S;
        setDurationS(blockHeight / speedPxPerS);
        // Avance par pas de 2 px (`steps()`) : le compositeur ne redessine que
        // quand la position change, environ 35 fois par seconde, au lieu d'une
        // image par rafraîchissement d'écran.
        setStepCount(Math.max(1, Math.round(blockHeight / STEP_PX)));
    }, [styledWords]);

    const renderBlock = (keyPrefix: string, ref?: Ref<HTMLDivElement>) => (
        <div
            ref={ref}
            className='flex flex-col items-center space-y-2 pb-2'
            aria-hidden={keyPrefix === 'b' ? true : undefined}
        >
            {styledWords.map((styledWord, index) => (
                <span
                    key={`${keyPrefix}-${index}`}
                    className={`font-serif ${styledWord.size} ${styledWord.color}`}
                >
                    {styledWord.word.toUpperCase()}
                </span>
            ))}
        </div>
    );

    return (
        <div className='overflow-hidden h-full relative z-0' ref={containerRef}>
            <div
                className='absolute inset-0'
                style={{
                    background:
                        'linear-gradient(to bottom, rgba(2, 8, 23, 0.95) 5%, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0) 60%, rgba(2, 8, 23, 0.95) 100%)',
                    zIndex: 1,
                }}
            />
            <div
                className='flex flex-col font-cinzelDecorative will-change-transform motion-safe:animate-word-scroll'
                style={{
                    animationDuration: `${durationS}s`,
                    animationTimingFunction:
                        stepCount > 0 ? `steps(${stepCount})` : 'linear',
                    animationPlayState:
                        isVisible && attentive ? 'running' : 'paused',
                }}
            >
                {renderBlock('a', blockRef)}
                {renderBlock('b')}
            </div>
        </div>
    );
};

export default WordCloud;
