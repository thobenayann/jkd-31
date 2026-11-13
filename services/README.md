# Service d'envoi d'emails

Ce service gère l'envoi d'emails via Nodemailer avec le serveur SMTP Gandi.

Le système envoie automatiquement **deux emails** :
1. **Email à l'administrateur** : Contient toutes les informations du formulaire de contact
2. **Email de confirmation** : Envoyé à la personne qui a soumis le formulaire pour confirmer la réception

## Configuration

### Variables d'environnement requises

#### Pour tous les environnements

- `SERVER_MAIL` : Adresse email complète du serveur (requis)
- `SERVER_MAIL_PASSWORD` : Mot de passe de l'email serveur (requis)

#### Pour le développement

- `DEV_TEST_EMAIL` : Adresse email de test pour recevoir les emails admin (optionnel, défaut: `test@test.dev`)
- `DEV_TEST_EMAIL_CC` : Adresse email en copie pour le développement (optionnel)

#### Pour la production

- `ADMIN_MAIL` : Adresse email de l'administrateur principal (optionnel, défaut: `thobena.yann@orange.fr`)
- `ADMIN_MAIL_CC` : Adresse email en copie pour la production (optionnel)

#### Limitation de débit (Production et Preview)

- `RATE_LIMIT_SECRET` : secret aléatoire d'au moins 32 octets (`openssl rand -hex 32`).
  Sert de clé au HMAC des deux compteurs (IP, par bloc /64 en IPv6, et
  destinataire), et le SDK `@vercel/firewall` le lit aussi.
- Une règle du pare-feu Vercel : condition `@vercel/firewall` égale à `contact-form`,
  action Rate Limit, fenêtre fixe de 600 s, 5 requêtes, réponse 429.

Sans l'un des deux, le formulaire fonctionne sans limitation et un avertissement
`[contact]` apparaît dans les logs. Hors Vercel (dev, `next start` local, tests),
la limitation est ignorée.

## Structure

- `email.types.ts` : Types TypeScript pour les emails et la réponse de la server action
- `email-config.ts` : Configuration des emails selon l'environnement
- `email-transport.ts` : Implémentation du transporteur Nodemailer (Gandi SMTP)
- `contact-rate-limit.ts` : Limitation de débit par IP hachée (pare-feu Vercel)
- `send-email.ts` : Server action du formulaire (validation, limitation, envoi des deux emails)
- `../lib/validation/contact.ts` : Schéma zod du formulaire, normalisation des caractères invisibles et détection du champ piège
- `../lib/contact-screening.ts` : Tri des liens (message `clean` ou `suspect`), porté d'Hexoprint
- `../lib/safe-text.ts` : Désamorçage des liens dans le mail admin (`hxxps://piege[.]online`)
- `../lib/contact-admin-email.ts` : Objet, Reply-To et confirmation selon le tri

## Templates React Email

- `emails/admin-contact-email.tsx` : Template pour l'email envoyé à l'administrateur
- `emails/confirmation-email.tsx` : Template pour l'email de confirmation à l'utilisateur

Les deux templates utilisent la charte graphique du site avec la couleur principale `#006599` (jkdBlue).

## Utilisation

```typescript
import { sendEmail } from '@/services/send-email';

const result = await sendEmail({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '+33123456789',
    message: 'Mon message',
    website: '', // champ piège, doit rester vide
});

switch (result.status) {
    case 'success': // envoyé (ou robot repéré, volontairement indiscernable)
    case 'invalid': // result.fieldErrors : un message par champ
    case 'rate_limited': // trop d'envois depuis cette IP
    case 'error': // échec SMTP, détail dans les logs serveur uniquement
}
```

Le payload est traité comme `unknown` : la server action est un point d'entrée
POST public, appelable sans passer par le formulaire.

## Configuration SMTP

Le service utilise la configuration suivante pour Gandi :
- **Host** : `mail.gandi.net`
- **Port** : `465`
- **Secure** : `true` (SSL)

## Fonctionnement

1. Lorsqu'un formulaire est soumis, le système :
   - Ignore en silence la soumission si le champ piège est rempli
   - Valide et normalise le payload (une seule adresse, tailles bornées, aucun champ inattendu)
   - Vérifie la limite de débit, uniquement pour une soumission valide : l'IP
     d'abord (pleine, rien n'est envoyé), puis le destinataire (plein, seule la
     confirmation est supprimée, le bureau reçoit toujours la demande)
   - Trie les liens du message : un lien vers un autre hôte que le site, ou un
     lien dans le nom ou le téléphone, rend le message suspect. Une ligne JSON
     `contact_screening` (verdict, motifs, hôtes, aucune donnée personnelle)
     part dans les logs, au niveau `warn` si le message est suspect
   - Génère l'email admin. Tout lien saisi hors du site y est désamorcé
     (`hxxps://piege[.]online`), aucune messagerie ne peut le rendre cliquable
   - Envoie cet email à `ADMIN_MAIL` (ou `DEV_TEST_EMAIL` en développement)
   - Si `ADMIN_MAIL_CC` (ou `DEV_TEST_EMAIL_CC`) est configuré, l'email est aussi envoyé en copie
   - Message suspect : objet préfixé `[À VÉRIFIER]`, bandeau d'avertissement,
     tous les liens désamorcés, pas de Reply-To, et **aucune confirmation** envoyée
   - Message propre : génère et envoie l'email de confirmation à l'adresse de l'utilisateur

   Le visiteur reçoit la même réponse dans les deux cas : rien ne lui apprend
   que son message a été repéré.

2. Si l'envoi de l'email admin échoue, `{ status: 'error' }` est retourné, sans le détail SMTP
3. Si l'envoi de l'email de confirmation échoue, un succès est quand même retourné (l'email admin a été envoyé)
