'use client';

import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import {
    Credenza,
    CredenzaContent,
    CredenzaDescription,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from '../ui/credenza';

const LordIcon = dynamic(() => import('@/components/shared/lord-icon'), {
    ssr: false,
});

interface ContactModalProps {
    object: 'phone' | 'email';
    email?: string;
    phone?: string;
    iconSrc: string;
}

export default function ContactModal({
    object,
    email,
    phone,
    iconSrc,
}: ContactModalProps) {
    const target = 'contact-group-' + object === 'email' ? 'email' : 'phone';
    return (
        <>
            <Credenza>
                <CredenzaTrigger asChild>
                    <div
                        id={target}
                        className='flex items-center space-x-2 cursor-pointer'
                    >
                        <LordIcon
                            trigger='hover'
                            src={iconSrc}
                            style={{ width: '24px', height: '24px' }}
                            colors='primary:#ffffff,secondary:#000000'
                            target={target}
                        />
                        <span className='ml-2'>
                            {object === 'email' ? email : phone}
                        </span>
                    </div>
                </CredenzaTrigger>
                <CredenzaContent onClose={() => {}}>
                    <div className='flex flex-col space-y-4'>
                        <CredenzaHeader>
                            <CredenzaTitle>
                                {object === 'email' ? (
                                    <div className='flex flex-col items-center space-y-2'>
                                        <p>
                                            Voulez-vous nous envoyer un mail ?
                                        </p>
                                        <p>Cliquez ci-dessous.</p>
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center space-y-2'>
                                        <p>Voulez-vous nous appeler ?</p>
                                        <p>Cliquez ci-dessous.</p>
                                    </div>
                                )}
                            </CredenzaTitle>
                            <CredenzaDescription>
                                <Button asChild variant='link'>
                                    <a
                                        href={
                                            object === 'email'
                                                ? `mailto:${email}`
                                                : `tel:${phone}`
                                        }
                                        className='flex justify-center items-center space-x-2'
                                        id={target}
                                    >
                                        <LordIcon
                                            trigger='hover'
                                            src={iconSrc}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                            }}
                                            colors='primary:#ffffff,secondary:#000000'
                                            target={target}
                                        />
                                        <span>
                                            {object === 'email' ? email : phone}
                                        </span>
                                    </a>
                                </Button>
                            </CredenzaDescription>
                        </CredenzaHeader>
                    </div>
                </CredenzaContent>
            </Credenza>
        </>
    );
}
