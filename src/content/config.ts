import { defineCollection, reference, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const categories = defineCollection({
  loader: file('src/data/blog/categories.json'),
  schema: z.object({
    bgTopColor: z.string().optional(),
    bgBottomColor: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: reference('categories'),
    // relatedPosts: z.array(reference('blog')),
  }),
});

export const collections = { categories, blog };
