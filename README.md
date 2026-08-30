# JKD Self Defense 31 - Site Web Officiel

![Next.js](https://img.shields.io/badge/Next.js-16.1.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)

Site web officiel de l'association **JKD Self Defense 31**, une association sportive basée à Muret (France) qui promeut et enseigne le Jeet Kune Do, art martial créé par Bruce Lee, ainsi que la self-défense.

## 📋 Table des matières

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Développement](#développement)
- [Structure du projet](#structure-du-projet)
- [Déploiement](#déploiement)
- [Auteur](#auteur)

## À propos

Ce projet est le site web officiel de l'association **JKD Self Defense 31**, située au **6 Rue Pierre Bauduc, 31600 Muret, France**. Le site présente l'association, ses cours, ses événements et permet aux visiteurs de prendre contact avec l'équipe.

### L'association

- **Nom** : JKD Self Defense 31
- **Adresse** : 6 Rue Pierre Bauduc, 31600 Muret, France
- **Téléphone** : +33 6 84 05 93 26
- **Email** : contact@jkd-selfdefense31.fr
- **Présidente** : Fanny GABORIT

### Disciplines enseignées

- Jeet Kune Do
- Kali
- Silat
- Self-défense
- JKD Boxing (Jun Fan Kick Boxing)
- Jun Fan Conditioning

## Fonctionnalités

### Pages principales

- **Page d'accueil** : Présentation de l'association avec animations et nuage de mots
- **L'association** : Informations détaillées sur le JKD, l'association, l'équipe pédagogique et vidéos
- **Tarifs** : Présentation des différents cours avec horaires et tarifs
- **Événements** : Gestion dynamique des événements via Sanity CMS avec filtres et détails
- **Contact** : Formulaire de contact avec envoi d'email automatique (admin + confirmation utilisateur)
- **Mentions légales** : Informations légales de l'association

### Fonctionnalités techniques

- ✅ **CMS Headless** : Intégration Sanity pour la gestion des événements
- ✅ **Système d'email** : Envoi d'emails stylisés avec React Email et Nodemailer
- ✅ **Animations** : Animations fluides avec Framer Motion
- ✅ **Responsive Design** : Design adaptatif mobile-first
- ✅ **SEO optimisé** : Métadonnées et Open Graph configurés
- ✅ **Accessibilité** : Composants accessibles avec Radix UI
- ✅ **Performance** : Optimisation des images et lazy loading

## Technologies utilisées

### Framework & Bibliothèques principales

- **Next.js** 16.1.3 - Framework React avec App Router
- **React** 19.2.3 - Bibliothèque UI
- **TypeScript** 5.9.3 - Typage statique
- **Tailwind CSS** 3.4.1 - Framework CSS utilitaire

### CMS & Backend

- **Sanity** 5.4.0 - CMS headless pour la gestion de contenu
- **next-sanity** 12.0.12 - Intégration Sanity avec Next.js

### UI & Composants

- **Shadcn UI** - Composants UI accessibles
- **Radix UI** - Primitives UI accessibles
- **Framer Motion** 12.27.0 - Animations
- **Lucide React** - Icônes

### Email & Communication

- **React Email** 5.2.5 - Templates d'email
- **Nodemailer** 7.0.12 - Envoi d'emails via SMTP

### Autres

- **date-fns** 4.1.0 - Manipulation de dates
- **react-hook-form** 7.71.1 - Gestion de formulaires
- **next-themes** 0.4.6 - Gestion des thèmes
- **@vercel/analytics** - Analytics

## Prérequis

- **Node.js** 20+ (recommandé via nvm ou fnm)
- **pnpm** 10.13.1+ (gestionnaire de paquets)
- **Compte Sanity** (pour le CMS)
- **Compte email SMTP** (Gandi Mail configuré)

## Installation

1. **Cloner le repository**

```bash
git clone <repository-url>
cd jkd-31
```

2. **Installer les dépendances**

```bash
pnpm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env.local` à la racine du projet :

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-read-token

# Email (Production)
SERVER_MAIL=your-email@gandi.net
SERVER_MAIL_PASSWORD=your-password
ADMIN_MAIL=admin@example.com
ADMIN_MAIL_CC=cc@example.com

# Email (Développement)
DEV_TEST_EMAIL=test@example.com
DEV_TEST_EMAIL_CC=test-cc@example.com

# Vercel (optionnel)
VERCEL_ENV=development
```

4. **Configurer Sanity**

```bash
# Se connecter à Sanity
pnpm sanity login

# Initialiser le projet (si nécessaire)
pnpm sanity init
```

## Configuration

### Configuration Sanity

Le schéma Sanity est défini dans `sanity/schemas/`. Les événements sont gérés via le type `event`.

### Configuration Email

Le système d'email est configuré dans `services/email-config.ts` et utilise :
- **Production** : SMTP Gandi Mail
- **Développement** : Emails de test configurés via variables d'environnement

Les templates d'email sont dans `emails/` :
- `admin-contact-email.tsx` - Email envoyé à l'admin
- `confirmation-email.tsx` - Email de confirmation à l'utilisateur

## Développement

### Lancer le serveur de développement

```bash
pnpm dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

### Lancer Sanity Studio

```bash
pnpm sanity dev
```

Le studio sera accessible sur [http://localhost:3333](http://localhost:3333)

### Build de production

```bash
pnpm build
```

### Lancer en production

```bash
pnpm start
```

### Linter

```bash
pnpm lint
```

## Structure du projet

```
jkd-31/
├── app/                          # App Router Next.js
│   ├── (admin)/                  # Routes admin (Sanity Studio)
│   └── (client)/                 # Routes client
│       ├── (home)/               # Page d'accueil
│       ├── association/          # Page association
│       ├── contact/              # Page contact
│       ├── events/               # Page événements
│       ├── tarifs/               # Page tarifs
│       └── legal/                 # Mentions légales
├── components/                   # Composants React
│   ├── shared/                   # Composants partagés
│   ├── ui/                       # Composants UI (Shadcn)
│   └── magicui/                  # Composants Magic UI
├── constant/                     # Constantes
│   └── config.ts                 # Configuration association
├── data/                         # Données statiques
│   ├── courses.json              # Données des cours
│   └── personalities-data.json   # Données personnalités
├── emails/                       # Templates React Email
│   ├── admin-contact-email.tsx
│   └── confirmation-email.tsx
├── lib/                          # Utilitaires
├── services/                     # Services backend
│   ├── email-config.ts           # Configuration email
│   ├── email-transport.ts        # Transport Nodemailer
│   └── send-email.ts              # Service d'envoi
├── sanity/                       # Configuration Sanity
│   ├── schemas/                  # Schémas Sanity
│   └── lib/                      # Utilitaires Sanity
└── types/                        # Types TypeScript
```

## Déploiement

### Vercel (recommandé)

1. Connecter le repository à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Variables d'environnement requises

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`
- `SERVER_MAIL`
- `SERVER_MAIL_PASSWORD`
- `ADMIN_MAIL`
- `ADMIN_MAIL_CC` (optionnel)
- `VERCEL_ENV` (défini automatiquement par Vercel)

### Build

Le build Next.js génère une application optimisée pour la production avec :
- Optimisation des images
- Code splitting automatique
- SSR/SSG selon les routes
- Optimisation des performances

## Auteur

**Yann THOBENA**

- 🌐 Site web : [https://www.yanndevweb.com/](https://www.yanndevweb.com/)
- 📧 Email : [Contact via le site](https://www.yanndevweb.com/)

---

Développé avec ❤️ pour l'association JKD Self Defense 31

© 2025 JKD Self Defense 31 - Tous droits réservés
