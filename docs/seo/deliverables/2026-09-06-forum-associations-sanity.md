# Fiche Sanity : Forum des associations de Muret 2026

À saisir dans le Studio, document **Événement**. Prêt à publier : la date de
reprise a été confirmée par Yann le 30 août 2026.

## Champs

| Champ du Studio | Valeur à saisir |
|---|---|
| **Titre** | `Forum des associations de Muret 2026` |
| **Slug** | `forum-des-associations-muret-2026` |
| **Origine** | Interne |
| **Dates de l'événement** | `06/09/2026` |
| **Tranches horaires** | `10h - 17h` |
| **Lieu, nom** | `Salle Horizon Pyrénées` |
| **Lieu, adresse** | `253 avenue des Pyrénées` |
| **Lieu, code postal** | `31600` |
| **Lieu, ville** | `Muret` |
| **Personnalité** | laisser vide |
| **Image principale** | l'affiche du forum |

Le lieu est pré-rempli avec le Gymnase Albert Camus à la création : il faut le
remplacer par la Salle Horizon Pyrénées.

## Descriptif

Texte simple. Un double saut de ligne crée un paragraphe, un saut simple crée un
retour à la ligne. Ni gras ni puces, le champ ne les interprète pas.

```
Le club JKD Self Defense 31 tient un stand au Forum des associations de Muret, le dimanche 6 septembre 2026 de 10h à 17h à la Salle Horizon Pyrénées. Entrée libre et gratuite, parking gratuit.

Les instructeurs du club sont présents toute la journée. Quel cours choisir, à partir de quel âge, quel niveau physique faut-il, comment se passe un premier cours : venez poser vos questions, sans rendez-vous et sans engagement.

Ce que nous enseignons
Le Jeet Kune Do, l'art martial créé par Bruce Lee, ainsi que le Kali philippin, le Silat et le JKD Boxing (Jun Fan Kick Boxing). Le club propose aussi de la self-défense féminine, de la self-défense mixte et un cours ados de 13 à 15 ans.

Nos cours à Muret
Les entraînements ont lieu au Gymnase Albert Camus, 6 rue Pierre Bauduc à Muret, les mardis, mercredis et jeudis en soirée. La reprise de la saison 2026-2027 a lieu le mardi 8 septembre 2026 à 20h.

Venir essayer
Si vous ne pouvez pas passer au forum, écrivez-nous depuis la page contact du site ou appelez le 06 84 05 93 26. Nous répondons à toutes les demandes, y compris celles de personnes qui n'ont jamais pratiqué.
```

La première phrase est reprise telle quelle comme description dans les résultats
Google, parce que le code envoie le descriptif entier dans la balise. Elle
contient donc à elle seule la discipline, la ville, la date, l'heure, le lieu et
la gratuité. Ne pas la raccourcir.

## Le recadrage de l'image, en pratique

Ce n'est ni du Next.js ni un travail manuel dans un éditeur d'images. C'est le
**hotspot de Sanity**, et il se règle en trois clics dans le Studio :

1. téléverser l'affiche dans **Image principale** ;
2. cliquer sur l'image, puis sur l'icône de recadrage qui apparaît ;
3. déplacer le cercle du hotspot sur la photo des instructeurs, en haut de
   l'affiche, et valider.

Le site demande ensuite une image en 1200 × 630 pour l'aperçu Facebook et
LinkedIn. Sanity recadre autour du hotspot au lieu de couper au centre, donc
l'aperçu montre les instructeurs et non le milieu du texte.

Le code jetait cette information : il passait la seule référence de l'asset
(`mainImage.asset._ref`) au constructeur d'URL, alors que le hotspot vit sur
l'objet image complet. Corrigé le 30 août 2026 dans `sanity/lib/imageUrl.ts` et
les six appels concernés. Sans ce correctif, régler le hotspot n'aurait rien
changé à l'aperçu.

Le texte de l'affiche reste invisible pour Google et pour les moteurs de réponse,
puisque c'est une image. Tout ce qui doit être trouvé en recherche doit figurer
dans le descriptif ci-dessus.

## Pourquoi « Interne » et non « Externe »

Le champ ne dit pas qui organise, il dit à qui appartient la page. En externe, la
canonical part vers le site d'origine et la fiche n'est plus indexée pour
elle-même. Or l'objectif est justement de sortir sur « forum des associations
Muret arts martiaux ».

Réserve assumée : en interne, les données structurées déclarent
`organizer: JKD Self Defense 31`. Le forum est organisé par la mairie de Muret,
nous y tenons un stand. Un champ `organisateur` optionnel dans le schéma corrigera
ce point, c'est une modification de quinze minutes inscrite au backlog.

## Sources

- [Salle événementielle Horizon Pyrénées, mairie de Muret](https://www.mairie-muret.fr/vie-economique-ville-de-muret/salle-evenementielle-horizon-pyrenees)
- [Forum des associations, agenda de la mairie de Muret](https://www.mairie-muret.fr/muret-bouge/evenements-agenda-ville-de-muret/588-forum-des-associations)
