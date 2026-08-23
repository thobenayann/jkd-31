# Référentiel SEO — JKD Self Defense 31

Ce dossier est la source de vérité pour le référencement, l'acquisition locale, la mesure d'audience et la conformité associée au site. Il est conçu pour être compris par le bureau de l'association, le développeur et tout agent IA intervenant ultérieurement.

## Carte des documents

| Besoin | Document |
|---|---|
| Comprendre l'audit daté | [`audit/2026-07-14/audit-seo-marketing.md`](audit/2026-07-14/audit-seo-marketing.md) |
| Consulter les preuves Lighthouse et performance | [`audit/2026-07-14/evidence/`](audit/2026-07-14/evidence/) |
| Définir les pages, mots-clés et contenus | [`strategy/content-and-keywords.md`](strategy/content-and-keywords.md) |
| Appliquer les choix Analytics et RGPD | [`governance/analytics-and-rgpd.md`](governance/analytics-and-rgpd.md) |
| Implémenter les corrections | [`technical/implementation-plan.md`](technical/implementation-plan.md) |
| Savoir ce qui a déjà été corrigé, quand et pourquoi | [`../reviews/`](../reviews/) (notes datées, dernière : [`2026-08-23-revue-qualite.md`](../reviews/2026-08-23-revue-qualite.md)) |
| Comprendre la conception du rapport | [`specs/2026-07-14-president-report-design.md`](specs/2026-07-14-president-report-design.md) |
| Rejouer le chantier documentaire | [`plans/2026-07-14-seo-documentation-president-report.md`](plans/2026-07-14-seo-documentation-president-report.md) |
| Présenter la situation au bureau | [`deliverables/rapport-presidente-2026-07-14.html`](deliverables/rapport-presidente-2026-07-14.html) |

## Ordre de lecture pour un agent de code

1. Lire ce README et les décisions non négociables ci-dessous.
2. Lire `governance/analytics-and-rgpd.md` avant tout changement de tracking, formulaire, vidéo ou page légale.
3. Lire `strategy/content-and-keywords.md` avant de créer ou restructurer une page publique.
4. Utiliser `technical/implementation-plan.md` comme backlog d'exécution et critères d'acceptation.
5. Lire la dernière note de `../reviews/` pour ne pas refaire ce qui est fait ni contredire une décision datée.
6. Consulter l'audit daté pour le contexte et les chiffres de référence.
7. Utiliser les preuves brutes uniquement pour confirmer un diagnostic ou comparer une nouvelle mesure.

## Décisions non négociables au 14 juillet 2026

- La mesure repose sur Vercel Web Analytics et Speed Insights. GA4, Google Tag Manager, Meta Pixel et autres outils publicitaires ne sont pas prévus.
- Les événements Vercel ne doivent contenir aucune donnée personnelle ou librement saisie.
- Google Search Console est nécessaire pour les requêtes SEO, mais n'ajoute aucun traceur au site.
- La fiche Google Business existante doit être revendiquée et renommée selon le nom réellement utilisé par le club ; ne pas créer de doublon.
- Le domaine canonique public est `https://www.jkd-selfdefense31.fr`.
- Le lieu d'entraînement public et l'adresse administrative de l'association doivent rester clairement distingués.
- Les contenus ciblent d'abord Muret et l'intention d'un futur adhérent, sans répétition artificielle de mots-clés.
- Toute image reconnaissable d'un membre, et particulièrement d'un mineur, exige une autorisation adaptée.

## Mise à jour du référentiel

- Ajouter un dossier daté sous `audit/` pour une nouvelle campagne de mesures ; ne jamais écraser les preuves historiques.
- Mettre à jour la stratégie et la gouvernance lorsqu'une décision change, avec une date et une justification.
- Cocher les tâches du plan technique au fur et à mesure des pull requests.
- Relever mensuellement les indicateurs Vercel et Search Console après leur mise en place.
- Ne stocker dans `docs/` aucun token, export contenant une adresse IP, donnée de contact ou information d'adhérent.
