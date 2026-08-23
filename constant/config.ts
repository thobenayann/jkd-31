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
        name: 'Salle Albert Camus',
        streetAddress: '6 Rue Pierre Bauduc',
        postalCode: '31600',
        city: 'Muret',
        country: 'FR',
    },
    phoneNumber: '+33 6 84 05 93 26',
    email: 'president@jeetkunedo31.com',
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
