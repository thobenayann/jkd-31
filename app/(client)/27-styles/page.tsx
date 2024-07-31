import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import StylesAccordeon from './_components/styles-accordeon';
import StylesAnimateTitle from './_components/styles-animate-title';
import ParallaxBackground from './_components/styles-parallax-bg';

export default function Styles() {
    return (
        <div className='flex flex-col items-center justify-center space-y-32 md:space-y-10 pb-10'>
            <div className='w-full h-full pt-10 md:py-32 relative overflow-hidden'>
                <ParallaxBackground imageUrl='url(/images/content/27-styles/self-bg-2.jpg)' />
                <StylesAnimateTitle />
            </div>

            <FadeInWrapper className='w-full flex justify-center' delay={0.8}>
                <StylesAccordeon />
            </FadeInWrapper>
        </div>
    );
}
