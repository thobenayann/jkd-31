import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AvatarPersonality from './avatar-personality';

describe('AvatarPersonality', () => {
    it('ne rend rien quand aucune personnalité n’est saisie', () => {
        expect(renderToStaticMarkup(<AvatarPersonality />)).toBe('');
    });

    it('ne rend rien quand les champs arrivent vides depuis Sanity', () => {
        const html = renderToStaticMarkup(
            <AvatarPersonality firstName='' lastName='' title='' />
        );
        expect(html).toBe('');
    });

    it('n’affiche jamais de texte de substitution', () => {
        const html = renderToStaticMarkup(<AvatarPersonality />);
        expect(html).not.toContain('N/A');
        expect(html).not.toContain('Unknown Title');
    });

    it('affiche le nom complet quand il est connu', () => {
        const html = renderToStaticMarkup(
            <AvatarPersonality
                firstName='David'
                lastName='DELANNOY'
                title='Instructeur'
            />
        );
        expect(html).toContain('David DELANNOY');
        expect(html).toContain('Instructeur');
    });

    it('accepte un prénom sans nom, sans espace parasite', () => {
        const html = renderToStaticMarkup(<AvatarPersonality firstName='Dan' />);
        expect(html).toContain('>Dan<');
    });

    it('omet le titre quand il n’est pas renseigné', () => {
        const html = renderToStaticMarkup(
            <AvatarPersonality firstName='Dan' lastName='INOSANTO' />
        );
        expect(html).toContain('Dan INOSANTO');
        expect(html).not.toContain('text-gray-400');
    });
});
