import { defineType } from 'sanity'

export default defineType({
  name: 'evenement',
  title: 'Événement',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'description',
      title: 'Descriptif',
      type: 'text',
    },
    {
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'eventDates',
      title: "Dates de l'événement",
      type: 'array',
      of: [{ type: 'date' }],
    },
    {
      name: 'timeSlots',
      title: 'Tranches horaires',
      type: 'array',
      of: [{ type: 'string' }],
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
        },
        {
          name: 'lastName',
          title: 'Nom',
          type: 'string',
        },
        {
          name: 'title',
          title: 'Titre',
          type: 'string',
        },
        {
          name: 'photo',
          title: 'Photo',
          type: 'image',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
