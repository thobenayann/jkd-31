/**
 * Annonce de saison affichée sur l'accueil et sur la page tarifs.
 *
 * Version codée en dur, volontairement. La forme des champs reproduit le futur
 * document Sanity `annonce` pour que le passage au CMS ne soit qu'un changement
 * de source : `lib/announcement.ts` et le composant n'auront pas à bouger.
 *
 * Pour modifier l'annonce aujourd'hui, éditer ce fichier et déployer.
 * Les pages concernées se revalident toutes les heures, la fenêtre d'affichage
 * prend donc effet sans redéploiement une fois les dates passées.
 */
export type Announcement = {
    /** Surtitre court, en petites capitales. */
    eyebrow: string;
    /** L'information principale, une phrase. */
    message: string;
    /** Complément facultatif, une phrase. */
    detail?: string;
    /** Premier jour d'affichage, format `AAAA-MM-JJ`. */
    visibleFrom: string;
    /** Dernier jour d'affichage inclus, format `AAAA-MM-JJ`. */
    visibleUntil: string;
};

export const SEASON_ANNOUNCEMENT: Announcement = {
    eyebrow: 'Rentrée 2026 · 2027',
    // Date confirmée par Yann le 30 août 2026.
    message:
        'Reprise des cours le mardi 8 septembre à 20h au Gymnase Albert Camus, à Muret.',
    detail: 'Venez nous rencontrer au Forum des associations, dimanche 6 septembre de 10h à 17h à la Salle Horizon Pyrénées.',
    visibleFrom: '2026-08-25',
    visibleUntil: '2026-10-04',
};
