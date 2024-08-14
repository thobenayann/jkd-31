import GradualSpacing from '@/components/ui/gradual-spacing';
import HomeContent from './(home)/home-content';
import HomeTitle from './(home)/_components/home-title';

export default function Home() {
    return (
        <div>
            <header
                className='h-screen w-full bg-contain md:bg-cover bg-no-repeat bg-center md:bg-top'
                style={{
                    backgroundImage: `url(/images/content/home/home-background.webp)`,
                }}
            >
                <HomeTitle />
            </header>
            <HomeContent />
        </div>
    );
}
