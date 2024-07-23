import GradualSpacing from '@/components/ui/gradual-spacing';
import HomeContent from './(home)/home-content';

export default function Home() {
    return (
        <div>
            <header
                className='h-screen w-full'
                style={{
                    backgroundImage: `url(/images/content/home/logo-jkd.webp)`,
                    backgroundSize: 'cover',
                }}
            >
                <div className='md:pl-52 pt-60 md:pt-80'>
                    <GradualSpacing
                        className='max-md:text-center font-cinzel text-white text-6xl md:text-7xl'
                        text='Ji Dao'
                    />
                </div>
            </header>
            <HomeContent />
        </div>
    );
}
