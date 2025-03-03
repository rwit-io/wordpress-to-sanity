const { createClient } = require('@sanity/client');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();


// Initialize Sanity client
const client = createClient({
  projectId: process.env.PROJECT_ID,
  dataset: 'production',
  token: process.env.TOKEN,
  apiVersion: '2023-10-10'
});

// Function to migrate pages
const migratePages = async (pages) => {
  const formattedPages = await Promise.all(pages.map(async (page) => {
    // Create a new page in Sanity
    return client.create({
      _type: 'page',
      title: page.title.rendered,
      slug: { _type: 'slug', current: page.slug },
      content: page.content.rendered,
      date: page.date,
    }).then(res => {
      console.log(`Page created with ID: ${res._id}`);
    }).catch(err => {
      console.error('Error creating page:', err);
    });
  }));

  return formattedPages;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const uploadImageToSanity = async (imageUrl, retries = 5) => {
  try {
    console.log(`Waiting before uploading image: ${imageUrl}`);
    await delay(1000);
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${imageUrl}`);

    const imageBuffer = await response.arrayBuffer();

    const sanityImage = await client.assets.upload('image', Buffer.from(imageBuffer), {
      filename: imageUrl.split('/').pop(),
    });

    console.log(`Uploaded image: ${sanityImage._id}`);
    return sanityImage._id;
  } catch (error) {
    if (error.statusCode === 429 && retries > 0) {
      console.warn(`Rate limit exceeded. Retrying in 5 seconds... (${retries} retries left)`);
      await delay(5000);
      return uploadImageToSanity(imageUrl, retries - 1);
    }

    console.error("Error uploading image:", error);
    return null;
  }
};

const migratePosts = async (posts) => {
  for (const post of posts) {
    console.log(`Processing post: ${post.title}`);

    let featuredImageRef = null;
    if (post.featured_image) {
      featuredImageRef = await uploadImageToSanity(post.featured_image);
    }

    await delay(1000);

    await client.create({
      _type: 'post',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      content: post.content,
      excerpt: post.excerpt,
      date: post.date,
      categories: post.categories.map(cat => ({
        _key: `${cat.id}-${Date.now()}`,
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      })) || [],
      tags: post.tags.map(tag => ({
        _key: `${tag.id}-${Date.now()}`,
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      })) || [],
      author: post.author || '',
      featuredImage: featuredImageRef
        ? { _type: 'image', asset: { _type: 'reference', _ref: featuredImageRef } }
        : null,
    }).then(res => {
      console.log(`Post created with ID: ${res._id}`);
    }).catch(err => {
      console.error('Error creating post:', err);
    });
  }
};

// Fetch data from WordPress
const fetchWordPressData = async () => {
  try {
    const postsResponse = await axios.get(process.env.WORDPRESS_POST_API);
    const pagesResponse = await axios.get(process.env.WORDPRESS_PAGE_API);

    const posts = postsResponse.data;
    const pages = pagesResponse.data;

    await migratePosts(posts);
    // await migratePages(pages);
  } catch (error) {
    console.error('Error fetching WordPress data:', error);
  }
};

// Function to delete documents by type
async function deleteDocumentsByType(docType) {
  try {
    const documents = await client.fetch(`*[_type == "${docType}"]{_id}`);
    if (!documents.length) {
      console.log(`No documents found for type: ${docType}`);
      return;
    }

    for (const doc of documents) {
      await client.delete(doc._id);
      console.log(`Deleted document with ID: ${doc._id}`);
    }
    console.log(`All documents of type "${docType}" have been deleted.`);
  } catch (err) {
    console.error(`Error deleting documents of type "${docType}":`, err);
  }
}
async function deleteAllContent() {
  await deleteDocumentsByType('post');
}

// Uncomment the below function to Start the deletion process
// deleteAllContent();


// Start the migration process
fetchWordPressData();
