# Rentrée 2026-2027 : annonce sur le site et fiche Forum des associations

> Note de travail du 30 août 2026. Trois sujets : ce que vaut réellement le site après
> les correctifs SEO d'août, le contenu à saisir dans le Studio Sanity pour le Forum des
> associations, et la forme que doit prendre l'annonce de rentrée.

## 1. Vérification SEO et robots IA, faite en production

Toutes les vérifications ci-dessous ont été faites le 30 août 2026 sur
`https://www.jkd-selfdefense31.fr`, pas sur le code local. `develop` et `main` sont au
même commit, la production contient donc bien le lot 1 de la revue du 23 août.

### Ce qui est bon

| Contrôle | Résultat |
|---|---|
| `robots.txt` | 200, `Allow: /`, `Disallow: /studio/`, `Host` et `Sitemap` corrects |
| `sitemap.xml` | 13 URLs, toutes en `.fr`, aucune preview Vercel, aucun `/studio` |
| Redirection `jkd-selfdefense31.fr` sans www | 308 vers `www` |
| Redirection `.com` | 308 vers `www.jkd-selfdefense31.fr` |
| Canonical page d'accueil | `https://www.jkd-selfdefense31.fr/` |
| JSON-LD global | `Organization`, `WebSite`, `SportsActivityLocation` présents dans le HTML serveur |
| Contenu lisible sans JavaScript | oui, le texte des pages est dans le HTML rendu par le serveur |
| Chaîne qualité locale | `pnpm test` 22/22, aucun `.com` ni `VERCEL_PROJECT_PRODUCTION_URL` dans les URLs publiques |

Le dernier point est celui qui compte le plus pour les robots IA. GPTBot, ClaudeBot et
PerplexityBot n'exécutent pas JavaScript. Un site dont le contenu n'apparaît qu'après
hydratation leur est invisible. Ici le texte est bien servi par le serveur, et `robots.txt`
ne bloque aucun de ces agents.

### Ce qui ne va pas, vérifié page par page

Nombre de balises `<h1>` dans le HTML servi par le serveur :

| Page | `<h1>` | Attendu |
|---|---:|---:|
| `/` | **0** | 1 |
| `/tarifs` | **47** | 1 |
| `/27-styles` | **60** | 1 |
| `/contact` | **14** | 1 |
| `/events` | **10** | 1 |
| `/association` | 1 | 1 |

Le composant `GradualSpacing` anime le titre lettre par lettre et enveloppe **chaque
caractère dans son propre `<h1>`**. Sur l'accueil, l'animation est cliente : le serveur
n'envoie aucun `<h1>`, et après hydratation le navigateur en compte 39, un par lettre de
« Jeet Kune Do ». Un robot voit donc soit rien, soit du bruit. C'est la tâche 3 du plan
technique, jamais commencée, et c'est aujourd'hui le défaut le plus coûteux du site.

Trois autres écarts confirmés :

| Écart | Détail | Conséquence |
|---|---|---|
| Titres et descriptions non travaillés | Accueil : `Jeet Kune Do Toulouse - Arts Martiaux et Self-Défense`. Le mot Muret n'y est pas, alors que c'est la ville du club. `/tarifs` porte la description de `/association`, mot pour mot. | Tâche 4 du plan. Perte directe de clics sur les requêtes locales. |
| Événements externes dans le sitemap | `/events/17d4b558…` est listé dans le sitemap mais sa canonical pointe vers `https://www.ecole-delannoy.fr`. Cinq fiches sont dans ce cas. | Signal contradictoire envoyé à Google. Il faut soit les sortir du sitemap, soit les passer en `noindex`. |
| Pas de suffixe de marque sur les fiches événement | Le layout n'a pas de `title.template`, donc l'onglet affiche seulement le titre saisi dans Sanity. | Le nom du club disparaît des résultats de recherche sur ces pages. |

### Deux détails de cohérence à trancher

- L'affiche du forum donne `contact@jkd-selfdefense31.fr`, alors que `constant/config.ts`
  déclare `president@jeetkunedo31.com`. Cette adresse alimente le JSON-LD `Organization`
  et la page mentions légales. Il faut une seule adresse publique.
- L'affiche renvoie vers la page Facebook « Jeet Kune Do Toulouse », le site vers
  `facebook.com/jkd.jidao`. Même problème, il faut une seule page.

## 2. Fiche Sanity du Forum des associations

### Choix retenu : origine « Interne »

Le champ `origine` ne décrit pas qui organise, il décrit **à qui appartient la page**.
Un événement externe reçoit une canonical vers le site d'origine, donc la fiche n'est
pas indexée pour elle-même. Or on veut précisément que quelqu'un qui cherche
« forum des associations Muret arts martiaux » tombe sur nous. Le forum est donc saisi
en interne, avec le lieu remplacé.

Réserve à noter : en interne, le JSON-LD déclare `organizer: JKD Self Defense 31`. Le
forum est organisé par la mairie de Muret, nous y tenons un stand. C'est inexact.
Correctif de quinze minutes proposé en partie 4.

### Champs à saisir

| Champ du Studio | Valeur |
|---|---|
| Titre | `Forum des associations de Muret 2026` |
| Slug | `forum-des-associations-muret-2026` |
| Origine | Interne |
| Dates de l'événement | `2026-09-06` |
| Tranches horaires | `10h - 17h` |
| Lieu, nom | `Salle Horizon Pyrénées` |
| Lieu, adresse | `253 avenue des Pyrénées` |
| Lieu, code postal | `31600` |
| Lieu, ville | `Muret` |
| Personnalité | laisser vide |
| Image principale | l'affiche, avec le point de recadrage placé sur la photo des instructeurs |

Le lieu et l'horaire sont confirmés par la mairie de Muret et par la fiche du site
municipal. Ne pas les saisir de mémoire.

**Le point de recadrage compte.** L'aperçu Facebook et l'image Open Graph sont générés en
1200 × 630 à partir de cette image. Une affiche verticale recadrée au centre donnera un
bandeau illisible. Placer le hotspot sur le groupe d'instructeurs en haut de l'affiche.

**Le texte de l'affiche n'est lisible ni par Google ni par une IA.** C'est une image. Tout
ce qui doit être trouvé en recherche doit figurer dans le descriptif ci-dessous.

### Descriptif à coller

Le champ accepte du texte simple. Les doubles sauts de ligne créent des paragraphes, les
simples sauts de ligne créent des retours à la ligne. Pas de gras ni de listes à puces.

```text
Le club JKD Self Defense 31 tient un stand au Forum des associations de Muret, le dimanche 6 septembre 2026 de 10h à 17h à la Salle Horizon Pyrénées. Entrée libre et gratuite, parking gratuit.

Les instructeurs du club sont présents toute la journée. Quel cours choisir, à partir de quel âge, quel niveau physique faut-il, comment se passe un premier cours : venez poser vos questions, sans rendez-vous et sans engagement.

Ce que nous enseignons
Le Jeet Kune Do, l'art martial créé par Bruce Lee, ainsi que le Kali philippin, le Silat et le JKD Boxing (Jun Fan Kick Boxing). Le club propose aussi de la self-défense féminine, de la self-défense mixte et un cours ados de 13 à 15 ans.

Nos cours à Muret
Les entraînements ont lieu au Gymnase Albert Camus, 6 rue Pierre Bauduc à Muret, les mardis, mercredis et jeudis en soirée. La reprise de la saison 2026-2027 a lieu le RENTREE_A_CONFIRMER.

Venir essayer
Si vous ne pouvez pas passer au forum, écrivez-nous depuis la page contact du site ou appelez le 06 84 05 93 26. Nous répondons à toutes les demandes, y compris celles de personnes qui n'ont jamais pratiqué.
```

Remplacer `RENTREE_A_CONFIRMER` par la date réelle avant publication.

La première phrase est celle qui sera reprise comme meta description par Google, parce
que le code envoie le descriptif entier dans la balise. Elle a donc été écrite pour tenir
seule : discipline, ville, date, heure, lieu, gratuité.

## 3. L'annonce de rentrée : forme et emplacement

### Recommandation

**Un bandeau d'annonce affiché sur toutes les pages, piloté depuis Sanity, avec une
fenêtre d'affichage.**

Trois raisons de trancher ainsi plutôt que de poser un encart sur l'accueil :

1. La question « quand est-ce que ça reprend » se pose sur n'importe quelle page.
   Aujourd'hui `/tarifs` est la deuxième page la plus consultée, et quelqu'un qui arrive
   dessus depuis Google ne verra jamais un encart posé sur l'accueil.
2. Piloté depuis Sanity, le texte se change sans déploiement. C'est ce qui fait la
   différence entre une annonce utilisée et une annonce oubliée.
3. Une fenêtre d'affichage (`visible du` / `visible jusqu'au`) fait disparaître le
   bandeau tout seul. C'est ce qui tue la plupart des bandeaux d'annonce : ils restent
   affichés jusqu'en mars.

Pas de bouton pour fermer le bandeau en version 1. Une pièce mobile de moins, et il
expire de lui-même.

### Emplacement exact

Tout en haut du contenu, avant le titre de page. Sur mobile la barre de navigation est
en bas de l'écran, le haut est donc libre. Sur desktop la barre est fixe en haut, le
bandeau se place juste en dessous et défile avec la page.

### Texte du bandeau

```text
Rentrée le RENTREE_A_CONFIRMER au Gymnase Albert Camus. Rencontrez-nous au Forum des associations le dimanche 6 septembre.
```

Lien : `Horaires, tarifs et premier cours` vers `/tarifs`.

### Spécification technique

Nouveau document Sanity `annonce`, en singleton.

| Champ | Type | Rôle |
|---|---|---|
| `message` | `text` | le texte du bandeau, une à deux phrases |
| `ctaLabel` | `string` | libellé du lien, décrit la destination |
| `ctaHref` | `string` | chemin interne du site |
| `visibleFrom` | `datetime` | début d'affichage |
| `visibleUntil` | `datetime` | fin d'affichage, obligatoire |

Rendu côté serveur dans `app/(client)/layout.tsx`, au-dessus de `{children}`. La fenêtre
d'affichage se calcule dans une fonction pure de `lib/`, testée, conformément à la règle
du projet qui interdit la logique métier dans les composants. Revalidation à l'heure,
comme le sitemap.

Charge estimée : une demi-journée, tests compris.

### Les deux autres emplacements, dans le même chantier

- **Un bloc rentrée en haut de `/tarifs`** : date de reprise, ce qu'il faut apporter au
  premier cours, comment demander un essai. C'est la page où la décision se prend, et
  elle contient déjà les horaires.
- **La fiche événement du forum** sert de page d'atterrissage pour ceux qui arrivent de
  Facebook ou de l'affiche. C'est la partie 2 de cette note.

Une même grille : on met l'information là où la question se pose.

### Ce qu'il manque pour publier

Quatre informations que je ne peux pas inventer :

1. la date exacte de reprise des cours ;
2. le premier cours d'essai est-il gratuit, et combien de séances d'essai sont offertes ;
3. l'adresse email publique retenue, celle de l'affiche ou celle du code ;
4. la page Facebook retenue.

## 4. Ce qui reste à faire, par ordre de rendement

| Priorité | Action | Charge | Pourquoi maintenant |
|---|---|---|---|
| P0 | Corriger `GradualSpacing` : un seul `<h1>` par page, caractères animés en `span[aria-hidden]` | 0,5 j | Tâche 3 du plan. 47 `<h1>` sur `/tarifs`, 0 sur l'accueil. Rien d'autre ne rattrape ça. |
| P0 | Titres et descriptions par page, avec Muret | 0,5 j | Tâche 4. `/tarifs` porte la description de `/association`. |
| P0 | Bandeau d'annonce Sanity | 0,5 j | Partie 3. La fenêtre de rentrée dure six semaines. |
| P1 | Sortir les événements externes du sitemap | 1 h | Leur canonical pointe ailleurs, ils n'ont rien à y faire. |
| P1 | `title.template` `%s \| JKD Self Defense 31` dans le layout | 15 min | Le nom du club manque sur les fiches événement. |
| P1 | Champ `organizer` optionnel dans le schéma événement | 15 min | Ne pas déclarer le club organisateur d'un forum municipal. |
| P1 | Page `/cours-essai` | 1 j | Page P0 de la stratégie de contenu, cible « cours d'essai arts martiaux Muret ». Le bandeau pointera dessus une fois publiée. |
| P2 | Routage des fiches événement par slug au lieu de l'identifiant Sanity | 0,5 j | `/events/forum-des-associations-muret-2026` au lieu de `/events/076fddca-54ea-…`. Le champ `slug` existe déjà et n'est pas utilisé. Nécessite des redirections 308 depuis les anciennes URLs. |
| P2 | Fusionner la tranche horaire dans `startDate` du JSON-LD | 1 h | `startDate` vaut aujourd'hui `2026-09-06` sans heure, alors que `timeSlots` contient `10h - 17h`. |
| P2 | Meta description dédiée pour les événements | 1 h | Le descriptif entier part dans la balise, Google la tronque. |

## Sources

- [Salle événementielle Horizon Pyrénées, mairie de Muret](https://www.mairie-muret.fr/vie-economique-ville-de-muret/salle-evenementielle-horizon-pyrenees)
- [Forum des associations, agenda de la mairie de Muret](https://www.mairie-muret.fr/muret-bouge/evenements-agenda-ville-de-muret/588-forum-des-associations)
- [Salle Horizon, 253 avenue des Pyrénées, Muret](https://www.waze.com/live-map/directions/salle-horizon-avenue-des-pyrenees-253-muret?to=place.w.852402.8589560.24577972)
- [`docs/seo/technical/implementation-plan.md`](../technical/implementation-plan.md), tâches 3, 4 et 8
- [`docs/reviews/2026-08-23-revue-qualite.md`](../../reviews/2026-08-23-revue-qualite.md)
- [`docs/seo/strategy/content-and-keywords.md`](../strategy/content-and-keywords.md), briefs `/cours-essai` et `/tarifs`
