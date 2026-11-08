# Montée des dépendances, lot 1 : failles de sécurité (8 novembre 2026)

> Mise à jour des dépendances pour fermer les failles connues, sans montée
> majeure risquée. Branche `develop`, à livrer par PR vers `main`.

## Pourquoi

`pnpm audit` remontait **210 alertes, dont 5 critiques et 93 hautes**. Les
plus graves touchaient le site déployé :

| Paquet | Faille | Exposition du site |
|---|---|---|
| next 16.3.4 | Exécution de code à distance dans l'optimiseur d'images avec des SVG (corrigé en 16.4.1) | Probable. `/_next/image` est public et `remotePatterns` accepte tout `cdn.sanity.io`. Conditions exactes non vérifiées. |
| next 16.3.4 | SSRF dans l'optimiseur d'images, déni de service sur les Server Actions | Oui. Le formulaire de contact est une Server Action. |
| next 16.3.4 | Exécution de code via `next/og` et via `use cache` | Non, ni l'un ni l'autre n'est utilisé. |
| nodemailer 7.0.12 | Analyseur d'adresses qui peut livrer à un autre domaine que celui affiché, plusieurs dénis de service | Oui. L'adresse saisie dans le formulaire part dans `to` et `replyTo`. Aucune 7.x ne corrige, il faut 10.1.4 ou plus. |

La dernière montée (`5dc71fe`, 8 septembre, Next 16.1.3 vers 16.3.4) date
d'avant ces avis. Aucune autre branche, PR ou bot ne traitait le sujet :
GitHub n'a que `main` et `develop`, sans configuration Dependabot ni Renovate,
et les alertes Dependabot sont désactivées sur le dépôt.

## Changements

| Changement | Raison |
|---|---|
| `pnpm update` dans les plages existantes | Next 16.4.5, React 19.3.1, Sanity 5.31.2, next-sanity 12.4.5, PostCSS 8.5.32, Radix, etc. pnpm relève aussi les planchers (`^16.4.5`), ce qui empêche de redescendre sous une version corrigée. |
| nodemailer `^10.4.0` | Seule ligne corrigée. Les changements cassants de 8, 9 et 10 (Node 20 minimum, code d'erreur `NoAuth` renommé `ENOAUTH`, TLS vérifié pour le contenu distant) ne touchent pas notre usage. |
| Retrait de `@types/nodemailer` | nodemailer 10 fournit ses types. Ce paquet tirait aussi `@aws-sdk/client-sesv2` et une faille critique de `fast-xml-parser`. |
| Retrait de `@tanstack/react-table` | Importé nulle part. |
| `sharp` `^0.35.5`, déplacé en `devDependencies` | Le site ne l'importe pas (Vercel optimise les images sans lui). Seul `.design-sync/build-assets.mjs` l'utilise en local. |
| `@types/node` `^24` | Aligné sur `engines.node: 24.x`. |
| Suppression du bloc `overrides` | Champ npm, ignoré par pnpm (le lockfile n'avait aucune section `overrides`). Il ne faisait rien. Pour forcer une version transitive, pnpm attend `pnpm.overrides`. |
| `services/email-transport.ts` | `SendMailOptions` et `Attachment` sont importés depuis `'nodemailer'`. La v10 exporte ces types à la racine, l'espace de noms `nodemailer.SendMailOptions` n'existe plus et le chemin interne `nodemailer/lib/mailer` n'est plus nécessaire. |
| `README.md` | Versions alignées, Node 24 au lieu de « 20+ ». |

**next-sanity reste en 12.x.** pnpm la marque « deprecated » avec Next 16,
mais l'avertissement de Sanity ne vise que `defineLive` et `<SanityLive>`
(multiplication des requêtes). Le site ne les utilise pas : il passe par
`createClient` dans `sanity/lib/fetch.ts`.

## Résultat de l'audit

| | Critiques | Hautes | Moyennes | Basses | Total |
|---|---|---|---|---|---|
| Avant | 5 | 93 | 94 | 18 | 210 |
| Après | 0 | 8 | 9 | 2 | 19 |

Les 8 alertes hautes restantes (`adm-zip`, `js-yaml`) sont toutes dans
`@sanity/cli`, l'outil en ligne de commande. Il n'est pas embarqué dans le site
déployé. Sanity 6 ne les corrige pas (simulé).

## Vérifications

- `pnpm exec tsc --noEmit` : OK après la correction des imports nodemailer.
- `pnpm test` : 64 tests OK.
- `pnpm build` : OK sous Next.js 16.4.5, 14 routes.
- Serveur de production local : toutes les routes répondent 200 (`/`,
  `/association`, `/27-styles`, `/tarifs`, `/events`, une page événement,
  `/contact`, `/legal`, `/studio`, sitemap, robots, image Open Graph).
  L'optimiseur sert les images locales et celles de `cdn.sanity.io`.
- Studio Sanity 5.31.2 : se charge jusqu'à l'écran de connexion, sans erreur
  console ni ressource en échec.
- nodemailer 10 : un mail construit avec les mêmes options que
  `email-transport.ts` (expéditeur, réponse, copie, logo intégré par `cid`),
  via un transport qui n'envoie rien. En-têtes et pièce jointe conformes.
- `pnpm test:e2e` : 54 tests OK, 2 en échec, sans lien avec la montée (voir
  plus bas).
- `pnpm lint` : 2 erreurs et 8 avertissements, tous antérieurs (même version
  d'`eslint-plugin-react-hooks`, 7.1.1, et fichiers inchangés depuis août).

**Non vérifié :** l'envoi SMTP réel vers Gandi, pour ne pas envoyer de vrai
mail depuis un poste de développement. À contrôler après déploiement avec une
soumission réelle du formulaire.

## Reporté (montées majeures sans gain de sécurité)

| Montée | Risque | Note |
|---|---|---|
| Tailwind 3 vers 4, avec tailwind-merge 3, tailwind-scrollbar 4 et le remplaçant de tailwindcss-animate | Élevé | Migration de configuration, chantier dédié. |
| lucide-react 0.x vers 1.x | Casse le build | La v1 a retiré les icônes de marque. `components/shared/footer.tsx` importe `Facebook` et `Instagram`. Il faudra des SVG. |
| Sanity 6, next-sanity 13 | Moyen | Montée majeure du Studio. next-sanity 13 accepte Sanity 5.29 ou plus, donc les deux peuvent se faire séparément. |
| ESLint 10 | Faible à moyen | ESLint 9 n'est plus maintenu. `eslint-config-next` 16.4.5 accepte ESLint 9 et plus. |
| TypeScript 6 puis 7, Vitest 5, react-email 6 | À évaluer | Rien ne presse. |
| framer-motion 14, `@vercel/analytics` 2, `@vercel/speed-insights` 2 | Faible | Changements cassants limités aux API internes, au support Nuxt et à la licence. |

## Constats hors périmètre

- **Formulaire de contact sans validation serveur.** `sendEmail` accepte
  n'importe quelle valeur dans `email`, y compris une liste d'adresses. La
  boîte de l'association peut ainsi servir de relais de spam. C'est la Task 6
  de `docs/seo/technical/implementation-plan.md`, traitée dans une session
  séparée.
- **Test e2e daté.** « annonce de rentrée › s'affiche sur l'accueil »
  (`e2e/rendu.spec.ts:210`) exige l'annonce visible, alors que
  `constant/announcement.ts` la masque après le 4 octobre 2026. Le test
  échoue depuis le 5 octobre. Il devrait se conditionner à la fenêtre
  d'affichage.
- **Erreurs de lint antérieures.** `react-hooks/immutability` dans
  `components/ui/3d-card.tsx:124` et `react-hooks/set-state-in-effect` dans
  `hooks/use-media-query.ts:14`.
- **ESLint parcourt `.claude/worktrees/`.** Les worktrees des sessions Claude
  doublent les résultats de `pnpm lint`. Ajouter `.claude/**` aux ignores de
  la config ESLint.
- **`remotePatterns` trop large.** `hostname: 'cdn.sanity.io'` sans `pathname`
  laisse passer les fichiers de n'importe quel projet Sanity par notre
  optimiseur. Restreindre à `/images/<projectId>/**`.
- **Alertes Dependabot désactivées.** Les activer dans Settings > Advanced
  Security aurait signalé les failles de Next.js dès leur publication.
