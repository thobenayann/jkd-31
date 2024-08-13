import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import SportSvg from '@/components/svg/sport-svg';
import GradualSpacing from '@/components/ui/gradual-spacing';
import coursesData from '@/data/courses.json';
import { CourseData } from '@/types/specific-types';
import CoursesTable from './_components/courses-table';
import FindUs from './_components/find-us';
import PriceShow from './_components/price-show';

export default function Prices() {
    const courseData: CourseData = coursesData;
    return (
        <section className='w-full flex flex-col space-y-12 md:space-y-20 max-md:pb-10'>
            {/* Les cours */}
            <header className='flex flex-col items-center align-center space-y-2 pb-10 pt-10 md:pt-28'>
                <GradualSpacing
                    className='text-5xl max-md:text-center md:text-6xl font-bold leading-none md:max-w-xl'
                    text='Les cours'
                />
            </header>
            <article className='flex flex-col-reverse md:flex-col md:space-y-8 max-md:border-b-2 max-md:pb-8 max-md:border-dashed'>
                <div className='flex max-md:flex-col justify-between items-center container max-md:space-y-8 md:space-x-8'>
                    {coursesData.map((course, index) => (
                        <PriceShow
                            key={index}
                            title={course.title}
                            subtitle={course.subtitle}
                            price={course.price.inscription}
                            features={course.features}
                        />
                    ))}
                </div>
                <FadeInWrapper className='flex justify-center max-md:pb-10'>
                    <SportSvg className='w-32 h-32 md:w-72 md:h-72 fill-jkdBlue' />
                </FadeInWrapper>
            </article>

            {/* Détails des tarifs réduits */}
            <article className='flex flex-col items-center justify-center max-md:space-y-4'>
                <GradualSpacing
                    text='Détails des tarifs réduits'
                    className='text-center text-2xl md:text-3xl font-bold leading-none md:max-w-xl'
                />
                <CoursesTable data={courseData} />
            </article>

            {/* Nous trouver */}
            <article className='flex flex-col items-center justify-center space-y-4 md:space-y-12 bg-gray-900 pt-12 md:pt-24 pb-16 md:pb-24 h-full'>
                <GradualSpacing
                    text='Nous trouver'
                    className='text-center text-2xl md:text-3xl font-bold leading-none md:max-w-xl'
                />
                <FadeInWrapper className='flex justify-center max-md:pb-10 w-full h-full'>
                    <FindUs />
                </FadeInWrapper>
            </article>
        </section>
    );
}
