import type { Announcement } from '@/constant/announcement';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const dayStart = (isoDay: string): number | null => {
    const time = new Date(`${isoDay}T00:00:00Z`).getTime();
    return Number.isNaN(time) ? null : time;
};

/**
 * Une annonce est visible entre le premier jour et le dernier jour, ce dernier
 * inclus. `visibleUntil: '2026-10-04'` affiche donc l'annonce pendant toute la
 * journée du 4 octobre, et elle disparaît le 5 au matin.
 *
 * Une date illisible masque l'annonce plutôt que de l'afficher indéfiniment :
 * une coquille de saisie ne doit pas laisser une information périmée en ligne.
 */
export const isAnnouncementVisible = (
    announcement: Announcement,
    now: Date = new Date()
): boolean => {
    const from = dayStart(announcement.visibleFrom);
    const until = dayStart(announcement.visibleUntil);
    if (from === null || until === null) return false;
    if (until < from) return false;

    const time = now.getTime();
    return time >= from && time < until + DAY_IN_MS;
};

/** L'annonce si elle doit être affichée, sinon `null`. */
export const selectVisibleAnnouncement = (
    announcement: Announcement,
    now: Date = new Date()
): Announcement | null =>
    isAnnouncementVisible(announcement, now) ? announcement : null;
