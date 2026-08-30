# JKD 31 — SEO, tracking and performance implementation plan

> **For the developer:** Required skill: use `superpowers:executing-plans` to implement this plan task by task, with a review checkpoint after each phase.

**Goal:** corriger les défauts SEO bloquants, mesurer les demandes d'essai, améliorer le LCP mobile et rendre la base Next.js vérifiable en continu.

**Architecture:** conserver Next.js App Router, Sanity, Vercel Analytics et Speed Insights. Centraliser l'identité canonique du site, produire les métadonnées depuis cette source, isoler le tracking dans une petite couche cliente et valider toute donnée de formulaire côté serveur. GA4, GTM et les pixels publicitaires sont hors périmètre ; toute évolution du tracking doit respecter `docs/seo/governance/analytics-and-rgpd.md`.

**Stack:** Next.js 16, React 19, TypeScript 5.9, Sanity 5, Vercel Analytics, Speed Insights, Nodemailer, ESLint 9.

**Baseline du 14 juillet 2026:** build et `tsc` passent ; ESLint ne démarre pas ; Lighthouse SEO 100 malgré des défauts d'indexation ; LCP terrain p75 2,10 s mobile ; 6 123 vues et 1 719 visiteurs sur 365 jours ; aucun événement de conversion.

## Vue d'ensemble du chantier

| Phase | Lots | Priorité | Charge indicative | Résultat attendu |
|---|---|---:|---:|---|
| 1 | 1 à 4 | P0 | 2 à 3 j | crawl, canonisation, titres et accessibilité fiables |
| 2 | 5 et 6 | P0/P1 | 2 à 3 j | conversions mesurées et formulaire durci |
| 3 | 7 et 8 | P1 | 2 à 4 j | LCP mobile et données structurées locales améliorés |
| 4 | 9 et 10 | P1/P2 | 2 à 3 j | qualité automatisée et pilotage mensuel reproductible |

Les charges excluent la rédaction des nouvelles pages métier, la récupération des accès Google et les délais de validation de la présidente.

---

### Task 1: Centraliser le domaine canonique

> **Réalisé le 23 août 2026** (PR [#23](https://github.com/thobenayann/jkd-31/pull/23)). Détail et écarts : [`../../reviews/2026-08-23-revue-qualite.md`](../../reviews/2026-08-23-revue-qualite.md). Écart : le test vit dans `lib/sitemap-entries.test.ts`, pas dans `tests/seo/`.

**Files:**
- Create: `constant/site.ts`
- Modify: `app/(client)/layout.tsx`
- Modify: `app/sitemap.ts`
- Test: `tests/seo/site-config.test.ts`

- [x] Installer un runner de tests léger : `pnpm add -D vitest`.
- [x] Ajouter les scripts `test` et `test:run` dans `package.json`.
- [x] Écrire un test qui exige `https://www.jkd-selfdefense31.fr`, sans slash final, et interdit toute URL `.com`.
- [ ] Lancer `pnpm test:run tests/seo/site-config.test.ts` et constater l'échec.
- [x] Créer une constante indépendante de `VERCEL_PROJECT_PRODUCTION_URL` :

```ts
export const SITE = {
  name: "JKD Self Defense 31",
  url: "https://www.jkd-selfdefense31.fr",
  locale: "fr_FR",
} as const;
```

- [x] Utiliser `new URL(SITE.url)` pour `metadataBase` dans le layout.
- [x] Remplacer toutes les bases d'URL de `app/sitemap.ts` par `SITE.url`.
- [x] Exécuter `rg -n "jkd-selfdefense31\.com|VERCEL_PROJECT_PRODUCTION_URL" app constant` ; aucun résultat ne doit alimenter les URLs SEO publiques.
- [x] Exécuter le test puis `pnpm exec tsc --noEmit`.
- [ ] Commit proposé : `fix(seo): centralize canonical site URL`.

### Task 2: Produire robots, sitemap et canonicals valides

> **Réalisé le 23 août 2026** (PR [#23](https://github.com/thobenayann/jkd-31/pull/23)). Détail et écarts : [`../../reviews/2026-08-23-revue-qualite.md`](../../reviews/2026-08-23-revue-qualite.md). Reste la soumission Search Console (action manuelle). Ajout non prévu : redirection 308 des hôtes `.com` et `vercel.app` dans `next.config.mjs`.

**Files:**
- Create: `app/robots.ts`
- Modify: `app/sitemap.ts`
- Modify: `app/(client)/layout.tsx`
- Modify: `app/(client)/association/layout.tsx`
- Modify: `app/(client)/tarifs/layout.tsx`
- Modify: `app/(client)/contact/layout.tsx`
- Modify: `app/(client)/events/layout.tsx`
- Modify: `app/(client)/legal/layout.tsx`
- Modify: `app/(client)/27-styles/layout.tsx`
- Modify: `app/(admin)/studio/[[...tool]]/metadata.ts`
- Test: `tests/seo/metadata.test.ts`

- [x] Tester que toutes les routes publiques ont une canonical `.fr` et que `/studio` porte `noindex, nofollow`.
- [x] Créer `app/robots.ts` avec `host`, `sitemap`, autorisation générale et désautorisation de `/studio/`.
- [x] Ajouter `alternates.canonical` dans les métadonnées de chaque route.
- [x] Remplacer les dates figées du sitemap par de vraies dates ou les omettre.
- [x] Ajouter les fiches événements publiées au sitemap depuis Sanity ; ne pas inclure les événements expirés sans utilité durable.
- [x] Vérifier après build : `pnpm build`, puis contrôler `/robots.txt` et `/sitemap.xml` sur un serveur de production local.
- [x] Vérifier qu'aucune URL `.com`, preview Vercel ou `/studio` ne figure dans le sitemap.
- [ ] Après déploiement, soumettre `https://www.jkd-selfdefense31.fr/sitemap.xml` dans Search Console.
- [ ] Commit proposé : `fix(seo): publish canonical metadata and crawl directives`.

### Task 3: Réparer la hiérarchie des titres et l'accessibilité du menu

> **Réalisé le 30 août 2026.** Détail : [`../../reviews/2026-08-30-titres-metadonnees-annonce.md`](../../reviews/2026-08-30-titres-metadonnees-annonce.md). Écarts : le test vit dans `components/ui/gradual-spacing.test.tsx` et rend du HTML serveur avec `renderToStaticMarkup`, sans `@testing-library` ni `jsdom`. Lighthouse accessibilité non relancé.

**Files:**
- Modify: `components/ui/gradual-spacing.tsx`
- Modify: `components/shared/menu.tsx`
- Modify: `components/shared/contact-button.tsx`
- Test: `tests/components/gradual-spacing.test.tsx`
- Test: `tests/components/menu.test.tsx`

- [x] ~~Ajouter `@testing-library/react`, `@testing-library/jest-dom` et `jsdom`~~ : non retenu. `renderToStaticMarkup` teste le HTML servi, c'est-à-dire exactement ce que voient les robots, sans nouvelle dépendance.
- [x] Écrire un test qui rend `GradualSpacing` et exige un seul heading, jamais un heading par caractère.
- [x] Faire accepter au composant un élément sémantique (`span`, `p`, `h1`, `h2`) ; valeur par défaut `span`.
- [x] Garder les caractères animés dans des `span[aria-hidden=true]` et fournir le libellé complet au lecteur d'écran.
- [x] Dans le menu global, ne rendre aucun H1. Réserver un H1 unique au contenu principal de chaque page.
- [x] Corriger le lien événements : son nom accessible doit inclure le texte visible.
- [ ] Remplacer l'imbrication `<button><a>` du CTA par un seul `Button asChild` contenant le lien.
- [x] Garantir une cible d'au moins 44 × 44 px et une indication de focus visible.
- [ ] Exécuter les tests puis un Lighthouse accessibilité mobile ; objectif 100 sans `label-content-name-mismatch` ni `target-size`.
- [ ] Commit proposé : `fix(a11y): restore semantic headings and menu controls`.

### Task 4: Renforcer les métadonnées éditoriales

> **Réalisé le 30 août 2026.** Détail : [`../../reviews/2026-08-30-titres-metadonnees-annonce.md`](../../reviews/2026-08-30-titres-metadonnees-annonce.md). Ajout non prévu : `title.template` au niveau du layout racine, qui suffixe automatiquement les fiches événement.

**Files:**
- Modify: `app/(client)/layout.tsx`
- Modify: `app/(client)/association/layout.tsx`
- Modify: `app/(client)/tarifs/layout.tsx`
- Modify: `app/(client)/contact/layout.tsx`
- Modify: `app/(client)/events/layout.tsx`
- Modify: `app/(client)/events/[eventId]/page.tsx`
- Test: `tests/seo/metadata.test.ts`

- [x] Définir le titre d'accueil : `Jeet Kune Do et self-défense à Muret | JKD Self Defense 31`.
- [x] Rédiger pour chaque route un title unique, une description locale et un Open Graph cohérent.
- [x] Générer les métadonnées événement depuis Sanity avec titre, date, image, description et canonical stable.
- [ ] Ajouter des images alternatives descriptives ; éviter la répétition de mots-clés.
- [x] Tester unicité, longueur raisonnable et présence de `Muret` sur les pages d'intention locale.
- [x] Valider le HTML rendu, pas seulement les objets TypeScript.
- [ ] Commit proposé : `feat(seo): localize route metadata`.

### Task 5: Mesurer le parcours vers le cours d'essai

**Files:**
- Create: `lib/analytics.ts`
- Create: `components/analytics/tracked-link.tsx`
- Modify: `components/shared/contact-button.tsx`
- Modify: `app/(client)/contact/_components/contact-form.tsx`
- Modify: `app/(client)/tarifs/page.tsx`
- Modify: `app/(client)/tarifs/_components/find-us.tsx`
- Modify: `components/shared/footer.tsx`
- Modify: `app/(client)/events/_components/event-detail.tsx`
- Test: `tests/analytics/events.test.ts`

- [ ] Définir une union TypeScript fermée pour les noms d'événements et des propriétés non sensibles.
- [ ] Interdire nom, email, téléphone, message libre et toute autre donnée personnelle dans Analytics.
- [ ] Ajouter `sanitizeAnalyticsEvent` et le brancher sur `Analytics.beforeSend` pour supprimer query string/hash et rejeter les routes sensibles selon le document de gouvernance.
- [ ] Tester le mapping des interactions vers : `cta_trial_click`, `contact_form_start`, `contact_form_success`, `contact_form_error`, `phone_click`, `email_click`, `map_click`, `social_click`, `event_contact_click`.
- [ ] Appeler `track()` de `@vercel/analytics` uniquement côté client.
- [ ] Ajouter des propriétés à faible cardinalité : `placement`, `page`, `platform`, `event_type`.
- [ ] Déclencher `contact_form_success` uniquement après réponse positive du serveur.
- [ ] Ajouter des UTM aux liens depuis Facebook, Instagram, Google Business et newsletters : `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.
- [ ] Tester en preview Vercel puis vérifier les événements dans Web Analytics.
- [ ] Documenter le dictionnaire d'événements dans `docs/analytics-events.md`.
- [ ] Commit proposé : `feat(analytics): track trial and contact conversions`.

### Task 6: Valider et protéger le formulaire côté serveur

**Files:**
- Create: `lib/validation/contact.ts`
- Modify: `app/(client)/contact/_components/contact-form.tsx`
- Modify: `services/send-email.ts`
- Modify: `services/email.types.ts`
- Test: `tests/services/send-email.test.ts`

- [ ] Ajouter `zod` : `pnpm add zod`.
- [ ] Écrire des tests serveur pour email invalide, champs vides, longueur excessive, honeypot rempli et payload inattendu.
- [ ] Parser chaque payload dans la Server Action ; ne jamais faire confiance à React Hook Form seul.
- [ ] Normaliser les espaces, limiter strictement les tailles et échapper le contenu envoyé dans l'email HTML.
- [ ] Ajouter un champ honeypot invisible aux humains et ignorer silencieusement les soumissions automatisées.
- [ ] Ajouter une limitation de débit par IP via une capacité Vercel adaptée ; ne stocker qu'un identifiant haché et une courte fenêtre.
- [ ] En cas de spam persistant, intégrer Cloudflare Turnstile avec validation serveur avant envoi.
- [ ] Retourner des états structurés sans exposer d'erreur SMTP ni de secret.
- [ ] Tester succès, rejet et panne de transport avec Nodemailer mocké.
- [ ] Commit proposé : `fix(contact): validate and rate limit submissions`.

### Task 6 bis: Mettre en conformité la page légale et la vidéo tierce

**Files:**
- Modify: `app/(client)/legal/_components/asso-info.tsx`
- Modify: `app/(client)/legal/_components/personal-data.tsx`
- Modify: `app/(client)/legal/_components/cookies-info.tsx`
- Modify: `app/(client)/association/_components/video-section.tsx`
- Create: `app/(client)/association/_components/youtube-consent.tsx`
- Test: `tests/privacy/legal-and-youtube.test.tsx`

- [ ] Faire valider par la présidente l'identité du responsable, l'adresse administrative, l'adresse d'exercice des droits, les destinataires et la durée proposée de 12 mois.
- [ ] Publier finalités, bases légales, catégories, destinataires, durées, droits, CNIL, Vercel, DPA et transferts selon `docs/seo/governance/analytics-and-rgpd.md`.
- [ ] Ajouter la mention courte sous le formulaire sans case de faux consentement.
- [ ] Remplacer l'iframe YouTube initiale par une image locale et un bouton explicite ; ne créer l'iframe qu'après activation.
- [ ] Fournir un lien YouTube direct et une méthode de retrait si le choix est mémorisé.
- [ ] Tester qu'aucune requête YouTube n'est émise avant activation.
- [ ] Commit proposé : `fix(privacy): update legal notice and gate YouTube`.

### Task 7: Optimiser le LCP et le poids des médias

**Files:**
- Modify: `app/(client)/page.tsx`
- Modify: `app/(client)/(home)/_components/home-content-static.tsx`
- Modify: `next.config.mjs` ou le fichier de configuration Next existant
- Modify: `public/images/content/home/home-background.webp`
- Modify: autres médias `public/` supérieurs à 500 Ko après inventaire
- Test: `tests/performance/media-budget.test.ts`

- [ ] Créer un test de budget : aucun raster de contenu au-dessus de 500 Ko, héros mobile cible sous 250 Ko, aucun SVG non optimisé au-dessus de 500 Ko.
- [ ] Remplacer le background CSS du héros par `Image fill`, `priority`, `fetchPriority="high"`, `sizes="100vw"` et `object-cover`.
- [ ] Générer des dimensions adaptées et conserver un recadrage acceptable à 390, 768, 1440 et 1920 px.
- [ ] Optimiser `tree.svg` (~2,58 Mo), `kali.jpg` (~1,74 Mo), `salut-kali` (~1,70 Mo) et les autres actifs lourds avec contrôle visuel.
- [ ] Ne pas charger les images sous la ligne de flottaison en priorité.
- [ ] Relancer Lighthouse dans les mêmes profils. Cibles : LCP laboratoire mobile < 1,2 s, LCP terrain p75 < 1,8 s après 30 jours, CLS ≤ 0,05.
- [ ] Contrôler qu'aucune régression visuelle n'est introduite en clair/sombre et mobile/desktop.
- [ ] Commit proposé : `perf(home): prioritize and compress hero media`.

### Task 8: Ajouter les données structurées locales vérifiables

> **Réalisé le 23 août 2026** (PR [#23](https://github.com/thobenayann/jkd-31/pull/23)). Détail et écarts : [`../../reviews/2026-08-23-revue-qualite.md`](../../reviews/2026-08-23-revue-qualite.md). Écarts : `Event` généré depuis Sanity (fait) mais `BreadcrumbList` non fait ; validation Rich Results Test à faire après déploiement.

**Files:**
- Create: `components/seo/json-ld.tsx`
- Create: `lib/structured-data.ts`
- Modify: `app/(client)/layout.tsx`
- Modify: `app/(client)/events/[eventId]/page.tsx`
- Modify: pages profondes concernées
- Test: `tests/seo/structured-data.test.ts`

- [x] Générer un `SportsActivityLocation` avec le lieu d'entraînement : 6 rue Pierre Bauduc, 31600 Muret.
- [x] Distinguer ce lieu de l'adresse administrative SIRENE à Longages ; ne pas mélanger les deux usages.
- [x] Inclure uniquement téléphone, email, horaires, coordonnées et profils sociaux validés par l'association.
- [x] Conserver `Organization` et `WebSite` sans dupliquer des entités contradictoires.
- [ ] Générer `Event` depuis Sanity et `BreadcrumbList` sur les pages profondes.
- [x] Sérialiser le JSON-LD en neutralisant `<` pour éviter une injection via le contenu CMS.
- [ ] Valider les pages déployées avec Rich Results Test et Schema Markup Validator.
- [ ] Commit proposé : `feat(seo): add local sports and event structured data`.

### Task 9: Réparer la chaîne qualité et l'hygiène du dépôt

> **Réalisé le 23 août 2026** (PR [#23](https://github.com/thobenayann/jkd-31/pull/23)). Détail et écarts : [`../../reviews/2026-08-23-revue-qualite.md`](../../reviews/2026-08-23-revue-qualite.md). Fait via la PR [#22](https://github.com/thobenayann/jkd-31/pull/22) (`5771874`). Reste : `package-lock.json`, artefacts ignorés, script `quality` et CI.

**Files:**
- Create: `eslint.config.mjs`
- Modify: `package.json`
- Modify: `.gitignore`
- Delete after confirmation: `package-lock.json`
- Delete or ignore after confirmation: `analyze/`
- Test: GitHub Actions workflow existant ou Create: `.github/workflows/quality.yml`

- [x] Migrer `.eslintrc.json` vers la configuration plate compatible ESLint 9 et Next 16.
- [x] Remplacer `next lint`, supprimé/inadapté, par `eslint .`.
- [ ] Choisir pnpm comme gestionnaire unique ; supprimer `package-lock.json` seulement après validation de l'équipe.
- [x] Ajouter `packageManager` dans `package.json` et figer la version pnpm utilisée en CI.
- [ ] Ignorer les rapports bundle, `*.tsbuildinfo`, rapports Lighthouse et autres artefacts reproductibles non destinés au dépôt.
- [ ] Ajouter `quality`: `pnpm lint && pnpm exec tsc --noEmit && pnpm test:run && pnpm build`.
- [ ] Faire exécuter cette commande sur chaque pull request.
- [ ] Vérifier qu'un échec lint, type, test ou build bloque la fusion.
- [ ] Commit proposé : `chore: restore lint and CI quality gates`.

### Task 10: Installer le pilotage SEO et acquisition

**Files:**
- Create: `docs/analytics-events.md`
- Create: `docs/seo-monthly-review.md`
- Create: `scripts/vercel-baseline.ps1`
- Modify: `README.md`

- [ ] Documenter les métriques Vercel sans écrire de token ni de secret.
- [ ] Le script de lecture doit exporter : visiteurs, vues, pages, référents, appareils et Core Web Vitals, sans modifier Vercel.
- [ ] Ajouter une revue mensuelle avec baseline N−1, évolution, pages d'entrée, conversions, sources UTM et actions décidées.
- [ ] Ajouter Search Console : requêtes, pages, clics, impressions, CTR et position, séparés marque/hors marque.
- [ ] Conserver Google Business Profile : appels, itinéraires, clics site, avis, complétude et publications.
- [ ] Définir le taux principal : `contact_form_success / visiteurs uniques`, avec sous-taux CTA → formulaire et formulaire commencé → réussi.
- [ ] Conserver Vercel + Search Console comme système de mesure ; documenter tout besoin non couvert sans installer automatiquement un nouvel outil.
- [ ] Commit proposé : `docs: add SEO and acquisition operating dashboard`.

---

## Critères de sortie globaux

- [ ] `pnpm lint`, `pnpm exec tsc --noEmit`, tests et `pnpm build` réussissent.
- [ ] Production : `/robots.txt` 200, sitemap uniquement `.fr`, canonicals cohérentes, `/studio` en `noindex`.
- [ ] Un seul H1 utile par page ; Lighthouse accessibilité mobile 100.
- [ ] Les événements de conversion apparaissent dans Vercel sans donnée personnelle.
- [ ] Formulaire validé côté serveur, protégé contre spam et erreurs SMTP non divulguées.
- [ ] LCP mobile laboratoire amélioré et budget médias respecté ; validation terrain après 30 jours.
- [ ] Données structurées validées sans avertissement critique.
- [ ] Search Console et Google Business Profile appartiennent à l'association, avec accès nominatifs révocables.

## Ordre de déploiement recommandé

Créer une branche `codex/seo-tracking-foundations`. Déployer les tâches 1 à 4 ensemble, puis contrôler crawl et rendu. Déployer ensuite 5 et 6 afin d'établir la baseline conversion. Traiter 7 et 8 dans un troisième déploiement pour isoler l'effet performance/SEO enrichi. Terminer par 9 et 10. Chaque phase doit disposer d'une preview Vercel, d'une vérification mobile et d'un point de retour arrière explicite.
