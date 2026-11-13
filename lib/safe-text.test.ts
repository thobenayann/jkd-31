import { describe, expect, it } from 'vitest';
import { type SafeSegment, defang, toSafeSegments, toSafeText } from './safe-text';

/*
 * Comme pour le tri : les tests d'Hexoprint repris tels quels avec la liste
 * d'hôtes d'Hexoprint (les noms de fichiers, absents du formulaire JKD, sont
 * retirés), puis les cas propres à JKD avec la liste par défaut.
 */

const HEXOPRINT_HOSTS = [
    'hexoprint.fr', 'wetransfer.com', 'we.tl', 'swisstransfer.com', 'transfernow.net', 'fromsmash.com',
    'drive.google.com', 'dropbox.com', 'onedrive.live.com', '1drv.ms', 'icloud.com', 'printables.com',
    'thingiverse.com', 'cults3d.com', 'myminifactory.com', 'makerworld.com', 'grabcad.com',
];

const joined = (segments: SafeSegment[]) => segments.map((segment) => segment.value).join('');
const segmentsOf = (text: unknown, allowLinks: boolean, extra: string[] = []) =>
    toSafeSegments(text, { allowLinks, allowedHosts: [...HEXOPRINT_HOSTS, ...extra] });
const on = (text: string) => segmentsOf(text, true);
const off = (text: string) => segmentsOf(text, false);

describe('désamorçage, tests repris d’Hexoprint', () => {
    it('defang neutralise le schéma et les points de l’hôte seulement', () => {
        expect(defang('https://partagepro.online/fr/b2b/hexoprint')).toBe('hxxps://partagepro[.]online/fr/b2b/hexoprint');
        expect(defang('sharez.online/fr/x')).toBe('sharez[.]online/fr/x');
    });

    it('un lien autorisé ne reste cliquable que si les liens sont permis', () => {
        expect(on('voir https://we.tl/t-abc')).toEqual([
            { kind: 'text', value: 'voir ' },
            { kind: 'link', value: 'https://we.tl/t-abc', href: 'https://we.tl/t-abc' },
        ]);
        const disabled = off('voir https://we.tl/t-abc');
        expect(disabled.every((s) => s.kind === 'text')).toBe(true);
        expect(joined(disabled)).toMatch(/hxxps:\/\/we\[\.\]tl\/t-abc/);
    });

    it('les liens inconnus, domaines nus et liens markdown ne sont jamais cliquables', () => {
        expect(on('https://partagepro.online/x').every((s) => s.kind === 'text')).toBe(true);
        expect(joined(on('truc.online'))).toBe('truc[.]online');
        expect(on('[dossier](https://partagepro.online/x)').every((s) => s.kind === 'text')).toBe(true);
        expect(on('(voir https://we.tl/t-abc).').find((s) => s.kind === 'link')).toMatchObject({ href: 'https://we.tl/t-abc' });
        expect(joined(on('écrivez à jean@exemple.fr'))).toBe('écrivez à jean@exemple.fr');
    });

    it('defang traite les formes sans schéma, en majuscules ou à séparateur inhabituel', () => {
        expect(defang('www.partagepro.online/x')).toBe('www[.]partagepro[.]online/x');
        expect(defang('HTTPS://PARTAGEPRO.ONLINE/x')).toBe('hxxps://PARTAGEPRO[.]ONLINE/x');
        expect(defang('http://1.2.3.4:8080/a.b?c=d.e#f.g')).toBe('hxxp://1[.]2[.]3[.]4:8080/a.b?c=d.e#f.g');
        expect(defang('https:\\\\partagepro.online\\x.y')).toBe('hxxps:\\\\partagepro[.]online\\x.y');
        expect(defang('https://we.tl@partagepro.online/x')).toBe('hxxps://we[.]tl@partagepro[.]online/x');
        // Un domaine nu qui commence par « http » n'est pas un schéma.
        expect(defang('httpbin.org/get')).toBe('httpbin[.]org/get');
    });

    it('un lien que l’analyseur d’URL ne peut pas utiliser n’est jamais cliquable', () => {
        for (const text of [
            'https://we.tl@partagepro.online/x',
            'https://we.tl"@partagepro.online/x',
            'https://[bad/x',
            'https://%zz.com/x',
        ]) {
            const segments = on(text);
            expect(segments.every((s) => s.kind === 'text'), text).toBe(true);
            expect(joined(segments), text).not.toMatch(/https?:/i);
        }
        expect(joined(on('https://we.tl@partagepro.online/x'))).toBe('hxxps://we[.]tl@partagepro[.]online/x');
    });

    it('les liens inconnus sans schéma ou en majuscules sont désamorcés', () => {
        expect(joined(on('.partagepro.online/fr'))).toBe('.partagepro[.]online/fr');
        expect(joined(on('www.partagepro.online/x'))).toBe('www[.]partagepro[.]online/x');
        expect(joined(on('HTTPS://PARTAGEPRO.ONLINE/x'))).toBe('hxxps://PARTAGEPRO[.]ONLINE/x');
        expect(joined(on('HtTp://Truc.Online/X'))).toBe('hxxp://Truc[.]Online/X');
    });

    it('les domaines nus sont désamorcés, y compris derrière une ponctuation', () => {
        const run = (text: string) => joined(on(text));
        expect(run('.partagepro.online')).toBe('.partagepro[.]online');
        expect(run('-partagepro.online')).toBe('-partagepro[.]online');
        expect(run('voir (sharez.online).')).toBe('voir (sharez[.]online).');
        expect(run('a.b.c.online et t.co')).toBe('a[.]b[.]c[.]online et t[.]co');
        expect(run('@partagepro.online')).toBe('@partagepro[.]online');
        expect(run('partagepro.online@')).toBe('partagepro[.]online@');
        expect(run('wеtransfer.com')).toBe('wеtransfer[.]com'); // « е » cyrillique
        expect(run('wetransfer.com.evil.online')).toBe('wetransfer[.]com[.]evil[.]online');
    });

    it('les nombres, versions et phrases sans domaine restent intacts', () => {
        for (const text of [
            'une base de 2.5 cm',
            'buse 0.4mm/0.6mm',
            'version 1.2.3-beta',
            'Fin de phrase. Début de la suivante.',
            'et cetera...',
            'a.b',
            '3.14',
        ]) {
            expect(joined(on(text))).toBe(text);
        }
    });

    it('les adresses e-mail restent intactes, mais seulement les vraies', () => {
        const run = (text: string) => joined(on(text));
        expect(run('jean@exemple.fr')).toBe('jean@exemple.fr');
        expect(run('jean.dupont@sous.exemple.fr')).toBe('jean.dupont@sous.exemple.fr');
        expect(run("o'neil+jean.dupont@exemple.co.uk, merci.")).toBe("o'neil+jean.dupont@exemple.co.uk, merci.");
        expect(run('josé.garcía@exemple.es')).toBe('josé.garcía@exemple.es');
        expect(run('voir @partagepro.online')).toBe('voir @partagepro[.]online');
        expect(run('partagepro.online@x')).toBe('partagepro[.]online@x');
    });

    it('un domaine nu autorisé reste tel qu’écrit, sauf liens coupés', () => {
        expect(joined(on('voir wetransfer.com ou www.we.tl'))).toBe('voir wetransfer.com ou www.we.tl');
        expect(joined(on('depuis drive.google.com.'))).toBe('depuis drive.google.com.');
        expect(joined(off('depuis drive.google.com.'))).toBe('depuis drive[.]google[.]com.');
        expect(joined(segmentsOf('depuis store.example.org', true, ['example.org']))).toBe('depuis store.example.org');
    });

    it('un domaine dans le chemin d’un lien désamorcé est désamorcé aussi', () => {
        expect(joined(on('https://a.online/x?u=evil.com&v=1'))).toBe('hxxps://a[.]online/x?u=evil[.]com&v=1');
        expect(joined(off('https://we.tl/t-abc'))).toBe('hxxps://we[.]tl/t-abc');
    });

    it('un texte collé à un lien, un schéma isolé et une adresse cachée n’échappent pas', () => {
        expect(joined(on('evil.comhttps://a.online/x'))).toBe('evil[.]comhxxps://a[.]online/x');
        expect(joined(off('https://https://a.online/x'))).toBe('hxxps://hxxps://a[.]online/x');
        expect(joined(on('voir http:// ici'))).toBe('voir hxxp:// ici');
        expect(joined(off('voir http:// ici'))).toBe('voir hxxp:// ici');
        expect(joined(on('https://a.online/p@evil.com/q'))).toBe('hxxps://a[.]online/p@evil[.]com/q');
    });

    it('les schémas non http et les adresses IP pointées sont désamorcés dans les deux modes', () => {
        const expected: Record<string, string> = {
            'ftp://203.0.113.7/plans.zip': 'ftx://203[.]0[.]113[.]7/plans[.]zip',
            'ftp://3232235777/x': 'ftx://3232235777/x',
            'sftp://203.0.113.7/x': 'sftx://203[.]0[.]113[.]7/x',
            'file://203.0.113.7/share': 'filx://203[.]0[.]113[.]7/share',
            'smb://203.0.113.7/share': 'smx://203[.]0[.]113[.]7/share',
            'FTP://203.0.113.7/x': 'FTx://203[.]0[.]113[.]7/x',
            'SMB://203.0.113.7/x': 'SMx://203[.]0[.]113[.]7/x',
            'HTTP://203.0.113.7/x': 'hxxp://203[.]0[.]113[.]7/x',
            'HTTPS://3232235777/x': 'hxxps://3232235777/x',
            'ftp://evil.online/x': 'ftx://evil[.]online/x',
            'file://evil.online/share': 'filx://evil[.]online/share',
            'file:///C:/Modeles/piece.stl': 'filx:///C:/Modeles/piece[.]stl',
            '1ftp://203.0.113.7/x': '1ftx://203[.]0[.]113[.]7/x',
            'evil.comftp://x.online': 'evil[.]comftx://x[.]online',
            'ftp:\\\\203.0.113.7\\x': 'ftx:\\\\203[.]0[.]113[.]7\\x',
            '\\\\203.0.113.7\\share': '\\\\203[.]0[.]113[.]7\\share',
            '\\\\files.example.com\\share': '\\\\files[.]example[.]com\\share',
            '203.0.113.7/x': '203[.]0[.]113[.]7/x',
            'ip 203.0.113.7:8080/x': 'ip 203[.]0[.]113[.]7:8080/x',
            '(203.0.113.7)': '(203[.]0[.]113[.]7)',
            '-203.0.113.7.': '-203[.]0[.]113[.]7.',
        };
        for (const allowLinks of [false, true]) {
            for (const [input, output] of Object.entries(expected)) {
                expect(joined(segmentsOf(input, allowLinks)), `${input} (allowLinks: ${allowLinks})`).toBe(output);
            }
            expect(joined(segmentsOf('sftp://user@evil.online/x', allowLinks))).toBe('sftx://user@evil.online/x');
        }
    });

    it('schémas, IP et chemins Windows : ce qui reste intact', () => {
        const run = (text: string) => joined(on(text));
        expect(run('dans C:\\Modeles\\liste')).toBe('dans C:\\Modeles\\liste');
        expect(run('RDV 12:/30')).toBe('RDV 12:/30');
        for (const text of [
            '1.2.3', '2.5', '256.1.1.1', '1.2.3.4.5', '1.2.3.4567', '1234.5.6.7',
            '05.61.22.33.44', '+33.5.61.22.33.44', '33.5.61.22.33.44', '1.234.567.890 EUR', 'au 05.61.22.33.44.',
        ]) {
            expect(run(text)).toBe(text);
        }
        expect(run('v1.2.3.4')).toBe('v1[.]2[.]3[.]4');
        expect(run('hxxp://a[.]online ftx://203[.]0[.]113[.]7/x')).toBe('hxxp://a[.]online ftx://203[.]0[.]113[.]7/x');
    });

    it('un lien autorisé derrière un schéma non http reste cliquable, le schéma non', () => {
        expect(on('ftp://we.tl/x')).toEqual([
            { kind: 'text', value: 'ftx://' },
            { kind: 'link', value: 'we.tl/x', href: 'https://we.tl/x' },
        ]);
        expect(joined(off('ftp://we.tl/x'))).toBe('ftx://we[.]tl/x');
    });

    it('un lien autorisé s’arrête au premier crochet, accolade, parenthèse ou chevron', () => {
        const cases: Array<[string, string, string]> = [
            ['https://we.tl/([)]evil.com', 'https://we.tl/', '([)]evil[.]com'],
            ['https://we.tl/[(])evil.online', 'https://we.tl/', '[(])evil[.]online'],
            ['https://we.tl/((x))evil.com', 'https://we.tl/', '((x))evil[.]com'],
            ['https://we.tl/[[x]]evil.com', 'https://we.tl/', '[[x]]evil[.]com'],
            ['https://we.tl/(xevil.online', 'https://we.tl/', '(xevil[.]online'],
            ['https://we.tl/x{evil.online', 'https://we.tl/x', '{evil[.]online'],
            ['https://we.tl/x}evil.online', 'https://we.tl/x', '}evil[.]online'],
            ['https://we.tl/x<evil.online', 'https://we.tl/x', '<evil[.]online'],
            ['https://we.tl/x>evil.online', 'https://we.tl/x', '>evil[.]online'],
            ['https://we.tl/x)evil.online', 'https://we.tl/x', ')evil[.]online'],
            ['https://we.tl/x]evil.online', 'https://we.tl/x', ']evil[.]online'],
            ['www.we.tl/a(b)evil.com', 'www.we.tl/a', '(b)evil[.]com'],
            ['https://we.tl/a?u=1&v=2]x.zip', 'https://we.tl/a?u=1&v=2', ']x[.]zip'],
        ];
        for (const [input, head, tail] of cases) {
            const segments = on(input);
            expect(segments, input).toEqual([
                { kind: 'link', value: head, href: head.startsWith('www.') ? `https://${head}` : head },
                { kind: 'text', value: tail },
            ]);
        }
        expect(on('(https://we.tl/x)evil.online')).toEqual([
            { kind: 'text', value: '(' },
            { kind: 'link', value: 'https://we.tl/x', href: 'https://we.tl/x' },
            { kind: 'text', value: ')evil[.]online' },
        ]);
        const plain = 'voir https://we.tl/x) puis https://we.tl/y]ok.';
        expect(joined(on(plain))).toBe(plain);
    });

    it('liens coupés : la suite entre crochets est désamorcée dans un seul texte', () => {
        expect(joined(off('https://we.tl/((x))evil.com'))).toBe('hxxps://we[.]tl/((x))evil[.]com');
        expect(joined(off('https://we.tl/(xevil.online'))).toBe('hxxps://we[.]tl/(xevil[.]online');
        expect(joined(off('(https://we.tl/x)evil.online'))).toBe('(hxxps://we[.]tl/x)evil[.]online');
    });

    it('un texte aux seuls liens autorisés se reconstitue à l’identique', () => {
        const text = 'Bonjour,\nmodèle : https://we.tl/t-abc et www.printables.com/model/1.\nbase 2.5 cm, jean@exemple.fr (https://drive.google.com/x).';
        const segments = on(text);
        expect(joined(segments)).toBe(text);
        expect(segments.filter((s) => s.kind === 'link').map((s) => (s.kind === 'link' ? s.href : ''))).toEqual([
            'https://we.tl/t-abc',
            'https://www.printables.com/model/1',
            'https://drive.google.com/x',
        ]);
    });

    it('une entrée vide ou qui n’est pas une chaîne ne donne aucun segment', () => {
        expect(on('')).toEqual([]);
        expect(segmentsOf(undefined, true)).toEqual([]);
    });

    it('la sortie désamorcée ne laisse aucun hôte qu’une messagerie pourrait lier', () => {
        for (const text of [
            'https://partagepro.online/fr/b2b/hexoprint',
            'HTTP://PARTAGEPRO.ONLINE',
            'sharez.online/fr/x',
            'www.partagepro.online',
            '[dossier](https://partagepro.online/x)',
            'https://we.tl"@partagepro.online/x',
            'https://we.tl/?u=https://partagepro.online/x',
            'https:/partagepro.online/x',
            'https:\\\\partagepro.online\\x',
            '.partagepro.online/x',
            'truc.online',
            'https://https://partagepro.online/x',
            'evil.comhttps://partagepro.online/x',
            'https://we.tl"@http://partagepro.online/x',
            'https://a.online/p@partagepro.online/q',
        ]) {
            const output = joined(off(text));
            expect(output, text).not.toMatch(/https?:/i);
            expect(output, text).not.toMatch(/partagepro\.online|sharez\.online|truc\.online/i);
        }
    });

    it('les longues entrées hostiles restent rapides', () => {
        for (const unit of ['a.bc ', 'a.', 'www.', 'https://a.b/', 'x@y.zz ', '.-_', 'a/', 'https://we.tl"@', 'a.bc' + '.'.repeat(500), 'https://we.tl/' + 'x.'.repeat(200),
            'ftp://1.2.3.4/', 'ftp:/', 'a://', 'sftp:\\\\1.2.3.4\\', '\\\\1.2.3.4\\share ', '1.2.3.4 ', '1.', 'a1.1.1.1.', '1.1.1.1x ', '1.1.1.1a',
            'abc', 'a1-b2+c3', ':///', 'https://we.tl/x)', 'https://we.tl/x]y.zz ', 'www.we.tl/x)www.we.tl/y)', 'https://we.tl/(x]', '((((((', '))))))', '[]][[]',
            'https://we.tl/' + ')'.repeat(100), 'https://we.tl/' + '(x)'.repeat(100),
            'https://we.tl/([)]x ', 'https://we.tl/((x))e.com ', 'https://we.tl/{x}<y>e.com ', 'www.we.tl/' + '{'.repeat(100), '{[(<', '>)]}',
            '05.61.22.33.44 ', '+33.5.61.22.33.44 ', '1.2.3.4.5.6.7.8 ', '255.255.255.255 ', '256.256.256.256 ', '1.2.3.', '1234.1234.1234.1234 ', '1.2.3.4.', '9.9.9.9x']) {
            const text = unit.repeat(Math.ceil(50000 / unit.length)).slice(0, 50000);
            const start = performance.now();
            segmentsOf(text, true, ['example.org']);
            expect(performance.now() - start, unit).toBeLessThan(1500);
        }
    });
});

describe('désamorçage, liste par défaut de JKD', () => {
    const CAMPAIGN = 'Le dossier de l’événement est ici : https://partagepro.online/fr/b2b/jkd31 (accès sécurisé).';

    it('désamorce le lien de la campagne, en message propre comme suspect', () => {
        for (const allowLinks of [true, false]) {
            const output = toSafeText(CAMPAIGN, { allowLinks });
            expect(output).toBe('Le dossier de l’événement est ici : hxxps://partagepro[.]online/fr/b2b/jkd31 (accès sécurisé).');
        }
    });

    it('laisse lisible un lien vers le site, sauf dans un message suspect', () => {
        const text = 'Vu sur https://www.jkd-selfdefense31.fr/tarifs et jkd-selfdefense31.com.';
        expect(toSafeText(text, { allowLinks: true })).toBe(text);
        expect(toSafeText(text, { allowLinks: false })).toBe(
            'Vu sur hxxps://www[.]jkd-selfdefense31[.]fr/tarifs et jkd-selfdefense31[.]com.'
        );
    });

    it('désamorce le faux domaine avec tirets', () => {
        expect(toSafeText('voir jkd-self-defense-31.fr', { allowLinks: true })).toBe('voir jkd-self-defense-31[.]fr');
    });

    it('laisse intacts un message ordinaire, un téléphone et une adresse', () => {
        const text = 'Bonjour,\nje voudrais un cours d’essai mardi à 19h30.\nTél. 05.61.22.33.44, jean.dupont@exemple.fr';
        expect(toSafeText(text, { allowLinks: false })).toBe(text);
    });
});
