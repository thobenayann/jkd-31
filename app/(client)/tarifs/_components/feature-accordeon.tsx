'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Check } from 'lucide-react';

interface FeatureAccordeonProps {
    features: string[];
}

export default function FeatureAccordeon({ features }: FeatureAccordeonProps) {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return isDesktop ? (
        <ul className='flex flex-col'>
            {features.map((feature, index) => (
                <li key={index} className='flex max-md:items-center mt-1'>
                    <Check
                        className='stroke-green-600 mr-2 min-w-6 md:mt-1'
                        size={16}
                    />
                    <strong className='text-sm font-light'>{feature}</strong>
                </li>
            ))}
        </ul>
    ) : (
        <Accordion type='single' collapsible className='flex flex-col'>
            <AccordionItem value='item-1'>
                <AccordionTrigger>
                    <div className='text-white md:hover:underline underline-offset-2 max-md:text-sm'>
                        Ce qui comprend
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <ul className='flex flex-col'>
                        {features.map((feature, index) => (
                            <li key={index} className='flex mt-1'>
                                <Check
                                    className='stroke-green-600 mr-2 min-w-6 mt-1'
                                    size={16}
                                />
                                <strong className='text-sm md:text-base font-light'>
                                    {feature}
                                </strong>
                            </li>
                        ))}
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
