import Link from 'next/link';

const Footer = () => {
    return (
        <footer className='flex flex-col items-center p-4 pb-20 md:pb-4 w-full text-center font-serif'>
            <p className='text-gray-400 text-xs md:text-sm font-normal'>
                ©2024 - Association JI DAO à Muret (31600) - Salle Albert Camus
                - Tous droits réservés
            </p>
            <div className='flex justify-center space-x-4'>
                <div className='flex items-center space-x-1'>
                    <p className='text-xs md:text-sm font-normal text-gray-400'>
                        Réalisation{' '}
                    </p>
                    <a
                        className='text-jkdBlue text-xs md:text-sm hover:text-blue-600 block'
                        href='https://thobena-yann-developpeur-web.netlify.app/'
                    >
                        Yann THOBENA
                    </a>
                </div>

                <span className='border-r-2' />
                <Link
                    href='/mentions-legales'
                    className='text-jkdBlue hover:text-blue-600 text-xs md:text-sm font-normal underline underline-offset-2'
                >
                    Mentions Légales
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
