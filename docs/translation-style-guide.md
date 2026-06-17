# Nostr.dk — English Translation Style Guide

This guide governs the English (`/en/`) version of nostr.dk. **Danish is canonical**
(`hreflang x-default` → Danish). English pages are *new* files; Danish pages are never
rewritten.

## Tone & voice
- Informal and direct. Danish **"du"** → English **"you"** (never "thou"/formal).
- Match the Danish energy: friendly, plain-spoken, a little playful. Avoid corporate stiffness.
- Prefer short sentences. Keep the Danish paragraph/heading structure 1:1.
- Use **en-US** spelling (decentralized, optimize, color) for consistency with existing
  date formatting (`FormattedDate` already renders `en-us`).

## Golden rule: translate text, never structure
Translate **only human-readable text**:
- visible prose, headings, list items;
- `title`, `description`, `alt`, `aria-label`, `aria-current` *labels*;
- meta description / OG / Twitter text passed as props.

**Never touch** (copy byte-for-byte):
- `class`, `id`, `data-*` (incl. `data-umami-event`), `style`;
- `<style>` and `<script>` blocks, component imports;
- image `src`, `width`/`height`, `viewBox`, SVG paths;
- external URLs, `mailto:`, `target`, `rel`;
- referral / discount / invoice codes, LNURL, npub/nprofile strings, API paths;
- section anchor IDs (`#nostr-klienter`, etc.) — the English home reuses the same IDs.

## Terms that stay UNtranslated (proper nouns / protocol terms)
Nostr, NIP-05, npub/nsec/nprofile, relay, zap, Lightning, Bitcoin, sats, Damus, Primal,
Amethyst, Alby, Umami, Netlify, and all app/product names from the resources collection.
Keep "Nostr.dk" as the brand. "Nostr address" is fine as a readable gloss of NIP-05.

## Glossary (DA → EN)
| Danish | English |
|---|---|
| Hjem | Home |
| Klienter | Clients |
| Ressourcer | Resources |
| Nostr Adresse | Nostr Address |
| Apps & Tjenester | Apps & Services |
| Om | About |
| Support | Support |
| Sider | Pages |
| Profiler | Profiles |
| Kontakt & Fællesskab | Contact & Community |
| Blokhøjde | Block height |
| Indlæser… | Loading… |
| Lær om Bitcoin | Learn about Bitcoin |
| Tilbage til toppen | Back to top |
| Privatlivspolitik | Privacy Policy |
| Opdateret | Updated |
| censurresistent | censorship-resistant |
| decentraliseret | decentralized |

## URLs & slugs (locked decisions)
- Danish stays at the **root** (no `/da/`). English lives under **`/en/`** with **English slugs**:
  `/en/`, `/en/apps`, `/en/podcasts`, `/en/blog`, `/en/profiles` (← profiler),
  `/en/get-nip05` (← getnip05), `/en/privacy-policy` (← privatlivspolitik).
- The single source of truth is `src/i18n/routes.ts`. Add a page to `EN_LIVE` **only when its
  English file actually exists**, or links/hreflang will point at a 404.

## Internal links inside an English page
- **Within the same section** → hardcode the English slug (`/en/...`).
- **Cross-section link to a page not yet translated** → use
  `localizedHref('/da-root-path', lang)` so it auto-upgrades to English the moment that
  target lands in `EN_LIVE` (no manual sweep, no 404).

## Per-page checklist (Phase 2)
1. Copy the Danish `.astro` into `src/pages/en/<english-slug>.astro`. **Do not edit the Danish file.**
2. Set `lang="en"` is handled by the layout automatically (derived from the `/en/` path) — just
   make sure the page renders through `NostrLayout`/`BlogPost`.
3. Translate prose + `title` + `description` + `alt`/`aria-label`. Leave everything in the
   "never touch" list untouched.
4. Internal links: within-section → `/en/...`; cross-section → `localizedHref(...)`.
5. If the page reads a shared data file, make the relevant fields bilingual `{ da, en }` and
   point the Danish page at `.da`.
6. Add the new English path(s) to `EN_LIVE` in `src/i18n/routes.ts`.
7. Build. Leak-scan the rendered `<main>` for stray Danish. Confirm within-section links are
   `/en/`, cross-section fall back to `/da` root, and the switcher maps correctly.
8. Commit. Do **not** push unless explicitly asked.

## Known limitations (flag, don't work around)
- `profiler.astro` renders **live Nostr profile data** (display names, bios) fetched from the
  `nostr-profiles` Netlify function — that content cannot be translated from this repo. Only
  the page chrome is translatable.
- Section-root menu parents without an index page are fine if they behave identically in both
  languages.
