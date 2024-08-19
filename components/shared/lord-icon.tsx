'use client';

import { cn } from '@/lib/utils';
import { useEffect } from 'react';

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
    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('lottie-web').then((lottie) => {
                import('@lordicon/element').then((module) => {
                    module.defineElement(lottie.default.loadAnimation);
                });
            });
        }
    }, []);

    return (
        <div className={cn('relative', containerClassName)}>
            <lord-icon
                src={src}
                trigger={trigger}
                target={`#${target}`}
                colors={colors}
                style={style}
            ></lord-icon>
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
