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
                    <motion.div layoutId={`image-${layoutIdPrefix}`}>
                        {imageShape === 'round' ? (
                            <Image
                                src={personalityPhotoUrl}
                                alt={`${firstName} ${lastName}`}
                                width={150}
                                height={150}
                                className={cn(
                                    'object-cover object-center rounded-full'
                                )}
                            />
                        ) : (
                            <Image
                                src={personalityPhotoUrl}
                                alt={`${firstName} ${lastName}`}
                                fill
                                className={cn(
                                    'object-cover object-top rounded-md'
                                )}
                            />
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
                        {flagUrl ? (
                            <Image
                                src={flagUrl}
                                alt='flag'
                                width={24}
                                height={24}
                            />
                        ) : null}
                    </div>
                    {shortInfo && (
                        <motion.p
                            layoutId={`shortInfo-${layoutIdPrefix}`}
                            className='text-gray-400 text-sm'
                        >
                            {shortInfo}
                        </motion.p>
                    )}
                    {withMoreInfo ? (
                        <div className='pt-4'>
                            <a
                                href='#'
                                className='text-jkdBlue font-semibold hover:text-jkdBlue/85 text-sm'
                                onClick={(event) => {
                                    event.preventDefault();
                                    onMoreInfoClick && onMoreInfoClick();
                                }}
                            >
                                En savoir plus -&gt;
                            </a>
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CardPersonality;
