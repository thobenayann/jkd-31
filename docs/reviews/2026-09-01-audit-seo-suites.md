# Suites de l'audit SEO du 1er septembre 2026

> Vérification point par point d'un audit externe, puis correctifs. Chaque
> constat a été recoupé dans le code et sur la production avant d'agir.

Contexte : PR [#25](https://github.com/thobenayann/jkd-31/pull/25) mergée et
déployée. L'audit lit bien les nouveaux titres, donc il porte sur l'état courant.

## Vérification des constats

| Constat de l'audit | Verdict | Détail |
|---|---|---|
| Liens `href="#"` sur Bruce Lee, Dan Inosanto, David Delannoy | **Confirmé, diagnostic à nuancer** | 3 occurrences en production, toutes issues de `card-personality.tsx`. Ce ne sont pas des liens morts qui gaspillent le maillage : ils portent un `onClick` avec `preventDefault` et ouvrent la fiche détaillée. C'est un bouton déguisé en lien. |
| Footer daté « ©2024 » | **Confirmé** | Année écrite en dur. |
| Drapeaux en `alt="flag"` | **Confirmé** | 6 occurrences, un seul composant. |
| JSON-LD `SportsActivityLocation` à implémenter | **Faux pour l'essentiel** | Déjà présent depuis le 23 août, avec l'adresse du Gymnase Albert Camus, le téléphone, l'email et les profils sociaux. L'audit annonçait lui-même ce point comme « NON VÉRIFIÉ, récupération bloquée par la politique réseau », et a recommandé quand même. Manquait réellement : les horaires. |
| Home structurée autour de l'histoire du JKD, pas de l'offre | **Confirmé** | Un seul H2, puis des H3 nominatifs. Traité à part, voir plus bas. |
| Pas de meta robots explicite | Sans objet | L'indexation par défaut est le comportement voulu. `/studio` porte bien `noindex`. |

Leçon de méthode : un audit qui n'a pas pu lire le JSON-LD ne devrait pas
recommander de l'implémenter. Vérifier avant de corriger a évité de réécrire un
bloc qui fonctionnait.

## Correctifs

- `components/shared/card-personality.tsx` : le faux lien devient un
  `<button type="button">`. Le texte visible ne change pas, le nom accessible
  devient « En savoir plus sur Bruce Lee » et contient le texte visible, donc pas
  de `label-content-name-mismatch`. Drapeaux passés en `alt=""` : ils doublent
  une information déjà portée par le nom, et aucune donnée de nationalité
  n'existe dans `personalities-data.json` pour les décrire justement.
- `lib/opening-hours.ts` : les horaires schema.org sont dérivés de
  `data/courses.json` plutôt qu'écrits en dur, pour ne pas créer une seconde
  vérité vouée à diverger de la page tarifs. Une plage par jour, de la première
  ouverture à la dernière fermeture : `openingHoursSpecification` répond à « à
  quelle heure peut-on venir », pas « quel cours a lieu ». Une plage illisible
  est ignorée plutôt que publiée fausse. Six tests.
- `lib/structured-data.ts` : `openingHoursSpecification` ajouté au lieu, omis si
  le planning devient illisible.
- `components/shared/footer.tsx` : année calculée, nom de la salle lu depuis
  `associationConfig.venue`. Réserve : les pages statiques figent l'année au
  build, un déploiement par an suffit à la tenir à jour.

## Vérifié

`lint` 0 erreur, `tsc` propre, **48 tests unitaires**, **56 tests Playwright**
contre un build de production.

Ajouts Playwright : aucun `a[href="#"]` sur les sept routes, année courante dans
le pied de page, et `openingHoursSpecification` présent avec les bonnes valeurs.

Contrôle de non-régression du bouton : `inline-block`, 14 px, poids 600,
`rgb(0, 101, 153)`, padding 0, hauteur 20 px. Identique au lien qu'il remplace.

## Reste ouvert

La recommandation 2 de l'audit, un bloc « Cours, horaires, lieu et tarifs » sur
l'accueil, n'est pas traitée ici. Ce n'est pas un correctif mais une
restructuration de la page d'accueil, déjà spécifiée dans
[`../seo/strategy/content-and-keywords.md`](../seo/strategy/content-and-keywords.md)
section 5.1. Elle demande un arbitrage de Yann sur la forme avant d'être écrite.
