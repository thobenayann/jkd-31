# Formulaire de contact : liens piégés dans le mail du bureau (13 novembre 2026)

> **Statut : proposition validée par Yann le 13 novembre 2026, code réalisé sur
> `develop`, à livrer par PR vers `main`.** Hors code : voir « Reste ».
> Base : `develop` aligné sur la production (`e77df46`, déployé par `555a5b0`).
> Suite de [`2026-11-08-formulaire-contact-serveur.md`](2026-11-08-formulaire-contact-serveur.md).
> Modèle : la sécurisation d'Hexoprint du 2 novembre 2026, même campagne.

## Pourquoi

Un mail de phishing est arrivé dans la boîte qui reçoit les demandes du site
(Fanny, `ADMIN_MAIL`). Fanny n'a pas cliqué, à notre connaissance. Hexoprint a reçu
les mêmes les 26 octobre et 2 novembre : une campagne vise les sites de la région
toulousaine par leur formulaire de contact, avec un message rédigé proprement et un
lien vers une page piégée. Le formulaire est rempli comme le ferait un humain.

Objectif : qu'aucun lien saisi par un visiteur ne puisse être cliqué par accident
dans un mail du site, et qu'un message suspect se signale de lui-même.

## Ce qui protège déjà la production (8 novembre)

| Protection | Effet sur cette campagne |
|---|---|
| Schéma zod strict dans la Server Action | Une seule adresse, tailles bornées, prénom et nom en lettres seulement : aucun lien possible dans l'identité, le relais vers des tiers est fermé. |
| Champ piège | Écarte les robots simples. |
| Limite de débit (règle « Formulaire de contact », vérifiée active le 13 novembre) | 5 envois par 10 minutes par IP, 5 confirmations par destinataire. |
| Erreurs SMTP masquées | Rien de technique côté visiteur. |

Rien de cela n'arrête un humain qui envoie un seul message avec un lien. C'est ce
qui s'est produit.

## Ce qui reste ouvert

| # | Constat | Gravité | Où |
|---|---|---|---|
| F1 | **Le message accepte n'importe quel lien, et il arrive cliquable chez Fanny.** React Email échappe le HTML, mais Gmail, Outlook ou Orange transforment une adresse web écrite en texte en lien cliquable. Aucun tri, aucun avertissement. Le `Reply-To` pointe vers l'adresse du visiteur et le pied du mail invite à répondre. | Haute | `services/send-email.ts`, `emails/admin-contact-email.tsx` |
| F2 | **Les mails du site pointent vers un domaine qui n'appartient pas à l'association.** En-tête, pied, bouton « Visiter notre site » et objet du mail admin renvoient vers `jkd-self-defense-31.fr`, avec tirets. L'association possède `jkd-selfdefense31.fr` et `.com`, sans tirets. Le domaine avec tirets n'est pas enregistré (registre AFNIC, réponse 404 le 13 novembre) : n'importe qui peut l'acheter et faire de chaque mail légitime du site un lien piégé, y compris les confirmations déjà envoyées depuis 2024. | Haute | `emails/*.tsx`, `services/send-email.ts:13` |
| F3 | **Le domaine n'a pas de politique DMARC active.** `p=none` et SPF en `~all` : un mail qui se fait passer pour `@jkd-selfdefense31.fr` n'est ni rejeté ni mis en quarantaine. Le SPF inclut encore `amazonses.com`, reste de l'époque Resend (`7524f79`, remplacé par nodemailer en `35e08ee`). Aucune clé Resend ne subsiste dans Vercel. | Moyenne | DNS Gandi, hors code |

## Proposition

### Code : un seul lot, une PR `develop` vers `main`

| | Changement | Ferme |
|---|---|---|
| A | Tous les liens, l'objet et l'identifiant du logo des mails passent par `siteConfig.url` (`constant/site.ts`). Plus aucune mention de `jkd-self-defense-31.fr`. | F2 |
| B | **Tri des liens** porté d'Hexoprint (`src/lib/contact-screening.mjs`, version de `origin/master`) dans `lib/contact-screening.ts`, fonction pure, tests Vitest repris et complétés. Liste blanche : le domaine du site seulement. Un élève qui demande un horaire n'a aucune raison de coller un lien. | F1 |
| C | Normalisation ajoutée au schéma : caractères invisibles retirés (U+200B, U+00AD...), points idéographiques ramenés à `.`. Sans elle, un seul caractère invisible suffit à cacher un domaine au tri. | F1 |
| D | **Dans le mail admin, tout lien hors du site est désamorcé** (`hxxps://exemple[.]com`) : aucune messagerie ne peut plus le rendre cliquable. | F1 |
| E | **Message suspect** : objet préfixé `[À VÉRIFIER]`, bandeau d'avertissement en tête, pas de `Reply-To`, pas de mail de confirmation au demandeur. Il arrive quand même. | F1 |
| F | Une ligne de log JSON par demande : verdict, raisons, hôtes des liens. Aucune donnée personnelle. | Suivi |

Pourquoi livrer le message suspect plutôt que le supprimer : un faux positif coûte un
élève perdu, et un message désamorcé n'offre plus de lien sur lequel cliquer. C'est
le choix retenu sur Hexoprint.

Ordre dans la Server Action : champ piège, validation, limite de débit, **tri**, envoi.
Le tri ne bloque rien, il change seulement la forme du mail admin et supprime la
confirmation.

### Hors code, à planifier ensuite

| Action | Où | Pourquoi |
|---|---|---|
| Retirer `include:amazonses.com` du SPF | DNS Gandi | Resend n'envoie plus rien pour ce domaine. |
| DMARC : ajouter une adresse de rapports, lire deux à quatre semaines, puis `p=quarantine` | DNS Gandi | Ferme F3 sans risquer de bloquer les vrais mails du club. |
| Acheter `jkd-self-defense-31.fr` et le rediriger vers le site | Gandi, quelques euros par an | Protège les mails déjà envoyés, que A ne peut pas corriger. Décision de Yann. |

### Écarté

| Option | Raison |
|---|---|
| BotID ou Turnstile | Décision du 8 novembre maintenue : pas de spam en rafale constaté, et un anti-robot n'arrête pas un humain qui envoie un seul message. |
| Supprimer les messages suspects | Risque de perdre une vraie demande, voir plus haut. |

## Réalisé

| Fichier | Rôle |
|---|---|
| `lib/contact-screening.ts` | Repérage des liens et tri `clean` / `suspect`, porté d'Hexoprint (`origin/master`, `src/lib/contact-screening.mjs`). La liste des hôtes autorisés devient un paramètre, par défaut `jkd-selfdefense31.fr` et `jkd-selfdefense31.com`, sous-domaines compris. Champs d'identité : prénom, nom, téléphone. |
| `lib/safe-text.ts` | Désamorçage, porté de `src/lib/safe-text.mjs`. Ajout de `toSafeText`, qui rend directement la chaîne affichable. La partie « noms de fichiers » d'Hexoprint n'est pas reprise, le formulaire JKD n'a pas de pièce jointe. |
| `lib/contact-admin-email.ts` | Objet, Reply-To et envoi de la confirmation selon le verdict. Un verdict absent ou inattendu est traité comme suspect. |
| `lib/validation/contact.ts` | Normalisation avant tout contrôle : caractères Unicode Cf retirés, points idéographique et pleine chasse ramenés à `.`, dans les quatre champs texte. |
| `services/send-email.ts` | Ordre : champ piège, validation, limite de débit, **tri**, envoi. Ligne de log `contact_screening` en `info` ou `warn`. Message suspect : objet `[À VÉRIFIER]`, pas de Reply-To, pas de confirmation. |
| `emails/admin-contact-email.tsx` | Bandeau du message suspect avec ses motifs. Prénom, nom, téléphone et message passent par `toSafeText`. Adresse sans `mailto:` et phrase de réponse adaptée si suspect. |
| `emails/confirmation-email.tsx`, `services/email-transport.ts` | Liens et identifiant du logo sur le vrai domaine. |
| `constant/site.ts`, `emails/email-constants.ts` | `SITE_DOMAIN` et `EMAIL_LOGO_CID`, dérivés de `SITE.url`. |
| `emails/email-template.tsx` | Supprimé. Ancien gabarit importé nulle part, qui renvoyait au faux domaine et lisait `VERCEL_PROJECT_PRODUCTION_URL`. |
| `services/README.md` | Fonctionnement mis à jour. |

**Pourquoi porter le code d'Hexoprint plutôt qu'une expression régulière simple.**
Repérer un lien dans un texte libre est plein de pièges : point ou tiret de tête,
identifiant avant `@`, guillemet qui coupe l'autorité, caractère invisible,
homoglyphe cyrillique, domaine nu, adresse IP, schéma `ftp://`. Le module
d'Hexoprint a déjà passé plusieurs revues de sécurité sur ces cas, avec des tests
de non-régression et de temps d'exécution. La liste des hôtes devient un paramètre,
ce qui permet de faire tourner ses tests tels quels avec la liste d'Hexoprint :
s'ils passent, le portage n'a rien changé au comportement. Un seul a été modifié,
volontairement, après la revue de sécurité (section suivante).

## Vérifications

**Tests (TDD).** Les tests de normalisation et de la Server Action ont été écrits
et vus en échec (8 puis 6) avant le code.

| Fichier | Tests | Couvre |
|---|---:|---|
| `lib/contact-screening.test.ts` | 22 | Tous les tests d'Hexoprint, sauf société et fichiers joints, avec la liste d'Hexoprint. Plus : campagne JKD suspecte, demandes d'élèves propres, lien vers le site propre, faux domaines du club suspects. |
| `lib/safe-text.test.ts` | 25 | Tous les tests de désamorçage d'Hexoprint, sauf noms de fichiers. Plus : lien de campagne désamorcé dans les deux modes, lien vers le site lisible sauf si suspect, faux domaine désamorcé, téléphone et adresse intacts. |
| `lib/contact-admin-email.test.ts` | 4 | Enveloppe propre, suspecte, verdict inattendu traité comme suspect, libellés des motifs. |
| `lib/validation/contact.test.ts` | +8 | Trait d'union conditionnel, espace sans chasse, gluon, BOM, trois points sosies, champs d'identité. |
| `services/send-email.test.ts` | +8 | Message propre inchangé, message suspect signalé sans lien, sans Reply-To ni confirmation, réponse identique pour le visiteur, lien vers le site accepté, lien caché par un caractère invisible repéré, log sans donnée personnelle, aucun lien vers `jkd-self-defense-31`. |

Suite complète : 16 fichiers, 221 tests, tous verts (154 avant ce lot). 230 après
la revue de sécurité ci-dessous.

**Contrôles statiques.** `pnpm exec tsc --noEmit` passe. `pnpm lint` ne signale rien
dans les fichiers touchés. Restent les 2 erreurs connues (`components/ui/3d-card.tsx`,
`hooks/use-media-query.ts`).

**Build de production local**, lancé avec `SERVER_MAIL` et `SERVER_MAIL_PASSWORD`
vides pour qu'aucun mail réel ne parte (Next ne remplace pas une variable déjà
définie, même vide, par celle de `.env.local`) :

| Envoi du vrai formulaire `/contact` | Log serveur | Visiteur |
|---|---|---|
| Message avec `https://partagepro.online/fr/b2b/jkd31` | `{"event":"contact_screening","verdict":"suspect","reasons":["link_not_allowed"],"linkHosts":["partagepro.online"]}` | « L'envoi a échoué… » (SMTP absent) |
| Message avec `https://www.jkd-selfdefense31.fr/tarifs` | `{"event":"contact_screening","verdict":"clean","reasons":[],"linkHosts":["www.jkd-selfdefense31.fr"]}` | Idem |

**Rendu du mail admin**, contrôlé dans un navigateur à partir du HTML produit par
React Email. Version suspecte : bandeau rouge en tête avec le motif, lien affiché
`hxxps://partagepro[.]online/fr/b2b/jkd31`, adresse sans lien, phrase « Ce message
n'a pas d'adresse de réponse ». Version propre : aucun bandeau, lien vers le site
lisible. Dans les deux, les seuls liens du mail pointent vers
`https://www.jkd-selfdefense31.fr`.

**Non vérifié à ce stade** : le rendu dans une messagerie et l'envoi réel. Fait
ensuite sur la preview de la PR #37, voir « Contrôle sur la preview ».

## Revue de sécurité automatique (après ouverture de la PR #37)

Deux contournements relevés. Les deux ont été vérifiés avant correction, puis
corrigés avec des tests écrits et vus en échec avant le code.

| Faille | Constat | Correctif |
|---|---|---|
| Points sosies non couverts | La revue citait le petit point U+FE52. Vérification sur les 1,1 million de points de code contre l'analyseur d'URL de Node 24 : seuls U+3002, U+FF0E et U+FF61 y sont lus comme un point, et ils étaient déjà traités. U+FE52 y est refusé. D'anciennes tables IDNA, encore présentes dans des navigateurs pas à jour, le lisaient pourtant comme un point, ainsi que U+2024 et `⒈` (lu « 1. »). Risque faible mais réel sur un poste ancien. | Forme NFKC appliquée avant le reste de la normalisation (`lib/validation/contact.ts`). Elle ramène ces caractères et les lettres pleine chasse à leur forme simple. Effet visible : `…` devient `...`, `²` devient `2`. Un test parcourt tout le plan multilingue de base contre l'analyseur réel et échoue si un caractère lu comme un point échappe à la normalisation. |
| Domaine caché dans le chemin d'un lien autorisé | Confirmé : `https://www.jkd-selfdefense31.fr/x'www.piege.online/y` donnait un message propre. `findLinks` garde `'`, `,`, `\|`, `^`, `*` dans le chemin, alors qu'une messagerie peut y couper le lien et rendre cliquable le domaine qui suit. | Un texte en forme de domaine ou d'adresse IPv4 dans le chemin d'un lien autorisé rend le message suspect (`link_not_allowed`), donc entièrement désamorcé (`lib/contact-screening.ts`). Écart assumé avec Hexoprint : un lien vers le site avec un point dans son chemin (`/logo.png`) sera signalé. Le message arrive quand même. |

Tests ajoutés : 7 sur la normalisation, 2 sur le tri, 1 de bout en bout sur la
Server Action. Le test Hexoprint « hôtes ajoutés » passe de `/a.stl` à `/a-stl`,
le premier étant désormais suspect par construction.

## Contrôle sur la preview de la PR #37

Le 13 novembre, sur le déploiement du commit `863f712`
(`jkd-31-a56qfunzq-yann-pro.vercel.app`), avec `DEV_TEST_EMAIL` pointant vers la
Gmail de Yann. Deux envois réels depuis le formulaire, l'adresse du visiteur étant
aussi celle de Yann. Contrôle dans Gmail, en-têtes lus dans la source du message.

| Contrôle | Message propre | Message avec `https://partagepro.online/fr/b2b/jkd31` |
|---|---|---|
| Réponse au visiteur | « Email envoyé avec succès! » | Identique, rien ne trahit le tri |
| Objet | `Nouveau message provenant du site jkd-selfdefense31.fr` | `[À VÉRIFIER] Nouveau message provenant du site jkd-selfdefense31.fr` |
| `Reply-To` | Adresse du visiteur | Absent |
| Destinataires | Boîte de test seule, pas de copie | Boîte de test seule, pas de copie |
| Bandeau | Aucun | « Message à vérifier avant toute action », motif affiché |
| Lien du message | Sans objet | `hxxps://partagepro[.]online/fr/b2b/jkd31`, ni lien ni texte `partagepro.online` dans la source |
| Confirmation au visiteur | Reçue | Aucune, dossier spam compris |
| SPF, DKIM, DMARC | pass | pass |

L'expéditeur de préproduction `no-reply@jkd-selfdefense31.fr` passe par Gandi sans
rejet. Fanny n'a rien reçu : hors production, le code n'adresse le mail du bureau
qu'à `DEV_TEST_EMAIL`, ce que confirment les en-têtes `To` sans `Cc`.

Deux constats propres à Gmail :

- **Le mail signalé rejoint la conversation des mails propres.** Gmail range dans une
  même conversation les mails d'un même expéditeur au même objet, en ignorant le
  préfixe entre crochets. La liste affiche alors l'objet sans `[À VÉRIFIER]`. Le
  bandeau reste visible à l'ouverture et dans l'aperçu de la liste. Corrigé, voir
  « Objet des messages signalés » ci-dessous.
- **Gmail rend cliquable l'adresse du visiteur** dans le mail signalé, alors que la
  source n'a aucun `mailto:`. Le clic ouvre un brouillon de réponse, jamais une
  page web. Accepté : le bandeau dit déjà de vérifier l'expéditeur avant de répondre.

### Objet des messages signalés

Décision de Yann : séparer les conversations. L'objet d'un message signalé devient
`[À VÉRIFIER] Message signalé sur le site jkd-selfdefense31.fr`
(`SUSPECT_SUBJECT`, `lib/contact-admin-email.ts`). Le préfixe reste pour les
messageries qui l'affichent, et le texte qui suit diffère de celui d'un message
propre, ce qui suffit à Gmail pour ouvrir une autre conversation. Les messages
signalés se regroupent entre eux, à part des demandes ordinaires.

Un test pose la règle plutôt que le texte : sans le préfixe entre crochets, l'objet
d'un message suspect ne doit ni égaler ni contenir celui d'un message propre. Une
retouche future du libellé ne peut donc pas recréer le regroupement en silence.

Vérifié sur la preview du commit `5012a31` (`jkd-31-eu065gzvj-yann-pro.vercel.app`)
avec un nouvel envoi contenant le même lien : Gmail l'a rangé dans une conversation
à part, et la liste affiche `[À VÉRIFIER] Message signalé sur le site
jkd-selfdefense31.fr`. Pas de nouvelle confirmation reçue.

## Mise en production

PR #37 mergée dans `main` le 13 novembre 2026 sur décision de Yann (commit de
merge `11de9c3`, quatre commits : `ee7b327`, `863f712`, `5012a31`, `dfa197a`).
Checks au vert avant le merge : GitGuardian, Vercel.

Contrôle après déploiement, sans aucun envoi, car un envoi en production part chez
Fanny :

- `https://www.jkd-selfdefense31.fr/` et `/contact` répondent 200, le formulaire est
  présent.
- Le domaine sert le nouveau déploiement : même identifiant de build
  (`czdOi-t0m-6aufy5ZV2VT`) sur le domaine et sur l'URL du déploiement de production.

## SPF : retrait de `amazonses.com`

Fait le 13 novembre 2026 dans la zone LiveDNS de Gandi, sur accord de Yann
conditionné à la vérification que Resend ne sert plus.

| Vérification | Constat |
|---|---|
| Code | Aucune mention de Resend, ni dépendance. Retiré le 17 septembre 2024 (`35e08ee`, passage à nodemailer). |
| Vercel | Aucune variable Resend dans le projet `jkd-31`. |
| DNS de Resend | `send.jkd-selfdefense31.fr` n'a pas de SPF, et son MX vaut `feedback-smtp.us-east-1.amazonses.com.jkd-selfdefense31.fr` : nom saisi sans point final, donc complété par le domaine. Resend ne peut pas valider le domaine avec ces enregistrements. |
| Rôle de l'include | Resend vérifie le SPF sur `send.jkd-selfdefense31.fr`, son domaine d'enveloppe, jamais sur le domaine racine. `include:amazonses.com` à la racine ne servait donc à rien, même du temps de Resend. Il autorisait seulement l'infrastructure Amazon SES à passer le SPF du domaine. |
| Envoi actuel | Le site passe par le SMTP de Gandi, couvert par `include:_mailcust.gandi.net` : SPF `pass` constaté sur la preview. |

| | Valeur |
|---|---|
| Avant | `v=spf1 include:_mailcust.gandi.net include:amazonses.com ~all` |
| Après | `v=spf1 include:_mailcust.gandi.net ~all` |

L'enregistrement `google-site-verification` voisin est inchangé. Le TTL est de
300 secondes.

Restent dans la zone deux traces de Resend, laissées en place à ce stade : la clé
DKIM `resend._domainkey` et le MX cassé de `send`.

`jkd-self-defense-31.fr` (avec tirets) n'est pas à l'association : Gandi ne gère que
`jkd-selfdefense31.fr` et `.com`, et le registre AFNIC répond toujours 404 pour le
nom avec tirets le 13 novembre.

## Reste

| Action | Qui | Où |
|---|---|---|
| Au premier vrai message reçu : une ligne `contact_screening` dans les logs, et pas d'avertissement `[contact] RATE_LIMIT_SECRET absent` | Yann ou un agent | Logs Vercel |
| DMARC : adresse de rapports, quelques semaines de lecture, puis `p=quarantine` | Yann | DNS Gandi |
| Acheter `jkd-self-defense-31.fr` et le rediriger vers le site, pour les mails déjà envoyés | Décision de Yann | Gandi |
| L'objet et l'expéditeur du mail reçu par Fanny, pour confirmer que le formulaire était la porte d'entrée | Yann | Boîte de réception |
