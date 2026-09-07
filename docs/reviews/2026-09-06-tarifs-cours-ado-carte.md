# Page tarifs : cours ado, stages, accès et carte (6 septembre 2026)

> Trois demandes de contenu et une refonte de la section « Nous trouver ».
> Branche `develop`, à livrer par PR vers `main`.

## Contenu

| Demande | Où | Fait |
|---|---|---|
| Tranche d'âge « 13 - 15 ans » sous « Cours ado » | `data/courses.json`, champ `subtitle` | Affiché par `PriceShow` comme les autres sous-titres. Le tableau des horaires et le JSON-LD n'utilisent pas ce champ. |
| « Stages (~2) avec David DELANNOY compris » | `data/courses.json`, 3 occurrences (Cours ado, Jeet Kune Do, Self-défense féminine) | Remplacement strict de l'ancienne phrase. |
| Nouvelle photo d'accès (portail vert) | `public/images/content/tarifs/jkd-batiment-acces-sans-txt.png` | Version sans texte incrusté (794 × 283), fichier renommé sans accent : un `é` dans une URL publique se retrouve encodé différemment selon le navigateur et le CDN. L'ancienne `local-nous-trouver.png` est supprimée. |
| Plan d'accès (vue satellite annotée) | `public/images/content/tarifs/jkd-plan-d-acces.png` | Placé au-dessus de la photo, sous le titre « Plan d'accès ». Sa hauteur donne à la carte Google la place d'une vraie carte. |

La consigne « Passer par le portail vert… » est un texte réel sous la photo
(`figcaption`), lisible par les lecteurs d'écran et les moteurs. Chaque cadre
reprend le ratio exact de son image pour ne rien rogner sur desktop.

## Carte « Nous trouver »

Avant : deux images statiques, dont une capture de carte non cliquable.

Après, dans `find-us-map.tsx` :

1. **Adresse en clair** au-dessus de la carte, issue de `associationConfig.venue`
   (même source que le JSON-LD).
2. **« Itinéraire »** : lien Maps URLs officiel (`/maps/dir/?api=1&destination=`).
   Sur mobile il ouvre l'application Google Maps si elle est installée, sinon le
   site. C'est le geste attendu d'un visiteur qui cherche le club.
3. **« Ouvrir dans Google Maps »** : lien vers la fiche du lieu
   (`/maps/search/?api=1&query=`), pour enregistrer l'adresse ou voir les avis.
4. **Carte interactive à la demande** : un aperçu local (`map.png`) et un bouton
   « Afficher la carte interactive ». L'iframe Google Maps n'est créée qu'après
   le clic, et le texte sous le bouton prévient qu'une connexion à Google sera
   établie.

Le point 4 respecte `docs/seo/governance/analytics-and-rgpd.md` §6 : aucun widget
Google Maps chargé automatiquement, liens externes préférés à l'embed. Vérifié
dans le navigateur : avant le clic, la seule ressource tierce de la page est
`va.vercel-scripts.com` (Vercel Analytics, déjà autorisé).

**Cibler la fiche du club, pas le gymnase.** Première version : requête sur
« Gymnase Albert Camus » et son adresse. Google renvoyait la fiche du club de
tir à l'arc, une autre association du même gymnase. Correctif :

- « Itinéraire » et la carte intégrée cherchent « JKD Self Defense 31 » suivi
  de l'adresse. Vérifié dans Google Maps : la recherche et l'itinéraire tombent
  sur la fiche du club (« JKD Self Defense 31, Association Ji Dao, 6 Rue Pierre
  Bauduc »).
- « Ouvrir dans Google Maps » utilise l'identifiant de la fiche (`cid`), stocké
  dans `associationConfig.googleMaps.cid`. C'est le seul lien qui ne dépend pas
  d'une recherche. Il se lit dans l'URL de la fiche : seconde moitié de
  `!1s0x…:0x<hex>`, convertie en décimal.

Pas de clé API et pas de coordonnées GPS en dur. Les URLs sont construites par
`lib/maps-links.ts`, fonction pure couverte par `lib/maps-links.test.ts`
(7 tests).

Mesure : les trois actions émettent l'événement `map_click` (déjà prévu dans
la gouvernance) avec `placement` parmi `directions`, `place`, `embed`.

## Vérifications

- `pnpm exec tsc --noEmit`, `pnpm lint` sur les fichiers touchés, `pnpm test`
  (55 tests), `pnpm build` : tout passe.
- Rendu contrôlé dans le navigateur à 1280 px et 375 px : colonnes de même
  hauteur, plan puis photo à gauche, carte de 566 px de haut à droite (324 px
  avant l'ajout du plan), boutons de 44 px de haut sur mobile, iframe créée au
  clic avec le nom du club et le zoom attendus.
- Les captures d'écran du navigateur intégré ressortent noires sur ce poste, la
  vérification s'est faite sur le DOM et les mesures de position. Les
  navigateurs Playwright ne sont pas installés localement (`npx playwright
  install` à lancer pour la suite e2e).

## Suite du 7 septembre : CTA « Nous trouver », tarifs sur l'accueil, ACDAM

### Où mène-t-on vers « Nous trouver »

La section reçoit l'ancre `#nous-trouver` (avec `scroll-mt-20` pour passer sous
le menu fixe). Trois entrées, choisies selon le moment où le visiteur se
demande « où est-ce ? » :

| Entrée | Pourquoi là |
|---|---|
| Page contact, sous le texte d'intro : « Plan d'accès et itinéraire jusqu'au gymnase » | C'est la page de celui qui s'apprête à venir. |
| Bandeau « Rejoindre le club » en fin d'accueil, bouton secondaire « Nous trouver » | Juste après les prix, la question suivante est le lieu. |
| Pied de page : le nom du gymnase devient un lien | Présent sur toutes les pages sans ajouter de bloc. |

**Saut d'ancre corrigé.** Le navigateur vise l'ancre avant que la page soit
stable : les composants qui lisent `useMediaQuery` rendent d'abord la version
mobile, puis la version desktop, et la navigation client remet le défilement
en haut après le rendu. Résultat mesuré : la section finissait 174 px
au-dessus de l'écran. `components/shared/scroll-to-hash.tsx` recale la page
pendant 1,5 s (à chaque variation de hauteur du document et à quelques
échéances fixes), en défilement instantané, et s'arrête au premier geste du
visiteur. Mesuré après correction : section à 80 px du haut, en navigation
directe comme en navigation interne.

### Tarifs sur l'accueil

Bandeau « Rejoindre le club » ajouté en fin de page d'accueil, dans
`app/(client)/(home)/_components/price-summary.tsx`. Cinq cartes compactes
(titre, sous-titre, prix annuel) et deux boutons : « Tarifs et horaires des
cours » vers `/tarifs`, « Nous trouver » vers l'ancre. Placé après les
portraits pour ne pas concurrencer le héros ni l'histoire du Jeet Kune Do,
qui font l'identité de cette page.

Les prix viennent de `data/courses.json` via `lib/price-summary.ts` (fonction
pure, 3 tests), dans le même ordre que la page tarifs. Rien à synchroniser.
Un astérisque signale les cours qui ont un tarif réduit, le détail reste sur
la page tarifs. Composant serveur : les prix sont dans le HTML rendu.

### ACDAM

Constat : l'ACDAM n'était mentionnée nulle part (code, données, docs). Les
fiches tarifs disent seulement « Adhésion à la fédération ». Le club figure
bien sur la page des clubs de l'École Delannoy d'Arts Martiaux.

Ajouts, tous alimentés par `associationConfig.affiliation` :

- pied de page : « Club affilié à l'ACDAM, École Delannoy d'Arts Martiaux »
  avec lien vers l'école ;
- mentions légales : ligne « Affiliation » ;
- JSON-LD `Organization` : champ `memberOf` (test ajouté).

À faire valider par le bureau : le développé exact du sigle ACDAM n'est
publié nulle part de façon officielle, il n'a donc pas été écrit. Si le
bureau le confirme, l'ajouter dans `constant/config.ts`. Reste aussi à
décider si « Adhésion à la fédération » dans `data/courses.json` devient
« Adhésion à l'ACDAM ».

### Vérifications du 7 septembre

`pnpm exec tsc --noEmit`, `pnpm lint` (0 erreur, 3 avertissements
préexistants dans des fichiers non touchés), `pnpm test` (58 tests),
`pnpm build`. Rendu contrôlé à 1280 px et 375 px : bandeau d'accueil sans
débordement, boutons pleine largeur sur mobile, CTA contact présent, ligne
d'affiliation sur `/legal`, `memberOf` dans le JSON-LD rendu.

## Constat hors périmètre

À 1280 px de large, la page `/tarifs` déborde horizontalement de 72 px : la
rangée des cinq cartes de prix ne tient pas dans le conteneur, et c'est la carte
« Self-défense féminine » qui dépasse. Le défaut existe avant ces modifications
(mesure identique avec l'ancien `courses.json`). Non traité ici, à reprendre
séparément : passer la rangée en grille qui replie, ou laisser les cartes
rétrécir.
