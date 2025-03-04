# WordPress to Sanity Migration

## Overview

This script automates the migration of content from a WordPress site to a Sanity CMS project. It fetches all pages and posts from WordPress using the REST API, converts the HTML content into a format compatible with Sanity's portableText schema, and uploads the structured data to Sanity.

## Prerequisites

Before running this script, ensure you have the following:

- Node.js installed
- A Sanity project set up
- API credentials (project ID, dataset, and authentication token)
- Access to the WordPress REST API

## Installation

1. Clone the repository or create a new project folder.
2. Install dependencies:
   ```sh
   npm install @sanity/client axios jsdom dotenv
   ```
3. Configure the Sanity client by replacing the placeholders in the script:
   ```js
   const client = createClient({
     projectId: 'your-project-id',
     dataset: 'production',
     token: 'your-token',
     apiVersion: '2023-10-10'
   });
   ```

## Schema for `post` in Sanity
Note: Please ensure that this schemas matches with your WordPress posts and pages schema,

To store the migrated WordPress posts in Sanity, create a schema file for the `post` content type:

```js
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
      type: 'array',
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
```

## Schema for `page` in Sanity

To store WordPress pages in Sanity, create a schema file for the `page` content type:

```js
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
      type: 'array',
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
```

## Migration Steps

### Step 1: Fetch Data from WordPress
- Retrieve posts and pages using the WordPress REST API.
- Fetch up to 100 posts and pages per request.

### Step 2: Convert HTML Content
- Convert WordPress HTML content into Sanity-compatible Portable Text format.

### Step 3: Upload Data to Sanity
- Create new documents in Sanity for posts and pages.
- Store fields such as title, slug, content, and date.

### Step 4: Handle Featured Images
- Download and upload images to Sanity.
- Store image references in the corresponding documents.

### Step 5: Delete Existing Content (Optional)
- A function is available to delete all existing posts before migration.
- Uncomment `deleteAllContent()` in the script if you need to clean up old data.

### Step 6: Run the Migration
To start the migration, execute the following command:
```sh
node WordpressToSanityMigration.js
```

## Error Handling

- Logs errors if fetching WordPress data or uploading to Sanity fails.
- Implements retry logic for API rate limits to prevent excessive failures.
- Provides detailed console logs for troubleshooting.

## Acknowledgments

A [remote agency](https://www.rwit.io/) with a global reach specializing in developing custom software and headless applications

Made with ❤️ by [RWIT](https://www.rwit.io/)

## Contact Us

For any questions or support, feel free to reach out at [RWIT](https://www.rwit.io/contact?utm_source=www&utm_medium=contactbutton&utm_campaign=visit).

## Notes

- Ensure you have the necessary API permissions in Sanity before running the script.
- Adjust API endpoints and schema fields as needed based on your WordPress data structure.

## License

This script is open-source and can be modified as needed for your migration requirements.

