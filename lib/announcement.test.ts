import type { Announcement } from '@/constant/announcement';
import { describe, expect, it } from 'vitest';
import { isAnnouncementVisible, selectVisibleAnnouncement } from './announcement';

const base: Announcement = {
    eyebrow: 'Rentrée 2026 · 2027',
    message: 'Reprise des cours le mardi 8 septembre.',
    visibleFrom: '2026-08-25',
    visibleUntil: '2026-10-04',
};

const at = (iso: string) => new Date(iso);

describe('isAnnouncementVisible', () => {
    it("masque l'annonce avant le premier jour", () => {
        expect(isAnnouncementVisible(base, at('2026-08-24T23:59:59Z'))).toBe(
            false
        );
    });

    it("affiche l'annonce dès le premier jour", () => {
        expect(isAnnouncementVisible(base, at('2026-08-25T00:00:00Z'))).toBe(
            true
        );
    });

    it('affiche encore le dernier jour, en fin de journée', () => {
        expect(isAnnouncementVisible(base, at('2026-10-04T23:00:00Z'))).toBe(
            true
        );
    });

    it('masque le lendemain du dernier jour', () => {
        expect(isAnnouncementVisible(base, at('2026-10-05T00:00:00Z'))).toBe(
            false
        );
    });

    it('masque une annonce dont les dates sont inversées', () => {
        const inverted = {
            ...base,
            visibleFrom: '2026-10-04',
            visibleUntil: '2026-08-25',
        };
        expect(isAnnouncementVisible(inverted, at('2026-09-01T12:00:00Z'))).toBe(
            false
        );
    });

    it('masque une annonce dont une date est illisible', () => {
        const broken = { ...base, visibleUntil: 'octobre' };
        expect(isAnnouncementVisible(broken, at('2026-09-01T12:00:00Z'))).toBe(
            false
        );
    });
});

describe('selectVisibleAnnouncement', () => {
    it("rend l'annonce pendant la fenêtre", () => {
        expect(selectVisibleAnnouncement(base, at('2026-09-01T12:00:00Z'))).toBe(
            base
        );
    });

    it('rend null en dehors', () => {
        expect(
            selectVisibleAnnouncement(base, at('2026-12-01T12:00:00Z'))
        ).toBeNull();
    });
});
