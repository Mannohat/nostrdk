# Nostr.dk

The Danish gateway to [Nostr](https://nostr.com) — a directory of clients, apps,
services, podcasts and guides about the censorship-resistant, decentralized
protocol. Built with [Astro](https://astro.build) and deployed on Netlify.

The site is **bilingual**: Danish is the canonical original (served at the site
root), and an AI-assisted English version lives under `/en/`.

## 🚀 Project structure

```text
├── public/                     # static assets (images, .well-known/nostr.json)
├── netlify/functions/          # serverless fns (NIP-05 invoice, profiles, etc.)
├── src/
│   ├── components/             # Header, Footer, NIP-05 form, LangSwitcher, …
│   ├── content/                # content collections: blog, podcasts, resources
│   ├── i18n/                   # route registry + UI strings (see below)
│   ├── layouts/                # NostrLayout, BlogPost
│   └── pages/                  # routes; Danish at root, English under /en/
├── docs/translation-style-guide.md
├── astro.config.mjs
└── package.json
```

Astro turns each file in `src/pages/` into a route based on its name. Content
collections in `src/content/` are typed via the schema in
`src/content.config.ts` and read with `getCollection()`.

## 🌍 Internationalization (`/en/`)

Danish pages are **never modified** when adding English — English pages are new
files under `src/pages/en/`. The system is driven by `src/i18n/routes.ts`:

- **`DA_TO_EN`** maps each Danish (root) path to its English path.
- **`EN_LIVE`** lists the English pages that actually exist yet. A link is only
  rewritten to English once its target is in `EN_LIVE`, so a partial translation
  never produces 404s. **When you add a new English page, add it to `EN_LIVE`.**
- **`localizedHref(href, lang)`** is what header/footer/cards use so links resolve
  to `/en/*` on English pages and stay Danish otherwise.

UI chrome strings live in `src/i18n/ui.ts`. Collection content is bilingual via
optional fields (see below). hreflang/canonical and the language switcher are
registry-driven, with `hreflang x-default` pointing at the Danish original.

See [`docs/translation-style-guide.md`](docs/translation-style-guide.md) for tone,
glossary and the per-page checklist.

### Adding an English translation

- **Pages** (`.astro`): create `src/pages/en/<english-slug>.astro`, translate the
  prose, then add the path to `EN_LIVE`. The layout sets `lang="en"` from the URL.
- **Resources / podcasts**: these are frontmatter-only data, so add optional
  `titleEn` / `descriptionEn` fields to the entry — the `/en` pages use them and
  fall back to Danish if absent. No file duplication needed.
- **Blog posts**: have real bodies, so add an English markdown file under
  `src/content/blog/en/` with `language: "en"`, and map the slug in the registry.

## 🧞 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build the production site to `./dist/`           |
| `npm run preview`         | Preview the build locally before deploying       |
| `npm run check`           | Type-check the project (`astro check`)           |

> Note: the NIP-05 name check, profile avatars and suggest-resource form use
> Netlify Functions. Run `netlify dev` (instead of `npm run dev`) to exercise
> those locally; under plain `astro dev` they show a friendly fallback message.

## 🤝 Contributing

To add an app/service to the directory, see
[`CONTRIBUTING.md`](CONTRIBUTING.md) and the
[`RESOURCE_TEMPLATE.md`](RESOURCE_TEMPLATE.md).

## Credit

Originally based on the [Bear Blog](https://github.com/HermanMartinus/bearblog/)
Astro theme.
