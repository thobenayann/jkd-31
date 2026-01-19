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

## Structure

- `email.types.ts` : Types TypeScript pour les emails
- `email-config.ts` : Configuration des emails selon l'environnement
- `email-transport.ts` : Implémentation du transporteur Nodemailer (Gandi SMTP)
- `send-email.ts` : Fonction principale d'envoi d'email (gère les deux emails)

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
});

if (result.success) {
    console.log('Emails envoyés !', result.messageId);
} else {
    console.error('Erreur:', result.error);
}
```

## Configuration SMTP

Le service utilise la configuration suivante pour Gandi :
- **Host** : `mail.gandi.net`
- **Port** : `465`
- **Secure** : `true` (SSL)

## Fonctionnement

1. Lorsqu'un formulaire est soumis, le système :
   - Génère l'email admin avec toutes les informations du formulaire
   - Envoie cet email à `ADMIN_MAIL` (ou `DEV_TEST_EMAIL` en développement)
   - Si `ADMIN_MAIL_CC` (ou `DEV_TEST_EMAIL_CC`) est configuré, l'email est aussi envoyé en copie
   - Génère l'email de confirmation personnalisé
   - Envoie l'email de confirmation à l'adresse email de l'utilisateur

2. Si l'envoi de l'email admin échoue, une erreur est retournée
3. Si l'envoi de l'email de confirmation échoue, un succès est quand même retourné (l'email admin a été envoyé)
