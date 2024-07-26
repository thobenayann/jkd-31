import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import stylesData from '@/data/27-styles.json';

export default function StylesAccordeon() {
    return (
        <Accordion type='single' collapsible className='max-md:mx-4 md:w-3/4'>
            {stylesData.map((style, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>
                        <div className='flex items-center space-x-4'>
                            <div className='w-5 h-5 bg-gray-500 text-white flex items-center justify-center rounded-full text-xs'>
                                {index + 1}
                            </div>
                            <div className='text-white md:hover:underline underline-offset-2 max-md:text-sm text-start'>
                                {style.title}
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className='text-white'>
                        {style.description}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
