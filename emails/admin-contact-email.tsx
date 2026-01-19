import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

type AdminContactEmailProps = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    message: string;
};

export function AdminContactEmail({
    firstName,
    lastName,
    email,
    phoneNumber,
    message,
}: AdminContactEmailProps) {
    const isDevelopment = process.env.VERCEL_ENV !== 'production';

    return (
        <Tailwind>
            <Html>
                <Head />
                <Body style={{ fontFamily: 'Arial, sans-serif' }}>
                    <Container
                        style={{
                            maxWidth: '600px',
                            margin: '0 auto',
                            padding: '20px',
                            backgroundColor: '#ffffff',
                        }}
                    >
                        {/* Header avec logo */}
                        <Section
                            style={{
                                backgroundColor: '#12100C',
                                padding: '30px 20px',
                                textAlign: 'center',
                                borderRadius: '8px 8px 0 0',
                            }}
                        >
                            <Img
                                src='cid:logo@jkd-self-defense-31.fr'
                                alt='JKD Self Defense 31'
                                width='200'
                                height='auto'
                                style={{
                                    margin: '0 auto',
                                    display: 'block',
                                }}
                            />
                            <Text
                                style={{
                                    color: '#E30613',
                                    fontSize: '14px',
                                    margin: '15px 0 0 0',
                                    fontWeight: '600',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                Nouveau message de contact
                            </Text>
                        </Section>

                        {/* Banner de développement */}
                        {isDevelopment && (
                            <Section
                                style={{
                                    backgroundColor: '#fff3cd',
                                    border: '2px solid #ffc107',
                                    padding: '15px',
                                    margin: '20px 0',
                                    borderRadius: '4px',
                                    textAlign: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#856404',
                                        fontWeight: 'bold',
                                        margin: '0',
                                        fontSize: '14px',
                                    }}
                                >
                                    ⚠️ EMAIL DE TEST - ENVIRONNEMENT DE
                                    DÉVELOPPEMENT
                                </Text>
                            </Section>
                        )}

                        {/* Contenu principal */}
                        <Section
                            style={{
                                backgroundColor: '#f8f9fa',
                                padding: '30px 20px',
                                borderRadius: '0 0 8px 8px',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: '16px',
                                    color: '#12100C',
                                    marginBottom: '20px',
                                    lineHeight: '1.6',
                                }}
                            >
                                Bonjour,
                            </Text>
                            <Text
                                style={{
                                    fontSize: '16px',
                                    color: '#12100C',
                                    marginBottom: '20px',
                                    lineHeight: '1.6',
                                }}
                            >
                                Vous avez reçu un nouveau message via le
                                formulaire de contact du site{' '}
                                <Link
                                    href='https://jkd-self-defense-31.fr'
                                    style={{
                                        color: '#E30613',
                                        textDecoration: 'underline',
                                    }}
                                >
                                    jkd-self-defense-31.fr
                                </Link>
                                .
                            </Text>

                            <Hr
                                style={{
                                    borderColor: '#E30613',
                                    borderWidth: '2px',
                                    margin: '30px 0',
                                }}
                            />

                            {/* Informations du contact */}
                            <Section
                                style={{
                                    backgroundColor: '#ffffff',
                                    padding: '20px',
                                    borderRadius: '4px',
                                    marginBottom: '20px',
                                    border: '1px solid #e0e0e0',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: '#E30613',
                                        marginBottom: '20px',
                                    }}
                                >
                                    Informations du contact
                                </Text>

                                <Text
                                    style={{
                                        fontSize: '14px',
                                        color: '#12100C',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <strong style={{ color: '#E30613' }}>
                                        Nom complet :
                                    </strong>{' '}
                                    {firstName} {lastName}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: '14px',
                                        color: '#12100C',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <strong style={{ color: '#E30613' }}>
                                        Email :
                                    </strong>{' '}
                                    <Link
                                        href={`mailto:${email}`}
                                        style={{
                                            color: '#E30613',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {email}
                                    </Link>
                                </Text>

                                <Text
                                    style={{
                                        fontSize: '14px',
                                        color: '#12100C',
                                        marginBottom: '20px',
                                    }}
                                >
                                    <strong style={{ color: '#E30613' }}>
                                        Téléphone :
                                    </strong>{' '}
                                    {phoneNumber}
                                </Text>

                                <Hr
                                    style={{
                                        borderColor: '#e0e0e0',
                                        margin: '20px 0',
                                    }}
                                />

                                <Text
                                    style={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: '#E30613',
                                        marginBottom: '10px',
                                    }}
                                >
                                    Message :
                                </Text>
                                <Text
                                    style={{
                                        fontSize: '14px',
                                        color: '#12100C',
                                        lineHeight: '1.6',
                                        whiteSpace: 'pre-wrap',
                                        backgroundColor: '#f8f9fa',
                                        padding: '15px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {message}
                                </Text>
                            </Section>
                        </Section>

                        {/* Footer */}
                        <Section
                            style={{
                                textAlign: 'center',
                                marginTop: '30px',
                                paddingTop: '20px',
                                borderTop: '1px solid #e0e0e0',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: '12px',
                                    color: '#666666',
                                    margin: '5px 0',
                                }}
                            >
                                Cet email a été envoyé automatiquement depuis le
                                formulaire de contact du site{' '}
                                <Link
                                    href='https://jkd-self-defense-31.fr'
                                    style={{
                                        color: '#E30613',
                                        textDecoration: 'none',
                                    }}
                                >
                                    jkd-self-defense-31.fr
                                </Link>
                            </Text>
                            <Text
                                style={{
                                    fontSize: '12px',
                                    color: '#666666',
                                    margin: '5px 0',
                                }}
                            >
                                Vous pouvez répondre directement à cet email
                                pour contacter {firstName} {lastName}.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    );
}
