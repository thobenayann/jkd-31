# Formulaire de contact : validation et protection côté serveur (8 novembre 2026)

> Task 6 de [`docs/seo/technical/implementation-plan.md`](../seo/technical/implementation-plan.md).
> Branche `fix/contact-form-validation` issue de `develop` après la montée des
> dépendances (`8689e2d`, nodemailer 10), PR [#35](https://github.com/thobenayann/jkd-31/pull/35) vers `main`.

## 1. État des lieux (avant correctif)

### La faille

`sendEmail` (`services/send-email.ts`) est une server action. Next.js l'expose
comme un point d'entrée POST public : son identifiant figure dans le bundle client,
n'importe qui peut l'appeler sans passer par le formulaire.

La fonction ne valide rien à l'exécution. Le type `EmailFormData` n'existe qu'à la
compilation. `formData.email` part tel quel dans deux champs Nodemailer :

| Envoi | Champ | Conséquence |
|---|---|---|
| Mail de confirmation | `to: formData.email` | Nodemailer accepte une liste séparée par des virgules. `email: "a@x.fr, b@y.fr"` envoie la confirmation à tous ces destinataires. |
| Mail admin | `replyTo: formData.email` | Même liste dans « Répondre à ». |

Le mail de confirmation affiche `Bonjour {firstName} {lastName}`, deux champs libres
choisis par l'appelant. Résultat : un relais de spam qui envoie le texte de son choix
à des destinataires arbitraires depuis la boîte Gandi de l'association. La
réputation du domaine est en jeu, et avec elle la délivrabilité de tous les mails
du club.

### Les autres défauts

| Défaut | Où | Effet |
|---|---|---|
| Aucune limite de taille | `send-email.ts` | Un message de plusieurs centaines de Ko part dans le mail admin. |
| Types non vérifiés | `send-email.ts` | Un tableau ou un objet à la place d'une chaîne arrive jusqu'au rendu du mail. |
| Erreur SMTP renvoyée au visiteur | `send-email.ts` (`catch`) et `contact-form.tsx` (`toast.error(result.error)`) | Le visiteur lit le message brut de Nodemailer, par exemple `SERVER_MAIL and SERVER_MAIL_PASSWORD must be set` ou une réponse d'authentification Gandi. |
| Ni honeypot ni limitation de débit | toute la chaîne | Un robot peut soumettre en boucle. Chaque soumission valide envoie deux mails. |
| Validation seulement côté client | `contact-form.tsx` (React Hook Form) | Contournée par tout appel direct. |

### Ce qui est déjà correct

- **Échappement HTML.** Les mails sont rendus par React Email. React échappe le
  texte inséré entre balises et dans les attributs. Un `<script>` dans le message
  devient `&lt;script&gt;`. Rien à changer, mais un test le prouvera.
- **En-têtes.** Les sujets sont des constantes. L'injection d'en-têtes ne peut
  passer que par l'adresse, que la validation va verrouiller.

## 2. Choix techniques (validés par Yann le 8 novembre 2026)

Les décisions de la Task 6 sont prises (zod, honeypot, limitation de débit par IP,
Turnstile seulement en cas de spam persistant). Cette section précise comment.

| Besoin | Choix | Pourquoi |
|---|---|---|
| Validation | Schéma zod 4 strict dans `lib/validation/contact.ts`, appliqué en tête de la server action | Fonction pure testable sans serveur. `z.strictObject` refuse tout champ inattendu. `z.email()` n'accepte qu'une seule adresse, sans virgule, sans nom affiché, sans retour à la ligne. |
| Prénom, nom | 1 à 50 caractères, lettres de tout alphabet, espaces, apostrophes, tirets, points | Ces deux champs sont les seuls repris dans le mail de confirmation. Refuser chiffres, `@`, `/` et `:` retire toute possibilité d'y glisser un lien. |
| Téléphone | 6 à 20 caractères : chiffres, espaces et `+ . - ( )` | Formats français et internationaux usuels. |
| Message | 2 000 caractères au plus, fins de ligne unifiées, caractères de contrôle retirés | Largement au-dessus d'une demande d'essai. |
| Normalisation | Espaces de début et de fin retirés partout. Espaces multiples réduits à un seul dans les champs d'une ligne | Les limites portent sur la valeur nettoyée, pas sur le bourrage. |
| Honeypot | Champ `website` hors écran, `tabIndex={-1}`, `autoComplete="off"`, masqué aux lecteurs d'écran | Placé hors écran plutôt qu'en `display:none`, que certains robots savent ignorer. S'il est rempli, l'action répond « succès » sans rien envoyer : le robot ne reçoit aucun signal pour s'adapter. |
| Limitation de débit | SDK `@vercel/firewall` (`checkRateLimit`) adossé à une règle WAF Vercel d'identifiant `contact-form` | C'est la capacité Vercel prévue pour compter depuis une fonction. Le compteur vit chez Vercel, pas de base Redis à ajouter. |
| Identifiant haché | Clé = HMAC-SHA256 de l'IP avec le secret `RATE_LIMIT_SECRET` | Le SDK recopie la clé fournie en clair devant son propre hachage. Lui passer l'IP brute la ferait stocker telle quelle. Un simple SHA-256 d'une IPv4 se retrouve par force brute en quelques minutes, le HMAC avec secret non. `RATE_LIMIT_SECRET` est aussi le nom que lit le SDK : un seul secret pour les deux. |
| Fenêtre | 5 envois valides par tranche de 10 minutes et par IP | Un visiteur envoie une demande, deux en cas d'erreur. 5 laisse de la marge à une IP partagée (famille, réseau mobile). |
| Panne du contrôle | Le message part quand même (délai maximal 1,5 s) | Une demande d'essai perdue coûte plus cher qu'un envoi de trop. La validation bloque déjà le relais, la limitation n'est qu'une couche anti-rafale. |
| Hors Vercel | Contrôle ignoré si `VERCEL` n'est pas défini (dev, `next start` local, tests) | En local `next start` tourne en `NODE_ENV=production` et le SDK tenterait d'appeler `https://localhost`. |
| Ordre | Honeypot, puis validation, puis limitation, puis envoi | Seules les soumissions valides consomment le quota, car seules elles coûtent des mails. |
| Résultats | `success`, `invalid` (erreurs par champ), `rate_limited`, `error` | Le client affiche un message adapté. L'erreur SMTP reste dans les logs serveur, jamais dans la réponse. |
| Turnstile | Reporté | Le plan le conditionne à un spam persistant. Aucun n'est constaté à ce jour. |

### Écarts avec le plan

| Plan | Fait | Raison |
|---|---|---|
| `tests/services/send-email.test.ts` | `services/send-email.test.ts`, plus `lib/validation/contact.test.ts` et `services/contact-rate-limit.test.ts` | Le projet place ses tests à côté du code (`lib/*.test.ts`), écart déjà pris à la Task 1. Créer `tests/` pour un seul fichier ouvrirait une seconde convention. `vitest.config.ts` inclura `services/**/*.test.ts`. |
| `pnpm add zod` | `pnpm add zod @vercel/firewall` | Le SDK est la « capacité Vercel adaptée ». |
| Fichiers listés | En plus : `services/contact-rate-limit.ts` | Un fichier `'use server'` ne peut exporter que des fonctions asynchrones appelables. La logique IP et HMAC vit à côté, testée seule. |
| Fichiers listés | En plus : `lib/validation/contact-limits.ts` | Ajouté pendant l'implémentation. Le formulaire client a besoin des limites et du nom du champ piège. Les importer depuis `contact.ts` aurait embarqué zod dans le JavaScript du navigateur. Vérifié après build : aucun chunk client ne contient zod. |

### Ce qui restera à faire à la main (Yann)

1. **Créer la règle WAF** dans Vercel, projet jkd-31, Firewall, nouvelle règle :
   condition `@vercel/firewall` égale à `contact-form`, action Rate Limit, fenêtre
   fixe de 600 s, 5 requêtes, réponse 429. Puis publier.
2. **Ajouter la variable `RATE_LIMIT_SECRET`** (Production et Preview), valeur
   aléatoire d'au moins 32 octets, par exemple `openssl rand -hex 32`.

Tant que l'une des deux manque, le formulaire fonctionne sans limitation (un
avertissement apparaît dans les logs). Validation et honeypot sont actifs dès le
déploiement.

## 3. Réalisé

| Fichier | Rôle |
|---|---|
| `lib/validation/contact.ts` | Schéma zod strict, normalisation, détection du champ piège. Renvoie `valid`, `spam` ou `invalid` avec un message par champ. |
| `lib/validation/contact-limits.ts` | Limites de taille et nom du champ piège, partagés avec le client. |
| `services/contact-rate-limit.ts` | Deux compteurs (IP puis destinataire, voir section 5), HMAC, appel à `checkRateLimit` avec délai de 1,5 s, laisse passer en cas de doute. Répond `ok`, `sender_limited` ou `recipient_limited`. |
| `services/send-email.ts` | Payload `unknown`, ordre honeypot, validation, limitation, envoi. Réponses `success`, `invalid`, `rate_limited`, `error`. Le détail SMTP part dans `console.error`. Pour l'échec de la confirmation, aucun détail n'est journalisé, car la réponse SMTP contient souvent l'adresse du visiteur. |
| `services/email.types.ts` | `EmailFormData` devient l'alias du type validé. Nouveau `ContactFormResult`. |
| `app/(client)/contact/_components/contact-form.tsx` | Champ piège, `maxLength` sur chaque champ, erreurs serveur affichées sous les champs via `setError`, un message par cas. Plus aucun texte d'erreur brut affiché. |
| `vitest.config.ts` | Inclut `services/**/*.test.ts`. |
| `services/README.md` | Variable `RATE_LIMIT_SECRET`, règle WAF, nouveau contrat de la server action. |

Dépendances : `zod` 4.6.7 (déjà présent en dépendance indirecte, seul le
spécificateur s'ajoute au lockfile) et `@vercel/firewall` 1.2.6.

## 4. Vérifications

**Tests (TDD).** Chaque fichier de test a été écrit et vu en échec avant le code.
Le test de la server action échouait sur l'ancien code exactement comme attendu :
l'appel avec `victime1@exemple.fr, victime2@exemple.org` renvoyait un succès et
déclenchait les envois. Le test d'échappement HTML passait dès le départ, ce qui
confirme que React Email échappait déjà.

| Fichier | Tests | Couvre |
|---|---:|---|
| `lib/validation/contact.test.ts` | 60 | Adresses multiples, nom affiché, retour à la ligne, champs vides ou absents, longueurs, normalisation, noms avec lien ou domaine, téléphone, honeypot, champ en trop, payload qui n'est pas un objet, mauvais types. |
| `services/contact-rate-limit.test.ts` | 18 | Deux compteurs vérifiés dans l'ordre (IP puis destinataire, le second non consommé si l'IP est bloquée), clés hachées sans IP ni adresse en clair, IPv6 regroupées par /64, IPv4 notée en IPv6, destinataire sans casse ni `+étiquette`, règles Gmail, `x-forwarded-for` en repli, pas d'appel hors Vercel ou sans secret, laisse passer en cas de panne ou de délai dépassé. |
| `services/send-email.test.ts` | 12 | Nodemailer simulé : succès (admin puis confirmation au seul visiteur), valeurs normalisées, relais refusé sans envoi, champ inattendu, payload non objet, honeypot, expéditeur limité, destinataire saturé (bureau prévenu, confirmation supprimée), panne SMTP sans détail exposé, configuration absente, échec de la seule confirmation, échappement HTML. |

Suite complète : 13 fichiers, 154 tests, tous verts.

**Contrôles statiques.** `pnpm exec tsc --noEmit` passe. `pnpm lint` ne signale
rien dans les fichiers touchés. Restent les 2 erreurs déjà présentes sur
`develop` (`components/ui/3d-card.tsx`, `hooks/use-media-query.ts`) et des
avertissements dans d'autres fichiers.

**Build de production local** (`pnpm build && pnpm start`, sans identifiants
SMTP pour qu'aucun mail réel ne parte) :

| Appel direct de la server action (POST avec en-tête `Next-Action`) | Réponse |
|---|---|
| `email: "victime1@exemple.fr, victime2@exemple.org"` | `invalid`, « Format d'email invalide. » |
| Champ supplémentaire `bcc` | `invalid` |
| Nom « Gagnez sur https://spam.example » | `invalid`, « Le nom ne doit contenir que des lettres. » |
| Message de 2 001 caractères | `invalid` |
| Champ piège rempli | `success`, aucun envoi tenté |
| Formulaire valide, SMTP non configuré | `error`. Le détail ne figure que dans le log serveur. |

Dans le formulaire réel : un nom « Dupont 2 » (accepté par React Hook Form) fait
apparaître l'erreur du serveur sous le champ « Nom ». Un envoi valide sans SMTP
affiche « L'envoi a échoué. Merci de réessayer dans quelques instants. », sans
aucune mention technique. Le champ piège est hors écran (`left: -10024px`),
`tabindex="-1"`, dans un conteneur `aria-hidden="true"`.

**Non vérifié en local** : la limitation de débit réelle. Elle n'agit que sur
Vercel, une fois la règle WAF et le secret en place. Après ces deux étapes, la
contrôler en preview : six envois valides en moins de 10 minutes depuis la même
connexion, le sixième doit afficher « Trop d'envois depuis votre connexion ».

## 5. Revue de sécurité automatique (après ouverture de la PR)

Une revue automatique du commit a relevé deux failles dans le correctif
lui-même. Les deux étaient réelles. Elles sont corrigées avec des tests écrits
et vus en échec avant le code.

| Faille | Scénario | Correctif |
|---|---|---|
| Domaine dans le nom | « Allez sur casino.com » passait : lettres, espaces et points étaient permis. Gmail et Outlook en font un lien cliquable dans le mail de confirmation. | Un point ne peut plus être suivi d'une lettre. « J.-P. » et « J. P. » passent toujours. |
| Contournement de la limite | En IPv6, un abonné dispose d'au moins un bloc /64 et peut changer d'adresse à chaque envoi. Et des milliers d'IP différentes pouvaient viser la même boîte. | IPv6 comptées par bloc /64, IPv4 notée en IPv6 ramenée à l'IPv4. Second compteur par destinataire (casse ignorée, `+étiquette` retirée), sous la même règle `contact-form` : une boîte ne reçoit pas plus de 5 confirmations par fenêtre de 10 minutes, quelle que soit l'origine. |

Un second passage de la revue, sur ce correctif, a relevé deux suites. Elles
aussi étaient réelles et sont corrigées de la même façon (test d'abord) :

| Faille | Scénario | Correctif |
|---|---|---|
| Contournement par Gmail | Gmail ignore les points de la partie locale et traite `googlemail.com` comme `gmail.com`. `j.dupont@gmail.com` et `jd.upont@gmail.com` atteignaient la même boîte avec deux compteurs distincts. | Pour ces deux domaines seulement, points retirés et domaine ramené à `gmail.com` avant hachage. Ailleurs, les points distinguent deux boîtes et sont gardés. |
| Blocage ciblé | Cinq envois au nom de l'adresse de quelqu'un saturaient son compteur, et cette personne ne pouvait plus joindre le club pendant 10 minutes. | Les compteurs sont vérifiés l'un après l'autre. L'IP d'abord : pleine, elle bloque l'envoi sans consommer le compteur du destinataire. Le destinataire ensuite : plein, il ne supprime que le mail de confirmation, le bureau reçoit toujours la demande. |

Les deux compteurs partagent la règle WAF : rien ne change dans les étapes
manuelles. Ils ne se mélangent pas, chaque clé étant le HMAC d'un sujet préfixé
(`ip:` ou `to:`).

## 6. Reste

- Les deux étapes manuelles de la section 2 (règle WAF, `RATE_LIMIT_SECRET`).
- Turnstile, reporté tant qu'aucun spam persistant n'est constaté.
- Le critère de sortie global « Formulaire validé côté serveur, protégé contre
  spam » du plan se coche après le déploiement en production et l'activation de
  la règle.
