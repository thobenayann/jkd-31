/**
 * Affichage sûr d'un texte saisi par un visiteur, pour le mail du bureau : un
 * lien inconnu ou un domaine nu devient du texte « désamorcé »
 * (`hxxps://piege[.]online/fr`), que ni la messagerie ni l'œil pressé ne
 * prennent pour un lien. Fonctions pures, sans entrée-sortie.
 *
 * Porté du site Hexoprint (`src/lib/safe-text.mjs`, novembre 2026). Le
 * repérage des liens vient de `contact-screening.ts` : le mail et le tri
 * lisent le texte avec les mêmes règles.
 */

import { type FoundLink, SITE_LINK_HOSTS, findLinks, isAllowedHost, isAllowedLink } from './contact-screening';

export type TextSegment = { kind: 'text'; value: string };
export type LinkSegment = { kind: 'link'; value: string; href: string };
export type SafeSegment = TextSegment | LinkSegment;

export type SafeTextOptions = {
    /**
     * Si faux, rien n'est cliquable : tout lien et tout domaine nu est
     * désamorcé, même vers un hôte autorisé. Faux pour un message suspect.
     */
    allowLinks: boolean;
    /** Hôtes autorisés. Par défaut, les domaines de l'association. */
    allowedHosts?: readonly string[];
};

// `http`, `https`, puis `:` et les `/` ou `\` qui le suivent (`https:/` et
// `https:\\` sont lus comme des liens par les navigateurs). Le `:` est exigé :
// `httpbin.org/get` n'a pas de schéma.
const SCHEME_AND_SEPARATOR = /^(https?)(:[\/\\]*)/i;
const AUTHORITY_END = /[\/?#\\]/;

// Un mot de schéma suivi de `:` et de deux `/` ou `\` (`ftp://`, `file://`,
// `smb://`), ou `http(s)` suivi d'un seul (`https:/`). Le mot ne démarre qu'au
// début d'une suite de caractères de schéma : sans ce regard arrière, chaque
// lettre d'un long mot relancerait la lecture de tout le mot (temps
// quadratique). Un chemin Windows (`C:\Dossier`) n'a qu'un séparateur.
const SCHEME_WORD = /(?<![a-z0-9+-])[a-z0-9+-]+(?=:[\/\\]{2})|http(?:s?)(?=:[\/\\])/gi;
const ENDS_WITH_HTTP = /https?$/i;

/**
 * Le mot de schéma désamorcé : `http` devient `hxxp`, tout autre schéma perd sa
 * dernière lettre au profit d'un `x` (`ftp` devient `ftx`). Stable : on peut
 * désamorcer deux fois sans rien changer de plus.
 */
function defangSchemeWord(word: string): string {
    if (/hxxps?$/i.test(word)) {
        return word;
    }
    const http = ENDS_WITH_HTTP.exec(word);
    if (http) {
        return `${word.slice(0, http.index)}hxxp${http[0].slice('http'.length).toLowerCase()}`;
    }
    return `${word.slice(0, -1)}x`;
}

/**
 * Désamorce tout schéma resté écrit sans hôte derrière lui pour `findLinks` :
 * `https://https://x.online`, mais aussi `ftp://203.0.113.7/plan.zip` ou
 * `file://serveur/dossier`, qu'une messagerie rend cliquables.
 */
function defangStraySchemes(text: string): string {
    return text.replace(SCHEME_WORD, defangSchemeWord);
}

/**
 * Désamorce un lien : `http` devient `hxxp` (le `s` reste), chaque `.` de
 * l'autorité (identifiant, hôte et port) devient `[.]`, le chemin est inchangé.
 * Accepte un lien sans schéma (`piege.online/fr/x`), majuscules comprises.
 */
export function defang(raw: string): string {
    const scheme = SCHEME_AND_SEPARATOR.exec(raw);
    const head = scheme ? `hxxp${scheme[1].slice('http'.length).toLowerCase()}${scheme[2]}` : '';
    const rest = scheme ? raw.slice(scheme[0].length) : raw;

    const authorityEnd = rest.search(AUTHORITY_END);
    const authority = authorityEnd === -1 ? rest : rest.slice(0, authorityEnd);
    const path = authorityEnd === -1 ? '' : rest.slice(authorityEnd);
    return head + authority.replace(/\./g, '[.]') + path;
}

/*
 * Domaines nus : `mot.lettres` sans schéma ni chemin (`truc.online`), que
 * `findLinks` ne renvoie pas mais que Gmail et Outlook rendent cliquables.
 *
 * On lit des « suites » : les plus longues séries de lettres, chiffres, `_`,
 * `-` et `.`. Une suite est un domaine si elle contient un point entre un
 * caractère de domaine et au moins deux lettres (`truc.online`), ce qui
 * écarte `2.5`, `0.4mm`, `1.2.3-beta`, `a.b` et la fin de phrase `ok. Oui`.
 *
 * Une adresse IPv4 (`203.0.113.7`) est désamorcée aussi. Les numéros de
 * téléphone à la française (`05.61.22.33.44`) et les montants ne sont pas
 * des adresses IP et restent tels qu'écrits.
 *
 * Linéaire : une suite est maximale, deux suites ne se recouvrent jamais, et
 * chaque test lit chaque caractère un nombre borné de fois.
 */
const DOMAIN_RUN = /[\p{L}\p{M}\p{N}_.-]+/gu;
const HAS_TLD_LIKE_LABEL = /[\p{L}\p{M}\p{N}_-]\.[\p{L}\p{M}]{2,}/u;
const IPV4 = /(?<![\d.])(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?!\d|\.\d)/g;
const IPV4_MAX_GROUP = 255;

type Span = { start: number; end: number };

/**
 * Les parties d'une suite à désamorcer, en positions dans la suite : toute la
 * suite si elle ressemble à un nom de domaine, sinon chaque adresse IPv4.
 */
function domainParts(run: string): Span[] {
    if (HAS_TLD_LIKE_LABEL.test(run)) {
        return [{ start: 0, end: run.length }];
    }
    const parts: Span[] = [];
    for (const match of run.matchAll(IPV4)) {
        if (match.slice(1, 5).every((group) => Number(group) <= IPV4_MAX_GROUP)) {
            const start = match.index as number;
            parts.push({ start, end: start + match[0].length });
        }
    }
    return parts;
}

function looksLikeDomain(run: string): boolean {
    return domainParts(run).length > 0;
}

const DOT_BETWEEN_LABELS = /(?<=[\p{L}\p{M}\p{N}_-])\.(?=[\p{L}\p{M}\p{N}_-])/gu;
// Même définition que `findLinks` : un `@` ne marque une adresse e-mail que
// s'il suit une lettre ou un chiffre, avec au plus une marque combinante.
const ADDRESS_LOCAL_PART_BEFORE_AT = /[\p{L}\p{N}]\p{M}?@$/u;
const LOOKBEHIND_LENGTH = 8;

type BareDomain = Span & { value: string };

/**
 * Domaines nus d'un texte, dans l'ordre. Les adresses e-mail sont écartées si
 * `skipAddresses` est vrai : dans un texte libre, `jean@exemple.fr` reste
 * lisible. Dans le chemin d'un lien, `x@piege.com` n'est pas une adresse,
 * c'est un moyen de cacher un domaine : on ne l'écarte pas.
 */
function findBareDomains(text: string, skipAddresses: boolean): BareDomain[] {
    const runs = [...text.matchAll(DOMAIN_RUN)];
    const domains: BareDomain[] = [];

    runs.forEach((run, index) => {
        const runStart = run.index as number;
        for (const part of domainParts(run[0])) {
            const start = runStart + part.start;
            const end = runStart + part.end;

            if (skipAddresses) {
                // Domaine d'une adresse : `jean@exemple.fr`.
                const before = text.slice(Math.max(0, start - LOOKBEHIND_LENGTH), start);
                if (ADDRESS_LOCAL_PART_BEFORE_AT.test(before)) {
                    continue;
                }
                // Partie locale d'une adresse : `jean.dupont@exemple.fr`, à
                // condition que ce qui suit le `@` ressemble à un domaine.
                const next = runs[index + 1];
                if (text[end] === '@' && next && next.index === end + 1 && looksLikeDomain(next[0])) {
                    continue;
                }
            }
            domains.push({ start, end, value: text.slice(start, end) });
        }
    });
    return domains;
}

function defangDomain(value: string): string {
    return value.replace(DOT_BETWEEN_LABELS, '[.]');
}

/**
 * Désamorce les domaines nus d'un texte déjà désamorcé en tête : le chemin
 * d'un lien (`/x?u=piege.com`) peut en contenir, et `defang` le laisse intact.
 */
function defangBareDomains(text: string): string {
    let output = '';
    let cursor = 0;
    for (const domain of findBareDomains(text, false)) {
        output += text.slice(cursor, domain.start) + defangDomain(domain.value);
        cursor = domain.end;
    }
    return output + text.slice(cursor);
}

function trimDots(value: string): string {
    let start = 0;
    let end = value.length;
    while (start < end && value[start] === '.') start += 1;
    while (end > start && value[end - 1] === '.') end -= 1;
    return value.slice(start, end);
}

// Les caractères qui, pour une messagerie, peuvent terminer une URL. Un lien
// piégé s'en sert pour cacher un domaine derrière (`/x)piege.com`).
const LINK_BREAKING_CHAR = /[()\[\]{}<>]/;

/**
 * Le segment cliquable d'un lien autorisé, ou `null` s'il ne doit pas l'être.
 * Le lien s'arrête au premier caractère de `LINK_BREAKING_CHAR`, son `href`
 * est recalculé sur ce début, et la suite redevient du texte ordinaire.
 */
function toClickableLink(link: FoundLink, allowedHosts: readonly string[]): LinkSegment | null {
    if (!isAllowedLink(link, allowedHosts)) {
        return null;
    }
    const breakAt = link.raw.search(LINK_BREAKING_CHAR);
    if (breakAt === -1) {
        return { kind: 'link', value: link.raw, href: link.href };
    }

    // `findLinks` retire lui-même la ponctuation finale du début du lien.
    const head = findLinks(link.raw.slice(0, breakAt));
    if (head.length !== 1 || head[0].start !== 0 || !isAllowedLink(head[0], allowedHosts)) {
        return null;
    }
    return { kind: 'link', value: head[0].raw, href: head[0].href };
}

type Replacement = Span & { segment: SafeSegment };

/**
 * Découpe un texte en segments sûrs : du texte, et des liens cliquables. Un
 * lien ne devient un segment `link` que si `allowLinks` est vrai et si
 * `isAllowedLink` l'accepte. Tout autre lien devient du texte désamorcé, de
 * même que tout domaine nu non autorisé, toute adresse IPv4 et tout schéma
 * (`ftp://`) resté dans le texte. Un domaine nu autorisé reste tel qu'écrit,
 * sauf si `allowLinks` est faux.
 *
 * Si tout est autorisé, la concaténation des `value` redonne exactement le
 * texte d'origine.
 */
export function toSafeSegments(text: unknown, options: SafeTextOptions): SafeSegment[] {
    const source = typeof text === 'string' ? text : '';
    if (source === '') {
        return [];
    }
    const allowLinks = options?.allowLinks === true;
    const allowedHosts = options?.allowedHosts ?? SITE_LINK_HOSTS;

    const replacements: Replacement[] = [];
    for (const link of findLinks(source)) {
        const clickable = allowLinks ? toClickableLink(link, allowedHosts) : null;
        if (clickable) {
            // Un lien raccourci laisse son reste dans le texte : il sera relu plus bas.
            replacements.push({ start: link.start, end: link.start + clickable.value.length, segment: clickable });
        } else {
            replacements.push({
                start: link.start,
                end: link.end,
                segment: { kind: 'text', value: defangBareDomains(defangStraySchemes(defang(link.raw))) },
            });
        }
    }
    const linkCount = replacements.length;

    // Hors des liens, aucun schéma ne reste écrit. Les positions ne changent
    // pas : `hxxp` a la longueur de `http`, et `ftx` celle de `ftp`.
    const base = defangStraySchemes(source);

    // Les domaines nus se cherchent dans le texte où chaque lien est remplacé
    // par des espaces (mêmes positions) : une suite collée à un lien s'arrête
    // à lui au lieu de lui être rattachée, et ne lui échappe pas.
    let masked = '';
    let cursor = 0;
    for (const { start, end } of replacements.slice(0, linkCount)) {
        masked += base.slice(cursor, start) + ' '.repeat(end - start);
        cursor = end;
    }
    masked += base.slice(cursor);

    for (const domain of findBareDomains(masked, true)) {
        if (allowLinks && isAllowedHost(trimDots(domain.value), allowedHosts)) {
            continue;
        }
        replacements.push({
            start: domain.start,
            end: domain.end,
            segment: { kind: 'text', value: defangDomain(domain.value) },
        });
    }
    replacements.sort((a, b) => a.start - b.start);

    const segments: SafeSegment[] = [];
    const appendText = (value: string) => {
        if (value === '') {
            return;
        }
        const last = segments[segments.length - 1];
        if (last && last.kind === 'text') {
            last.value += value;
        } else {
            segments.push({ kind: 'text', value });
        }
    };

    cursor = 0;
    for (const { start, end, segment } of replacements) {
        appendText(base.slice(cursor, start));
        if (segment.kind === 'text') {
            appendText(segment.value);
        } else {
            segments.push(segment);
        }
        cursor = end;
    }
    appendText(base.slice(cursor));
    return segments;
}

/**
 * Le texte sûr, d'un seul tenant, prêt à être rendu dans un mail. Les liens
 * autorisés restent écrits tels quels (la messagerie les rendra cliquables),
 * tout le reste est désamorcé.
 */
export function toSafeText(text: unknown, options: SafeTextOptions): string {
    return toSafeSegments(text, options)
        .map((segment) => segment.value)
        .join('');
}
