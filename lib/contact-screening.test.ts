import { describe, expect, it } from 'vitest';
import {
    type ScreeningInput,
    findLinks,
    isAllowedHost,
    screenContactSubmission,
    toScreeningLog,
} from './contact-screening';

/*
 * Deux jeux de tests.
 *
 * 1. Ceux d'Hexoprint, repris tels quels avec la liste d'hôtes d'Hexoprint :
 *    ils prouvent que le portage n'a rien changé au repérage des liens. Seuls
 *    les noms de champs suivent le formulaire JKD (`description` devient
 *    `message`, `phone` devient `phoneNumber`). Les cas sur la société et les
 *    fichiers joints, absents du formulaire JKD, sont retirés.
 * 2. Ceux de JKD, avec la liste par défaut (les domaines de l'association).
 *
 * Les seuils de temps vérifient l'absence de retour arrière catastrophique,
 * qui se compterait en secondes : ils sont larges pour ne pas dépendre de la
 * charge de la machine.
 */

const HEXOPRINT_HOSTS = [
    'hexoprint.fr',
    'wetransfer.com',
    'we.tl',
    'swisstransfer.com',
    'transfernow.net',
    'fromsmash.com',
    'drive.google.com',
    'dropbox.com',
    'onedrive.live.com',
    '1drv.ms',
    'icloud.com',
    'printables.com',
    'thingiverse.com',
    'cults3d.com',
    'myminifactory.com',
    'makerworld.com',
    'grabcad.com',
];

const MAX_MS = 250;

const timed = (run: () => void) => {
    const start = performance.now();
    run();
    return performance.now() - start;
};

const base: ScreeningInput = {
    firstName: 'Camille',
    lastName: 'Martin',
    phoneNumber: '0600000000',
    message: 'Bonjour',
};

describe('tri des liens, tests repris d’Hexoprint', () => {
    const CAMPAIGN =
        "Une pièce de remplacement imprimée en 3D évite d'attendre un fournisseur d'origine. Quel devis et quel délai pour un prototype en impression 3D, livré en France ? Projet exposé ici : ";
    const screen = (patch: Partial<ScreeningInput>) =>
        screenContactSubmission({ ...base, ...patch }, HEXOPRINT_HOSTS);
    const isAllowed = (host: string, extra: string[] = []) =>
        isAllowedHost(host, [...HEXOPRINT_HOSTS, ...extra]);

    it('classe suspects les messages de la campagne', () => {
        expect(screen({ message: CAMPAIGN + 'https://partagepro.online/fr/b2b/hexoprint' })).toEqual({
            verdict: 'suspect',
            reasons: ['link_not_allowed'],
            linkHosts: ['partagepro.online'],
        });
        expect(screen({ message: CAMPAIGN + 'sharez.online/fr/b2b/hexoprint' }).verdict).toBe('suspect');
    });

    it('laisse propres les demandes légitimes', () => {
        for (const message of [
            "Je voudrais faire imprimer une figurine de jeu de rôle de quelques cm, avec une base de 2.5 cm et des ailes détaillées.",
            'Bonjour, je souhaiterais faire imprimer ce support moteur, le fichier STL est joint.',
            "Mon fils cherche un stage d'observation en février, il s'intéresse à la 3D. Merci de votre retour.",
            'je vous envoie le plan.zip et le support.stl',
            'il me faut une pièce.de rechange',
            'écrivez-moi à jean@exemple.fr',
            'mon modèle : https://we.tl/t-abc123',
            'voir https://www.printables.com/model/123',
        ]) {
            expect(screen({ message }).verdict, message).toBe('clean');
        }
    });

    it('classe suspects les sosies et les liens dans l’identité', () => {
        expect(screen({ message: 'https://wetransfer.com.evil.online/x' }).verdict).toBe('suspect');
        expect(screen({ firstName: 'https://we.tl/x' }).reasons).toEqual(['link_in_identity_field']);
        expect(screen({ phoneNumber: 'www.exemple.online' }).verdict).toBe('suspect');
    });

    it('respecte les hôtes ajoutés à la liste', () => {
        // Écart volontaire avec Hexoprint, dont le test portait sur `/a.stl` :
        // depuis la revue du 13 novembre, un texte en forme de domaine dans le
        // chemin d'un lien autorisé rend le message suspect (voir plus bas).
        const result = screenContactSubmission(
            { ...base, message: 'https://store.public.blob.vercel-storage.com/a-stl' },
            [...HEXOPRINT_HOSTS, 'store.public.blob.vercel-storage.com']
        );
        expect(result.verdict).toBe('clean');
    });

    it('revue : casse, homoglyphe, identifiant, ponctuation, markdown', () => {
        expect(screen({ message: 'HTTPS://WE.TL/t-abc' }).verdict).toBe('clean');
        expect(screen({ message: 'https://wеtransfer.com/x' }).verdict).toBe('suspect');
        expect(screen({ message: 'https://we.tl@partagepro.online/x' }).linkHosts).toEqual(['partagepro.online']);
        expect(findLinks('(voir https://we.tl/t-abc).')[0].href).toBe('https://we.tl/t-abc');
        expect(screen({ message: '[dossier](https://partagepro.online/x)' }).verdict).toBe('suspect');
    });

    it('revue : une entrée pathologique reste rapide', () => {
        for (const message of ['a.'.repeat(2500), 'www.'.repeat(1250), 'a/'.repeat(2500)]) {
            expect(timed(() => screen({ message })), message.slice(0, 8)).toBeLessThan(MAX_MS);
        }
    });

    it('la ligne de trace ne porte aucune donnée personnelle', () => {
        const log = toScreeningLog(screen({ message: CAMPAIGN + 'https://partagepro.online/fr' }));
        expect(Object.keys(log).sort()).toEqual(['event', 'linkHosts', 'reasons', 'verdict']);
    });

    it('findLinks rend positions exactes, texte brut, href et hôte normalisés', () => {
        const text = 'Voir [ici](https://we.tl/t-abc), puis sharez.online/fr. Et www.Exemple.online !';
        expect(
            findLinks(text).map(({ start, end, raw, href, host }) => ({
                slice: text.slice(start, end),
                raw,
                href,
                host,
            }))
        ).toEqual([
            { slice: 'https://we.tl/t-abc', raw: 'https://we.tl/t-abc', href: 'https://we.tl/t-abc', host: 'we.tl' },
            { slice: 'sharez.online/fr', raw: 'sharez.online/fr', href: 'https://sharez.online/fr', host: 'sharez.online' },
            { slice: 'www.Exemple.online', raw: 'www.Exemple.online', href: 'https://www.exemple.online/', host: 'www.exemple.online' },
        ]);
    });

    it('les mesures, initiales et adresses e-mail ne sont pas des liens', () => {
        for (const message of [
            'buse de 0.4mm/0.6mm, rapport 2.5/3, cf./ci-dessous, S.A.R.L/SAS',
            'écrivez à jean.dupont@exemple.fr/contact ou contact@www.exemple.fr',
            'voir www., ou https:// tout seul',
        ]) {
            expect(findLinks(message), message).toEqual([]);
        }
    });

    it('un lien caché derrière un lien autorisé ou un hôte invalide est repéré', () => {
        expect(screen({ message: 'https://we.tl/x?u=https://partagepro.online/fr' }).linkHosts).toEqual([
            'partagepro.online',
            'we.tl',
        ]);
        for (const message of [
            'https://we.tl/x?u=https://partagepro.online/fr',
            'https://partagepro.online:99999/fr',
            'https://partagepro.online@',
            'https:/partagepro.online/fr',
            'sharez.online:8443/fr',
        ]) {
            expect(screen({ message }).verdict, message).toBe('suspect');
        }
    });

    it('un point, un tiret ou un souligné de tête ne cache pas un lien', () => {
        for (const message of [
            'ici :.partagepro.online/fr',
            'ici :...partagepro.online/fr',
            '-www.partagepro.online',
            '.www.partagepro.online',
            '..www.partagepro.online/x',
            '_www.partagepro.online',
            'https://we.tl\n.partagepro.online/x',
        ]) {
            expect(screen({ message }).verdict, JSON.stringify(message)).toBe('suspect');
        }
        const [link] = findLinks('ici :..www.partagepro.online/x');
        expect({ start: link.start, raw: link.raw, host: link.host }).toEqual({
            start: 7,
            raw: 'www.partagepro.online/x',
            host: 'www.partagepro.online',
        });
    });

    it('un guillemet, un accent grave ou un chevron avant « @ » ne cache pas le vrai hôte', () => {
        for (const message of [
            'https://we.tl"@partagepro.online/x',
            'https://we.tl`@partagepro.online/x',
            'https://we.tl<@partagepro.online/x',
            'https://we.tl>@partagepro.online/x',
            'www.we.tl"@partagepro.online/x',
            'https://"@partagepro.online/x',
            'https://`@partagepro.online/x',
            'https://<@partagepro.online/x',
            'https://>@partagepro.online/x',
            'https://"x"@partagepro.online/x',
            'www."@partagepro.online/x',
        ]) {
            expect(screen({ message }), message).toEqual({
                verdict: 'suspect',
                reasons: ['link_not_allowed'],
                linkHosts: ['partagepro.online'],
            });
        }
        expect(findLinks('https://"x et www."x')).toEqual([]);
        // L'inverse : un logiciel qui coupe au délimiteur ouvrirait partagepro.online.
        for (const message of [
            'https://partagepro.online"@we.tl/x',
            'https://partagepro.online)@we.tl/x',
            'https://partagepro.online@we.tl/x',
            'https://we.tl"www.partagepro.online/x',
        ]) {
            expect(screen({ message }).verdict, message).toBe('suspect');
        }
        const [quoted] = findLinks('"https://we.tl", ok');
        expect([quoted.raw, quoted.href]).toEqual(['https://we.tl', 'https://we.tl/']);
        for (const message of [
            '"https://we.tl", ok',
            '<a href="https://we.tl/x">lien</a>',
            '<p>https://we.tl</p>',
            '`https://we.tl`',
        ]) {
            expect(screen({ message }).verdict, message).toBe('clean');
        }
    });

    it('un lien illisible rapporte un hôte borné ou une sentinelle, jamais son texte', () => {
        for (const [text, host] of [
            ['https://we.tl:99999/x', 'we.tl'],
            ['https://partagepro.online:99999/x', 'partagepro.online'],
            ['https://we.tl:9x9,www.evil.online/x', 'invalid-host'],
            ['https://Jean.Dupont^Rue-des-Lilas/x', 'invalid-host'],
            [`https://${'a'.repeat(300)}.online:99999/x`, 'invalid-host'],
            [`www.${'w'.repeat(300)}.online`, 'invalid-host'],
        ]) {
            const [link] = findLinks(text);
            expect([link.host, link.href], text).toEqual([host, '']);
            expect(screen({ message: text }).verdict, text).toBe('suspect');
        }
    });

    it('un « @ » isolé ne fait pas d’un domaine une adresse e-mail', () => {
        for (const message of [
            'voir @partagepro.online/fr',
            '@www.partagepro.online',
            '(@partagepro.online/fr)',
            "voir l'@partagepro.online/fr",
            'voir ~@www.partagepro.online',
            'voir _@www.partagepro.online',
            'voir ́@partagepro.online/fr',
            'x@www.`@partagepro.online/x',
        ]) {
            expect(screen({ message }).verdict, JSON.stringify(message)).toBe('suspect');
        }
        for (const message of [
            'écrivez-moi à jean@exemple.fr',
            'contact: jean.dupont@exemple.fr',
            'jean@exemple.fr',
            'contact@www.exemple.fr',
            'a.b-c_d+e@sous.domaine.fr',
            "o'brien@exemple.fr/x",
            'élodie@exemple.fr/x',
            'josé@exemple.fr/x',
            '1234@exemple.fr/x',
        ]) {
            expect(screen({ message }).verdict, JSON.stringify(message)).toBe('clean');
        }
        const [link] = findLinks("voir l'@partagepro.online/fr");
        expect([link.start, link.raw]).toEqual([8, 'partagepro.online/fr']);
    });

    it('des entrées pathologiques de 50 000 caractères restent rapides', () => {
        for (const unit of ['a.', 'www.', 'a/', '-.', '.', '_', 'a.b/', ':www.a', 'www.a"', 'https://a"', 'https://a^', 'https://"', 'www."', ' @www.a', '@a.aa/', 'a@a.aa/', ' ́@a.aa/', 'á@a.aa/', '~@www.a']) {
            const message = unit.repeat(Math.ceil(50000 / unit.length)).slice(0, 50000);
            expect(timed(() => screen({ message })), unit).toBeLessThan(MAX_MS);
        }
    });

    it('un domaine nu ou une IPv4 suivis d’une requête, d’un fragment, d’un port ou d’un chemin sont suspects', () => {
        for (const [message, host] of [
            ['partagepro.online?ref=hexoprint', 'partagepro.online'],
            ['partagepro.online#x', 'partagepro.online'],
            ['partagepro.online:8080/x', 'partagepro.online'],
            ['partagepro.online:8080?x', 'partagepro.online'],
            ['partagepro.online:8080#x', 'partagepro.online'],
            ['voir partagepro.online?https://we.tl/x', 'partagepro.online'],
            ['203.0.113.7/x', '203.0.113.7'],
            ['203.0.113.7:80', '203.0.113.7'],
            ['203.0.113.7:80/x', '203.0.113.7'],
            ['203.0.113.7?x', '203.0.113.7'],
            ['203.0.113.7#x', '203.0.113.7'],
            ['ici :.203.0.113.7/x', '203.0.113.7'],
            ['(203.0.113.7:8443)', '203.0.113.7'],
        ]) {
            const result = screen({ message });
            expect(result.verdict, message).toBe('suspect');
            expect(result.linkHosts, message).toContain(host);
        }
        const [link] = findLinks('le dossier partagepro.online?ref=hexoprint, merci');
        expect([link.raw, link.href, link.host]).toEqual([
            'partagepro.online?ref=hexoprint',
            'https://partagepro.online/?ref=hexoprint',
            'partagepro.online',
        ]);
        const [ip] = findLinks('serveur 203.0.113.7:80.');
        expect([ip.raw, ip.host]).toEqual(['203.0.113.7:80', '203.0.113.7']);
    });

    it('un texte ordinaire avec points, barres, points d’interrogation et nombres reste propre', () => {
        for (const message of [
            'plan.zip', 'pièce.de', 'support.stl', '2.5 cm', '0.4mm/0.6mm', '12.03.2026', 'v1.2', 'PLA/PETG',
            'jean@exemple.fr', '05.61.22.33.44', 'etc.?', 'ok.? merci',
            'vous connaissez site.fr?', 'vous connaissez site.fr? merci', '(sur lesite.fr?)', 'lesite.fr?!', 'lesite.fr#',
            '203.0.113.7', 'au 203.0.113.7.', '05.61.22.33.44/06.12.34.56.78', 'du 12.03.2026/13.03.2026', 'v1.2.3.4/beta',
            'à 10:30, ref 1.2.3/4', 'jean@203.0.113.7/x',
        ]) {
            expect(screen({ message }).verdict, message).toBe('clean');
        }
    });

    it('des entrées de 50 000 caractères sur les nouveaux motifs restent rapides', () => {
        for (const unit of ['a.aa?', 'a.aa#', 'a.aa?x', 'a.aa? ', 'a.aa?)', 'a.aa:1?', 'a.aa:1', 'a.aa:', 'etc.?', '1.1.1.1', '1.1.1.1.', '1.1.1.1?', '1.1.1.1? ', '1.1.1.1:', '1.1.1.1:1', '-1.1.1.1', '.1.1.1.1:1 ', '1.1.1.1/', '1.', '1.1:1/']) {
            const message = unit.repeat(Math.ceil(50000 / unit.length)).slice(0, 50000);
            expect(timed(() => screen({ message })), unit).toBeLessThan(MAX_MS);
        }
    });

    it('isAllowedHost accepte l’hôte exact et ses sous-domaines seulement', () => {
        expect(isAllowed('we.tl')).toBe(true);
        expect(isAllowed('WWW.Printables.com')).toBe(true);
        expect(isAllowed('evilwetransfer.com')).toBe(false);
        expect(isAllowed('wetransfer.com.evil.online')).toBe(false);
        expect(isAllowed('we.tl:99999')).toBe(false);
        expect(isAllowed('evil.online', [''])).toBe(false);
        expect(isAllowed('a.store.example', ['store.example'])).toBe(true);
    });
});

describe('tri des liens, liste par défaut de JKD', () => {
    const screen = (message: string) => screenContactSubmission({ ...base, message });

    it('classe suspect le message de la campagne de phishing', () => {
        const result = screen(
            'Bonjour, nous organisons un événement sportif dans la région. Le dossier est ici : https://partagepro.online/fr/b2b/jkd31'
        );
        expect(result).toEqual({
            verdict: 'suspect',
            reasons: ['link_not_allowed'],
            linkHosts: ['partagepro.online'],
        });
    });

    it('laisse propres les demandes habituelles d’un futur élève', () => {
        for (const message of [
            'Bonjour, je voudrais faire un cours d’essai mardi à 19h30. Merci !',
            'Mon fils a 14 ans, le cours ado est-il ouvert en cours de saison ?',
            'Vous pouvez me rappeler au 05.61.22.33.44 ou écrire à jean.dupont@exemple.fr.',
            'J’ai vu les tarifs sur https://www.jkd-selfdefense31.fr/tarifs, la licence est-elle comprise ?',
            'Trouvé via jkd-selfdefense31.com/contact',
        ]) {
            expect(screen(message).verdict, message).toBe('clean');
        }
    });

    // Revue de sécurité du 13 novembre : `findLinks` garde dans le chemin des
    // caractères (`'`, `,`, `|`, `^`...) où une messagerie peut couper le lien,
    // puis rendre cliquable à part le domaine qui suit.
    it('classe suspect un lien vers le site qui cache un autre domaine dans son chemin', () => {
        for (const message of [
            "https://www.jkd-selfdefense31.fr/x'www.piege.online/y",
            'https://www.jkd-selfdefense31.fr/x,piege.online/y',
            'https://www.jkd-selfdefense31.fr/x|piege.online/y',
            'https://www.jkd-selfdefense31.fr/tarifs?u=piege.online',
            'jkd-selfdefense31.fr/x^piege.online',
            'https://www.jkd-selfdefense31.fr/x*203.0.113.7/y',
        ]) {
            expect(screen(message), message).toMatchObject({
                verdict: 'suspect',
                reasons: ['link_not_allowed'],
            });
        }
    });

    it('laisse propre un lien vers le site au chemin ordinaire', () => {
        for (const message of [
            'https://www.jkd-selfdefense31.fr/tarifs?saison=2026-2027#ado',
            'https://www.jkd-selfdefense31.fr/events/stage-2026, merci',
            'https://www.jkd-selfdefense31.fr/27-styles',
        ]) {
            expect(screen(message).verdict, message).toBe('clean');
        }
    });

    it('classe suspects les faux domaines du club', () => {
        for (const message of [
            // Le domaine avec tirets n'appartient pas à l'association.
            'https://jkd-self-defense-31.fr/inscription',
            'https://www.jkd-selfdefense31.fr.piege.online/x',
            'https://fauxjkd-selfdefense31.fr/x',
            'https://www.jkd-selfdefense31.fr@piege.online/x',
        ]) {
            expect(screen(message).verdict, message).toBe('suspect');
        }
    });
});
