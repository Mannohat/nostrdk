import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

const podcasts = defineCollection({
	// Load Markdown files in the `src/content/podcasts/` directory.
	loader: glob({ base: './src/content/podcasts', pattern: '**/*.md' }),
	// Type-check frontmatter using a schema
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
	// Load Markdown files in the `src/content/resources/` directory.
	loader: glob({ base: './src/content/resources', pattern: '**/*.md' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		url: z.string(),
		category: z.string(), // e.g., "klienter", "extensions", "tools", etc.
		section: z.string(), // For organizing within tables (e.g., "Twitter", "Youtube")
		order: z.number(),
		published: z.boolean().default(true),
	}),
});

export const collections = { blog, podcasts, resources };