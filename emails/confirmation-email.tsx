import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Img,
    Link,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

type ConfirmationEmailProps = {
    firstName: string;
    lastName: string;
};

const PRESIDENT_NAME = 'Fanny GABORIT';
const PRESIDENT_EMAIL = 'president@jeetkunedo31.com';
const PRESIDENT_PHONE = '+33 6 84 05 93 26';

export function ConfirmationEmail({
    firstName,
    lastName,
}: ConfirmationEmailProps) {
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
                                Confirmation de réception
                            </Text>
                        </Section>

                        {/* Message de confirmation */}
                        <Section
                            style={{
                                backgroundColor: '#f8f9fa',
                                padding: '40px 30px',
                                borderRadius: '0 0 8px 8px',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: '18px',
                                    color: '#12100C',
                                    marginBottom: '20px',
                                    lineHeight: '1.6',
                                }}
                            >
                                Bonjour {firstName} {lastName},
                            </Text>

                            <Text
                                style={{
                                    fontSize: '16px',
                                    color: '#12100C',
                                    marginBottom: '20px',
                                    lineHeight: '1.6',
                                }}
                            >
                                Nous avons bien reçu votre message via le
                                formulaire de contact de notre site{' '}
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

                            <Section
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: '2px solid #E30613',
                                    borderRadius: '8px',
                                    padding: '25px',
                                    margin: '30px 0',
                                    textAlign: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: '16px',
                                        color: '#E30613',
                                        fontWeight: 'bold',
                                        marginBottom: '15px',
                                    }}
                                >
                                    ✓ Votre demande a été prise en compte
                                </Text>
                                <Text
                                    style={{
                                        fontSize: '14px',
                                        color: '#12100C',
                                        lineHeight: '1.6',
                                        margin: '0',
                                    }}
                                >
                                    Nous vous recontacterons dans les plus brefs
                                    délais pour répondre à votre demande.
                                </Text>
                            </Section>

                            <Text
                                style={{
                                    fontSize: '14px',
                                    color: '#12100C',
                                    marginTop: '30px',
                                    lineHeight: '1.6',
                                }}
                            >
                                En attendant, n'hésitez pas à consulter notre
                                site pour découvrir nos activités, nos cours et
                                nos événements.
                            </Text>

                            {/* Bouton CTA */}
                            <Section
                                style={{
                                    textAlign: 'center',
                                    marginTop: '30px',
                                }}
                            >
                                <Button
                                    href='https://jkd-self-defense-31.fr'
                                    style={{
                                        backgroundColor: '#E30613',
                                        color: '#ffffff',
                                        padding: '12px 30px',
                                        borderRadius: '6px',
                                        textDecoration: 'none',
                                        display: 'inline-block',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                    }}
                                >
                                    Visiter notre site
                                </Button>
                            </Section>
                        </Section>

                        {/* Section contact présidente */}
                        <Section
                            style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '25px',
                                marginTop: '20px',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#12100C',
                                    marginBottom: '15px',
                                }}
                            >
                                Besoin d'informations ?
                            </Text>
                            <Text
                                style={{
                                    fontSize: '14px',
                                    color: '#12100C',
                                    lineHeight: '1.6',
                                    marginBottom: '15px',
                                }}
                            >
                                Pour toute question, vous pouvez contacter
                                directement notre présidente :
                            </Text>
                            <Text
                                style={{
                                    fontSize: '14px',
                                    color: '#12100C',
                                    marginBottom: '8px',
                                }}
                            >
                                <strong style={{ color: '#E30613' }}>
                                    {PRESIDENT_NAME}
                                </strong>
                            </Text>
                            <Text
                                style={{
                                    fontSize: '14px',
                                    color: '#12100C',
                                    marginBottom: '8px',
                                }}
                            >
                                <Link
                                    href={`mailto:${PRESIDENT_EMAIL}`}
                                    style={{
                                        color: '#E30613',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {PRESIDENT_EMAIL}
                                </Link>
                            </Text>
                            <Text
                                style={{
                                    fontSize: '14px',
                                    color: '#12100C',
                                    margin: '0',
                                }}
                            >
                                <Link
                                    href={`tel:${PRESIDENT_PHONE.replace(/\s/g, '')}`}
                                    style={{
                                        color: '#E30613',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {PRESIDENT_PHONE}
                                </Link>
                            </Text>
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
                                Cet email est un accusé de réception automatique.
                            </Text>
                            <Text
                                style={{
                                    fontSize: '12px',
                                    color: '#666666',
                                    margin: '5px 0',
                                }}
                            >
                                Merci de ne pas répondre à cet email.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    );
}
