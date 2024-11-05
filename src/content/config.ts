import { defineCollection, reference, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const config = defineCollection({
  loader: file('src/data/blog/config.json'),
  // schema: z.object({
  //   categories: z.array(z.string()),
  // }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    category: z.string(),
    // Reference an array of related posts from the `blog` collection by `slug`
    // relatedPosts: z.array(reference('blog')),
  }),
});

export const collections = { config, blog };
