import FadeInWrapper from '@/components/shared/fade-in-wrapper';
import StylesAccordeon from './_components/styles-accordeon';
import StylesAnimateTitle from './_components/styles-animate-title';

export default function Styles() {
    return (
        <div className='flex flex-col items-center justify-center pt-10 md:pt-40 space-y-32 md:space-y-10 pb-10'>
            <StylesAnimateTitle />
            <FadeInWrapper className='w-full flex justify-center' delay={0.8}>
                <StylesAccordeon />
            </FadeInWrapper>
        </div>
    );
}
