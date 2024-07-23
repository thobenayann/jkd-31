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
}

const CardPersonality: React.FC<CardPersonalityProps> = ({
    personalityPhotoUrl,
    firstName,
    lastName,
    title,
    flagUrl,
    shortInfo,
    imageShape = 'square',
}) => {
    return (
        <Card className='max-w-sm mx-auto border-none shadow-lg'>
            <CardHeader className='flex items-end p-0'>
                <Image
                    src={personalityPhotoUrl}
                    alt={`${firstName} ${lastName}`}
                    width={150}
                    height={150}
                    className={cn(
                        'object-cover',
                        imageShape === 'round' ? 'rounded-full' : 'rounded-md'
                    )}
                />
            </CardHeader>
            <CardContent className='text-left p-4 space-y-1'>
                <h3 className='text-xl font-bold'>{`${firstName} ${lastName}`}</h3>
                <div className='flex justify-between items-center'>
                    <span className='text-gray-400'>{title}</span>
                    {flagUrl && (
                        <Image
                            src={flagUrl}
                            alt='flag'
                            width={24}
                            height={24}
                            className='rounded-full'
                        />
                    )}
                </div>
                {shortInfo && <p className='text-gray-500'>{shortInfo}</p>}
                <div className='pt-4'>
                    <a
                        href='#'
                        className='text-jkdBlue font-semibold hover:text-jkdBlue/85'
                    >
                        En savoir plus -&gt;
                    </a>
                </div>
            </CardContent>
        </Card>
    );
};

export default CardPersonality;
