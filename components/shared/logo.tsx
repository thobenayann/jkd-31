import Image from 'next/image';

import logo from '../../public/images/logo/logo-jkd-admin.png';

export const MyLogo = () => {
    return (
        <Image
            src={logo}
            alt='Logo JKD Self Defense 31'
            height={25}
            style={{ objectFit: 'contain', width: 'auto' }}
        />
    );
};
