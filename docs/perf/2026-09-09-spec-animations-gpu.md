# Spécification : animations à coût constant nul

Date : 9 septembre 2026. Branche : `perf/animations-gpu`.

## Contexte

Un membre de l'association signale une consommation CPU élevée sur le site. Le
diagnostic (profils Chrome DevTools sur la production, page d'accueil au repos,
fenêtre 1920 × 1080, écran 160 Hz, GPU dédié) donne :

| Thread | Tout actif | Nuage de mots en pause | Tout en pause |
|---|---|---|---|
| Processus GPU (rendu) | 14,7 % | 9,1 % | 0 % |
| Compositeur Viz | 11,4 % | 7,2 % | 0 % |
| Compositeur renderer | 2,7 % | 2,7 % | 0 % |
| Navigateur (main) | 2,0 % | 2,1 % | 0 % |
| Thread principal JS | 0,3 % | 0,2 % | 0,1 % |
| **Total, % d'un cœur** | **31,1** | **21,5** | **0,2** |

Aucune boucle infinie. Le thread principal est inactif. Le coût est entièrement
dû à deux animations CSS perpétuelles : l'aurora de la barre de navigation
(environ 21 points, toutes les pages) et le nuage de mots (environ 10 points,
accueil et association, largeur ≥ 1536 px).

## Pourquoi la tentative précédente n'a pas suffi

Les commits `e21783c` et `82e4c69` ont remplacé `background-position` et
framer-motion par des animations `transform` en CSS. C'était la bonne direction,
mais le critère de succès était « Paint, raster et `requestAnimationFrame` à zéro
sur le thread principal ». Ce critère a été atteint, et le travail a simplement
changé de thread : les filtres `blur`, l'inversion, la fusion
`mix-blend-difference`, le masque et le `backdrop-filter` sont recalculés par le
compositeur et le processus GPU à chaque image, à la fréquence de l'écran.

Leçon : la mesure qui compte est la **somme de tous les threads du navigateur**
pour l'onglet, pas le seul thread principal. Ce document fixe ce critère.

## Objectif

Page d'accueil au repos, 1920 × 1080, build de production locale, même protocole
de mesure : **moins de 5 % d'un cœur toutes threads confondues**, contre 31 %
aujourd'hui. Rendu visuel inchangé, vérifié par comparaison de captures.

## Principe

Un déplacement en `transform` d'une texture déjà dessinée est quasi gratuit. Tout
ce qui est **recalculé par image** autour de ce déplacement doit être calculé
**une seule fois** et transformé en texture. Concrètement : aucune propriété
`filter`, `backdrop-filter` ni `invert` sur un calque qui bouge ou qui est
recouvert par un calque qui bouge.

## Changement 1 : aurora cuite (`components/ui/aurora-background-french-flag.tsx`)

Aujourd'hui trois `div` portent chacun `blur(10px) invert()` avec des dégradés
CSS, fusionnés en `mix-blend-difference`, sous un masque radial et une opacité de
groupe, avec un `backdrop-blur-sm` par-dessus pour le contenu de la barre.

Cible :

- Les trois calques deviennent des `<canvas>` dessinés une fois au montage (et
  au redimensionnement, avec un délai). Le dessin reproduit les dégradés à
  l'identique, applique `ctx.filter = 'blur(10px)'` (même implémentation Skia
  que le `blur` CSS), puis inverse les canaux RGB pixel par pixel en mode clair
  (équivalent exact du `invert()` CSS, qui n'agit pas sur l'alpha). Le canvas
  est dimensionné au `devicePixelRatio`.
- La fusion `mix-blend-difference` est conservée en CSS : une seule passe par
  image sur la bande de la barre, coût négligeable.
- Le calque des bandes garde `w-[200%]`, `will-change-transform` et
  `motion-safe:animate-aurora-drift` : seule la texture change de nature.
- Le mode sombre est détecté par la classe `dark` sur `<html>` (next-themes) et
  observé par `MutationObserver` pour redessiner.
- Le `backdrop-blur-sm` du contenu de la barre (`menu.tsx:114`) est retiré : au
  dessus d'un fond déjà flouté à 10 px, un flou de 4 px n'est pas perceptible.
  La comparaison de captures le confirmera.
- Sur mobile (< md), la barre de bureau est `hidden` mais l'aurora tourne dans
  une bande vide. Le composant ne s'anime que si sa surface est visible.

Le masque radial et l'opacité de groupe sont conservés dans un premier temps. Si
la mesure montre un résidu significatif, ils seront remplacés par un calque de
recouvrement équivalent (dégradé vers la couleur de fond de la barre).

## Changement 2 : nuage de mots (`app/(client)/(home)/_components/word-cloud.tsx`)

Aujourd'hui : liste de `ceil(hauteur / 40) × 6` mots (environ 200 par colonne),
soit un calque d'environ 8 000 px de haut qui traverse un conteneur de 1 300 px
en 180 s, de `translateY(-100 %)` à `translateY(100 %)`. Le calque immense est
rastérisé par tuiles au fil du défilement, en permanence, même hors écran.

Cible :

- **Boucle sans couture** : la liste est réduite à ce qui remplit deux fois la
  hauteur du conteneur, dupliquée une fois, animée de `translateY(0)` à
  `translateY(-50 %)`. Densité, tailles, couleurs et police inchangées. La
  vitesse de défilement est conservée à l'identique (environ 100 px/s), la durée
  de la boucle est recalculée à partir de la hauteur réelle. Le calque passe
  d'environ 8 000 px à environ 2 600 px.
- **Écart visuel assumé** : l'original commence et finit chaque cycle par un
  conteneur vide pendant une dizaine de secondes. La boucle sans couture
  supprime ces blancs. C'est le seul changement perceptible, et c'est une
  amélioration. À valider par Yann.
- **Pause hors écran** : un `IntersectionObserver` pose
  `animation-play-state: paused` quand la colonne n'est pas visible.
- `motion-safe:` sur l'animation, pour respecter `prefers-reduced-motion` comme
  l'aurora le fait déjà.
- Le listener `resize` est débouncé (200 ms).

## Changement 3 : navigation sans re-render au défilement (`components/shared/menu.tsx`)

Aujourd'hui `setLastYPos` est appelé à chaque changement de `scrollY`, ce qui
re-rend toute la barre (aurora, `GradualSpacing` et ses 39 `motion.span`) à
chaque image de défilement, et l'effet se réabonne à chaque frame. Le nettoyage
`scrollY.clearListeners()` purge aussi les abonnés des autres composants qui
partagent ce `MotionValue`.

Cible : `useMotionValueEvent(scrollY, 'change', ...)` avec la dernière position
dans un `useRef`. Aucun état React, aucun re-render, désabonnement propre géré
par framer-motion. Comportement identique : la barre se cache au défilement vers
le bas au delà de 100 px, réapparaît au défilement vers le haut.

## Protocole de vérification

1. Build de production locale (`pnpm build`, `pnpm start`), page d'accueil,
   fenêtre 1920 × 1080.
2. Profil Chrome DevTools de 8 s au repos, via le serveur MCP `chrome-devtools`,
   analyse par thread avec le script `analyse-trace.py` (somme des `RunTask`
   par thread, en % de la fenêtre). Mesure de référence prise sur `develop`
   avant modification, puis après chaque changement.
3. Captures de la barre de navigation avant et après, en clair et en sombre,
   animation figée à `currentTime = 0`. Diff pixel par pixel avec Pillow,
   écart moyen attendu sous 2 sur 255.
4. Tests existants : `pnpm test` et `pnpm test:e2e` (la suite `rendu.spec.ts`
   vérifie la couleur de fond de la barre).
5. Vérification manuelle du comportement de la barre au défilement.

## Résultats (9 septembre 2026, build de production locale)

Même protocole : accueil au repos, 1920 × 1080, écran 160 Hz, profil DevTools de
8 s, somme des `RunTask` par thread (le temps CPU `tdur` est identique à `dur`,
il n'y a pas d'attente comptée).

| Thread | `develop` | Canvas seul | Canvas + `steps()` |
|---|---|---|---|
| Processus GPU (rendu) | 7,8 % | 4,9 % | 0,9 % |
| Compositeur Viz | 6,0 % | 3,4 % | 0,6 % |
| Compositeur renderer | 1,9 % | 1,9 % | 0,4 % |
| Navigateur (main) | 2,3 % | 2,1 % | 1,0 % |
| Thread principal JS | 0,3 % | 0,3 % | 0,1 % |
| **Total** | **18,2 %** | **12,6 %** | **3,0 %** |

Objectif « moins de 5 % » atteint. Le gestionnaire de tâches Windows, moins
précis (comptage par quantum de 15,6 ms), voit 0,2 % sur l'ensemble des
processus Chrome de l'onglet une fois la page stabilisée.

### Ce que la cuisson en canvas ne suffisait pas à régler

Une fois les filtres retirés, il restait environ 12 %. L'expérience par
retrait de propriétés a montré que ni le masque ni l'opacité de groupe ne
coûtaient, que la fusion `difference` valait 1,6 point, et surtout qu'un simple
`div` coloré animé au même endroit coûtait autant que les canvas. Le coût
restant n'était donc pas le contenu, mais le **nombre d'images** : une
animation `linear` fait dessiner le compositeur à chaque rafraîchissement
d'écran, 160 fois par seconde ici, pour un déplacement de 0,4 px.

La réponse est la fonction de temps `steps()`. Le compositeur ne dessine que
quand la valeur change : `steps(1440)` sur 60 s donne 24 images par seconde,
mesurées dans la trace (`DrawFrame`), pour un pas de 1,3 px sur un dégradé
flouté à 10 px. Le nuage de mots avance par pas de 2 px. Cette cadence est
indépendante de la fréquence de l'écran : sur un 60 Hz, le gain relatif est
plus faible, mais le coût absolu est le même, et il est faible.

### Contrôle visuel

Captures de la barre, animation figée à `currentTime = 0`, avant et après :

| Thème | Écart moyen (sur 255) | Pixels avec écart > 24 |
|---|---|---|
| Sombre | 1,0 | 0 % |
| Clair | 0,9 | 0 % |

Le premier passage en clair donnait un écart moyen de 6 : le canvas interpole
les dégradés sans prémultiplier l'alpha, contrairement à CSS, ce qui
assombrissait les bords des bandes blanches. Corrigé en donnant au stop
transparent la couleur de la bande.

### Tests

`pnpm test` : 58 tests unitaires passent. `pnpm test:e2e` contre le build de
production : 56 tests passent. `pnpm lint` : les 2 erreurs signalées
(`3d-card.tsx`, `use-media-query.ts`) préexistent sur `develop`.

## Complément : animer seulement quand quelqu'un regarde

Retour d'un membre après mise en production : le résidu de 3 % « sans rien
faire » devrait être nul, une animation ne doit tourner que quand elle sert.
Le principe est juste. Sur desktop la barre est visible en permanence, le
critère « hors écran » ne suffit donc pas ; le critère retenu est
**l'attention** :

- **Fenêtre sans focus ou onglet caché** (`focus`, `blur`,
  `visibilitychange`) : pause immédiate, reprise au retour. C'est le cas de
  la mesure au gestionnaire de tâches.
- **Inactivité** : aucun mouvement de souris, touche, molette, défilement ni
  toucher pendant 60 s : pause, reprise au premier geste.
- **Barre masquée par le défilement vers le bas** : l'aurora est en pause tant
  que la barre est hors écran.

Implémentation : logique pure dans `lib/attention.ts` (testée en node), hook
`hooks/use-user-attention.ts` qui la branche sur les événements DOM. Coût au
repos nul : les événements d'entrée ne font que dater la dernière interaction,
un seul minuteur programme le passage en inactif, l'état React ne change que
quand la valeur bascule. `AuroraBackground` reçoit une prop `paused`, et le
nuage de mots combine visibilité et attention.

Mesures (même protocole) :

| État | Total toutes threads |
|---|---|
| Visiteur actif, animations en cours | 3,0 % |
| 60 s sans interaction, animations en pause | 0,2 % |
| Onglet `about:blank`, référence de l'instrument | 0,2 % |

Le résidu de 0,2 % est donc celui du profileur lui-même et de l'entretien du
navigateur, pas du site. Vérifié dans le navigateur : pause à 65 s
d'inactivité, reprise sur un `pointermove`, pause pendant le masquage de la
barre au défilement et reprise à la remontée. La perte de focus n'a pas pu
être reproduite dans le navigateur piloté par DevTools (les onglets y restent
« visibles ») ; ce chemin s'appuie sur les événements standard et est vérifié
par lecture.

Point aveugle assumé : toutes les mesures sont faites sous Chrome. Firefox
gère peut-être différemment `steps()` ; une mesure Firefox avant et après par
le membre qui a signalé le problème est demandée.

## Complément 2 : retrouver le drapeau qui flotte

Retour de Yann après mise en production : la barre ne « flotte » plus comme
un drapeau, des formes carrées apparaissent. Comparaison à instants égaux
(15 s et 40 s de boucle) entre trois versions : production (canvas), version
d'Opus 4.8 (`5dc71fe`) et version d'origine (`e21783c^`).

Constat : la version canvas reproduisait au pixel près celle d'Opus 4.8, mais
c'est le commit `e21783c` qui avait changé le rendu. L'original appliquait
**un seul** `blur(10px)` (et `invert` en clair) sur l'élément entier, donc
**après** la fusion `mix-blend-difference`, avec des bandes mobiles deux fois
plus larges et trois fois plus rapides. Opus 4.8 avait posé le flou **par
couche, avant** la fusion. Or la différence de deux images floues garde des
arêtes nettes là où elle change de signe : ce sont les cellules rectangulaires.

Correction : retour aux dégradés CSS et à la mécanique d'origine (flou après
fusion, bandes à 200 % de la largeur de barre, 96 px/s), en gardant le
déplacement par `transform`, la cadence `steps()` et la pause à l'attention.
Plus aucun canvas : le composant redevient purement déclaratif.

Deux pièges mesurés au passage, par retrait de propriétés dans une trace :

| Variante (flou après fusion, animation active) | Total |
|---|---|
| Groupe filtré sans découpe, `steps(1440)` | 11,7 % |
| Groupe filtré avec `overflow: hidden`, `steps(1440)` (36 img/s) | 5,9 % |
| Idem, `steps(960)` (24 img/s) | 4,1 % |
| Idem, `steps(600)` (15 img/s) | 3,9 % |
| Idem, `linear` | 8,3 % |

1. Sans `overflow: hidden` sur l'élément filtré, le compositeur floute une
   surface qui englobe tout le calque mobile (400 % de large) avant de la
   découper : trois fois plus de pixels que la barre.
2. La cadence retenue est 24 images par seconde (`steps(960)` sur 40 s, 4 px
   par pas). Mesures propres sur le build final, nuage de mots compris : de
   4,1 % (fenêtre de 4 s) à 6,2 % (fenêtre de 8 s après rechargement), contre
   3,0 % pour la version canvas. C'est le prix du rendu d'origine, assumé.

Piège de mesure : après 60 s sans interaction, la pause à l'attention rend
toute mesure « animation active » fausse. Chaque phase consigne désormais
`playState` et relance l'attention par un `pointermove` synthétique.

## Hors périmètre

`will-change` jamais libéré dans `fade-in-wrapper.tsx`, transition de page en
`filter: blur` dans `globals.css`. Coûts ponctuels, pas permanents. À traiter
séparément si besoin.
