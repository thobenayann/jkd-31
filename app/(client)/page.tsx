import GradualSpacing from '@/components/ui/gradual-spacing';
import Confetti from './_components/confetti';

export default function Home() {
    return (
        <div
            className='h-screen w-full relative'
            style={{
                backgroundImage: `url(/images/content/home/logo-jkd.webp)`,
                backgroundSize: 'cover',
            }}
        >
            <div className='absolute top-[15%] left-[64%]'>
                <Confetti />
            </div>
            <div className='md:pl-52 pt-60 md:pt-80'>
                <GradualSpacing
                    className='max-md:text-center font-cinzel text-white text-6xl md:text-7xl'
                    text='Ji Dao'
                />
            </div>
        </div>
    );
}
