import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import * as React from 'react';

interface CardPersonalityProps {
    personalityPhotoUrl: string;
    firstName: string;
    lastName: string;
    title: string;
    flagUrl?: string;
    shortInfo?: string;
    imageShape?: 'round' | 'square';
    cardHeaderClass?: string;
    withMoreInfo?: boolean;
    onMoreInfoClick?: () => void;
}

const CardPersonality: React.FC<CardPersonalityProps> = ({
    personalityPhotoUrl,
    firstName,
    lastName,
    title,
    flagUrl,
    shortInfo,
    imageShape = 'square',
    cardHeaderClass,
    withMoreInfo = false,
    onMoreInfoClick,
}) => {
    const layoutIdPrefix = `${firstName}-${lastName}`;

    return (
        <motion.div layoutId={`card-${layoutIdPrefix}`} className='w-56'>
            <Card className='border-none shadow-lg backdrop-blur-sm bg-transparent'>
                <CardHeader
                    className={cn(
                        'flex p-0 w-full relative overflow-hidden',
                        cardHeaderClass,
                        imageShape === 'round' ? 'h-full' : 'h-32'
                    )}
                >
                    <motion.div
                        layoutId={`image-${layoutIdPrefix}`}
                        className='w-full h-full'
                    >
                        {imageShape === 'round' ? (
                            <div className='relative w-[150px] h-[150px]'>
                                <Image
                                    src={personalityPhotoUrl}
                                    alt={`${firstName} ${lastName}`}
                                    fill
                                    sizes='150px'
                                    className='object-cover object-center rounded-full'
                                />
                            </div>
                        ) : (
                            <div className='relative w-full h-full'>
                                <Image
                                    src={personalityPhotoUrl}
                                    alt={`${firstName} ${lastName}`}
                                    fill
                                    sizes='(max-width: 768px) 100vw, 224px'
                                    className='object-cover object-top rounded-md'
                                />
                            </div>
                        )}
                    </motion.div>
                </CardHeader>
                <CardContent className='text-left p-4 space-y-1'>
                    <motion.h3
                        layoutId={`title-${layoutIdPrefix}`}
                        className='text-lg font-bold'
                    >{`${firstName} ${lastName}`}</motion.h3>
                    <div className='flex justify-between items-center'>
                        <motion.span
                            layoutId={`title-${layoutIdPrefix}`}
                            className='text-gray-400 text-sm'
                        >
                            {title}
                        </motion.span>
                        {flagUrl && (
                            <div className='relative w-6 h-6'>
                                <Image
                                    src={flagUrl}
                                    alt='flag'
                                    fill
                                    sizes='24px'
                                    className='object-contain'
                                />
                            </div>
                        )}
                    </div>
                    {shortInfo && (
                        <motion.p
                            layoutId={`shortInfo-${layoutIdPrefix}`}
                            className='text-gray-400 text-sm'
                        >
                            {shortInfo}
                        </motion.p>
                    )}
                    {withMoreInfo && (
                        <div className='pt-4'>
                            <a
                                href='#'
                                className='text-jkdBlue font-semibold hover:text-jkdBlue/85 text-sm'
                                onClick={(event) => {
                                    event.preventDefault();
                                    onMoreInfoClick?.();
                                }}
                            >
                                En savoir plus -&gt;
                            </a>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CardPersonality;
