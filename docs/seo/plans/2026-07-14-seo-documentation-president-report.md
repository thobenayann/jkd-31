# SEO Documentation and President Report Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Do not delegate unless the user explicitly requests subagents.

**Goal:** produire une documentation SEO durable, compléter l'analyse des contenus et mots-clés, formaliser la gouvernance Vercel/RGPD et livrer un rapport HTML autonome destiné à la présidente.

**Architecture:** séparer les preuves datées, la stratégie éditoriale, la gouvernance juridique, le chantier technique et le livrable de communication. Le rapport présidentiel consomme uniquement des chiffres et décisions présents dans les documents sources, mais reste un fichier HTML autonome sans dépendance réseau.

**Tech Stack:** Markdown, HTML5, CSS natif, JavaScript natif, SVG accessible, Vercel Web Analytics, documentation CNIL et Google officielle.

## Global Constraints

- Le choix analytique est Vercel Web Analytics + Speed Insights uniquement ; GA4 est exclu jusqu'à nouvelle décision explicite.
- Aucun événement analytique ne contient de nom, email, téléphone, message, identifiant d'adhérent ou donnée relative à un mineur.
- Le rapport HTML ne charge aucune police, image, script ou feuille de style externe.
- Le rapport utilise quatre onglets accessibles, des `<details>` natifs, des animations sobres et `prefers-reduced-motion`.
- Les graphiques sont des SVG avec `linearGradient` et disposent d'une alternative textuelle.
- Le mode impression affiche toutes les sections et masque les contrôles interactifs.
- Aucun volume de recherche de mots-clés n'est inventé ; les priorités reposent sur l'intention, la concurrence observée et les futures données Search Console.
- Le nom Google Business doit correspondre au nom réellement employé par le club, sans ajout artificiel de mots-clés.

---

### Task 1: Réorganiser la documentation SEO

**Files:**
- Move: `docs/audit-seo-2026-07-14/01-audit-seo-marketing.md` → `docs/seo/audit/2026-07-14/audit-seo-marketing.md`
- Move: `docs/audit-seo-2026-07-14/02-rapport-chantier-technique.md` → `docs/seo/technical/implementation-plan.md`
- Move: `docs/audit-seo-2026-07-14/raw/` → `docs/seo/audit/2026-07-14/evidence/`
- Create: `docs/seo/README.md`

**Interfaces:**
- Consumes: les rapports et preuves existants.
- Produces: une arborescence stable utilisée par toutes les tâches suivantes.

- [x] Vérifier que les trois sources existent et que toutes les destinations restent sous `D:\Work\jkd-31\docs\seo`.
- [x] Créer les dossiers `audit/2026-07-14`, `technical`, `strategy`, `governance` et `deliverables`.
- [x] Déplacer les rapports et preuves sans modifier leur contenu.
- [x] Créer `docs/seo/README.md` avec cette carte :

```markdown
# Référentiel SEO — JKD Self Defense 31

| Besoin | Document |
|---|---|
| Comprendre l'audit daté | `audit/2026-07-14/audit-seo-marketing.md` |
| Consulter les preuves | `audit/2026-07-14/evidence/` |
| Définir les contenus | `strategy/content-and-keywords.md` |
| Appliquer les choix RGPD | `governance/analytics-and-rgpd.md` |
| Implémenter les corrections | `technical/implementation-plan.md` |
| Présenter au bureau | `deliverables/rapport-presidente-2026-07-14.html` |
```

- [x] Ajouter une section « ordre de lecture pour un agent » : README, gouvernance, stratégie, plan technique, audit, preuves.
- [x] Exécuter `rg --files docs/seo | Sort-Object` et vérifier qu'aucun ancien rapport ne subsiste dans `docs/audit-seo-2026-07-14`.
- [ ] Commit proposé : `docs: organize SEO project knowledge`.

### Task 2: Produire la stratégie de contenus et mots-clés

**Files:**
- Create: `docs/seo/strategy/content-and-keywords.md`
- Modify: `docs/seo/audit/2026-07-14/audit-seo-marketing.md`

**Interfaces:**
- Consumes: pages actuelles, classements observés, concurrents locaux et intentions de recherche.
- Produces: priorités de pages, briefs éditoriaux et maillage interne pour le rapport et l'agent technique.

- [x] Inventorier les titres, H1, descriptions, longueur approximative et thèmes des routes `/`, `/association`, `/tarifs`, `/events`, `/contact`, `/27-styles`.
- [x] Rechercher les résultats locaux pour « Jeet Kune Do Muret », « self défense Muret », « arts martiaux Muret », « cours self défense femme Muret » et requêtes proches.
- [x] Classer les intentions en quatre familles : spécialité, besoin, public et information pratique.
- [x] Écrire une matrice de mots-clés sans volumes fictifs :

```markdown
| Priorité | Intention principale | Page cible | Objectif |
|---|---|---|---|
| P0 | jeet kune do Muret | `/jeet-kune-do-muret` ou hub cours | défendre la position actuelle |
| P0 | self défense Muret | `/self-defense-muret` | recruter au-delà de la marque |
| P0 | cours d'essai arts martiaux Muret | `/cours-essai` | convertir |
| P1 | self défense femme Muret | `/self-defense-femmes-muret` | répondre à un besoin précis |
| P1 | kali escrima Muret | `/kali-escrima-muret` | valoriser une discipline différenciante |
| P1 | arts martiaux adultes débutants Muret | page cours/FAQ | rassurer les débutants |
```

- [x] Pour chaque page prioritaire, fournir : intention, title, H1, angle, sections, questions FAQ, CTA, preuves requises, liens internes et médias Canva.
- [x] Définir un calendrier éditorial de rentrée sur huit semaines pour le site, Google Business, Facebook et Instagram.
- [x] Ajouter au rapport d'audit un résumé de cette recherche et un lien relatif vers la stratégie détaillée.
- [x] Vérifier qu'aucune page ne cible deux intentions principales concurrentes.
- [ ] Commit proposé : `docs(seo): add local content and keyword strategy`.

### Task 3: Formaliser Vercel Analytics et la conformité RGPD

**Files:**
- Create: `docs/seo/governance/analytics-and-rgpd.md`
- Modify: `docs/seo/audit/2026-07-14/audit-seo-marketing.md`
- Modify: `docs/seo/technical/implementation-plan.md`

**Interfaces:**
- Consumes: choix Vercel uniquement, code actuel de la page légale, formulaire et iframe YouTube.
- Produces: règles juridiques/techniques que l'agent doit appliquer sans réinterprétation.

- [x] Documenter la décision : Vercel Analytics et Speed Insights conservés ; GA4, GTM, Meta Pixel et outils similaires exclus.
- [x] Établir le dictionnaire des événements autorisés et interdits.
- [x] Définir la configuration `beforeSend` : suppression des paramètres sensibles et rejet des chemins contenant une donnée personnelle.
- [x] Décrire la page légale cible : responsable, finalités, bases légales, données, destinataires, durées, transferts, droits, contact et CNIL.
- [x] Expliquer que l'absence de cookies ne supprime pas les obligations d'information, de minimisation et de documentation.
- [x] Exiger un chargement YouTube contextuel après action explicite, avec information et alternative par lien.
- [x] Inclure une checklist annuelle : DPA Vercel, sous-traitants, registre, durées, test des traceurs, droits et accès.
- [x] Modifier le plan technique pour rendre ces éléments obligatoires et supprimer toute suggestion active de réévaluation GA4 à court terme.
- [x] Ajouter les liens officiels CNIL et Vercel consultés le 14 juillet 2026.
- [ ] Commit proposé : `docs(privacy): record Vercel-only analytics policy`.

### Task 4: Construire le rapport HTML autonome

**Files:**
- Create: `docs/seo/deliverables/rapport-presidente-2026-07-14.html`

**Interfaces:**
- Consumes: chiffres de l'audit, stratégie de contenus, gouvernance Vercel/RGPD et spécification `docs/seo/specs/2026-07-14-president-report-design.md`.
- Produces: un document autonome partageable et imprimable.

- [x] Écrire le HTML sémantique avec un héros, une navigation `role="tablist"`, quatre boutons `role="tab"` et quatre panneaux `role="tabpanel"`.
- [x] Écrire les tokens CSS exacts de la spécification et le motif tatami en gradients CSS locaux.
- [x] Construire les cartes, badges, chronologie et encadrés sans dépendance externe.
- [x] Construire quatre visualisations autonomes : courbe SVG de fréquentation, pages principales, appareils et sources.
- [x] Ajouter pour chaque graphique un titre, une description et une alternative textuelle accessible.
- [x] Ajouter les accordéons `<details>` et conserver toutes les décisions importantes hors de ceux-ci.
- [x] Implémenter le clavier des onglets : ArrowLeft, ArrowRight, Home, End, Enter et Space.
- [x] Implémenter l'animation initiale, les transitions de panneaux, le tracé de courbe et les compteurs une seule fois.
- [x] Désactiver les animations sous `prefers-reduced-motion: reduce`.
- [x] Ajouter `@media print` pour afficher tous les panneaux, ouvrir visuellement les détails, utiliser un fond clair et éviter les coupures de cartes.
- [x] N'inclure aucun chemin technique, package, commande ou jargon non expliqué dans le contenu présidentiel.
- [ ] Commit proposé : `feat(report): add interactive standalone SEO report`.

### Task 5: Vérifier le rapport et le référentiel

**Files:**
- Verify: `docs/seo/deliverables/rapport-presidente-2026-07-14.html`
- Verify: tous les fichiers sous `docs/seo/`

**Interfaces:**
- Consumes: livrables des tâches 1 à 4.
- Produces: preuves de lisibilité, autonomie, interaction et cohérence.

- [x] Scanner les documents produits pour `TODO`, `TBD`, marqueurs de conflit, liens vides, secrets et anciennes affirmations GA4 (les rapports Lighthouse bruts contiennent leurs propres commentaires `TODO`).
- [x] Vérifier que le HTML ne contient aucune ressource `http://` ou `https://` dans `src`, `href` de stylesheet/script ou `url()` CSS ; les liens documentaires externes restent autorisés.
- [ ] Ouvrir le fichier local dans le navigateur intégré et contrôler 1440 × 1000, 768 × 1024 et 390 × 844.
- [ ] Tester chaque onglet à la souris et au clavier.
- [ ] Tester les accordéons, `prefers-reduced-motion`, focus visible et défilement mobile.
- [ ] Capturer une vue desktop et une vue mobile pour la revue visuelle.
- [ ] Imprimer en PDF ou prévisualiser l'impression et vérifier que les quatre panneaux sont présents.
- [x] Vérifier les chiffres : 6 123 vues, 1 719 visiteurs, septembre 1 778/439, mobile ≈ 68 %, Google ≈ 22 %.
- [x] Exécuter `git status --short` et confirmer qu'aucun fichier temporaire n'est ajouté.

> **Revue visuelle restante :** le navigateur intégré a refusé l'URL locale selon sa politique de sécurité. Les contrôles desktop/mobile, les interactions et l'aperçu d'impression doivent être rejoués manuellement en ouvrant le fichier autonome dans Chrome ou Edge.
- [ ] Commit proposé : `test(report): verify standalone presidential deliverable`.

## Self-review

- Chaque exigence de la spécification visuelle est couverte par la tâche 4 ou 5.
- La structure documentaire demandée est couverte par la tâche 1.
- L'analyse de contenu et de mots-clés manquante est couverte par la tâche 2.
- La décision Vercel uniquement et la conformité juridique sont couvertes par la tâche 3.
- Aucun placeholder ni interface contradictoire n'est présent.
- Les déplacements, créations, modifications et vérifications ont des chemins exacts.
