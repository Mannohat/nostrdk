import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

const podcasts = defineCollection({
	loader: glob({ base: './src/content/podcasts', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		videoId: z.string().optional(),
		imageUrl: z.string().optional(),
		externalUrl: z.string().optional(),
		category: z.enum(['featured', 'beginner', 'guides', 'series']),
		order: z.number(),
		published: z.boolean().default(true),
	}),
});

const resources = defineCollection({
	loader: glob({ base: './src/content/resources', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		url: z.string(),
		category: z.string(),
		section: z.string().optional(), // ← valgfri, bruges ikke af alle ressourcer
		order: z.number(),
		published: z.boolean().default(true),
	}),
});

export const collections = { blog, podcasts, resources };