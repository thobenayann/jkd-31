import Link from 'next/link';

export default function CookiesInfo() {
    return (
        <div className='text-white'>
            <h2 className='text-2xl font-bold mb-2'>Cookies</h2>
            <p className='text-gray-300 mb-4'>
                Ce site utilise{' '}
                <Link
                    href='https://vercel.com/analytics'
                    className='text-blue-500 hover:underline'
                >
                    Vercel Analytics
                </Link>{' '}
                pour mesurer les performances et les interactions des
                utilisateurs. Aucune donnée personnelle identifiable n&apos;est
                collectée et{' '}
                <span className='underline underline-offset-4 decoration-jkdBlue decoration-2'>
                    aucun cookie n&apos;est utilisé
                </span>
                .
            </p>
        </div>
    );
}
