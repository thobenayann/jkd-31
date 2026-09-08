'use client';

import { useEffect, useRef, useState } from 'react';

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

const generateWords = (baseWords: string[], count: number) => {
    const wordList = [];
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

const WordCloud = () => {
    const [styledWords, setStyledWords] = useState<
        { word: string; size: string; color: string }[]
    >([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateWords = () => {
        if (containerRef.current) {
            const containerHeight = containerRef.current.clientHeight;
            const wordHeight = 40; // Approximate height of a word
            const wordCount = Math.ceil(containerHeight / wordHeight) * 6; // Adjust the multiplier for more words
            const wordsWithStyles = generateWords(words, wordCount);
            setStyledWords(wordsWithStyles);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateWords();
        }, 400); // On met du délai sur le calculs des mots à cause d'un effet de bord sur le calcul de la hauteur du container

        window.addEventListener('resize', updateWords);

        return () => {
            clearTimeout(timeoutId); // Nettoyage du timeout
            window.removeEventListener('resize', updateWords);
        };
    }, []);

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
            {/*
                Défilement en CSS pur (`animate-word-scroll`, défini dans
                tailwind.config). Reprend l'animation d'origine à l'identique
                (y de -100 % à 100 %, linéaire, 180 s, en boucle) sans la boucle
                JavaScript de framer-motion, qui tournait en continu sur le
                thread principal même hors écran.
            */}
            <div className='flex flex-col items-center space-y-2 font-cinzelDecorative animate-word-scroll'>
                {styledWords.map((styledWord, index) => (
                    <span
                        key={index}
                        className={`font-serif ${styledWord.size} ${styledWord.color}`}
                    >
                        {styledWord.word.toUpperCase()}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default WordCloud;
