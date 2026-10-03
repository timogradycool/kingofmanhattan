import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categorySlugs } from './lib/categories';

// Every approval is one Markdown file in content/approvals/.
// The filename becomes the page URL: content/approvals/joes-pizza.md -> /approved/joes-pizza/
const approvals = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/approvals' }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      category: z.string().refine((slug) => categorySlugs.includes(slug), {
        message: `category must be one of the slugs in content/categories.json: ${categorySlugs.join(', ')}`,
      }),
      remyQuote: z.string().optional(),
      dateApproved: z.coerce.date(),
      photo: image().optional(),
      photoAlt: z.string().optional(),
      location: z.string().optional(),
      link: z.url().optional(),
      stickerAwarded: z.boolean().default(false),
      placeholder: z.boolean().default(false),
    }),
});

export const collections = { approvals };
