# Rapport SEO destiné à la présidente — spécification de conception

**Date :** 14 juillet 2026
**Livrable cible :** `docs/seo/deliverables/rapport-presidente-2026-07-14.html`
**Public :** présidente et membres du bureau non techniques
**Fonction principale :** expliquer simplement l'état du site, les décisions prises et les prochaines actions.

## 1. Résultat attendu

Le rapport doit donner confiance sans masquer les problèmes. En huit à dix minutes, la lectrice doit comprendre :

1. ce qui fonctionne déjà ;
2. comment la fréquentation évolue ;
3. pourquoi le club conserve Vercel Analytics sans ajouter GA4 ;
4. quels contenus et mots-clés permettront d'attirer de nouveaux adhérents ;
5. ce que le développeur va corriger ;
6. quelles actions nécessitent l'intervention de la présidente.

Le document ne doit ressembler ni à un tableau de bord SaaS générique, ni à une présentation commerciale. Il s'agit d'un rapport de décision, chaleureux, précis et facile à transmettre.

## 2. Format

- Un fichier HTML unique contenant CSS, JavaScript, icônes et graphiques SVG en ligne.
- Aucune dépendance réseau, police distante, bibliothèque JavaScript ou CDN.
- Consultation confortable sur ordinateur, tablette et téléphone.
- Impression A4 et export PDF depuis le navigateur.
- En mode impression, toutes les sections et tous les accordéons sont automatiquement visibles ; la navigation interactive disparaît.
- Le contenu reste lisible si JavaScript est désactivé : toutes les sections sont affichées par défaut, puis enrichies par le script.

## 3. Direction visuelle

### Palette

| Token | Valeur | Usage |
|---|---|---|
| `ink` | `#0A1020` | fond principal, sérieux et profondeur |
| `panel` | `#111A2E` | cartes et surfaces élevées |
| `paper` | `#F7F9FC` | contenu clair et impression |
| `blue` | `#2563EB` | données, liens, progression |
| `cyan` | `#22D3EE` | extrémité des gradients et signaux positifs |
| `red` | `#E5484D` | priorité ou alerte, avec parcimonie |

La palette reprend l'univers bleu du club et utilise le bleu-blanc-rouge comme repère discret, jamais comme décoration envahissante.

### Typographie

- Titres : `Georgia`, `Cambria`, serif système, pour une présence institutionnelle.
- Texte : `Inter`, `Segoe UI`, `Arial`, sans-serif système, pour la lisibilité.
- Données et libellés : `ui-monospace`, `SFMono-Regular`, monospace système.
- Pas de police téléchargée afin de garantir l'autonomie du fichier.

### Signature visuelle

Une « ligne de progression » traverse le rapport : un trait fin bleu → cyan, parfois interrompu par un repère rouge. Elle devient successivement axe de graphique, séparateur de section puis chronologie du plan d'action. Cette continuité évoque la progression martiale sans recourir aux clichés de silhouettes de combattants ou de ceintures décoratives.

Le fond du héros reçoit une trame géométrique très légère inspirée du quadrillage d'un tatami. C'est l'unique motif décoratif fort ; le reste du document demeure sobre.

## 4. Structure et navigation

### En-tête

- Nom du club et nature du document.
- Titre : « Faire du site un véritable outil de recrutement ».
- Sous-titre en langage simple.
- Date de l'audit et périmètre.
- Résumé de trois décisions : conserver Vercel, renforcer Google local, préparer la rentrée.

### Navigation interactive

Une barre d'onglets collante permet de passer entre quatre vues :

1. **L'essentiel** — synthèse, résultats actuels, décision analytics ;
2. **Visibilité** — Google, concurrence, contenus et mots-clés ;
3. **Fréquentation** — évolution mensuelle, pages, appareils et sources ;
4. **Plan d'action** — priorités, calendrier et demandes à la présidente.

Chaque onglet :

- met à jour `aria-selected` et le panneau visible ;
- reste utilisable au clavier avec flèches gauche/droite, Home et End ;
- ne modifie pas l'URL et ne recharge pas la page ;
- conserve une hauteur fluide sans saut visuel brutal.

Sur petit écran, la barre devient horizontalement défilable avec un indicateur de position.

### Accordéons

Les détails secondaires utilisent des éléments `<details>` natifs stylisés :

- « Que signifie ce chiffre ? » sous les graphiques ;
- « Pourquoi ne pas installer GA4 maintenant ? » ;
- « À quoi servent sitemap, H1 et canonical ? » ;
- « Quels accès Google faut-il donner ? » ;
- « Méthode et limites de l'audit ».

Les informations décisives ne doivent jamais être cachées dans un accordéon.

## 5. Visualisation des données

### Style

Les cartes reprennent les qualités appréciées de shadcn/ui : bordures fines, fonds maîtrisés, rayons modérés, hiérarchie typographique nette et états de focus visibles. Elles sont dessinées spécifiquement pour le rapport, sans importer shadcn/ui.

Les graphiques sont des SVG accessibles et utilisent des `linearGradient` :

- trait principal bleu → cyan ;
- aire sous la courbe avec dégradé vertical vers la transparence ;
- point de septembre accentué pour montrer le pic de rentrée ;
- grille légère, labels peu nombreux et valeurs exactes disponibles dans une table accessible.

### Graphiques retenus

1. Courbe mensuelle des pages vues, août 2025 à juin 2026.
2. Barres horizontales des cinq pages les plus consultées.
3. Anneau ou barre segmentée mobile/desktop/tablette, accompagné des valeurs en texte.
4. Barres des principales sources identifiables, avec « direct/non attribué » clairement expliqué.

La visualisation reste secondaire par rapport au message : septembre est décisif, le mobile domine et Google est la première source identifiable.

## 6. Animations et interactions

- Apparition initiale orchestrée du héros, des trois décisions puis de la navigation, en moins de 700 ms.
- Transition d'onglet : fondu et déplacement vertical de 6 px, 180 à 220 ms.
- Tracé progressif de la courbe au premier affichage de l'onglet Fréquentation.
- Compteurs qui montent une seule fois jusqu'à leur valeur, sans effet machine à sous.
- Chevron d'accordéon animé par rotation.
- Survol des cartes limité à une légère élévation et une variation de bordure.
- Aucun parallaxe, particule, carrousel automatique ou animation continue.
- `prefers-reduced-motion: reduce` supprime immédiatement toutes les animations non essentielles.

## 7. Contenu éditorial

Le rapport emploie des phrases courtes et explique le vocabulaire au premier usage.

Exemples :

- « Une page canonical indique à Google quelle adresse doit être considérée comme l'originale. »
- « Le sitemap est la liste des pages que nous souhaitons faire découvrir à Google. »
- « Une conversion est une action utile : demande d'essai, appel ou formulaire envoyé. »

Le rapport ne contient pas :

- de chemins de fichiers ou commandes terminal ;
- de noms de packages ;
- de détails d'implémentation Next.js ;
- de score technique sans interprétation ;
- de promesse de résultat SEO garanti.

## 8. Messages obligatoires

- Le site est déjà premier sur « Jeet Kune Do Muret » dans le relevé ponctuel du 14 juillet 2026.
- Le site est deuxième sur « self défense Muret » et septième sur « arts martiaux Muret » dans le même relevé, avec les réserves de localisation habituelles.
- 6 123 pages vues et 1 719 visiteurs uniques sur 365 jours.
- Septembre 2025 atteint 1 778 pages vues et 439 visiteurs ; la rentrée doit être préparée avant mi-août.
- Environ 68 % des visiteurs par appareil sont sur mobile.
- Google apporte environ 22 % des pages vues et constitue la première source identifiable.
- Vercel Analytics est conservé ; GA4 est écarté pour l'instant.
- Les événements de demande d'essai, formulaire, téléphone, email et itinéraire seront ajoutés sans donnée personnelle.
- La page légale sera mise à jour et la vidéo YouTube chargée uniquement à la demande.
- La fiche Google existante doit être revendiquée puis renommée selon le nom réellement utilisé par le club.
- La stratégie de contenu cible Muret et les intentions de futurs adhérents, sans répétition artificielle de mots-clés.

## 9. Plan d'action présenté à la présidente

La chronologie comporte trois horizons :

- **Maintenant — 0 à 14 jours :** accès Google, fiche établissement, corrections SEO urgentes, page légale, tracking des contacts.
- **Avant la rentrée — 15 à 45 jours :** contenus prioritaires, page cours d'essai, planning, FAQ, médias Canva et campagne UTM.
- **Après déploiement — 45 à 90 jours :** mesure des conversions, publications, avis, ajustement selon Search Console.

Un encadré distinct « Ce dont nous avons besoin de votre part » demande uniquement :

1. confirmer le nom public exact du club ;
2. récupérer ou revendiquer la fiche Google ;
3. fournir un accès Gestionnaire au développeur ;
4. valider adresse, horaires, téléphone et email ;
5. valider les textes juridiques et les durées de conservation ;
6. organiser les autorisations d'image, notamment pour les mineurs.

## 10. Usage de Canva Pro

Canva Pro est retenu pour produire les visuels éditoriaux, pas pour fabriquer les graphiques du rapport. Le futur système de contenu doit prévoir :

- un kit de marque commun ;
- des modèles publication carrée, story, Reel/Short et Google Business ;
- des exports WebP optimisés pour le site ;
- un espace partagé avec noms de fichiers et droits d'image ;
- un calendrier de rentrée décliné avec paramètres UTM.

## 11. Accessibilité et qualité

- Contraste WCAG AA minimum.
- Navigation intégrale au clavier.
- Focus visible sur onglets, accordéons et liens.
- Graphiques accompagnés de titres, descriptions et tables de données.
- Aucun message transmis uniquement par la couleur.
- Mise en page stable de 320 px à 1920 px.
- Impression A4 sans fond noir massif, sans élément tronqué et sans onglet masqué.
- Aucun appel réseau au chargement du fichier.

## 12. Critères d'acceptation

- Le fichier s'ouvre directement depuis le disque dans un navigateur moderne.
- Les quatre onglets, les accordéons et la navigation clavier fonctionnent.
- Les animations sont discrètes et désactivables par préférence système.
- Les graphiques utilisent des dégradés SVG et restent compréhensibles sans animation.
- Le contenu correspond aux chiffres vérifiés et au choix Vercel uniquement.
- Une personne non technique peut reformuler les trois priorités après lecture.
- L'impression PDF contient toutes les sections dans un ordre logique.
- Le document ne contient aucun secret, token, adresse personnelle non publiée ou donnée d'adhérent.

## 13. Auto-relecture de la spécification

- Aucun placeholder ou décision laissée ouverte.
- Le format autonome est compatible avec les interactions prévues.
- Le mode impression résout le risque de contenu caché par les onglets.
- Les graphiques sont visuels à l'écran et accessibles sous forme de données textuelles.
- La distinction entre rapport présidentiel, documentation d'agent et pièces techniques est explicite.
- Le périmètre reste centré sur le rapport et le suivi SEO, sans modification immédiate du site de production.
