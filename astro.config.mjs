// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://nostr.dk',
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => {
				/** @type {any} */
				const p = page;
				const pathLike =
					typeof page === "string"
						? page
						: page && typeof page === "object"
							? // v3.x may pass either `{ pathname }` or `{ url }`
								(p.pathname ?? p.url ?? "")
							: "";
				const s = String(pathLike);
				return !s.includes("/test-betaling");
			},
		}),
	],
});
