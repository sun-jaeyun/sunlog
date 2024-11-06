import { defineCollection, reference, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const categories = defineCollection({
  loader: file('src/data/blog/config.json', { parser: (text) => JSON.parse(text).categories }),
  // schema: z.object({
  //   name: z.string(),
  // }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.string(),
    // Reference an array of related posts from the `blog` collection by `slug`
    // relatedPosts: z.array(reference('blog')),
  }),
});

export const collections = { categories, blog };
