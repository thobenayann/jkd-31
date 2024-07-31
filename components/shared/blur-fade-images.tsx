import BlurFade from '@/components/magicui/blur-fade';
import Image, { ImageProps } from 'next/image';

export type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

interface BlurFadeImageProps extends ImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    style?: { objectFit?: ObjectFit };
}

interface BlurFadeImagesProps {
    images: BlurFadeImageProps[];
    delay?: number;
}

const BlurFadeImages: React.FC<BlurFadeImagesProps> = ({
    images,
    delay = 0.25,
}) => {
    return (
        <div className='flex max-md:flex-col max-md:space-y-10 md:space-x-4 w-full'>
            {images.map((image, idx) => (
                <BlurFade
                    key={image.src}
                    delay={delay + idx * 0.05}
                    inView
                    className='w-full h-full'
                    duration={0.8}
                >
                    <div
                        className={`relative rounded-lg ${
                            image.className || ''
                        }`}
                        style={image.style}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill={image.fill}
                            className={`w-full h-full shadow-md shadow-jkdBlue ${
                                image.className || ''
                            }`}
                            style={image.style}
                            sizes='(max-width: 768px) 100vw, 50vw'
                        />
                    </div>
                </BlurFade>
            ))}
        </div>
    );
};

export default BlurFadeImages;
