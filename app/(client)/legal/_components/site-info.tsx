import Image from 'next/image';

export default function SiteInfo() {
    return (
        <div className='text-white'>
            <h2 className='text-2xl font-bold mb-2'>
                Informations sur le Site
            </h2>
            <p className='text-gray-300 mb-4'>
                Ce site web est édité par{' '}
                <strong>l&apos;un de nos élèves</strong>.
            </p>
            <div className='flex items-center space-x-4'>
                <p className='text-gray-300'>Hébergement :</p>
                <Image
                    src='/vercel.svg'
                    alt='Vercel Logo'
                    width={80}
                    height={80}
                />
            </div>
        </div>
    );
}
