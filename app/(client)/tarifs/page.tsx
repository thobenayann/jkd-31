import SportSvg from '@/components/svg/sport-svg';
import GradualSpacing from '@/components/ui/gradual-spacing';
import coursesData from '@/data/courses.json';
import PriceShow from './_components/price-show';

export default function Prices() {
    return (
        <section className='w-full flex flex-col space-y-12 max-md:pb-28 min-h-screen'>
            <header className='flex flex-col items-center align-center space-y-2 pb-10 pt-10 md:pt-28'>
                <GradualSpacing
                    className='text-4xl max-md:text-center md:text-6xl font-bold leading-none md:max-w-xl'
                    text='Les cours'
                />
            </header>
            <div className='flex max-md:flex-col justify-between items-center container max-md:space-y-8 md:space-x-8'>
                {coursesData.map((course, index) => (
                    <PriceShow
                        key={index}
                        title={course.title}
                        subtitle={course.subtitle}
                        price={course.price}
                        features={course.features}
                    />
                ))}
            </div>
            <div className='flex justify-center'>
                <SportSvg className='w-72 h-72 fill-jkdBlue' />
            </div>
        </section>
    );
}
