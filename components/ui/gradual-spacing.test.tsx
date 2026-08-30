import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import GradualSpacing from './gradual-spacing';

/**
 * Ces tests portent sur le HTML rendu par le serveur, pas sur l'arbre React.
 * C'est exactement ce que voient Googlebot et les robots des moteurs de réponse
 * (GPTBot, ClaudeBot, PerplexityBot), qui n'exécutent pas JavaScript.
 */

const countTag = (html: string, tag: string) =>
    (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) ?? []).length;

describe('GradualSpacing', () => {
    it("n'émet aucun titre par défaut", () => {
        const html = renderToStaticMarkup(
            <GradualSpacing text='Jeet Kune Do' />
        );

        expect(countTag(html, 'h1')).toBe(0);
        expect(countTag(html, 'h2')).toBe(0);
    });

    it('émet exactement un titre quand un niveau est demandé', () => {
        const html = renderToStaticMarkup(
            <GradualSpacing as='h1' text='Les cours' />
        );

        expect(countTag(html, 'h1')).toBe(1);
    });

    it('ne crée jamais un titre par caractère', () => {
        const text = 'Jeet Kune Do, Kali, Silat, Self-défense';
        const html = renderToStaticMarkup(
            <GradualSpacing as='h2' text={text} />
        );

        expect(countTag(html, 'h2')).toBe(1);
        expect(countTag(html, 'h2')).not.toBe(text.length);
    });

    it('expose le texte complet, en un seul morceau, aux lecteurs sans JavaScript', () => {
        const html = renderToStaticMarkup(
            <GradualSpacing as='h1' text='Tarifs et horaires' />
        );

        expect(html).toContain('Tarifs et horaires');
    });

    it('masque les caractères animés aux technologies d’assistance', () => {
        const text = 'Contact';
        const html = renderToStaticMarkup(<GradualSpacing text={text} />);

        // Un caractère masqué par lettre, plus rien de lisible en double
        expect((html.match(/aria-hidden="true"/g) ?? []).length).toBe(
            text.length
        );
    });

    it('conserve les classes de style sur chaque caractère animé', () => {
        const html = renderToStaticMarkup(
            <GradualSpacing text='Ok' className='font-cinzel text-3xl' />
        );

        expect((html.match(/font-cinzel text-3xl/g) ?? []).length).toBe(2);
    });
});
