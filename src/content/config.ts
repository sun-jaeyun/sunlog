import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**\/[^_]*.md', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    // Reference an array of related posts from the `blog` collection by `slug`
    // relatedPosts: z.array(reference('blog')),
  }),
});

export const collections = { blog };