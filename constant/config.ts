import { StaffRoles } from '@/types/specific-types';

export const associationConfig = {
    name: 'Ji DAO',
    address: '6 Rue Pierre Bauduc, 31600 Muret, France',
    phoneNumber: '+33 6 84 05 93 26',
    email: 'president@jeetkunedo31.com',
    socialMedia: {
        facebook: 'https://www.facebook.com/jkd.jidao',
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
            name: 'Julien BERTOLINO',
            role: ['Secrétaire', 'Instructeur'] as StaffRoles[],
        },
        {
            name: 'William FAUGERE',
            role: ['Responsable communication', 'Instructeur'] as StaffRoles[],
        },
        {
            name: 'Nicolas MASSON',
            role: ['Responsable technique', 'Instructeur'] as StaffRoles[],
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
