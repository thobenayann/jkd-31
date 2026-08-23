# Audit SEO, acquisition locale et contenu — JKD Self Defense 31

**Date de l'audit :** 14 juillet 2026
**Site audité :** https://www.jkd-selfdefense31.fr
**Marché local :** Muret (31600), Toulouse Sud
**Objectif :** augmenter les demandes de cours d'essai et les nouvelles adhésions.

## 1. Synthèse de direction

Le site dispose d'une excellente base technique et d'un positionnement organique déjà solide sur sa spécialité. Il est premier sur « Jeet Kune Do Muret », deuxième sur « self défense Muret » et septième sur « arts martiaux Muret » dans le relevé Google non personnalisé effectué le 14 juillet 2026 (`hl=fr`, `gl=fr`, `pws=0`). Ces positions sont ponctuelles et peuvent varier selon la localisation, l'appareil et l'historique de l'utilisateur.

La priorité n'est pas une refonte. Le meilleur retour sur effort vient de quatre actions : réparer les signaux d'indexation, transformer les visites en demandes d'essai mesurables, consolider la présence Google locale existante, puis publier des contenus répondant aux questions des futurs adhérents.

| Axe | État | Diagnostic |
|---|---:|---|
| Visibilité Jeet Kune Do | Très bon | 1er résultat organique observé sur « Jeet Kune Do Muret » |
| Visibilité self-défense | Bon | 2e résultat organique, derrière une page Facebook Krav Maga |
| Visibilité arts martiaux | Moyen | 7e ; concurrence multi-disciplines plus riche sémantiquement |
| SEO Lighthouse | Excellent | 100/100 desktop et mobile |
| Accessibilité Lighthouse | Bon | 100 desktop, 96 mobile |
| Performance laboratoire | Très bonne | LCP 222 ms desktop ; 1,29 s mobile Slow 4G ; CLS 0 |
| Performance terrain (30 j) | Bonne | LCP p75 : 2,10 s mobile / 1,36 s desktop ; INP : 136 / 88 ms ; CLS : 0 |
| Crawl et canonisation | À corriger d'urgence | sitemap en `.com`, `robots.txt` absent, canonicals absentes |
| Contenu de conversion | Insuffisant | bénéfices, essai, planning, publics et FAQ pas assez visibles |
| Mesure des conversions | Insuffisant | pages vues Vercel actives, aucun événement métier identifié |
| Fréquentation sur 365 jours | Mesurée | 6 123 pages vues, 1 719 visiteurs uniques ; pic de rentrée très marqué |

## 2. Méthode et limites

L'audit combine : inspection de la codebase Next.js, compilation de production, contrôle TypeScript, analyse des pages publiques, recherche Google locale non personnalisée, contrôle du sitemap et de `robots.txt`, Lighthouse desktop/mobile, traces de performance Chrome et comparaison éditoriale avec plusieurs acteurs de Muret.

L'environnement a été authentifié sur l'équipe Vercel `yann-pro` et lié au projet `jkd-31` (`prj_nUsSmRFgyxXJC9PcIAoGGAdD4enk`). Les chiffres ci-dessous proviennent directement des métriques Vercel, relevées le 14 juillet 2026. La rétention du plan Pro autorise 366 jours pour Web Analytics et 30 jours pour Speed Insights. Google Analytics et Search Console ne sont pas connectés : les requêtes de recherche, impressions, clics SEO et conversions finales restent donc inconnus.

Il n'existe aucune donnée CrUX publique pour la page d'accueil au moment de la mesure. Les mesures Lighthouse sont des tests de laboratoire ; elles sont complétées par les données terrain anonymisées de Vercel Speed Insights.

## 3. Fréquentation et tracking

### État vérifié

- Vercel Web Analytics et Speed Insights sont intégrés globalement.
- Vercel mesure automatiquement les pages vues, les pages d'entrée, les référents, les pays et les caractéristiques techniques de manière anonyme et sans cookies.
- Aucun appel `track()` n'est présent : les actions qui correspondent réellement à une intention d'adhésion ne sont pas mesurées.
- Le formulaire de contact envoie un email mais ne produit aucun événement analytique métier.
- Aucun tag GA4, Google Tag Manager ou identifiant Search Console n'est présent dans la codebase.

### Évolution mensuelle mesurée

Période complète comparable : août 2025 à juin 2026. Juillet 2025 et juillet 2026 sont partiels et ne doivent pas être comparés à des mois pleins.

| Mois | Visiteurs uniques | Pages vues | Vues/visiteur | Évolution des vues |
|---|---:|---:|---:|---:|
| Juil. 2025, du 15 au 31 | 69 | 221 | 3,20 | partiel |
| Août 2025 | 212 | 772 | 3,64 | base |
| Sept. 2025 | 439 | 1 778 | 4,05 | +130 % |
| Oct. 2025 | 182 | 509 | 2,80 | −71 % |
| Nov. 2025 | 100 | 346 | 3,46 | −32 % |
| Déc. 2025 | 79 | 260 | 3,29 | −25 % |
| Janv. 2026 | 94 | 387 | 4,12 | +49 % |
| Févr. 2026 | 107 | 309 | 2,89 | −20 % |
| Mars 2026 | 127 | 436 | 3,43 | +41 % |
| Avr. 2026 | 72 | 239 | 3,32 | −45 % |
| Mai 2026 | 80 | 288 | 3,60 | +21 % |
| Juin 2026 | 106 | 411 | 3,88 | +43 % |
| Juil. 2026, du 1 au 14 | 51 | 166 | 3,25 | partiel |

Lecture : septembre concentre 29 % des 6 123 vues annuelles et 439 visiteurs, soit plus du double d'août. La rentrée est donc la fenêtre d'acquisition décisive. Après octobre, le site évolue autour de 72 à 127 visiteurs et 239 à 436 vues par mois. Il faut préparer les contenus, campagnes sociales, avis et pages d'essai avant mi-août, puis mesurer leur effet jusqu'à octobre.

Les visiteurs mensuels ne s'additionnent pas pour obtenir le total annuel, car une même personne peut revenir plusieurs mois. Le total dédupliqué sur 365 jours est de 1 719 visiteurs uniques pour 6 123 pages vues, soit 3,56 vues par visiteur unique.

### Pages, appareils et sources sur 365 jours

Les cinq pages principales concentrent presque tout le trafic : accueil 2 720 vues (44 %), tarifs 1 222 (20 %), association 1 147 (19 %), événements 580 (9 %) et contact 328 (5 %). La page tarifs est un actif de conversion majeur ; elle doit porter un CTA d'essai mesuré et répondre immédiatement aux objections prix, équipement, horaires et engagement.

La répartition par appareil compte 1 173 visiteurs mobiles, 525 desktop et 19 tablette dans les groupes Vercel, soit environ 68 % de mobile. Un visiteur multi-appareil peut apparaître dans plusieurs groupes. Les décisions UX et performance doivent donc être prises mobile d'abord.

| Référent | Pages vues | Part approximative |
|---|---:|---:|
| Direct / non attribué | 4 501 | 73,5 % |
| Google.com + Google.fr | 1 363 | 22,3 % |
| Facebook, toutes variantes | 120 | 2,0 % |
| Bing | 25 | 0,4 % |
| ecole-delannoy.fr | 24 | 0,4 % |
| DuckDuckGo | 23 | 0,4 % |

La part « direct / non attribué » inclut les saisies directes, favoris, liens sans référent et certains partages privés ; elle ne signifie pas que 73,5 % des personnes connaissaient déjà la marque. Google est de loin la première source identifiable. Facebook apporte peu de trafic mesurable et Instagram n'apparaît pas dans le top 15 : les futurs liens sociaux doivent porter des paramètres UTM cohérents.

La France représente 1 426 visiteurs uniques sur les 1 719 visiteurs annuels dédupliqués. Les États-Unis (100), la Chine (78) et l'Allemagne (37) peuvent inclure robots, VPN ou trafic non local ; Vercel Analytics ne permet pas ici d'isoler Muret. Search Console et une mesure des conversions sont indispensables pour juger la qualité réelle de l'audience.

La comparaison annuelle n'est pas disponible au-delà de la fenêtre Pro de 366 jours. Les chiffres Vercel seuls ne permettent pas d'attribuer les requêtes Google ni de relier une vue à une adhésion : Search Console et les événements de conversion sont nécessaires.

### Plan de mesure recommandé

Conserver Vercel Analytics pour sa simplicité et ajouter immédiatement des événements Pro :

- `cta_trial_click` : clic sur « Réserver un cours d'essai » ;
- `contact_form_start` : première interaction avec le formulaire ;
- `contact_form_success` et `contact_form_error` ;
- `phone_click`, `email_click`, `map_click` ;
- `social_click` avec la plateforme ;
- `event_contact_click` depuis une fiche événement.

La documentation Vercel confirme que les événements personnalisés sont disponibles sur les plans Pro et s'utilisent avec `track()` : [Tracking custom events](https://vercel.com/docs/analytics/custom-events). Les limites et la fenêtre de reporting dépendent du plan et de l'éventuel module Web Analytics Plus : [limites et tarification](https://vercel.com/docs/analytics/limits-and-pricing).

**Décision du 14 juillet 2026 : ne pas ajouter GA4.** Vercel Web Analytics et Speed Insights couvrent la baseline, les sources, pages, appareils, Core Web Vitals et événements de conversion nécessaires au club. Search Console complétera avec les requêtes et performances Google. Cette approche réduit les traceurs, la complexité RGPD et la maintenance. Les règles détaillées figurent dans [`../../governance/analytics-and-rgpd.md`](../../governance/analytics-and-rgpd.md).

## 4. SEO technique de production

### P0 — Sitemap publié avec le mauvais domaine

`https://www.jkd-selfdefense31.fr/sitemap.xml` renvoie des URLs en `https://www.jkd-selfdefense31.com`. Google exige que les URLs d'un sitemap appartiennent au même site/protocole/hôte que le sitemap. Il s'agit du défaut SEO le plus urgent. La cause est l'usage de `VERCEL_PROJECT_PRODUCTION_URL`, dont la valeur Vercel ne correspond manifestement pas au domaine canonique public.

Conséquences possibles : sitemap rejeté ou partiellement ignoré, confusion de canonisation et impossibilité de suivre correctement l'indexation par sitemap. Référence : [rapport Sitemaps de Google](https://support.google.com/webmasters/answer/7451001?hl=fr).

### P0 — Structure des titres H1 invalide

Le composant animé découpe son texte caractère par caractère et rend chaque lettre dans un `<motion.h1>`. Ce composant est utilisé dans la navigation globale. Les robots et lecteurs d'écran voient donc des dizaines de H1 composés d'une seule lettre sur toutes les pages. Les extraits des moteurs montrent déjà des titres verticaux lettre par lettre.

Lighthouse SEO ne sanctionne pas ce cas, ce qui explique le 100/100 malgré le défaut. L'animation doit conserver un seul H1 sémantique, avec des `<span aria-hidden="true">` pour les lettres animées et un texte accessible complet.

### P1 — `robots.txt` absent

`https://www.jkd-selfdefense31.fr/robots.txt` renvoie HTTP 404. Cela ne bloque pas Google, mais empêche de déclarer le sitemap et de fermer proprement `/studio`. Créer `app/robots.ts` avec l'URL canonique, le sitemap `.fr` et une règle de non-exploration du studio.

### P1 — Canonicals absentes

Aucune balise `link[rel=canonical]` n'a été observée sur les pages auditées. Le domaine répond avec `www`; il faut définir explicitement les URLs canoniques et mettre en place une redirection permanente cohérente de la variante sans `www` vers `www` (ou l'inverse, mais une seule variante).

### P1 — Studio Sanity publiquement découvrable

La route `/studio/[[...tool]]` est déployée dynamiquement. Elle doit être protégée, exclue du crawl et porter `noindex, nofollow`. Le simple `robots.txt` ne suffit pas à empêcher l'indexation d'une URL découverte par un lien externe.

### P1 — Données structurées locales incomplètes

Le site expose `Organization` et `WebSite`, mais pas une entité locale sportive détaillée. Ajouter un schéma `SportsActivityLocation` (ou `LocalBusiness` si approprié) avec nom, URL, téléphone, email, adresse du lieu d'entraînement, coordonnées, horaires et profils sociaux. Conserver `Event` sur les fiches événements et ajouter `BreadcrumbList` sur les pages profondes. Ne publier que des informations vérifiables.

### P2 — Dates du sitemap artificielles

Plusieurs `lastModified` sont figées en 2024 et les pages permanentes ont `changeFrequency: never`. Les dates doivent refléter une vraie modification ; sinon il vaut mieux les omettre. Les événements doivent être générés depuis Sanity et ajoutés au sitemap dynamique.

### P2 — Métadonnées à mieux localiser

Le title principal cible « Toulouse » alors que le club est à Muret. Cette formulation aide la zone large, mais réduit la précision locale. Proposition : « Jeet Kune Do & Self-défense à Muret | JKD 31 ». Réserver « Toulouse Sud » au texte et aux pages secondaires. Les descriptions de `/association` et `/tarifs` sont par ailleurs trop génériques et partiellement dupliquées.

### Performances : laboratoire et terrain

Lighthouse sur la page d'accueil obtient 100/100 en SEO et bonnes pratiques sur desktop et mobile. L'accessibilité atteint 100 desktop et 96 mobile. En laboratoire, le LCP est de 222 ms sur desktop et 1,29 s sur mobile simulé Slow 4G, avec CLS nul. Ces scores sont excellents, mais Lighthouse ne détecte pas les défauts de sitemap, de hiérarchie H1 ou de canonisation décrits plus haut.

Speed Insights confirme de bons Core Web Vitals au 75e percentile sur les 30 derniers jours :

| Mesure terrain p75 | Mobile | Desktop | Lecture |
|---|---:|---:|---|
| LCP | 2 096 ms | 1 364 ms | bon, mais mobile proche du seuil de 2,5 s |
| INP | 136 ms | 88 ms | bon, sous 200 ms |
| CLS | 0 | 0 | excellent |
| TTFB | 360 ms | 332 ms | bon |

Le point de vigilance est le LCP mobile. L'image de héros `home-background.webp` pèse environ 1,70 Mo, est chargée comme arrière-plan CSS et n'est découverte que tardivement ; la trace mobile montre une priorité initiale basse et environ 637 ms de délai avant chargement. La remplacer par `next/image` en mode `fill`, avec `sizes`, priorité/fetch priority élevée et une version compressée est l'optimisation prioritaire. Les autres actifs supérieurs à 1 Mo et `tree.svg` (environ 2,58 Mo) doivent être rationalisés. Le DOM reste raisonnable (311 éléments), le CLS est nul et aucun problème d'interactivité terrain n'est observé.

## 5. Contenu, pertinence et conversion

### Forces

- contenu authentique sur l'histoire du club et du Jeet Kune Do ;
- présentation des instructeurs et affiliation à l'EDAM ;
- tarifs publics, événements Sanity et coordonnées cohérentes sur le site ;
- visuels réels du club, bien plus crédibles que des images de stock ;
- présence sur le site de la mairie, l'EDAM, Waze/annuaires et dans La Dépêche ;
- pages indexées sur le domaine `.fr` malgré le sitemap erroné.

### Faiblesses

La page d'accueil privilégie les personnalités du Jeet Kune Do, mais répond trop tard aux questions d'un futur adhérent : « Est-ce adapté à mon niveau ? », « Quel cours choisir ? », « Quand ? », « Où ? », « Puis-je essayer ? », « Combien cela coûte ? ». Elle ne possède pas un appel principal évident vers un cours d'essai.

Les concurrents les mieux placés sur la requête générique couvrent davantage d'intentions : choix de discipline, planning, public par âge, essai, FAQ, coachs diplômés, villes voisines et inscription. Boxe & Mind Academy mentionne explicitement Muret, Toulouse Sud et les communes proches, publie une FAQ et offre des CTA « planning », « tarifs » et « je m'inscris ».

### Architecture éditoriale recommandée

La recherche éditoriale détaillée est documentée dans [`../../strategy/content-and-keywords.md`](../../strategy/content-and-keywords.md). Elle distingue quatre familles d'intentions : spécialité connue, besoin de self-défense, public concerné et décision d'essai.

1. Conserver l'accueil comme unique page cible de « Jeet Kune Do Muret » afin de protéger la première position observée.
2. Créer `/self-defense-muret`, page prioritaire pour la requête générique où le site est deuxième.
3. Créer `/cours-essai`, landing de conversion répondant à la tenue, au niveau, à l'âge, au matériel, au certificat, au coût et au déroulé.
4. Conserver `/tarifs` et en faire une page de décision complète, lisible sur mobile.
5. Créer un hub `/cours` ciblant « arts martiaux Muret », puis les pages femmes, adolescents et Kali uniquement avec des contenus réels et suffisamment distincts.
6. Recentrer `/association` sur le club, l'équipe et la pédagogie pour éviter qu'elle concurrence l'accueil sur le JKD.
7. Ajouter FAQ, preuves, planning HTML et CTA mesurés sur chaque page de cours.

### Idées de contenus à forte intention locale

- « Quel art martial choisir pour apprendre à se défendre à Muret ? » ;
- « Jeet Kune Do ou Krav Maga : quelles différences pour un débutant ? » ;
- « Self-défense féminine à Muret : comment se déroule un premier cours ? » ;
- « Arts martiaux pour adolescents à Muret : horaires, sécurité et progression » ;
- pages événements récapitulatives avec photos et compte-rendu après chaque stage ;
- portrait mensuel d'un instructeur ou adhérent avec son autorisation.

## 6. Analyse concurrentielle locale

### Relevé Google ponctuel

| Requête | Position JKD | Principaux concurrents devant le site |
|---|---:|---|
| Jeet Kune Do Muret | 1 | aucun |
| self défense Muret | 2 | page Facebook Krav Maga Muret |
| arts martiaux Muret | 7 | mairie, annuaire, Boxe & Mind, PagesJaunes, Mappy, Facebook Boxing Club |

Le club domine sa niche exacte mais perd la requête générique face aux agrégateurs et structures multi-disciplines. Il faut protéger la position JKD et élargir progressivement vers « self-défense », « cours d'essai », « ados » et « arts martiaux Muret », sans diluer l'identité.

### Opportunités d'autorité locale

- demander à la mairie de mettre à jour le nom, le lien HTTPS et les horaires ;
- faire corriger les anciennes fiches « Ji Dao » sur PagesJaunes, Mappy, Waze et autres annuaires ;
- obtenir/maintenir un lien de l'EDAM vers la page spécifique du club ;
- publier les stages dans les agendas mairie, associations et médias locaux ;
- utiliser la presse existante comme preuve éditoriale, sans reproduire les articles ;
- standardiser partout le NAP public : **JKD Self Defense 31 — 6 rue Pierre Bauduc — 31600 Muret — 06 84 05 93 26**.

Attention : l'avis SIRENE public mentionne une adresse administrative à Longages tandis que le site utilise le lieu d'entraînement à Muret. Ce n'est pas nécessairement une erreur, mais la distinction « siège administratif » / « lieu des cours » doit être explicite afin d'éviter une incohérence locale.

## 7. Google Business Profile

Une fiche semble déjà exister sous « Jeet Kune Do / Self-Défense — Association Ji Dao », à la bonne adresse et avec le bon domaine. Il ne faut surtout pas créer un doublon : Google recommande une seule fiche par établissement. La priorité est de revendiquer la fiche existante, vérifier son propriétaire, puis la renommer conformément à l'identité réellement utilisée : [règles Google Business Profile](https://support.google.com/business/answer/3038177?hl=fr).

À optimiser après accès :

- nom réel « JKD Self Defense 31 » ;
- catégorie principale la plus précise disponible, puis catégories secondaires minimales ;
- adresse du lieu de cours, téléphone, domaine `.fr` et horaires réels ;
- description claire sans bourrage de mots-clés ;
- photos récentes, logo, couverture et courtes vidéos ;
- lien de réservation de cours d'essai avec UTM ;
- actualité hebdomadaire en période de rentrée ;
- demande d'avis éthique après quelques séances, sans incitation financière ;
- réponse systématique aux avis et questions.

Si la fiche est gérée par un ancien compte, utiliser `business.google.com/add`, sélectionner la fiche puis « Demander l'accès ». Le propriétaire actuel dispose de trois jours pour répondre : [procédure officielle](https://support.google.com/business/answer/4566671?hl=fr-ca).

## 8. Réseaux sociaux et IA hors développement

Le rôle des réseaux n'est pas d'accumuler des abonnés mais de générer des essais traçables et des signaux de confiance locaux.

Cadence soutenable : deux contenus par semaine pendant la saison, renforcés six semaines avant la rentrée. Répartition conseillée : 40 % pédagogie, 30 % vie du club, 20 % preuve/portraits, 10 % offre/essai. Chaque publication importante utilise un lien UTM et une page d'atterrissage cohérente.

Outils utiles :

- **Canva Magic Studio** pour décliner une charte et réadapter les formats, avec validation humaine des visuels : [présentation officielle](https://www.canva.com/newsroom/news/magic-studio/) ;
- **CapCut** pour dérusher les démonstrations, recadrer verticalement et générer des sous-titres, à relire systématiquement : [Auto Captions](https://www.capcut.com/help/how-to-recognise-subtitles) ;
- **Buffer** pour planifier Facebook, Instagram, YouTube Shorts et Google Business, et réécrire une base par plateforme : [AI Assistant](https://buffer.com/fr/ai-assistant) ;
- un assistant rédactionnel pour proposer des angles, FAQ et variantes, sans inventer de diplômes, résultats ou témoignages.

Les visages, noms et témoignages exigent une autorisation adaptée, particulièrement pour les mineurs. Les contenus IA ne doivent pas simuler de vrais membres du club ni exagérer l'efficacité de la self-défense.

## 9. Marche à suivre à transmettre à la présidente

### Vercel

L'accès développeur est opérationnel : la CLI est authentifiée et le dossier lié à `yann-pro/jkd-31`. Aucune nouvelle action de la présidente n'est nécessaire pour Vercel à ce stade. Pour un autre intervenant :

1. se connecter au compte d'équipe propriétaire ;
2. inviter la personne dans l'équipe/projet avec le rôle minimal permettant Analytics et Speed Insights, sans partager de mot de passe ;
3. lui faire exécuter `vercel login`, puis `vercel link --project jkd-31 --scope yann-pro` ;
4. révoquer l'accès lorsqu'il n'est plus utile ;
5. ne jamais transmettre de token Vercel par email ou messagerie.

La CLI officielle est installée. Les commandes de lecture utilisées pour la baseline sont notamment :

```powershell
vercel metrics vercel.analytics_pageview.count --project jkd-31 --since 365d
vercel metrics vercel.speed_insights.lcp_ms --project jkd-31 --since 30d --aggregation p75
```

### Google Search Console

Si une propriété existe :

1. Ouvrir la propriété domaine `jkd-selfdefense31.fr`.
2. Aller dans **Paramètres → Utilisateurs et autorisations**.
3. Cliquer **Ajouter un utilisateur**.
4. Saisir l'adresse Google du développeur.
5. Donner **Accès complet** pour analyser et soumettre le sitemap ; conserver la présidente comme propriétaire vérifiée.

Google documente les rôles et cette procédure ici : [utilisateurs Search Console](https://support.google.com/webmasters/answer/7687615?hl=fr).

Si aucune propriété n'existe, créer une propriété **Domaine** et vérifier par DNS chez le registrar. La propriété domaine regroupe `www`, sans `www`, HTTP et HTTPS. Après correction technique, soumettre `https://www.jkd-selfdefense31.fr/sitemap.xml`, contrôler son statut et inspecter les URLs principales.

### Analytics et conformité

GA4 n'est pas retenu. Il n'y a donc aucun compte Analytics Google à créer ni accès à transmettre. La présidente doit valider avec le bureau :

1. l'identité exacte du responsable de traitement et l'adresse administrative à publier ;
2. une durée de conservation des demandes sans adhésion — proposition : 12 mois après le dernier échange ;
3. l'adresse permettant d'exercer les droits ;
4. les personnes habilitées à recevoir les formulaires ;
5. le chargement de la vidéo YouTube uniquement après une action explicite.

La page légale doit ensuite être réécrite selon [`../../governance/analytics-and-rgpd.md`](../../governance/analytics-and-rgpd.md). Le suivi Vercel reste sans cookie et sans donnée personnelle dans les événements, mais l'information des visiteurs, le formulaire, le DPA et les transferts doivent être documentés.

### Google Business Profile

1. Rechercher sur Google « Jeet Kune Do / Self-Défense Muret » depuis le compte de l'association.
2. Vérifier si la mention « Vous gérez cette fiche » apparaît.
3. Sinon, demander l'accès à la fiche existante ; ne pas en créer une seconde.
4. Après accès, inviter le développeur ou la personne communication comme **Gestionnaire**, pas propriétaire principal. Les gestionnaires peuvent modifier les informations, publier, répondre aux avis et télécharger les statistiques : [rôles Business Profile](https://support.google.com/business/answer/3403100?hl=fr).

## 10. Feuille de route priorisée

### 0 à 14 jours

1. Corriger domaine sitemap, `robots.txt`, canonicals et H1 animés.
2. Obtenir l'accès Search Console et relever la baseline requêtes/clics/impressions.
3. Revendiquer la fiche Google existante et corriger le nom/NAP.
4. Ajouter les événements Vercel de conversion.
5. Mettre à jour la page légale et charger YouTube uniquement à la demande.
6. Remplacer le CTA principal par « Réserver un cours d'essai ».

### 15 à 45 jours

1. Recomposer l'accueil autour des futurs adhérents tout en conservant sa cible « Jeet Kune Do Muret ».
2. Publier `/self-defense-muret` et `/cours-essai`, puis améliorer `/tarifs`.
3. Ajouter planning HTML, FAQ, preuves et données structurées locales.
4. Sécuriser le formulaire contre spam et abus.
5. Lancer un calendrier social de rentrée avec UTM.

### 45 à 90 jours

1. Publier le hub `/cours`, puis les pages femmes, adolescents et Kali confirmées par Search Console et l'offre réelle.
2. Corriger les citations locales et consolider les backlinks mairie/EDAM/presse.
3. Collecter des avis Google de manière régulière.
4. Comparer conversions par source et page d'entrée.
5. Ajuster les contenus selon les impressions, clics et conversions, sans ajouter de nouvel outil Analytics.

## 11. Objectifs à 90 jours

Les objectifs de trafic doivent être comparés à la baseline Vercel ci-dessus ; les objectifs SEO et de conversion seront finalisés après accès Search Console et déploiement des événements. Utiliser ces objectifs relatifs :

- 100 % des pages importantes indexables avec sitemap valide ;
- 100 % des contacts attribuables à une source et un support ;
- +25 % de clics Search Console non brandés sur trois mois comparables ;
- maintien du top 1 sur « Jeet Kune Do Muret » ;
- top 3 sur « self défense Muret » ;
- progression vers le top 5 sur « arts martiaux Muret » ;
- amélioration mesurable du ratio visite → contact/cours d'essai ;
- fiche Google complète, active et sans doublon.

## 12. Sources et preuves locales principales

- [Site JKD Self Defense 31](https://www.jkd-selfdefense31.fr/)
- [Fiche de la mairie de Muret](https://www.mairie-muret.fr/muret-bouge/annuaire-des-associations/entr%C3%A9e/vue/437%3Ajkd-self-d%C3%A9fense-31)
- [Répertoire des clubs EDAM](https://www.ecole-delannoy.fr/clubs/)
- [Article La Dépêche 2023](https://www.ladepeche.fr/2023/03/27/les-descendants-de-bruce-lee-sexercent-chez-nous-au-ji-dao-11091315.php)
- [Vercel Web Analytics](https://vercel.com/docs/analytics)
- [Guide Search Console](https://support.google.com/webmasters/answer/10267942?hl=fr)
