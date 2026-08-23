# Revue qualité du 23 août 2026

> Note d'état des lieux et de traçabilité. Elle date ce qui a été constaté, ce qui a été
> corrigé, par quel commit, et ce qui reste à faire. Tout agent (humain ou IA) qui reprend
> le projet doit la lire avant de toucher aux sujets listés ici.

## Contexte

Point de départ : une erreur 500 signalée sur une page événement en production. L'enquête a
montré un problème d'infrastructure, puis une série de défauts de qualité sur le code. Le
travail a été découpé en correctifs immédiats, puis en une revue qualité en trois lots.
Le lot 1 est livré avec cette note. Les lots 2 et 3 sont décrits en fin de document.

Production avant intervention : déploiement du 19 janvier 2026 (Next.js 16.1.3, Node 20.x).

## Correctifs immédiats (hors revue)

| PR | Commit | Sujet | Détail |
|---|---|---|---|
| [#20](https://github.com/thobenayann/jkd-31/pull/20) | `72b3f73` | Crash des routes serveur | Toutes les routes rendues par une fonction Vercel (`/events/[id]`, `/studio`) répondaient 500 avec `Node.js process exited with signal: 11 (SIGSEGV)`. Cause : runtime Node 20 de Vercel sous le déploiement de janvier. Correctif : `engines.node: "24.x"` dans `package.json`. Le réglage Node du dashboard Vercel a ensuite été passé à 24 par Yann. |
| [#21](https://github.com/thobenayann/jkd-31/pull/21) | `0f6b554` | JSON-LD invisible des crawlers | `next/script` injectait les données structurées après hydratation. Balises `<script type="application/ld+json">` natives. |
| [#21](https://github.com/thobenayann/jkd-31/pull/21) | `a506858` | Filtre "3 derniers événements" | Renvoyait les 3 plus anciens (tri croissant puis `slice`). Logique extraite dans `lib/selectEventsByPeriod.ts`, testée. Période par défaut calculée côté serveur : "derniers" s'il n'y a aucun événement à venir hors celui mis en avant. Cartes rendues côté serveur. |
| [#22](https://github.com/thobenayann/jkd-31/pull/22) | `f254452` | Types Sanity périmés | `schema.json` datait d'avant les champs `origin` et `externalUrl`. Schéma réextrait, types régénérés, 7 `as any` supprimés. `sanity-typegen.json` désactive l'augmentation de module `@sanity/client` (inutilisée, et le paquet n'est pas une dépendance directe). |
| [#22](https://github.com/thobenayann/jkd-31/pull/22) | `5771874` | Lint inopérant | `next lint` supprimé par Next 16 et `.eslintrc.json` ignoré par ESLint 9. `eslint.config.mjs` (flat config), script `eslint .`, 15 erreurs corrigées sans changement de comportement. |

## Revue qualité : signaux relevés

Relevés en passant pendant les correctifs ci-dessus, classés par gravité.

| Signal | Emplacement | Gravité | Lot |
|---|---|---|---|
| Lieu et adresse factices dans le JSON-LD `Event` | `event-detail.tsx` | Réelle | 1, corrigé |
| Trois copies du site indexables (`.fr`, `.com`, `jkd-31.vercel.app`), aucune canonical, sitemap en `.com` | global | Réelle | 1, corrigé |
| `robots.txt` absent, sitemap sans événements, dates figées à 2024 | `app/sitemap.ts` | Réelle | 1, corrigé |
| Événement inexistant servi en HTTP 200 | `[eventId]/page.tsx` | Réelle | 1, corrigé |
| `<Image src="">` possible sans visuel | `event-detail.tsx` | Moyenne | 1, corrigé |
| Artefacts générés commités (`build/ts/`, `ds-bundle/`) | racine | Moyenne | 2 |
| `types/sanity.ts`, copie manuelle des types générés | `types/` | Moyenne | 2 |
| Bloc JSX d'état vide dupliqué (deux fois 25 lignes) | `events/page.tsx` | Faible | 2 |
| `sortEventsByDate` et logique inline redondantes avec `selectEventsByPeriod` | `events/page.tsx` | Faible | 2 |
| `formatEventDates` : `switch` de 80 lignes pour 4 cas | `lib/formatEventDate.ts` | Faible | 3 |
| Skeleton de chargement simulé (100 ms) | `event-filter.tsx` | Faible | 3 |
| 8 avertissements ESLint de variables inutilisées | divers | Faible | 3 |
| Aucun test avant le 23 août | global | Moyenne | traité au fil de l'eau |

## Lot 1 : correctness et SEO (livré, PR [#23](https://github.com/thobenayann/jkd-31/pull/23))

Correspond aux tâches 1, 2 et 8 de [`../seo/technical/implementation-plan.md`](../seo/technical/implementation-plan.md).

### Décisions prises

| Décision | Choix | Pourquoi |
|---|---|---|
| Source du domaine canonique | `constant/site.ts`, valeur en dur `https://www.jkd-selfdefense31.fr` | `VERCEL_PROJECT_PRODUCTION_URL` vaut `.com` (premier domaine déclaré sur Vercel). Une constante versionnée ne dépend pas de l'ordre des domaines dans un dashboard. |
| Redirection des autres hôtes | `redirects()` dans `next.config.mjs` avec condition sur `host`, 308 | Versionné et relisible, contrairement à une règle de dashboard. |
| Lieu des événements | Champ optionnel `location` dans le schéma Sanity, pré-rempli avec la salle du club à la création | Le JSON-LD ne doit jamais inventer un lieu. Sans lieu connu, le champ est omis (pas de rich result, mais pas de fausse donnée). |
| Événements externes | Canonical et `url` JSON-LD = URL externe, pas d'`organizer` | La page est une republication ; la page d'origine fait référence. Choix hérité du commit "add external events", conservé. |
| Rétention des événements passés dans le sitemap | 12 mois | Au-delà, aucun intérêt de référencement. |
| Runner de tests | Vitest | `node --test` ne résout pas l'alias `@/` de `tsconfig`. Vitest le lit en une ligne de config et fonctionne sur un projet Next.js (Vite n'est que son moteur de transformation). |
| Nom de la salle | "Salle Albert Camus" (pied de page) | Les descriptions d'événements disent "Gymnase Albert Camus". À trancher selon la fiche Google Business, puis aligner `constant/config.ts`. |

### Changements de code

- `constant/site.ts` : `SITE` et `absoluteUrl()`. Toute URL publique en dérive.
- `constant/config.ts` : `venue` structuré (nom, rue, CP, ville, pays) pour schema.org et Sanity.
- `next.config.mjs` : redirections 308 de `www.jkd-selfdefense31.com`, `jkd-selfdefense31.com`, `jkd-31.vercel.app`.
- `app/robots.ts` : tout autorisé sauf `/studio/`, référence au sitemap.
- `app/sitemap.ts` + `lib/sitemap-entries.ts` : routes statiques + événements publiés, `lastModified` depuis `_updatedAt`.
- `alternates.canonical` sur chaque layout ; `metadataBase` depuis `SITE`.
- `app/(admin)/layout.tsx` : `robots: noindex, nofollow`. `app/(admin)/studio/[[...tool]]/metadata.ts` supprimé (jamais importé).
- `lib/structured-data.ts` : `buildEventJsonLd`, `buildOrganizationJsonLd`, `buildWebSiteJsonLd`, `buildSportsLocationJsonLd`, `serializeJsonLd` (échappe `<`).
- `components/seo/json-ld.tsx` : balise native.
- `app/(client)/events/[eventId]/page.tsx` : `notFound()`, métadonnées sans image vide.
- `app/(client)/events/_components/event-detail.tsx` : JSON-LD via le générateur, pas d'`<Image>` sans `src`.
- `sanity/schemas/event.ts` : champ `location`, `initialValue` au niveau document.
- `scripts/backfill-event-location.mjs` : renseigne la salle du club sur les internes sans lieu (simulation par défaut, `--apply` pour écrire).

### Changements de données Sanity (dataset `production`, 23 août 2026)

| Document | `location` renseigné |
|---|---|
| 6 événements internes (`0f61c110`, `40d6963b`, `4fefbb49`, `541b342c`, `72723159`, `b8c3c7ba`) | Salle Albert Camus, 6 Rue Pierre Bauduc, 31600 Muret |
| `076fddca` Stage de printemps 2026 | Salle Mystère, complexe Jacqueline Auriol, 40 avenue Henri Peyrusse, 31600 Muret (lu dans la description) |
| `d83cc058` Bootcamp Téléthon 2023 | Lac du Four de Louge, 31600 Muret (lu dans la description) |
| 5 événements externes | **Non renseignés.** À saisir dans le Studio par Yann. |

### Vérifications faites sur build de production local

`robots.txt` correct ; sitemap 13 URLs, toutes en `.fr`, 6 événements, aucun `/studio` ; canonical `.fr` sur les 7 routes statiques et les pages événement ; JSON-LD `Organization`, `WebSite`, `SportsActivityLocation` sur toutes les pages, `Event` complet sur un interne et sans lieu ni organisateur sur un externe ; `/events/inexistant` → 404 ; `/studio` → `noindex, nofollow` ; hôtes `.com` et `vercel.app` → 308 vers `.fr` avec query string conservée. `tsc`, `pnpm lint` (0 erreur), `pnpm test` 22/22, `pnpm build` OK.

## Actions manuelles restantes

- [ ] Search Console : vérifier la propriété `https://www.jkd-selfdefense31.fr`, soumettre `/sitemap.xml`.
- [ ] Studio Sanity : renseigner le lieu des 5 événements externes.
- [ ] Fiche Google Business : trancher "Salle" ou "Gymnase" Albert Camus ; aligner nom, adresse, téléphone, horaires avec `constant/config.ts` (cohérence NAP).
- [ ] Après quelques semaines : contrôler dans Search Console que `.com` et `vercel.app` disparaissent de l'index.

## Lots suivants (non commencés)

**Lot 2, dette structurelle** : sortir `build/ts/` et `ds-bundle/` du dépôt ou justifier leur présence ; supprimer `types/sanity.ts` ; factoriser `events/page.tsx` (état vide dupliqué, tri redondant avec `selectEventsByPeriod`).

**Lot 3, lisibilité** : `formatEventDates` ; skeleton artificiel de `event-filter.tsx` ; 8 avertissements ESLint.

Chaque lot commence par un état des lieux écrit validé par Yann, puis une PR avec tests.
