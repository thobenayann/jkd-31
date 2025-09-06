import { defineType, Rule, type ValidationContext } from 'sanity';

export default defineType({
    name: 'evenement',
    title: 'Événement',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Titre',
            type: 'string',
            validation: (rule: Rule) =>
                rule.required().error("Le titre de l'événement est requis"),
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (rule: Rule) =>
                rule.required().error("Le slug de l'événement est requis"),
        },
        {
            name: 'description',
            title: 'Descriptif',
            type: 'text',
            validation: (rule: Rule) => rule.optional(),
        },
        {
            name: 'origin',
            title: "Origine de l'événement",
            type: 'string',
            options: {
                list: [
                    { title: 'Interne', value: 'internal' },
                    { title: 'Externe', value: 'external' },
                ],
                layout: 'radio',
            },
            initialValue: 'internal',
            validation: (rule: Rule) => rule.required(),
        },
        {
            name: 'externalUrl',
            title: "URL de l'événement externe",
            type: 'url',
            hidden: (ctx) =>
                (ctx.parent as { origin?: 'internal' | 'external' } | undefined)
                    ?.origin !== 'external',
            validation: (rule: Rule) =>
                rule
                    .uri({ allowRelative: false, scheme: ['http', 'https'] })
                    .custom((value, context: ValidationContext) => {
                        const parent = context.parent as
                            | { origin?: 'internal' | 'external' }
                            | undefined;
                        return parent?.origin === 'external' && !value
                            ? 'URL requise pour un événement externe'
                            : true;
                    }),
        },
        {
            name: 'mainImage',
            title: 'Image principale',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (rule: Rule) => rule.optional(),
        },
        {
            name: 'eventDates',
            title: "Dates de l'événement",
            type: 'array',
            of: [{ type: 'date' }],
            validation: (rule: Rule) =>
                rule
                    .required()
                    .min(1)
                    .error("Les dates de l'événement sont requises"),
        },
        {
            name: 'timeSlots',
            title: 'Tranches horaires',
            type: 'array',
            of: [{ type: 'string' }],
            validation: (rule: Rule) =>
                rule
                    .required()
                    .min(1)
                    .error('Les tranches horaires sont requises'),
        },
        {
            name: 'personality',
            title: 'Personnalité',
            type: 'object',
            fields: [
                {
                    name: 'firstName',
                    title: 'Prénom',
                    type: 'string',
                    validation: (rule: Rule) => rule.required(),
                },
                {
                    name: 'lastName',
                    title: 'Nom',
                    type: 'string',
                    validation: (rule: Rule) => rule.required(),
                },
                {
                    name: 'title',
                    title: 'Titre',
                    type: 'string',
                    validation: (rule: Rule) => rule.optional(),
                },
                {
                    name: 'photo',
                    title: 'Photo',
                    type: 'image',
                    validation: (rule: Rule) => rule.optional(),
                },
            ],
        },
    ],
    preview: {
        select: {
            title: 'title',
            author: 'author.name',
            media: 'mainImage',
            eventDates: 'eventDates',
        },
        prepare(selection) {
            const { title, media, eventDates } = selection;
            let eventDate: string;

            switch (true) {
                case Array.isArray(eventDates) && eventDates.length === 1:
                    eventDate = `Date: ${new Date(
                        eventDates[0]
                    ).toLocaleDateString('fr-FR')}`;
                    break;

                case Array.isArray(eventDates) && eventDates.length > 1:
                    eventDate = `Dates: ${eventDates
                        .map((date: string) =>
                            new Date(date).toLocaleDateString('fr-FR')
                        )
                        .join(' et ')}`;
                    break;

                default:
                    eventDate = 'Pas de date';
                    break;
            }
            return {
                title,
                subtitle: eventDate,
                media,
            };
        },
    },
});
