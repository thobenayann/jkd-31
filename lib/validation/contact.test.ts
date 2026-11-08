import { describe, expect, it } from 'vitest';
import {
    CONTACT_LIMITS,
    HONEYPOT_FIELD,
    parseContactSubmission,
} from './contact';

const valid = {
    firstName: 'Jean-Pierre',
    lastName: "N'Diaye",
    email: 'jp.ndiaye@exemple.fr',
    phoneNumber: '06 12 34 56 78',
    message: 'Bonjour,\nje voudrais faire un cours d’essai.',
};

const fieldErrorsOf = (payload: unknown) => {
    const result = parseContactSubmission(payload);
    if (result.kind !== 'invalid') {
        throw new Error(`attendu "invalid", reçu "${result.kind}"`);
    }
    return result.fieldErrors;
};

describe('parseContactSubmission', () => {
    it('accepte un formulaire complet', () => {
        expect(parseContactSubmission(valid)).toEqual({
            kind: 'valid',
            data: valid,
        });
    });

    it('accepte un honeypot présent mais vide, et ne le renvoie pas', () => {
        const result = parseContactSubmission({
            ...valid,
            [HONEYPOT_FIELD]: '',
        });
        expect(result).toEqual({ kind: 'valid', data: valid });
    });

    describe('adresse email', () => {
        it.each([
            ['une liste séparée par des virgules', 'a@x.fr, b@y.fr'],
            ['une liste séparée par des points-virgules', 'a@x.fr;b@y.fr'],
            ['un nom affiché', 'Jean <jean@x.fr>'],
            ['un retour à la ligne', 'a@x.fr\nBcc: b@y.fr'],
            ['une adresse sans domaine', 'jean@'],
            ['une chaîne sans arobase', 'jean.exemple.fr'],
        ])('refuse %s', (_, email) => {
            expect(fieldErrorsOf({ ...valid, email }).email).toBe(
                "Format d'email invalide."
            );
        });

        it('retire les espaces autour de l’adresse', () => {
            const result = parseContactSubmission({
                ...valid,
                email: '  jp.ndiaye@exemple.fr  ',
            });
            expect(result).toEqual({ kind: 'valid', data: valid });
        });

        it('refuse une adresse trop longue', () => {
            const email = `${'a'.repeat(CONTACT_LIMITS.email)}@x.fr`;
            expect(fieldErrorsOf({ ...valid, email }).email).toBe(
                "Format d'email invalide."
            );
        });
    });

    describe('champs vides', () => {
        it.each([
            ['firstName', 'Le prénom est requis.'],
            ['lastName', 'Le nom est requis.'],
            ['email', "L'email est requis."],
            ['phoneNumber', 'Le numéro de téléphone est requis.'],
            ['message', 'Un message est requis.'],
        ] as const)('refuse %s vide', (field, error) => {
            expect(fieldErrorsOf({ ...valid, [field]: '' })[field]).toBe(error);
        });

        it.each(['firstName', 'lastName', 'message'] as const)(
            'refuse %s composé uniquement d’espaces',
            (field) => {
                expect(
                    fieldErrorsOf({ ...valid, [field]: ' \n\t ' })[field]
                ).toBeDefined();
            }
        );

        it.each(['firstName', 'email', 'message'] as const)(
            'refuse %s absent',
            (field) => {
                const payload: Record<string, string> = { ...valid };
                delete payload[field];
                expect(fieldErrorsOf(payload)[field]).toBeDefined();
            }
        );
    });

    describe('longueurs', () => {
        it('refuse un prénom trop long', () => {
            const firstName = 'a'.repeat(CONTACT_LIMITS.name + 1);
            expect(fieldErrorsOf({ ...valid, firstName }).firstName).toBe(
                `Le prénom ne doit pas dépasser ${CONTACT_LIMITS.name} caractères.`
            );
        });

        it('refuse un message trop long', () => {
            const message = 'a'.repeat(CONTACT_LIMITS.message + 1);
            expect(fieldErrorsOf({ ...valid, message }).message).toBe(
                `Le message ne doit pas dépasser ${CONTACT_LIMITS.message} caractères.`
            );
        });

        it('accepte un message à la limite exacte', () => {
            const message = 'a'.repeat(CONTACT_LIMITS.message);
            expect(parseContactSubmission({ ...valid, message }).kind).toBe(
                'valid'
            );
        });

        it('mesure la longueur après normalisation des espaces', () => {
            const firstName = `Jean${' '.repeat(200)}Pierre`;
            const result = parseContactSubmission({ ...valid, firstName });
            expect(result).toEqual({
                kind: 'valid',
                data: { ...valid, firstName: 'Jean Pierre' },
            });
        });
    });

    describe('prénom et nom', () => {
        it.each(['José', 'Le Gall', 'J.-P.', 'J. P.', 'N’Diaye', 'Zoë', 'Łukasz'])(
            'accepte « %s »',
            (lastName) => {
                expect(
                    parseContactSubmission({ ...valid, lastName }).kind
                ).toBe('valid');
            }
        );

        it.each([
            ['un lien', 'Gagnez sur https://spam.example'],
            ['un domaine', 'spam.example/promo'],
            // Gmail et Outlook transforment « casino.com » en lien cliquable.
            ['un domaine nu', 'casino.com'],
            ['un domaine dans une phrase', 'Allez sur casino.com'],
            ['une adresse', 'a@b.fr'],
            ['des chiffres', 'Jean 2000'],
            ['un caractère de contrôle', 'Jean\u0000'],
            ['seulement de la ponctuation', '--'],
        ])('refuse %s', (_, lastName) => {
            expect(fieldErrorsOf({ ...valid, lastName }).lastName).toBe(
                'Le nom ne doit contenir que des lettres.'
            );
        });
    });

    describe('téléphone', () => {
        it.each(['0612345678', '+33 6 12 34 56 78', '06.12.34.56.78', '+33 (0)6 12 34 56 78'])(
            'accepte %s',
            (phoneNumber) => {
                expect(
                    parseContactSubmission({ ...valid, phoneNumber }).kind
                ).toBe('valid');
            }
        );

        it.each(['abcdef', '12345', '......', '06 12 34 56 78 ext 3'])(
            'refuse %s',
            (phoneNumber) => {
                expect(fieldErrorsOf({ ...valid, phoneNumber }).phoneNumber).toBe(
                    'Numéro de téléphone invalide.'
                );
            }
        );
    });

    describe('normalisation du message', () => {
        it('unifie les fins de ligne et retire les caractères de contrôle', () => {
            const result = parseContactSubmission({
                ...valid,
                message: '  Ligne 1\r\nLigne 2\rLigne 3\u0007\u0000\tfin  ',
            });
            expect(result).toEqual({
                kind: 'valid',
                data: { ...valid, message: 'Ligne 1\nLigne 2\nLigne 3\tfin' },
            });
        });
    });

    describe('honeypot', () => {
        it('signale un honeypot rempli comme spam', () => {
            expect(
                parseContactSubmission({
                    ...valid,
                    [HONEYPOT_FIELD]: 'https://spam.example',
                })
            ).toEqual({ kind: 'spam' });
        });

        it('signale le spam avant toute autre erreur', () => {
            expect(
                parseContactSubmission({
                    email: 'a@x.fr, b@y.fr',
                    [HONEYPOT_FIELD]: 'x',
                })
            ).toEqual({ kind: 'spam' });
        });
    });

    describe('payload inattendu', () => {
        it('refuse un champ supplémentaire', () => {
            const result = parseContactSubmission({ ...valid, cc: 'b@y.fr' });
            expect(result.kind).toBe('invalid');
        });

        it.each([
            ['null', null],
            ['undefined', undefined],
            ['une chaîne', 'a@x.fr'],
            ['un tableau', [valid]],
            ['un nombre', 42],
        ])('refuse %s', (_, payload) => {
            expect(parseContactSubmission(payload).kind).toBe('invalid');
        });

        it.each([
            ['un tableau', ['a@x.fr', 'b@y.fr']],
            ['un objet', { address: 'a@x.fr' }],
            ['un nombre', 42],
        ])('refuse %s à la place de l’email', (_, email) => {
            expect(fieldErrorsOf({ ...valid, email }).email).toBe(
                "L'email est requis."
            );
        });
    });
});
