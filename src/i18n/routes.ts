/**
 * i18n route registry — single source of truth for Danish ↔ English page mapping.
 *
 * Background: the Danish site lives at the ROOT (no `/da/` prefix). English pages
 * are NEW files under `/en/`. Danish stays canonical (hreflang x-default → Danish).
 *
 * The `EN_LIVE` gate is what prevents 404s during a partial migration: a link is
 * only rewritten to its English path when that English page actually exists yet.
 * Until then, links fall back to the Danish (root) path. As each section lands,
 * add its English path(s) to `EN_LIVE`.
 */

export type Lang = 'da' | 'en';

/**
 * Danish (root) path → English (`/en`) path.
 * Keys are canonical Danish paths with no trailing slash, except the homepage `'/'`.
 * Add a row here when a new translatable page exists; flip it on by adding the
 * English value to `EN_LIVE` once the page is actually built.
 */
export const DA_TO_EN: Readonly<Record<string, string>> = {
	'/': '/en/',
	'/apps': '/en/apps',
	'/podcasts': '/en/podcasts',
	'/blog': '/en/blog',
	'/profiler': '/en/profiles',
	'/getnip05': '/en/get-nip05',
	'/privatlivspolitik': '/en/privacy-policy',
};

/** English (`/en`) path → Danish (root) path. Derived from `DA_TO_EN`. */
export const EN_TO_DA: Readonly<Record<string, string>> = Object.fromEntries(
	Object.entries(DA_TO_EN).map(([da, en]) => [en, da]),
);

/**
 * English paths that actually exist as built pages yet. START EMPTY.
 * Add each English path here the moment its `/en/*.astro` page is created, so
 * the language switcher, hreflang alternates, and `localizedHref()` start
 * pointing at it. Strings MUST match the values in `DA_TO_EN` exactly.
 */
export const EN_LIVE: ReadonlySet<string> = new Set<string>([
	'/en/privacy-policy', // privatlivspolitik
	'/en/podcasts', // podcasts
	// '/en/',            // home          — add when src/pages/en/index.astro lands
	// '/en/apps',        // apps          — add when src/pages/en/apps.astro lands
	// '/en/blog',        // blog
	// '/en/profiles',    // profiler
	// '/en/get-nip05',   // getnip05
]);

/** Strip a trailing slash except for the bare root `'/'`. */
function normalizePath(path: string): string {
	if (path.length > 1 && path.endsWith('/')) return path.replace(/\/+$/, '');
	return path === '' ? '/' : path;
}

/** Derive the active language from a pathname. Anything under `/en` is English. */
export function getLangFromPath(pathname: string): Lang {
	const p = normalizePath(pathname);
	return p === '/en' || p.startsWith('/en/') ? 'en' : 'da';
}

/**
 * Map an internal Danish (root) href to its English equivalent — but ONLY when
 * that English page is live (`EN_LIVE`). Otherwise the original Danish href is
 * returned, so partially-migrated sites never 404.
 *
 * - `lang === 'da'`            → returns `daHref` unchanged.
 * - external / non-root hrefs  → returned unchanged.
 * - query strings and hashes   → preserved (e.g. `/apps?type=client#x`).
 * - path not in the registry   → returned unchanged.
 */
export function localizedHref(daHref: string, lang: Lang): string {
	if (lang !== 'en') return daHref;
	// Only touch internal, root-relative links (not `//cdn…`, not `https://…`, not `#`, not `mailto:`).
	if (!daHref.startsWith('/') || daHref.startsWith('//')) return daHref;

	const hashIdx = daHref.indexOf('#');
	const hash = hashIdx >= 0 ? daHref.slice(hashIdx) : '';
	const beforeHash = hashIdx >= 0 ? daHref.slice(0, hashIdx) : daHref;

	const queryIdx = beforeHash.indexOf('?');
	const query = queryIdx >= 0 ? beforeHash.slice(queryIdx) : '';
	const path = queryIdx >= 0 ? beforeHash.slice(0, queryIdx) : beforeHash;

	const enPath = DA_TO_EN[normalizePath(path)];
	if (!enPath || !EN_LIVE.has(enPath)) return daHref;
	return enPath + query + hash;
}

/**
 * Given the current pathname, return the canonical Danish-root key for the page
 * (used to look up alternates). English pages resolve back through `EN_TO_DA`.
 * Returns `null` for pages not in the registry (dynamic/test pages).
 */
export function daKeyForPath(pathname: string): string | null {
	const p = normalizePath(pathname);
	if (getLangFromPath(p) === 'en') {
		// Normalize `/en` → `/en/` for the home lookup.
		const enKey = p === '/en' ? '/en/' : p;
		return EN_TO_DA[enKey] ?? null;
	}
	return p in DA_TO_EN ? p : null;
}

/**
 * Resolve the language-switcher target for the current page.
 * Returns the counterpart path, or `null` when no usable counterpart exists
 * (e.g. on a Danish page whose English version is not live yet).
 */
export function switcherTarget(pathname: string, targetLang: Lang): string | null {
	const daKey = daKeyForPath(pathname);
	if (daKey == null) return null;
	if (targetLang === 'da') return daKey; // Danish always exists.
	const enPath = DA_TO_EN[daKey];
	return enPath && EN_LIVE.has(enPath) ? enPath : null;
}
