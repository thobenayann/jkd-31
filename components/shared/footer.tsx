import { TransitionLink } from './transition-link';

const Footer = () => {
    return (
        <footer className='flex flex-col items-center p-4 pb-28 md:pb-4 w-full text-center font-serif'>
            <p className='text-gray-400 text-sm font-normal'>
                ©2024 - Association JKD Self Defense 31 à Muret (31600) - Salle
                Albert Camus - Tous droits réservés
            </p>
            <div className='flex max-md:flex-col justify-center space-x-4'>
                <div className='flex items-center space-x-1'>
                    <p className='text-sm font-normal text-gray-400'>
                        Réalisation{' '}
                    </p>
                    <a
                        className='text-[#00A2FF] text-sm hover:text-blue-600 block'
                        href='https://www.yanndevweb.com/'
                    >
                        Yann THOBENA
                    </a>
                </div>

                <span className='border-r-2' />
                <TransitionLink
                    href='/legal'
                    className='text-[#00A2FF] hover:text-blue-600 text-sm font-normal underline underline-offset-2'
                >
                    Mentions Légales
                </TransitionLink>
            </div>
        </footer>
    );
};

export default Footer;
