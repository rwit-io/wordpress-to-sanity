import { defineField, defineType, defineArrayMember } from 'sanity';

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'content',
      type: 'string',
      title: 'Content',
      of: [
        defineArrayMember({
          type: 'block',
        }),
      ],
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      title: 'Date',
    }),
  ],
});