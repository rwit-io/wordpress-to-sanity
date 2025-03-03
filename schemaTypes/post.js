import { defineField, defineType, defineArrayMember } from 'sanity';

export const postType = defineType({
  name: 'post',
  title: 'Post',
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
      }),
    defineField({
        name: 'excerpt',
        type: 'string',
        title: 'Excerpt',
      }),
    defineField({
      name: 'date',
      type: 'datetime',
      title: 'Date',
    }),
    defineField({
        name: 'categories',
        type: 'array',
        title: 'Categories',
        of: [
          {
            type: 'object',
            fields: [
              { name: 'id', type: 'number', title: 'ID' },
              { name: 'name', type: 'string', title: 'Name' },
              { name: 'slug', type: 'string', title: 'Slug' },
            ],
          },
        ],
      }),      
      defineField({
        name: 'tags',
        type: 'array',
        title: 'Tags',
        of: [
          {
            type: 'object',
            fields: [
              { name: 'id', type: 'number', title: 'ID' },
              { name: 'name', type: 'string', title: 'Name' },
              { name: 'slug', type: 'string', title: 'Slug' },
            ],
          },
        ],
      }),      
    defineField({
      name: 'author',
      type: 'string',
      title: 'Author',
    }),
    defineField({
        name: 'featuredImage',
        type: 'image',
        title: 'Featured Image',
        options: { hotspot: true },
      }),   
  ],
});