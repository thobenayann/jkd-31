import type { StaffRoles } from '@/types/specific-types';

export const associationConfig = {
    name: 'JKD Self Defense 31',
    address: '6 Rue Pierre Bauduc, 31600 Muret, France',
    /**
     * Lieu d'entraînement, au format structuré pour schema.org (PostalAddress)
     * et pour pré-remplir le lieu des événements internes dans Sanity.
     * À garder identique à la fiche Google Business Profile.
     */
    venue: {
        name: 'Gymnase Albert Camus',
        streetAddress: '6 Rue Pierre Bauduc',
        postalCode: '31600',
        city: 'Muret',
        country: 'FR',
    },
    /**
     * Identifiant de la fiche Google Business du club (paramètre `cid` de
     * Google Maps). Il pointe la fiche « JKD Self Defense 31 » et non celle du
     * gymnase, que plusieurs associations partagent. Se lit dans l'URL de la
     * fiche : la seconde moitié de `!1s0x…:0x<hex>`, convertie en décimal.
     */
    googleMaps: {
        cid: '16806687830570321192',
    },
    /**
     * Affiliation du club. L'ACDAM regroupe les clubs de Jeet Kune Do et de
     * Kali placés sous la direction technique de David Delannoy (École
     * Delannoy d'Arts Martiaux). Le club figure sur la page des clubs de
     * l'école. Le développé exact du sigle est à confirmer par le bureau avant
     * de l'écrire sur le site : il n'est publié nulle part de façon officielle.
     */
    affiliation: {
        acronym: 'ACDAM',
        school: 'École Delannoy d’Arts Martiaux',
        url: 'https://www.ecole-delannoy.fr/',
        clubsUrl: 'https://www.ecole-delannoy.fr/clubs/',
    },
    phoneNumber: '+33 6 84 05 93 26',
    /**
     * Adresse publique unique de l'association. Elle alimente le JSON-LD
     * `Organization`, la page contact, les mentions légales et les supports
     * imprimés. Elle doit rester identique à celle de l'affiche et de la fiche
     * Google Business.
     */
    email: 'contact@jkd-selfdefense31.fr',
    socialMedia: {
        facebook: 'https://www.facebook.com/jkd.jidao',
        instagram: 'https://www.instagram.com/jeetkunedo_muret/',
    },
    legal: {
        director: 'Fanny GABORIT',
    },
    description:
        'Association sportive dont le but est de promouvoir et enseigner le Jeet Kune Do, art martial créé par Bruce Lee mais également la self defense.',
    staff: [
        {
            name: 'Fanny GABORIT',
            role: ['Présidente'] as StaffRoles[],
        },
        {
            name: 'Isabelle MASSON',
            role: ['Trésorier'] as StaffRoles[],
        },
        {
            name: 'Nicolas MASSON',
            role: ['Responsable technique', 'Instructeur'] as StaffRoles[],
        },
        {
            name: 'William FAUGERE',
            role: ['Responsable communication', 'Instructeur'] as StaffRoles[],
        },
        {
            name: 'Julien BERTOLINO',
            role: ['Secrétaire', 'Instructeur'] as StaffRoles[],
        },
        {
            name: 'Maxime GRANDCLAUDON',
            role: ['Instructeur'] as StaffRoles[],
        },
        {
            name: 'Alain SANGO',
            role: ['Assistant'] as StaffRoles[],
        },
    ],
};
