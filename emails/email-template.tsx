import {
    Body,
    Container,
    Head,
    Html,
    Link,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

interface EmailProps {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
}

export function Email({ message, firstName, lastName, email }: EmailProps) {
    const isDevelopment = process.env.VERCEL_ENV !== 'production';
    const baseUrl =
        process.env.VERCEL_ENV === 'development'
            ? 'http://localhost:3000'
            : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

    return (
        <Tailwind
            config={{
                theme: {
                    extend: {
                        colors: {
                            brand: '#007291',
                        },
                    },
                },
            }}
        >
            <Html className='bg-gray-100 dark:bg-gray-800'>
                <Head />
                <Body>
                    <Container className='mx-auto'>
                        {/* <Section className='flex justify-center items-center'>
                            <Img
                                src={`${baseUrl}/logos/movieart.jpg`}
                                width='auto'
                                height='200'
                                alt='Movie art'
                            />
                        </Section>
                        <Hr className='border-[#cccccc]' /> */}
                        {isDevelopment && (
                            <Section>
                                <div className='bg-yellow-100 p-4 rounded-md border-2 border-red-500 mb-4'>
                                    <Text className='text-red-600 font-bold text-center'>
                                        EMAIL DE TEST - ENVIRONNEMENT DE
                                        DÉVELOPPEMENT
                                    </Text>
                                </div>
                            </Section>
                        )}
                        <Section>
                            <Text className='text-lg font-bold text-[#00305B]'>
                                Vous avez reçu un email du formulaire de contact
                                du site{' '}
                                <Link href='https://jkd-self-defense-31.fr'>
                                    jkd-self-defense-31.fr
                                </Link>{' '}
                                :
                            </Text>
                        </Section>
                        <Section>
                            <Text className='text-gray-900 dark:text-white'>
                                <span className='font-bold'>Nom :</span>{' '}
                                {lastName} - {firstName}
                            </Text>
                            <Text className='text-gray-900 dark:text-white'>
                                <span className='font-bold'>Email :</span>{' '}
                                {email}
                            </Text>
                            <Text className='text-gray-900 dark:text-white font-bold'>
                                Message :
                            </Text>
                            <Text className='text-gray-900 dark:text-white'>
                                {message}
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    );
}
