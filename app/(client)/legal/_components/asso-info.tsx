import { associationConfig } from '@/constant/config';
import { obfuscateEmail } from '@/lib/obfuscateEmail';

export default function AssoInfo() {
    const obfuscatedEmail = obfuscateEmail(associationConfig.email);
    return (
        <div className='text-white pt-20'>
            <h2 className='text-2xl font-bold mb-2'>
                Informations sur l&apos;Association
            </h2>
            <p className='text-gray-300 mb-4'>
                Nom de l&apos;association : <strong>Ji DAO</strong>
            </p>
            <p className='text-gray-300 mb-4'>
                Adresse :{' '}
                <strong>6 Rue Pierre Bauduc, 31600 Muret, France</strong>
            </p>
            <p className='text-gray-300 mb-4'>
                Numéro de téléphone : <strong>+33 6 84 05 93 26</strong>
            </p>
            <p className='text-gray-300 mb-4'>
                Email :{' '}
                <strong dangerouslySetInnerHTML={{ __html: obfuscatedEmail }} />
            </p>
        </div>
    );
}
