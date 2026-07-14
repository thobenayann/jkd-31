# Rapport à la présidente — conception éditoriale et visuelle

**Date :** 14 juillet 2026
**Version :** 2 — remplace la première proposition
**Livrable :** `docs/seo/deliverables/rapport-presidente-2026-07-14.html`
**Public :** présidente et membres du bureau de l'association

## Rôle du document

Le rapport aide le bureau à comprendre la situation actuelle du site et les possibilités d'amélioration. Il ne donne pas d'ordres sur la direction du club et ne transfère pas au bureau les sujets réservés au développeur.

Le lecteur doit pouvoir :

1. lire les chiffres exacts ;
2. comprendre simplement ce qu'ils peuvent indiquer ;
3. connaître les propositions de Yann ;
4. identifier les quelques actions pour lesquelles Yann aura besoin de l'aide du bureau.

Le rapport technique reste séparé dans `docs/seo/technical/implementation-plan.md`.

## Voix et ton

Le rapport emploie un ton de conseil associatif, calme et respectueux.

Formulations à privilégier :

- « Nous devrions améliorer… » lorsqu'une piste mérite d'être étudiée ;
- « Nous pourrions… » lorsqu'il s'agit d'une possibilité ;
- « Yann propose de… » lorsqu'une action sera prise en charge par le développeur ;
- « Ce que nous pouvons en retenir » pour expliquer un chiffre ;
- « Pour avancer, Yann aura besoin de… » pour demander une intervention du bureau.

Formulations exclues :

- « le site doit désormais » ;
- « il faut absolument » ;
- « protéger », « corriger les fondations » ou toute expression alarmante ;
- « recrutement », « conversion », « prospects » ou vocabulaire d'entreprise ;
- toute phrase qui juge négativement le travail déjà réalisé.

Le but est d'accueillir davantage d'adhérents et de mieux informer les personnes intéressées, pas de « recruter ».

## Exactitude et interprétation des chiffres

La simplification porte sur le vocabulaire, jamais sur les données.

- Les chiffres sont repris exactement depuis l'audit daté.
- Les mois partiels sont identifiés comme tels et ne sont pas comparés comme des mois complets.
- Les graphiques présentent les valeurs exactes dans une infobulle au survol et au focus clavier.
- Une alternative textuelle ou un tableau accessible contient toutes les valeurs.
- Chaque graphique est suivi d'une phrase « Ce que nous pouvons en retenir ».
- Les interprétations restent prudentes : « suggère », « peut s'expliquer », « nous pouvons observer ».
- Les classements Google sont présentés comme un relevé ponctuel susceptible de varier.

Exemple attendu :

> **Ce que nous pouvons en retenir :** la fréquentation augmente fortement autour de la rentrée de septembre. Nous pourrions donc préparer les contenus et la communication du club un peu avant cette période.

## Ce qui disparaît du rapport présidentiel

Les sujets ci-dessous restent dans la documentation interne de Yann et ne sont pas cités dans le rapport public :

- GA4 et les outils écartés ;
- Search Console ;
- sitemap, robots, canonical, balises et autres termes de code ;
- détails de conformité liés à l'intégration YouTube ;
- noms de fonctions ou d'outils de suivi ;
- Canva Pro en tant que produit.

Le rapport peut simplement indiquer que :

- l'hébergement actuel fournit déjà des statistiques de fréquentation ;
- Yann propose d'améliorer la mesure des demandes d'essai et des prises de contact ;
- Yann utilisera des outils de création graphique pour améliorer les affiches et les contenus destinés aux réseaux sociaux ;
- les informations légales seront actualisées dans le cadre de la maintenance du site.

## Respect du contenu existant

Le rapport reconnaît ce qui existe déjà.

- Les horaires et tarifs sont présents : la piste consiste à les rendre plus faciles à repérer depuis les pages les plus consultées.
- L'histoire du Jeet Kune Do est riche et légitime : nous devrions l'équilibrer avec davantage d'explications destinées aux personnes qui découvrent la discipline.
- Les instructeurs, l'association et les photographies réelles inspirent confiance.
- Le site dispose déjà d'une bonne visibilité sur les recherches liées au Jeet Kune Do à Muret.

## Identité visuelle du club

Le rapport reprend directement la charte observée sur le site et dans les ressources du projet.

### Palette

- noir profond : `#100d0d` ;
- rouge du logo : `#e60012` ;
- blanc : `#ffffff` ;
- gris clair : `#f3f3f3` ;
- gris de texte : `#626262`.

Les dégradés des graphiques utilisent le rouge du club, du rouge sombre vers le rouge vif. Le bleu et le cyan de la première version sont supprimés.

### Ressources de marque

- logo principal : `public/images/logo/logo-jkd-sd-31-bg-black.jpg` ou une variante transparente adaptée ;
- photographie d'ouverture : `public/images/content/home/home-background.webp` ;
- autres photographies : uniquement des images réelles du club déjà présentes dans le projet.

Le fichier devant rester autonome, les images retenues sont intégrées directement au HTML final.

### Typographie et formes

- titres : caractère condensé, sportif et angulaire, proche du logo ;
- texte : sans-serif très lisible ;
- angles francs ou légèrement arrondis ;
- traits rouges inspirés du triangle du logo ;
- animations sobres et courtes.

La signature visuelle est un fil rouge angulaire qui relie les sections et rappelle le triangle formé par les armes du logo.

## Structure du rapport

### 1. Notre situation aujourd'hui

- accueil avec le logo et une photographie réelle du club ;
- phrase d'ouverture : le site constitue déjà une base solide pour présenter le club ;
- chiffres annuels exacts ;
- points forts exprimés sans comparaison agressive ;
- pistes d'amélioration formulées comme des conseils.

### 2. Ce que la fréquentation nous apprend

- évolution mensuelle avec valeurs exactes au survol et au clavier ;
- pages les plus consultées ;
- origine des visites ;
- appareils utilisés ;
- une interprétation simple après chaque visualisation.

Le pic de septembre est expliqué comme une occasion de préparer la rentrée, jamais comme une obligation.

### 3. Mieux informer les futurs adhérents

- valoriser l'histoire du JKD tout en donnant plus de place à l'apprentissage et au premier cours ;
- rendre les horaires et tarifs existants plus faciles à retrouver ;
- expliquer le déroulement d'une séance et l'accueil des personnes débutantes ;
- envisager, selon les résultats, des contenus autour de la self-défense féminine, des bienfaits des arts martiaux pour les adolescents et de la culture du Kali ;
- améliorer progressivement les affiches et la communication sur les réseaux sociaux.

### 4. Les propositions de Yann

La chronologie devient une feuille de route souple :

1. **Dans un premier temps** — Yann propose de rendre certaines informations plus faciles à trouver et d'améliorer le suivi des demandes reçues depuis le site.
2. **Avant la prochaine rentrée** — Yann propose de préparer des contenus, affiches et publications qui présentent mieux l'essai et la vie du club.
3. **Après quelques semaines d'observation** — Yann propose d'analyser la fréquentation et l'intérêt suscité afin de suggérer de nouveaux contenus pertinents.

Aucune opération technique détaillée n'apparaît dans cette partie.

### 5. Comment la présidente peut aider

Une courte liste, distincte du travail de Yann :

- confirmer le nom officiel que le club souhaite utiliser partout ;
- permettre à Yann d'intervenir comme gestionnaire sur les services Google déjà associés au club ;
- valider les informations de contact et les éléments administratifs destinés au public ;
- transmettre ou valider les photographies et autorisations utilisables pour la communication ;
- donner son accord sur les messages importants avant leur publication.

Chaque demande indique pourquoi elle est utile, en une phrase simple.

## Interactions

- onglets conservés, avec des intitulés compréhensibles ;
- accordéons réservés aux explications secondaires ;
- infobulle du graphique mensuel affichant le mois, les visiteurs et les pages vues ;
- chaque point du graphique est accessible au clavier ;
- possibilité d'imprimer ou d'enregistrer en PDF ;
- toutes les sections et explications sont visibles à l'impression ;
- animations désactivées lorsque le navigateur demande une réduction des mouvements.

## Critères d'acceptation

- Le logo officiel et une photographie réelle du club sont visibles dès l'ouverture.
- La palette principale est noir, blanc et rouge.
- Aucun nom GA4, Search Console, sitemap, robots, canonical, YouTube ou Canva n'apparaît dans le contenu présidentiel.
- « Vercel » n'apparaît pas ; si l'hébergement est évoqué, il est nommé « l'hébergement actuel du site ».
- Aucun passage ne parle de recrutement, de prospects ou de conversion.
- Chaque recommandation emploie « nous devrions », « nous pourrions » ou « Yann propose » selon son rôle.
- Les horaires ne sont jamais présentés comme absents.
- Les chiffres de l'audit restent exacts et les données mensuelles sont consultables au survol et au clavier.
- Chaque graphique possède une interprétation simple, prudente et visible.
- La chronologie ne contient aucune tâche technique destinée à Yann.
- La contribution attendue de la présidente tient dans une liste courte et concrète.
- Le document fonctionne sans connexion internet.
- Le document reste lisible sur mobile et à l'impression.

## Revue de cohérence

- Aucun placeholder ou choix indéterminé ne subsiste.
- Le rapport présidentiel et le rapport technique ont des rôles distincts.
- La précision statistique est maintenue tout en simplifiant l'interprétation.
- L'identité visuelle provient des ressources réelles du club, et non d'un thème générique.
- Le ton conseillé ne donne pas d'ordre au bureau ni à l'association.
