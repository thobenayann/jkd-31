import {
    Body,
    Container,
    Head,
    Html,
    Link,
    Section,
    Tailwind,
} from '@react-email/components';

interface EmailProps {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
}

export default function Email({
    message,
    firstName,
    lastName,
    email,
}: EmailProps) {
    const baseUrl =
        process.env.VERCEL_ENV === 'development'
            ? 'http://localhost:3000'
            : `https://${process.env.VERCEL_URL}`;

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
                        <Section>
                            <h1 className='text-lg font-bold text-[#00305B]'>
                                Vous avez reçu un email du formulaire de contact
                                du site{' '}
                                <Link href='https://movie-art.fr'>
                                    movie-art.fr
                                </Link>{' '}
                                :
                            </h1>
                        </Section>
                        <Section>
                            <p className='text-gray-900 dark:text-white'>
                                <span className='font-bold'>Nom :</span>{' '}
                                {lastName} - {firstName}
                            </p>
                            <p className='text-gray-900 dark:text-white'>
                                <span className='font-bold'>Email :</span>{' '}
                                {email}
                            </p>
                            <p className='text-gray-900 dark:text-white font-bold'>
                                Message :
                            </p>
                            <p className='text-gray-900 dark:text-white'>
                                {message}
                            </p>
                        </Section>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    );
}
