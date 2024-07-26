import { associationConfig } from '@/constant/config';
import { obfuscateEmail } from '@/lib/obfuscateEmail';

export default function ContactInfo() {
    const obfuscatedEmail = obfuscateEmail(associationConfig.email);
    return (
        <div className='text-white'>
            <h2 className='text-2xl font-bold mb-2'>Contact</h2>
            <p className='text-gray-300 mb-4'>
                Pour toute question ou demande d&apos;information concernant
                notre politique de confidentialité, vous pouvez nous contacter
                par email à l&apos;adresse suivante :{' '}
                <strong dangerouslySetInnerHTML={{ __html: obfuscatedEmail }} />
            </p>
        </div>
    );
}
