import FeatureAccordeon from './feature-accordeon';

interface PriceShowProps {
    title: string;
    subtitle?: string;
    price: number;
    features: string[];
}

export default function PriceShow({
    title,
    subtitle,
    price,
    features,
}: PriceShowProps) {
    return (
        <article className='outline outline-1 shadow-md shadow-gray-700 outline-gray-700 bg-gray-800 text-white rounded-md flex flex-col items-center py-4 px-2 md:p-8 space-y-8 h-fit max-md:min-w-full'>
            <header className='flex flex-col items-center space-y-2 text-center'>
                <h2 className='text-xl md:text-2xl font-semibold uppercase'>
                    {title}
                </h2>
                {subtitle ? (
                    <h3 className='text-gray-400 text-sm md:text-base'>
                        {subtitle}
                    </h3>
                ) : null}
            </header>
            <div className='flex items-end space-x-2 md:space-x-6'>
                <p className='text-xl md:text-3xl xl:text-5xl font-bold'>
                    {price}€
                </p>
                <span className='text-gray-400'>/an</span>
            </div>

            <ul className='flex flex-col'>
                <FeatureAccordeon features={features} />
            </ul>
        </article>
    );
}
