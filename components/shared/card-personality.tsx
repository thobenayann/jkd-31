import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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
}) => {
    return (
        <Card className='w-56 border-none shadow-lg'>
            <CardHeader
                className={cn(
                    'flex p-0 w-full relative overflow-hidden',
                    cardHeaderClass,
                    imageShape === 'round' ? 'h-full' : 'h-32'
                )}
            >
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
                        className={cn('object-cover object-top rounded-md')}
                    />
                )}
            </CardHeader>
            <CardContent className='text-left p-4 space-y-1'>
                <h3 className='text-lg font-bold'>{`${firstName} ${lastName}`}</h3>
                <div className='flex justify-between items-center'>
                    <span className='text-gray-400 text-sm'>{title}</span>
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
                    <p className='text-gray-400 text-sm'>{shortInfo}</p>
                )}
                <div className='pt-4'>
                    <a
                        href='#'
                        className='text-jkdBlue font-semibold hover:text-jkdBlue/85 text-sm'
                    >
                        En savoir plus -&gt;
                    </a>
                </div>
            </CardContent>
        </Card>
    );
};

export default CardPersonality;
