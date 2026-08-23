# Gouvernance Analytics et RGPD

**Décision applicable à partir du :** 14 juillet 2026
**Périmètre :** site `www.jkd-selfdefense31.fr`, Vercel, formulaire de contact, contenus tiers et mesures d'acquisition
**Responsable de la validation organisationnelle :** présidente de JKD Self Defense 31

Ce document fixe les règles de mise en œuvre pour le développeur et les futurs agents. Il ne remplace pas un conseil juridique adapté ; les informations propres à l'association, les durées et les bases légales doivent être validées par le bureau avant publication.

## 1. Décision analytique

Le site utilise uniquement :

- Vercel Web Analytics pour les pages vues, visiteurs agrégés, sources, pages, appareils et événements métier ;
- Vercel Speed Insights pour les performances réelles ;
- Google Search Console pour les requêtes, impressions, clics, CTR, positions et indexation ;
- Google Business Profile pour la visibilité locale, les avis, appels, itinéraires et clics vers le site.

Ne pas installer sans nouvelle décision écrite :

- Google Analytics 4 ;
- Google Tag Manager ;
- Meta Pixel ;
- TikTok Pixel ;
- Hotjar, Clarity ou outil de replay ;
- dispositif publicitaire, remarketing ou identification inter-sites.

Cette décision réduit les traceurs, les transferts, la maintenance et le besoin d'une plateforme générale de consentement. Elle sera réévaluée uniquement si un besoin métier précis ne peut pas être satisfait par Vercel et Search Console.

## 2. Pourquoi aucun bandeau général n'est prévu

Vercel indique que Web Analytics :

- n'utilise pas de cookies ;
- produit des points de données anonymes et agrégés ;
- ne rattache pas les mesures à un utilisateur ou à une adresse IP ;
- ne suit pas une personne entre plusieurs sites ou applications.

La CNIL précise qu'une mesure limitée à l'audience du seul éditeur et à des statistiques anonymes peut, sous conditions, être exemptée de consentement. L'éditeur demeure responsable de son analyse, de l'information des visiteurs, de la minimisation et du suivi des prestataires.

En conséquence, aucun bandeau de consentement général n'est nécessaire tant que :

1. la configuration reste conforme aux règles de ce document ;
2. aucun outil exclu ci-dessus n'est ajouté ;
3. aucun contenu tiers soumis au consentement n'est chargé automatiquement ;
4. les audits périodiques ne détectent pas de nouveau traceur ;
5. la politique de confidentialité informe clairement les visiteurs.

L'absence de cookie ne signifie pas que le site est automatiquement conforme au RGPD. Le formulaire contient des données personnelles et Vercel reste un prestataire à documenter.

## 3. Données Vercel autorisées

### Pages vues automatiques

- chemin de page public ;
- référent ;
- pays ou zone agrégée ;
- type d'appareil, navigateur et système ;
- horodatage ;
- mesures de performance.

Les URL publiques ne doivent jamais contenir un nom, email, téléphone, token, message ou identifiant interne d'adhérent. Les fiches événements peuvent utiliser un identifiant technique Sanity s'il ne désigne pas une personne.

### Événements personnalisés

| Événement | Déclenchement | Propriétés autorisées |
|---|---|---|
| `cta_trial_click` | clic vers le cours d'essai | `page`, `placement`, `course_type` |
| `contact_form_start` | première interaction utile | `page`, `form_type` |
| `contact_form_success` | confirmation serveur uniquement | `page`, `form_type`, `course_type` |
| `contact_form_error` | échec présenté au visiteur | `page`, `error_type` parmi une liste fermée |
| `phone_click` | clic sur un lien `tel:` | `page`, `placement` |
| `email_click` | clic sur un lien `mailto:` | `page`, `placement` |
| `map_click` | ouverture de l'itinéraire | `page`, `placement` |
| `social_click` | sortie vers un réseau | `page`, `platform` |
| `event_contact_click` | contact depuis un événement | `event_type`, `placement` |

Valeurs autorisées : chaînes courtes issues d'une liste contrôlée, nombres non identifiants, booléens et `null`.

### Données interdites dans Analytics

- prénom, nom ou pseudonyme ;
- email, téléphone ou adresse ;
- message ou champ libre ;
- texte d'une erreur technique contenant une donnée saisie ;
- âge ou date de naissance ;
- état de santé, handicap ou certificat ;
- récit d'agression, harcèlement ou autre situation personnelle ;
- donnée ou identifiant relatif à un mineur ;
- identifiant d'adhérent, d'inscription ou de paiement ;
- adresse IP, fingerprint ou identifiant publicitaire ;
- URL avec token, clé ou paramètre personnel.

## 4. Configuration préventive `beforeSend`

L'implémentation doit supprimer tous les paramètres d'URL avant envoi et rejeter une route reconnue comme sensible.

```tsx
import type { BeforeSendEvent } from '@vercel/analytics/react';

const blockedPathFragments = ['/reset-', '/invitation/', '/private/'];

export function sanitizeAnalyticsEvent(
  event: BeforeSendEvent,
): BeforeSendEvent | null {
  const url = new URL(event.url);

  if (blockedPathFragments.some((part) => url.pathname.includes(part))) {
    return null;
  }

  url.search = '';
  url.hash = '';

  return { ...event, url: url.toString() };
}
```

Le type exact devra être confirmé contre la version installée de `@vercel/analytics`. Les tests doivent vérifier la suppression de `email`, `token`, `utm_*` et de tout paramètre inconnu. Les UTM servent à l'attribution de la page d'entrée, mais il n'est pas nécessaire de conserver leur valeur dans l'URL envoyée si la source/référent est déjà correctement remontée.

## 5. Page légale et politique de confidentialité cible

La page actuelle doit être remplacée par une information structurée contenant au minimum :

### Éditeur et responsable de traitement

- nom public et nom juridique exact de l'association ;
- adresse administrative destinée aux mentions légales ;
- email de contact RGPD ;
- représentant de l'association ;
- informations d'immatriculation ou RNA/SIREN si applicables et confirmées.

Le lieu d'entraînement de Muret et l'adresse administrative de Longages ne doivent pas être confondus. La présidente doit confirmer quelle adresse doit être publiée dans chaque rubrique.

### Formulaire de contact et cours d'essai

| Élément | Politique proposée à valider |
|---|---|
| Finalité | répondre à une demande et organiser un éventuel cours d'essai |
| Base légale | mesures précontractuelles demandées par la personne pour un essai ; intérêt légitime pour une question générale |
| Données | identité minimale, moyen de contact, cours/créneau souhaité, message facultatif limité |
| Destinataires | membres habilités du bureau et encadrant concerné, prestataires email strictement nécessaires |
| Durée proposée | suppression 12 mois après le dernier échange si la personne ne devient pas adhérente |
| Suite en cas d'adhésion | bascule vers un traitement « gestion des adhérents » documenté séparément |

La durée de 12 mois est une proposition opérationnelle, pas une valeur automatique imposée par la loi. Le bureau doit la valider et s'assurer que les emails, sauvegardes et exports sont effectivement supprimés selon cette règle.

### Vercel Analytics et Speed Insights

- finalités : statistiques anonymes, amélioration du contenu, de l'ergonomie et des performances ;
- données agrégées décrites dans la section 3 ;
- absence de cookies Vercel Analytics ;
- événements de conversion sans donnée personnelle ;
- prestataire Vercel et lien vers sa documentation de confidentialité ;
- durée accessible selon le plan : jusqu'à 366 jours pour Web Analytics et 30 jours pour Speed Insights, constatée lors de l'audit ;
- transferts internationaux et garanties contractuelles décrites dans le DPA Vercel.

### Droits des personnes

- droit d'accès, rectification, effacement, limitation et opposition selon le traitement ;
- droit de retirer un consentement lorsqu'il constitue la base légale ;
- méthode de contact simple et délai de réponse ;
- droit d'introduire une réclamation auprès de la CNIL ;
- lien vers `https://www.cnil.fr/`.

### Mention courte sous le formulaire

Texte de travail à faire valider :

> JKD Self Defense 31 utilise les informations saisies pour répondre à votre demande et organiser, si vous le souhaitez, un cours d'essai. Les champs obligatoires sont signalés. En l'absence d'adhésion, les échanges sont supprimés au plus tard 12 mois après le dernier contact. Vous pouvez exercer vos droits en écrivant à [adresse validée]. En savoir plus dans notre politique de confidentialité.

Ne pas ajouter une case « J'accepte la politique de confidentialité » si le traitement repose sur des mesures précontractuelles ou l'intérêt légitime : une information claire est nécessaire, mais une fausse demande de consentement brouillerait la base légale. Une case distincte, facultative et non précochée serait nécessaire pour une future prospection sans rapport avec la demande initiale.

## 6. Vidéo YouTube et contenus tiers

Le code actuel charge une iframe `youtube-nocookie.com` dès l'affichage de la section association. Le domaine « nocookie » réduit certains stockages mais ne supprime pas la connexion au tiers ni tous les risques de traceurs après activation.

Règle cible :

1. afficher une image locale optimisée et un bouton « Charger la vidéo YouTube » ;
2. expliquer avant le clic qu'une connexion à YouTube sera établie ;
3. créer l'iframe uniquement après l'action explicite ;
4. fournir un lien direct comme alternative ;
5. permettre de retirer la préférence si elle est mémorisée ;
6. ne jamais charger automatiquement un widget Facebook, Instagram, Google Maps ou flux social.

Un simple lien externe vers Google Maps ou un réseau social ne charge pas son service dans la page et doit être préféré à un embed.

## 7. Vercel comme sous-traitant

Le plan Pro est couvert par le Data Processing Addendum de Vercel. Le dossier interne RGPD doit conserver ou référencer :

- version et date du DPA ;
- liste des sous-traitants Vercel ;
- mécanismes de transfert applicables, dont clauses contractuelles types ;
- finalités et catégories de données ;
- durée et méthode de suppression ;
- personnes ayant accès au projet Vercel ;
- date du dernier examen.

Vercel indique que ses principales installations de traitement se trouvent aux États-Unis et prévoit des mécanismes contractuels pour les transferts. Cela doit être mentionné dans l'analyse interne et, lorsque pertinent, dans l'information des visiteurs.

## 8. Accès et responsabilités

| Système | Propriétaire attendu | Accès développeur |
|---|---|---|
| Vercel | compte/équipe contrôlé par l'association ou mandat documenté | membre nominatif, droits minimaux |
| Search Console | présidente ou compte institutionnel | utilisateur complet, pas propriétaire délégué si inutile |
| Google Business | présidente propriétaire principale | Gestionnaire |
| Canva Pro | association ou responsable communication | accès au dossier de marque uniquement |
| Email | association | accès limité aux personnes répondant aux demandes |

Interdictions : mot de passe partagé, token transmis par messagerie, compte personnel unique sans solution de reprise, accès conservé après la mission.

## 9. Registre minimal des traitements

Créer au moins quatre fiches internes :

1. demandes de contact et cours d'essai ;
2. gestion des adhérents ;
3. communication, photos et réseaux sociaux ;
4. statistiques anonymes et performance du site.

Pour chaque fiche : finalité, données, personnes concernées, base légale, destinataires, durée, prestataires, transferts, sécurité et procédure d'exercice des droits.

Les photos/vidéos et les mineurs sont gérés séparément du tracking. Canva ne doit contenir que des médias dont les droits et autorisations sont connus.

## 10. Checklist avant chaque nouveau service

- [ ] Le service répond-il à un besoin que Vercel/Search Console ne couvre pas ?
- [ ] Dépose-t-il ou lit-il un traceur ?
- [ ] Reçoit-il l'adresse IP, l'URL ou un identifiant ?
- [ ] Réutilise-t-il les données pour son propre compte ?
- [ ] Effectue-t-il un suivi entre plusieurs sites ?
- [ ] Où les données sont-elles traitées ?
- [ ] Un DPA et des garanties de transfert existent-ils ?
- [ ] Peut-il être chargé uniquement après une action ?
- [ ] La page légale et le registre sont-ils mis à jour ?
- [ ] Le refus laisse-t-il le site utilisable ?

Si une réponse reste inconnue, le service n'est pas ajouté.

## 11. Revue périodique

### Tous les mois

- vérifier les événements et leurs propriétés ;
- contrôler qu'aucune donnée libre n'apparaît ;
- supprimer les accès devenus inutiles ;
- traiter les demandes d'exercice de droits.

### À chaque livraison

- scanner cookies, localStorage et requêtes tierces ;
- tester la vidéo avant/après consentement contextuel ;
- vérifier le formulaire et sa mention courte ;
- examiner toute nouvelle URL dynamique.

### Une fois par an

- relire ce document et la page publique ;
- réexaminer DPA, sous-traitants et transferts Vercel ;
- contrôler les durées réelles de suppression ;
- actualiser le registre ;
- auditer les autorisations d'image et comptes utilisateurs.

## 12. Sources officielles

- [CNIL — solutions de mesure d'audience et conditions d'exemption](https://cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience)
- [CNIL — contenus externes et consentement](https://www.cnil.fr/fr/questions-reponses-lignes-directrices-modificatives-et-recommandation-cookies-traceurs)
- [CNIL — premières étapes RGPD](https://www.cnil.fr/fr/passer-laction/rgpd-les-premieres-etapes)
- [CNIL — guide de sensibilisation pour les associations](https://www.cnil.fr/sites/default/files/atoms/files/cnil-guide_association.pdf)
- [Vercel — Web Analytics](https://vercel.com/docs/analytics)
- [Vercel — confidentialité et conformité de Web Analytics](https://vercel.com/docs/analytics/privacy-policy)
- [Vercel — événements personnalisés](https://vercel.com/docs/analytics/custom-events)
- [Vercel — Data Processing Addendum](https://vercel.com/legal/dpa)

Dernière consultation des sources : 14 juillet 2026.
