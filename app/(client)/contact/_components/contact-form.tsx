'use client';

import { Button } from '@/components/ui/button';
import { sendEmail } from '@/services/sendEmail';
import Image from 'next/image';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster, toast } from 'sonner';

type Inputs = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    message: string;
};

export default function ContactForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>();

    const processForm: SubmitHandler<Inputs> = async (data) => {
        try {
            await sendEmail(data);
            toast.success('Email envoyé avec succès!');
            reset();
        } catch (error) {
            toast.error("Erreur lors de l'envoi de l'email.");
            console.error('Something went wrong:', error);
        }
    };

    return (
        <>
            <Toaster richColors />
            <form
                onSubmit={handleSubmit(processForm)}
                noValidate
                className='w-full transform md:translate-y-5 shadow-2xl shadow-jkdBlue grid max-w-screen-lg grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:mb-28 backdrop-blur-md bg-jkdBlue/10 rounded-md backdrop-grayscale backdrop-brightness-150'
            >
                <div className='grid grid-cols-1 gap-1'>
                    <label
                        htmlFor='firstName'
                        className='block text-sm text-white mb-1'
                    >
                        Prénom
                    </label>
                    <input
                        {...register('firstName', {
                            required: 'Le prénom est requis.',
                        })}
                        type='text'
                        id='firstName'
                        placeholder='...'
                        className='mt-0 p-2 w-full border rounded-md text-gray-800 focus:ring-jkdBlue focus:outline-none focus:ring-2 focus:ring-offset-jkdBlue'
                    />
                    <p
                        className={`text-red-500 text-xs h-4 font-bold ${
                            errors.firstName ? 'visible' : 'invisible'
                        }`}
                    >
                        {errors.firstName?.message}
                    </p>
                </div>
                <div className='grid grid-cols-1 gap-1'>
                    <label
                        htmlFor='lastName'
                        className='block text-sm text-white mb-1'
                    >
                        Nom
                    </label>
                    <input
                        {...register('lastName', {
                            required: 'Le nom est requis.',
                        })}
                        type='text'
                        id='lastName'
                        placeholder='...'
                        className='mt-0 p-2 w-full border rounded-md text-gray-800 focus:ring-jkdBlue focus:outline-none focus:ring-2 focus:ring-offset-jkdBlue'
                    />
                    <p
                        className={`text-red-500 text-xs h-4 font-bold ${
                            errors.lastName ? 'visible' : 'invisible'
                        }`}
                    >
                        {errors.lastName?.message}
                    </p>
                </div>
                <div className='grid grid-cols-1 gap-1'>
                    <label
                        htmlFor='email'
                        className='block text-sm text-white mb-1'
                    >
                        Email
                    </label>
                    <input
                        {...register('email', {
                            required: "L'email est requis.",
                            pattern: {
                                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                message: "Format d'email invalide.",
                            },
                        })}
                        type='email'
                        id='email'
                        placeholder='nom@exemple.com'
                        className='mt-0 p-2 w-full border rounded-md text-gray-800 focus:ring-jkdBlue focus:outline-none focus:ring-2 focus:ring-offset-jkdBlue'
                    />
                    <p
                        className={`text-red-500 text-xs h-4 font-bold ${
                            errors.email ? 'visible' : 'invisible'
                        }`}
                    >
                        {errors.email?.message}
                    </p>
                </div>
                <div className='grid grid-cols-1 gap-1'>
                    <label
                        htmlFor='phoneNumber'
                        className='block text-sm text-white mb-1'
                    >
                        Téléphone
                    </label>
                    <input
                        {...register('phoneNumber', {
                            required: 'Le numéro de téléphone est requis.',
                        })}
                        type='tel'
                        id='phoneNumber'
                        placeholder='06 00 00 00 00'
                        className='mt-0 p-2 w-full border rounded-md text-gray-800 focus:ring-jkdBlue focus:outline-none focus:ring-2 focus:ring-offset-jkdBlue'
                    />
                    <p
                        className={`text-red-500 text-xs h-4 font-bold ${
                            errors.phoneNumber ? 'visible' : 'invisible'
                        }`}
                    >
                        {errors.phoneNumber?.message}
                    </p>
                </div>
                <div className='grid grid-cols-1 gap-1 sm:col-span-2'>
                    <label
                        htmlFor='message'
                        className='block text-sm text-white'
                    >
                        Votre message
                    </label>
                    <textarea
                        {...register('message', {
                            required: 'Un message est requis.',
                        })}
                        id='message'
                        placeholder='...'
                        rows={6}
                        className='mt-0 p-2 w-full border rounded-md outline-none focus:ring-jkdBlue focus:outline-none focus:ring-2 focus:ring-offset-jkdBlue border-white/20 placeholder:text-white/30 placeholder:font-light text-white'
                    ></textarea>
                    <p
                        className={`text-red-500 text-xs h-4 font-bold ${
                            errors.message ? 'visible' : 'invisible'
                        }`}
                    >
                        {errors.message?.message}
                    </p>
                </div>
                <div className='flex flex-col md:grid grid-cols-2 gap-1 sm:col-span-2'>
                    <div className='flex items-center'>
                        <Button
                            type='submit'
                            disabled={isSubmitting}
                            className={`relative py-2 px-4 w-full md:w-28 text-sm bg-jkdBlue text-white hover:bg-gray-900 uppercase font-bold rounded flex items-center justify-center ${
                                isSubmitting
                                    ? 'cursor-not-allowed bg-gray-300'
                                    : 'hover:ring-2'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    Envoyer
                                    <div className='h-4 w-4'>
                                        <svg
                                            className='animate-spin h-full w-full text-green-600 ml-2'
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                        >
                                            <circle
                                                className='opacity-25'
                                                cx='12'
                                                cy='12'
                                                r='10'
                                                stroke='currentColor'
                                                stroke-width='4'
                                            ></circle>
                                            <path
                                                className='opacity-75'
                                                fill='currentColor'
                                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                            ></path>
                                        </svg>
                                    </div>
                                </>
                            ) : (
                                'Envoyer'
                            )}
                        </Button>
                    </div>
                    <div className='flex justify-center md:justify-end py-6 md:p-0'>
                        <Image
                            width={50}
                            height={50}
                            src={'/images/logo/logo-jkd31.png'}
                            alt="logo de l'association"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </div>
                </div>
            </form>
        </>
    );
}
