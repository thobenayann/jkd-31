# Revue du 30 août 2026 : titres, métadonnées et annonce de rentrée

> Note de traçabilité. Elle date ce qui a été constaté en production, ce qui a été
> corrigé, et ce qui reste ouvert. À lire avant de toucher aux titres, aux
> métadonnées de route ou à l'annonce de saison.

## Constat de départ, mesuré en production le 30 août 2026

Les fondations livrées le 23 août tiennent : `robots.txt`, `sitemap.xml`,
canonicals, redirections `.com` et apex, JSON-LD `Organization` / `WebSite` /
`SportsActivityLocation`. Le contenu textuel est bien rendu par le serveur, donc
lisible par les robots des moteurs de réponse, qui n'exécutent pas JavaScript.

La couche éditoriale, elle, ne tenait pas. Nombre de balises `<h1>` dans le HTML
servi par la production, avant correctif :

| Page | `<h1>` avant | `<h1>` après |
|---|---:|---:|
| `/` | 0, et 39 après hydratation | 1 |
| `/tarifs` | 47 | 1 |
| `/27-styles` | 60 | 1 |
| `/contact` | 14 | 1 |
| `/events` | 10 | 1 |
| `/association` | 1 | 1 |

Cause : `GradualSpacing` animait le texte lettre par lettre en enveloppant
**chaque caractère dans son propre `motion.h1`**. Le menu global en ajoutait 39 de
plus après hydratation, un par lettre de « Jeet Kune Do, Kali, Silat,
Self-défense », à l'intérieur d'un lien. Un lecteur d'écran épelait le titre.

Deux autres défauts confirmés : la description de `/tarifs` reprenait mot pour mot
celle de `/association`, et aucun titre de page ne contenait « Muret ».

## Décisions

| Décision | Choix | Pourquoi |
|---|---|---|
| Niveau de titre de `GradualSpacing` | Prop `as`, valeur par défaut `span` | Un composant d'animation ne doit pas décider de la sémantique. Le défaut ne produit aucun titre, chaque page déclare le sien. |
| Texte accessible | `span.sr-only` avec le texte entier, caractères animés en `aria-hidden` | Plus robuste qu'un `aria-label` sur le conteneur, et le texte reste dans le HTML servi. |
| Outil de test des composants | `renderToStaticMarkup` de `react-dom/server`, dans Vitest en environnement `node` | Le plan prévoyait `@testing-library` et `jsdom`. Trois dépendances de moins, et surtout on teste le HTML réellement servi, qui est précisément l'objet du défaut. |
| Titre de l'accueil | `h1` en `sr-only` | Le héros est un logo sans texte. Le rendre visible demanderait de redessiner le héros, ce qui n'était pas le périmètre. |
| Suffixe de marque | `title.template` sur le layout racine | Les titres de route se raccourcissent, et les fiches événement de Sanity gagnent le nom du club sans code supplémentaire. |
| Adresse de contact | `contact@jkd-selfdefense31.fr` | Tranché par Yann. L'ancienne adresse divergeait de l'affiche et alimentait le JSON-LD. |
| Couleur du surtitre de l'annonce | `jkdBlueLight` | Passé en rouge le temps d'un aller-retour, ramené au bleu par Yann. La taille doublée sur desktop (14 px → 30 px) est conservée. |
| Forme de l'annonce de rentrée | Carte dans le héros de l'accueil, pas un bandeau | Le bas du héros est vide par construction, y compris sur mobile. Positionnée en absolu, elle ne décale aucun bloc existant. |
| Source de l'annonce | Constante `constant/announcement.ts` | Codée en dur pour la version 1, décision de Yann. La forme des champs reproduit le futur document Sanity `annonce` pour que le passage au CMS ne change que la source. |

## Changements de code

- `components/ui/gradual-spacing.tsx` : prop `as` (`span` par défaut),
  `containerClassName`, texte complet en `sr-only`, caractères en
  `motion.span[aria-hidden]`.
- `components/ui/gradual-spacing.test.tsx` : six tests sur le HTML serveur.
- `vitest.config.ts` : `components/**/*.test.tsx` ajouté à `include`.
- Niveaux déclarés sur les sept routes. `/27-styles` enveloppe ses deux à quatre
  fragments animés dans un seul `h1` qui reprend la mise en page du `header`.
- `app/(client)/page.tsx` : `h1` en `sr-only`, annonce de rentrée, `revalidate`.
- `components/shared/menu.tsx` : plus aucun titre dans la navigation. Nom
  accessible construit à partir du texte visible, qui diffère entre desktop et
  mobile, d'où le champ `hint` en remplacement de `ariaLabel`. Cible tactile
  portée à 44 px de haut sur mobile.
- Métadonnées des sept routes : titre unique, description propre, Open Graph et
  Twitter alignés. `title.template` sur le layout racine.
- `constant/config.ts`, `emails/confirmation-email.tsx`, `README.md` : adresse de
  contact unique. Le gabarit d'email dupliquait les coordonnées, il lit
  désormais `associationConfig`.
- `sanity/lib/imageUrl.ts` et ses six appels : l'objet image complet est passé au
  constructeur d'URL au lieu de la seule référence d'asset. Le hotspot saisi dans
  le Studio était jusqu'ici ignoré, et tout format fixe recadrait au centre.
- `constant/announcement.ts`, `lib/announcement.ts` (+ 8 tests),
  `components/shared/season-announcement.tsx`.
- `tailwind.config.ts` : `jkdBlueLight` (`#4DA6D9`). `jkdBlue` sur fond sombre
  plafonne à 2,4:1, sous le minimum de 4,5:1 exigé pour du petit texte. `jkdRed`
  et `jkdRedLight` ajoutés au passage, non utilisés par l'annonce après retour
  au bleu, mais ils documentent le rouge du logo déjà présent dans
  `event-origin-badge.tsx`.
- `components/shared/avatar-personality.tsx` : ne rend plus rien quand aucun nom
  n'est connu. Les valeurs par défaut `N/A` et `Unknown Title` s'affichaient
  telles quelles sur les événements sans personnalité saisie dans le Studio.
  Six tests unitaires, plus un test Playwright qui balaie `/events` et chaque
  fiche.

## Vérification de non-régression visuelle

Exigence de Yann : les visuels en place ne doivent pas bouger. Vérifié en
comparant le build de production local à la production, qui servait encore
l'ancien code, à viewport identique.

| Page | Hauteur de page, production | Hauteur de page, local | Repères de mise en page |
|---|---:|---:|---|
| `/` | 3722 px | 3722 px | identiques |
| `/tarifs` | 4115 px | 4115 px | 8 blocs, mêmes `top` et `height` au pixel |
| `/27-styles` | 3411 px | 3411 px | `header` à 40 px, hauteur 200 px |
| `/contact` | 2342 px | 2342 px | identiques |

Aucun décalage. Les seuls écarts visuels sont l'annonce de rentrée, qui est du
contenu nouveau et volontaire.

Défaut trouvé et corrigé pendant cette vérification : sur mobile, le bouton
flottant « Notre démo » est en `fixed bottom-24 right-4` et reste affiché en
permanence. L'annonce, placée au même niveau, le chevauchait. Elle est remontée
à `bottom-40`.

## Incident : le site basculait en thème clair

Symptôme signalé par Yann : bandeau de navigation blanc sur `localhost:3000`.

**Première hypothèse, fausse.** J'ai accusé une corruption de `.next`, au motif
qu'un `pnpm dev` tournait pendant que je lançais `pnpm build`. C'était une
explication plausible affirmée sans mesure. Un `rm -rf .next` a semblé la
confirmer parce que le serveur redémarré était lu par Playwright dans un contexte
neuf, donc sans `localStorage`.

**Cause réelle, mesurée.** Diagnostic Playwright croisant préférence système et
valeur stockée, sur `/` :

| Système | `localStorage.theme` | classe sur `<html>` | fond du bandeau |
|---|---|---|---|
| dark | absent | `dark` | `rgb(24, 24, 27)` |
| light | absent | `dark` | `rgb(24, 24, 27)` |
| light | `system` | **`light`** | **`rgb(250, 250, 250)`** |
| dark | `system` | `dark` | `rgb(24, 24, 27)` |
| light | `light` | **`light`** | **`rgb(250, 250, 250)`** |

`next-themes` était configuré en `defaultTheme='dark'` avec `enableSystem`. Une clé
`theme` déjà présente dans `localStorage` gagne sur le thème par défaut. Sur
`localhost:3000`, cette clé est partagée par tous les projets servis sur ce port,
et `components/ui/mode-toggle.tsx` n'est rendu nulle part : personne ne pouvait
revenir en arrière depuis l'interface.

Le symptôme se voit d'abord sur la navigation parce que `AuroraBackground` est en
`bg-zinc-50 dark:bg-zinc-900` avec `invert dark:invert-0`.

**Correctif :** `forcedTheme='dark'`. Le site est conçu en sombre uniquement, il
n'a pas de sélecteur de thème, `enableSystem` n'apportait donc qu'un risque.

Défaut de méthode à retenir : la première version de `e2e/rendu.spec.ts` posait
`colorScheme: 'dark'` dans la configuration Playwright. Le test ne pouvait pas
échouer. La configuration est passée en `colorScheme: 'light'`, et la
non-régression a été vérifiée en réintroduisant temporairement `enableSystem` :
les deux tests concernés échouent bien sans le correctif.

## Vérification par Playwright

`@playwright/test` ajouté, avec `channel: 'chrome'` pour utiliser le Chrome de la
machine sans télécharger de binaire. `e2e/rendu.spec.ts` vérifie sur les sept
routes publiques et deux profils d'appareil : aucune feuille de style en erreur,
classe `dark` sur `<html>`, fond de page et bandeau de navigation effectivement
sombres, un seul `h1`. Deux tests supplémentaires posent `localStorage.theme` à
`system` puis `light` et exigent que le site reste sombre. Un dernier mesure les
boîtes de l'annonce et du bouton flottant pour prouver qu'elles sont disjointes.

`e2e/diagnostic-theme.spec.ts` reste comme outil de diagnostic, il n'assertionne
rien.

`pnpm test:e2e` : 34 tests, 34 au vert.

Note d'exploitation : `next dev` et `next build` partagent `.next`. Éviter de les
lancer en parallèle reste une bonne pratique, mais ce n'était pas la cause ici.

## Chaîne qualité

`pnpm lint` 0 erreur et 8 avertissements préexistants (lot 3), `tsc --noEmit`
propre, `pnpm test` 36/36, `pnpm build` réussi. `/` et `/tarifs` passent de
statiques à revalidées toutes les heures, sans quoi la fenêtre d'affichage de
l'annonce resterait figée à l'heure du build.

## Ouvert

- [x] Date de reprise confirmée par Yann le 30 août 2026 : mardi 8 septembre à
      20h. Le cours ado de 18h30 n'est volontairement pas mentionné, décision de
      Yann.
- [ ] Créer la boîte `contact@jkd-selfdefense31.fr` et faire suivre l'ancienne.
      Le site l'affiche désormais partout.
- [ ] Trancher la page Facebook : l'affiche renvoie vers « Jeet Kune Do
      Toulouse », le site vers `facebook.com/jkd.jidao`.
- [ ] Sortir les cinq événements externes du sitemap : leur canonical pointe vers
      un autre domaine.
- [ ] Champ `organisateur` optionnel dans le schéma événement, pour ne pas
      déclarer le club organisateur d'un forum municipal.
- [ ] Relancer Lighthouse accessibilité mobile et viser 100.
- [ ] Remplacer l'imbrication `<button><a>` de `contact-button.tsx`, seul point
      de la tâche 3 non traité.
- [ ] Passer l'annonce dans Sanity quand la version codée en dur aura fait ses
      preuves.

Contexte et arbitrages : [`../seo/plans/2026-08-30-rentree-2026-annonce-et-forum.md`](../seo/plans/2026-08-30-rentree-2026-annonce-et-forum.md).
Fiche à saisir : [`../seo/deliverables/2026-09-06-forum-associations-sanity.md`](../seo/deliverables/2026-09-06-forum-associations-sanity.md).
