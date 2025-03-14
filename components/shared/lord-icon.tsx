'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface LordIconProps {
    src: string;
    trigger?: string;
    target?: string;
    colors?: string;
    style?: React.CSSProperties;
    containerClassName?: string;
}

const LordIcon: React.FC<LordIconProps> = ({
    src,
    trigger = 'hover',
    target,
    colors,
    style,
    containerClassName,
}) => {
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && iconRef.current) {
            import('lottie-web').then((lottie) => {
                import('@lordicon/element').then((module) => {
                    module.defineElement(lottie.default.loadAnimation);

                    // Créer dynamiquement l'élément lord-icon après le chargement du module
                    const lordIcon = document.createElement('lord-icon');
                    lordIcon.setAttribute('src', src);
                    lordIcon.setAttribute('trigger', trigger);
                    if (target) lordIcon.setAttribute('target', `#${target}`);
                    if (colors) lordIcon.setAttribute('colors', colors);
                    if (style) {
                        Object.entries(style).forEach(([key, value]) => {
                            // @ts-ignore
                            lordIcon.style[key] = value;
                        });
                    }

                    // Vider et ajouter l'élément
                    if (iconRef.current) {
                        iconRef.current.innerHTML = '';
                        iconRef.current.appendChild(lordIcon);
                    }
                });
            });
        }
    }, [src, trigger, target, colors, style]);

    return (
        <div className={cn('relative', containerClassName)}>
            <div ref={iconRef} className='lord-icon-container'></div>
            {/* <a
                href='https://lordicon.com/'
                className='invisible absolute top-0 left-0'
            >
                Icons by Lordicon.com
            </a> */}
        </div>
    );
};

export default LordIcon;
