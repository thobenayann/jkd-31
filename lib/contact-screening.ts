/**
 * Tri des messages du formulaire de contact : repère les liens dans les champs
 * et classe le message `clean` ou `suspect`. Fonctions pures, sans entrée-sortie.
 *
 * Porté du site Hexoprint (`src/lib/contact-screening.mjs`, novembre 2026), où
 * il a passé plusieurs revues de sécurité. La seule différence de fond est la
 * liste des hôtes autorisés, passée en paramètre : par défaut, les domaines de
 * l'association. Les tests d'Hexoprint tournent tels quels avec leur propre
 * liste, ce qui prouve que le portage est fidèle.
 *
 * Le texte lu ici doit être normalisé par le schéma de contact
 * (`lib/validation/contact.ts`) : les caractères invisibles que l'analyseur
 * d'URL retire d'un hôte (U+00AD, U+200B...) n'y sont plus, et les points
 * idéographique et pleine chasse y sont des `.`.
 */

export type ScreeningReason = 'link_not_allowed' | 'link_in_identity_field';

export type ScreeningResult = {
    verdict: 'clean' | 'suspect';
    /** Sans doublon, `link_not_allowed` en premier. */
    reasons: ScreeningReason[];
    /** Hôtes trouvés, sans chemin, sans doublon, triés. */
    linkHosts: string[];
};

export type FoundLink = {
    /** Position du premier caractère du lien dans le texte. */
    start: number;
    /** Position qui suit le dernier caractère (exclue). */
    end: number;
    /** Le lien tel qu'écrit, sans la ponctuation finale ni les `.`, `-`, `_` de tête. */
    raw: string;
    /**
     * URL absolue normalisée. Vide pour un lien qui ne doit jamais être
     * autorisé ni rendu cliquable : URL que l'analyseur rejette, URL avec
     * identifiant (`https://site.fr@piege.online`), hôte `invalid-host`.
     */
    href: string;
    /**
     * Hôte en minuscules et en punycode : un domaine ou une adresse IP, de 253
     * caractères au plus. Pour une URL que l'analyseur rejette, la partie hôte
     * écrite, sans port, si elle respecte cette forme. Sinon `invalid-host`.
     */
    host: string;
};

export type ScreeningInput = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    message: string;
};

export type ScreeningLog = {
    event: 'contact_screening';
    verdict: ScreeningResult['verdict'];
    reasons: ScreeningReason[];
    linkHosts: string[];
};

/**
 * Hôtes vers lesquels un lien reste acceptable dans un message : les deux
 * domaines de l'association, sous-domaines compris (`www.`). Un élève qui
 * demande un horaire n'a aucune raison de coller un autre lien.
 */
export const SITE_LINK_HOSTS: readonly string[] = Object.freeze([
    'jkd-selfdefense31.fr',
    'jkd-selfdefense31.com',
]);

/*
 * Repérage des candidats : une seule expression régulière, en temps linéaire.
 *
 * Quatre formes comptent comme lien :
 * 1. `http://` ou `https://` (aussi `https:/` ou `https:\\`, que les
 *    navigateurs acceptent), puis l'autorité, puis un chemin éventuel.
 * 2. `www.`, puis l'autorité, puis un chemin éventuel.
 * 3. Un domaine nu dont le dernier libellé est un vrai suffixe (lettres, ou
 *    punycode `xn--`), port facultatif, immédiatement suivi de `/`, ou de `?`
 *    ou `#` puis d'un caractère qui n'est ni un blanc ni une ponctuation
 *    finale (`piege.online?ref=x`, mais pas `site.fr? merci`).
 * 4. Une adresse IPv4 nue suivie d'un port, ou de `/`, `?`, `#` comme la
 *    forme 3. Son hôte n'est jamais autorisé, le message est donc suspect.
 *    Seule, sans port ni chemin, elle ne compte pas (comme un domaine nu),
 *    elle est seulement désamorcée à l'affichage (`lib/safe-text.ts`).
 * Les formes 2, 3 et 4 acceptent des `.`, `-`, `_` de tête (`.www.`,
 * `:.piege.online/`), retirés ensuite du lien : sans cela, un seul point
 * devant le domaine suffirait à le cacher.
 *
 * Pourquoi c'est linéaire :
 * - Aucune répétition n'en contient une autre. Les seules répétitions de
 *   groupe portent sur un caractère précédé d'un regard avant de longueur
 *   bornée, et les `?` ne rendent un groupe que facultatif.
 * - Deux quantificateurs voisins ne peuvent jamais lire le même caractère.
 * - Les formes 2, 3 et 4 ne peuvent démarrer qu'au début d'une suite de
 *   caractères de domaine (regard arrière `GLUED_BEFORE`), donc chaque essai
 *   raté ne parcourt que sa propre suite, et ces suites sont disjointes.
 * - Les regards avant et arrière ont une longueur bornée.
 * - Un candidat trouvé est consommé en entier, la recherche reprend après lui.
 */

// Un candidat collé à un mot ou à un domaine (`awww.`, `exemple.fr`) n'est pas
// un lien, ni la partie domaine d'une adresse e-mail (`jean@www.exemple.fr`).
// Un `@` ne marque une adresse que s'il suit une lettre ou un chiffre, avec
// au plus une marque combinante (`josé@`) : `voir @…` reste un lien.
const GLUED_BEFORE = String.raw`(?<![\p{L}\p{M}\p{N}_.-])(?<![\p{L}\p{N}]\p{M}?@)`;
// Le début d'une autre URL : il termine le candidat en cours, pour que
// `https://site.fr/?u=https://piege.online/x` donne deux liens.
const NEXT_URL = String.raw`https?:[\/\\]`;
// Identifiant, hôte et port, lus comme le ferait un logiciel de messagerie
// strict : tout sauf les séparateurs, les blancs, les caractères de contrôle
// et les délimiteurs HTML ou Markdown. La lecture large, qui traverse ces
// délimiteurs, est traitée dans `findLinks`.
const AUTHORITY_CHAR = String.raw`(?:(?!${NEXT_URL})[^\s\p{Cc}<>"\x60\/?#\\])`;
const PATH_CHAR = String.raw`(?:(?!${NEXT_URL})[^\s\p{Cc}<>"\x60])`;
const OPTIONAL_PATH = String.raw`(?:[\/?#\\]${PATH_CHAR}*)?`;
const LABEL_CHAR = String.raw`[\p{L}\p{M}\p{N}_-]`;
const HOST_CHAR = String.raw`[\p{L}\p{M}\p{N}_.-]`;
const PORT = String.raw`:\d{1,5}`;
// Ce qui fait d'un domaine ou d'une adresse IPv4 nus un lien : `/`, ou `?` ou
// `#` suivi d'un caractère d'URL qui n'est pas une ponctuation finale.
const BARE_SEPARATOR = String.raw`(?:\/|[?#](?=[^\s\p{Cc}<>"\x60.,;:!?)\]}']))`;
// Vérifié une seule fois, quand le séparateur qui suit le domaine nu est
// atteint. Écarte les nombres (`2.5/3`), les mesures, les initiales.
const ENDS_WITH_TLD = String.raw`(?<=\.(?:[\p{L}\p{M}]{2,}|xn--[\p{L}\p{N}-]+)(?:${PORT})?[\/?#])`;
const IPV4_HOST = String.raw`\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}`;

// Une autorité stricte non vide, ou vide si un délimiteur suit aussitôt
// (`https://"@piege.online/x`) : la lecture large de `findLinks` prend alors
// le relais. Le regard avant ne lit qu'un caractère.
const STRICT_AUTHORITY = String.raw`(?:${AUTHORITY_CHAR}+|(?=["<>\x60]))`;

const LINK_CANDIDATE = new RegExp(
    [
        String.raw`https?:[\/\\]+${STRICT_AUTHORITY}${OPTIONAL_PATH}`,
        String.raw`${GLUED_BEFORE}[._-]*www\.${STRICT_AUTHORITY}${OPTIONAL_PATH}`,
        String.raw`${GLUED_BEFORE}\.*${LABEL_CHAR}+\.${HOST_CHAR}*(?:${PORT})?${BARE_SEPARATOR}${ENDS_WITH_TLD}${PATH_CHAR}*`,
        String.raw`${GLUED_BEFORE}[._-]*${IPV4_HOST}(?:${PORT}(?:${BARE_SEPARATOR}${PATH_CHAR}*)?|${BARE_SEPARATOR}${PATH_CHAR}*)`,
    ].join('|'),
    'giu'
);

// Lecture large de l'autorité, à partir d'un délimiteur : jusqu'au premier
// blanc, caractère de contrôle ou `/?#\`, comme l'analyseur d'URL WHATWG.
const WIDE_AUTHORITY = new RegExp(String.raw`[^\s\p{Cc}\/?#\\]*`, 'uy');
const PATH_AFTER_AUTHORITY = new RegExp(OPTIONAL_PATH, 'iuy');
const STRICT_AUTHORITY_DELIMITERS = new Set(['"', '<', '>', '`']);

const SCHEME_PREFIX = /^https?:[\/\\]+/i;
const AUTHORITY_END = /[\/?#\\]/;
const LEADING_JUNK = /^[._-]*/;
const TRAILING_PUNCTUATION = new Set(['.', ',', ';', ':', '!', '?', ')', ']', '}', "'", '"']);
const WWW_PREFIX_LENGTH = 'www.'.length;

/** Valeur de `host` quand l'hôte écrit ne peut pas figurer dans la trace. */
export const INVALID_HOST = 'invalid-host';
const MAX_HOST_LENGTH = 253;
// Hôte « simple » : domaine ASCII ou IPv4, ou IPv6 entre crochets, puis port
// facultatif. Rien d'autre n'entre dans `linkHosts` ni dans la trace serveur.
const PLAIN_HOST = /^(\[[0-9a-f:.]+\]|[a-z0-9.-]+)(?::\d*)?$/;

function trimTrailingPunctuation(candidate: string): string {
    let end = candidate.length;
    while (end > 0 && TRAILING_PUNCTUATION.has(candidate[end - 1])) {
        end -= 1;
    }
    return candidate.slice(0, end);
}

/** Autorité d'une URL absolue : entre le schéma et le premier `/?#\`. */
function authorityOf(absoluteUrl: string): string {
    const rest = absoluteUrl.replace(SCHEME_PREFIX, '');
    const authorityEnd = rest.search(AUTHORITY_END);
    return authorityEnd === -1 ? rest : rest.slice(0, authorityEnd);
}

/**
 * Hôte tel qu'il peut figurer dans `linkHosts` et dans la trace serveur : en
 * minuscules, sans port, borné à 253 caractères et réduit à un domaine ou une
 * adresse IP. Tout le reste devient `invalid-host`, pour qu'aucun texte saisi
 * par le visiteur n'atteigne la trace.
 */
function toReportedHost(hostAndPort: string): string {
    const match = PLAIN_HOST.exec(hostAndPort.toLowerCase());
    return match && match[1].length <= MAX_HOST_LENGTH ? match[1] : INVALID_HOST;
}

/**
 * Transforme un candidat en lien. L'hôte vient toujours de l'analyseur d'URL
 * WHATWG (`new URL`), jamais du texte brut : il règle la casse, convertit les
 * noms internationaux en punycode (un « е » cyrillique donne `xn--…`) et
 * retire l'identifiant de `https://site.fr@piege.online`.
 */
function toLink(raw: string, start: number): FoundLink | null {
    const hasScheme = SCHEME_PREFIX.test(raw);
    // `www.` suivi de ponctuation seulement (`www.,`) : rien vers quoi pointer.
    if (!hasScheme && raw.length <= WWW_PREFIX_LENGTH) {
        return null;
    }

    const absoluteUrl = hasScheme ? raw : `https://${raw}`;
    const end = start + raw.length;

    // `URL.canParse` évite une exception par URL invalide : un texte piégé peut
    // en contenir des milliers, et une exception coûte cher.
    if (!URL.canParse(absoluteUrl)) {
        // Un lien que l'analyseur refuse reste un lien : un logiciel de
        // messagerie peut en rendre cliquable une partie. Il n'est jamais autorisé.
        const authority = authorityOf(absoluteUrl);
        if (authority === '') {
            return null;
        }
        const hostAndPort = authority.slice(authority.lastIndexOf('@') + 1) || authority;
        return { start, end, raw, href: '', host: toReportedHost(hostAndPort) };
    }

    const url = new URL(absoluteUrl);
    const host = toReportedHost(url.hostname);
    // Un identifiant dans l'URL n'a aucun usage légitime ici, et deux logiciels
    // peuvent y lire deux hôtes différents (`https://piege.online"@site.fr`).
    const neverAllowed = url.username !== '' || url.password !== '' || host === INVALID_HOST;
    return { start, end, raw, href: neverAllowed ? '' : url.href, host };
}

/**
 * Lecture large de l'autorité qui commence à `from` : sa fin, et le dernier
 * `@` qu'elle contient (ou -1). Le dernier résultat est gardé : des candidats
 * successifs dans la même autorité ne la relisent pas, ce qui garde
 * `findLinks` linéaire.
 */
function createWideAuthorityReader(text: string) {
    let cachedEnd = -1;
    let cachedLastAt = -1;
    return (from: number) => {
        if (from >= cachedEnd) {
            WIDE_AUTHORITY.lastIndex = from;
            WIDE_AUTHORITY.exec(text);
            cachedEnd = WIDE_AUTHORITY.lastIndex;
            const at = text.slice(from, cachedEnd).lastIndexOf('@');
            cachedLastAt = at === -1 ? -1 : from + at;
        }
        return { end: cachedEnd, lastAt: cachedLastAt >= from ? cachedLastAt : -1 };
    };
}

/**
 * Liens présents dans un texte, dans l'ordre. Comptent comme liens une URL
 * `http(s)://`, une adresse commençant par `www.`, un domaine nu suivi d'un
 * chemin, d'une requête ou d'un fragment (`piege.online/fr`), une adresse
 * IPv4 nue suivie d'un port ou d'un chemin. Ne comptent pas : un domaine nu
 * ou une adresse IPv4 seuls, une adresse e-mail, un nombre décimal. La
 * ponctuation finale `.,;:!?)]}'"` est retirée du lien.
 *
 * Une autorité qui s'arrête sur `"`, `<`, `>` ou un accent grave est lue de
 * deux façons. Un logiciel strict coupe le lien au délimiteur. Un logiciel
 * large, comme l'analyseur WHATWG, le prolonge jusqu'au `/` : si un `@` suit,
 * l'hôte réel est après lui (`https://site.fr"@piege.online/x`). Dans ce cas
 * le lien couvre toute la lecture large, et son identifiant le rend non
 * autorisé.
 */
export function findLinks(text: unknown): FoundLink[] {
    if (typeof text !== 'string' || text === '') {
        return [];
    }

    const candidates = new RegExp(LINK_CANDIDATE.source, LINK_CANDIDATE.flags);
    const readWideAuthority = createWideAuthorityReader(text);
    const links: FoundLink[] = [];

    let match: RegExpExecArray | null;
    while ((match = candidates.exec(text)) !== null) {
        let end = candidates.lastIndex;
        const isAuthorityOnly = !AUTHORITY_END.test(match[0].replace(SCHEME_PREFIX, ''));
        if (isAuthorityOnly && STRICT_AUTHORITY_DELIMITERS.has(text[end])) {
            const wide = readWideAuthority(end);
            if (wide.lastAt !== -1) {
                PATH_AFTER_AUTHORITY.lastIndex = wide.end;
                PATH_AFTER_AUTHORITY.exec(text);
                end = PATH_AFTER_AUTHORITY.lastIndex;
                candidates.lastIndex = end;
            }
        }

        const candidate = text.slice(match.index, end);
        const leading = (LEADING_JUNK.exec(candidate) as RegExpExecArray)[0].length;
        const link = toLink(trimTrailingPunctuation(candidate.slice(leading)), match.index + leading);
        if (link) {
            links.push(link);
        }
    }
    return links;
}

/** Hôte normalisé par l'analyseur d'URL, ou `null`. Accepte un hôte nu ou une URL. */
function toHostname(value: unknown): string | null {
    if (typeof value !== 'string' || value.trim() === '') {
        return null;
    }
    const trimmed = value.trim();
    try {
        const { hostname } = new URL(SCHEME_PREFIX.test(trimmed) ? trimmed : `https://${trimmed}`);
        return hostname === '' ? null : hostname;
    } catch {
        return null;
    }
}

/**
 * Un hôte est autorisé s'il est égal à un hôte de la liste ou s'il en est un
 * sous-domaine (suffixe `.<domaine>`). `jkd-selfdefense31.fr.piege.online` et
 * `fauxjkd-selfdefense31.fr` ne le sont pas.
 */
export function isAllowedHost(
    host: string,
    allowedHosts: readonly string[] = SITE_LINK_HOSTS
): boolean {
    const candidate = toHostname(host);
    if (candidate === null) {
        return false;
    }
    return allowedHosts
        .map(toHostname)
        .some(
            (allowed) =>
                allowed !== null &&
                (candidate === allowed || candidate.endsWith(`.${allowed}`))
        );
}

/**
 * Un lien trouvé par `findLinks` est autorisé si son hôte l'est et s'il a une
 * URL utilisable (`href` non vide). À utiliser plutôt que `isAllowedHost`
 * seul, avant de laisser un lien lisible tel quel.
 */
export function isAllowedLink(
    link: Pick<FoundLink, 'href' | 'host'>,
    allowedHosts: readonly string[] = SITE_LINK_HOSTS
): boolean {
    return link.href !== '' && isAllowedHost(link.host, allowedHosts);
}

const IDENTITY_FIELDS = ['firstName', 'lastName', 'phoneNumber'] as const;

/**
 * Classe un message validé. Il est `suspect` si un lien pointe hors de la
 * liste (`link_not_allowed`), ou si un lien, même autorisé, figure dans le
 * prénom, le nom ou le téléphone (`link_in_identity_field`). Le schéma refuse
 * déjà les liens dans ces champs : ce contrôle est une seconde barrière.
 */
export function screenContactSubmission(
    data: ScreeningInput,
    allowedHosts: readonly string[] = SITE_LINK_HOSTS
): ScreeningResult {
    const hosts = new Set<string>();
    let linkNotAllowed = false;
    let linkInIdentityField = false;

    const inspect = (value: unknown, isIdentityField: boolean) => {
        for (const link of findLinks(value)) {
            hosts.add(link.host);
            linkInIdentityField ||= isIdentityField;
            linkNotAllowed ||= !isAllowedLink(link, allowedHosts);
        }
    };

    for (const field of IDENTITY_FIELDS) {
        inspect(data[field], true);
    }
    inspect(data.message, false);

    const reasons: ScreeningReason[] = [];
    if (linkNotAllowed) reasons.push('link_not_allowed');
    if (linkInIdentityField) reasons.push('link_in_identity_field');

    return {
        verdict: reasons.length > 0 ? 'suspect' : 'clean',
        reasons,
        linkHosts: [...hosts].sort(),
    };
}

/**
 * Ligne de trace serveur d'un tri. Elle ne contient aucune donnée saisie par
 * le visiteur : ni nom, ni adresse, ni téléphone, ni message.
 */
export function toScreeningLog(result: ScreeningResult): ScreeningLog {
    return {
        event: 'contact_screening',
        verdict: result.verdict,
        reasons: [...result.reasons],
        linkHosts: [...result.linkHosts],
    };
}
