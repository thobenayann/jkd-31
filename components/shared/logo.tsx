import Image from 'next/image';

import logo from '../../public/images/logo/logo-jkd-admin.webp';

export const MyLogo = () => {
    return (
        <Image
            src={logo}
            alt='My Logo'
            height={25}
            style={{ objectFit: 'contain', width: 'auto' }}
        />
    );
};
