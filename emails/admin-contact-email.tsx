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
import { SITE, SITE_DOMAIN } from '@/constant/site';
import {
    SUSPECT_BANNER_BODY,
    SUSPECT_BANNER_TITLE,
    isCleanScreening,
    reasonLabels,
} from '@/lib/contact-admin-email';
import type { ScreeningResult } from '@/lib/contact-screening';
import { toSafeText } from '@/lib/safe-text';
import { EMAIL_LOGO_CID } from './email-constants';

type AdminContactEmailProps = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    message: string;
    screening: Pick<ScreeningResult, 'verdict' | 'reasons'>;
};

/**
 * Mail envoyé au bureau pour chaque message du formulaire.
 *
 * Tout texte saisi par le visiteur passe par `toSafeText` : un lien hors du
 * site y devient du texte désamorcé (`hxxps://piege[.]online`), qu'aucune
 * messagerie ne rend cliquable. Si le message est suspect, même les liens
 * vers le site sont désamorcés, un bandeau l'annonce en tête, et l'adresse du
 * demandeur n'est plus un lien `mailto:`.
 */
export function AdminContactEmail({
    firstName,
    lastName,
    email,
    phoneNumber,
    message,
    screening,
}: AdminContactEmailProps) {
    const isDevelopment = process.env.VERCEL_ENV !== 'production';
    const clean = isCleanScreening(screening);
    const safe = (value: string) => toSafeText(value, { allowLinks: clean });
    const reasons = reasonLabels(screening?.reasons);

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
                                src={`cid:${EMAIL_LOGO_CID}`}
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

                        {/* Bandeau du message suspect */}
                        {!clean && (
                            <Section
                                style={{
                                    backgroundColor: '#fdecea',
                                    border: '2px solid #E30613',
                                    padding: '20px',
                                    margin: '20px 0',
                                    borderRadius: '4px',
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#E30613',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        margin: '0 0 10px 0',
                                    }}
                                >
                                    ⚠️ {SUSPECT_BANNER_TITLE}
                                </Text>
                                <Text
                                    style={{
                                        color: '#12100C',
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        margin: '0',
                                    }}
                                >
                                    {SUSPECT_BANNER_BODY}
                                </Text>
                                {reasons.length > 0 && (
                                    <Text
                                        style={{
                                            color: '#12100C',
                                            fontSize: '14px',
                                            lineHeight: '1.6',
                                            margin: '10px 0 0 0',
                                        }}
                                    >
                                        <strong>Signalé car :</strong>{' '}
                                        {reasons.join(', ')}.
                                    </Text>
                                )}
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
                                    href={SITE.url}
                                    style={{
                                        color: '#E30613',
                                        textDecoration: 'underline',
                                    }}
                                >
                                    {SITE_DOMAIN}
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
                                    {safe(firstName)} {safe(lastName)}
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
                                    {clean ? (
                                        <Link
                                            href={`mailto:${email}`}
                                            style={{
                                                color: '#E30613',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            {email}
                                        </Link>
                                    ) : (
                                        email
                                    )}
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
                                    {safe(phoneNumber)}
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
                                    {safe(message)}
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
                                    href={SITE.url}
                                    style={{
                                        color: '#E30613',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {SITE_DOMAIN}
                                </Link>
                            </Text>
                            <Text
                                style={{
                                    fontSize: '12px',
                                    color: '#666666',
                                    margin: '5px 0',
                                }}
                            >
                                {clean
                                    ? `Vous pouvez répondre directement à cet email pour contacter ${safe(firstName)} ${safe(lastName)}.`
                                    : "Ce message n'a pas d'adresse de réponse. Pour répondre, copiez l'adresse du demandeur ci-dessus."}
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    );
}
