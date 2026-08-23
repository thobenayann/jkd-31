# Guide pour les agents

Site de l'association JKD Self Defense 31 (Muret). Next.js 16 App Router, React 19,
TypeScript, Tailwind, Sanity (CMS), déployé sur Vercel. Gestionnaire de paquets : pnpm.

## À lire avant d'agir

| Besoin | Où |
|---|---|
| Ce qui a déjà été corrigé, quand, pourquoi, et ce qui reste | [`docs/reviews/`](docs/reviews/), notes datées. Lire la plus récente en premier. |
| SEO, mesure d'audience, RGPD, décisions non négociables | [`docs/seo/README.md`](docs/seo/README.md) |
| Backlog technique SEO avec cases à cocher | [`docs/seo/technical/implementation-plan.md`](docs/seo/technical/implementation-plan.md) |

## Commandes

```bash
pnpm dev          # serveur de développement
pnpm test         # Vitest, tests unitaires de lib/
pnpm lint         # ESLint 9 (flat config)
pnpm exec tsc --noEmit
pnpm build && pnpm start
```

Régénérer les types Sanity après un changement de schéma :

```bash
npx sanity schema extract && npx sanity typegen generate
```

## Règles du projet

- **Domaine canonique** : `https://www.jkd-selfdefense31.fr`, défini dans `constant/site.ts`.
  Aucune URL publique ne doit venir de `VERCEL_PROJECT_PRODUCTION_URL` (Vercel y met le `.com`).
- **Données structurées** : générées par `lib/structured-data.ts`, rendues par
  `components/seo/json-ld.tsx`. Un champ inconnu est omis, jamais remplacé par un texte
  de substitution. Jamais `next/script` pour du JSON-LD.
- **Logique métier hors des composants** : tri, filtrage, sitemap et JSON-LD vivent dans
  `lib/` sous forme de fonctions pures testées. Les composants ne font que brancher.
- **Types Sanity** : `sanity.types.ts` est généré, ne pas l'éditer. Pas de `as any` pour
  contourner un type manquant : régénérer.
- **Données Sanity** : toute écriture en masse passe par un script dans `scripts/`,
  en simulation par défaut, et se consigne dans `docs/reviews/`.
- **Méthode** : état des lieux écrit et validé avant de coder, tests avec le correctif,
  vérification sur un build de production local avant la PR.
- **Livraison** : branche `develop`, PR vers `main`, le merge sur `main` déploie en
  production. Le merge reste une décision de Yann.

## Déploiement

`engines.node` est épinglé à 24 dans `package.json` : le runtime Node 20 de Vercel faisait
planter (SIGSEGV) toutes les routes serveur. Ne pas retirer.
