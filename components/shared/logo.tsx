import Image from 'next/image';

import logo from '../../public/images/logo/logo-jkd31.png';

export const MyLogo = () => {
    return (
        <Image
            src={logo}
            alt="My Logo"
            height={18}
            style={{ objectFit: 'contain' }}
        />
    );
};
